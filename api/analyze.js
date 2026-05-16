import { sendJson } from "./_watsonx.js";

const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

export default async function handler(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const repoUrl = url.searchParams.get("repo") || "";
  const parsed = parseGitHubRepo(repoUrl);

  if (!parsed) {
    sendJson(res, 400, { error: "Use a GitHub repository URL like https://github.com/owner/repo." });
    return;
  }

  try {
    const repo = await githubRequest(`/repos/${parsed.owner}/${parsed.repo}`);
    const tree = await githubRequest(`/repos/${parsed.owner}/${parsed.repo}/git/trees/${repo.default_branch}?recursive=1`);
    const paths = (tree.tree || [])
      .filter((item) => item.type === "blob")
      .map((item) => item.path)
      .slice(0, 1200);

    sendJson(res, 200, {
      authenticated: Boolean(githubToken),
      paths,
      repo,
    });
  } catch (error) {
    const status = error.status || 500;
    sendJson(res, status, { error: formatGithubError(status) });
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
