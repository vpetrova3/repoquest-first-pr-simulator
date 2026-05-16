import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { createServer } from "node:http";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);
const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
]);

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);

  if (url.pathname === "/api/analyze") {
    await handleAnalyzeRequest(url, response);
    return;
  }

  const requestedPath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(join(root, requestedPath === "/" ? "index.html" : requestedPath));

  if (!filePath.startsWith(root) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": mimeTypes.get(extname(filePath)) || "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, () => {
  console.log(`RepoQuest running at http://localhost:${port}`);
  if (githubToken) {
    console.log("Private GitHub repository analysis is enabled with GITHUB_TOKEN.");
  }
});

async function handleAnalyzeRequest(url, response) {
  const repoUrl = url.searchParams.get("repo") || "";
  const parsed = parseGitHubRepo(repoUrl);

  if (!parsed) {
    sendJson(response, 400, { error: "Use a GitHub repository URL like https://github.com/owner/repo." });
    return;
  }

  try {
    const repo = await githubRequest(`/repos/${parsed.owner}/${parsed.repo}`);
    const tree = await githubRequest(`/repos/${parsed.owner}/${parsed.repo}/git/trees/${repo.default_branch}?recursive=1`);
    const paths = (tree.tree || [])
      .filter((item) => item.type === "blob")
      .map((item) => item.path)
      .slice(0, 1200);

    sendJson(response, 200, {
      authenticated: Boolean(githubToken),
      paths,
      repo,
    });
  } catch (error) {
    const status = error.status || 500;
    sendJson(response, status, { error: formatGithubError(status) });
  }
}

async function githubRequest(path) {
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "repoquest-first-pr-simulator",
    "x-github-api-version": "2022-11-28",
  };

  if (githubToken) {
    headers.authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) {
    const error = new Error(`GitHub API request failed with ${response.status}.`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

function parseGitHubRepo(repoUrl) {
  try {
    const parsed = new URL(repoUrl);
    if (!["github.com", "www.github.com"].includes(parsed.hostname)) {
      return null;
    }

    const [owner, repo] = parsed.pathname.replace(/^\/|\/$/g, "").split("/");
    if (!owner || !repo) {
      return null;
    }

    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function formatGithubError(status) {
  if (status === 401) {
    return "GitHub rejected GITHUB_TOKEN. Check that the token is valid, not expired, and pasted without extra spaces.";
  }

  if (status === 403) {
    return "GitHub denied access. Check token permissions, SSO authorization, rate limits, and repository access.";
  }

  if (status === 404) {
    return "Repository not found through authenticated access. If this is private, the token must have read access to that exact repo.";
  }

  return `GitHub API request failed with ${status}.`;
}
