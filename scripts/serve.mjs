import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { createServer } from "node:http";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);
const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

const watsonxApiKey = process.env.WATSONX_API_KEY || "";
const watsonxProjectId = process.env.WATSONX_PROJECT_ID || "";
const watsonxUrl = (process.env.WATSONX_URL || "https://us-south.ml.cloud.ibm.com").replace(/\/$/, "");
const watsonxModelId = process.env.WATSONX_MODEL_ID || "ibm/granite-3-3-8b-instruct";
const watsonxApiVersion = process.env.WATSONX_API_VERSION || "2024-05-31";

const iamCache = { token: "", expiresAt: 0 };

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
]);

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);

  if (url.pathname === "/api/analyze") {
    await handleAnalyzeRequest(url, response);
    return;
  }

  if (url.pathname === "/api/llm") {
    await handleLlmRequest(request, response);
    return;
  }

  if (url.pathname === "/api/llm/status") {
    handleLlmStatus(response);
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
  if (watsonxApiKey && watsonxProjectId) {
    console.log(`IBM watsonx text generation enabled (model: ${watsonxModelId}).`);
  } else {
    console.log("IBM watsonx not configured. Set WATSONX_API_KEY and WATSONX_PROJECT_ID to enable live AI.");
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

function handleLlmStatus(response) {
  sendJson(response, 200, {
    enabled: Boolean(watsonxApiKey && watsonxProjectId),
    provider: "ibm-watsonx",
    model: watsonxModelId,
  });
}

async function handleLlmRequest(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "POST only." });
    return;
  }

  if (!watsonxApiKey || !watsonxProjectId) {
    sendJson(response, 503, {
      error: "watsonx not configured. Set WATSONX_API_KEY and WATSONX_PROJECT_ID.",
      configured: false,
    });
    return;
  }

  const body = await readJsonBody(request);
  if (!body || typeof body.prompt !== "string" || !body.prompt.trim()) {
    sendJson(response, 400, { error: "Provide a non-empty 'prompt' string." });
    return;
  }

  const maxNewTokens = clampNumber(body.maxTokens, 16, 2048, 800);
  const temperature = clampNumber(body.temperature, 0, 1, 0.2);

  try {
    const token = await getWatsonxAccessToken();
    const apiResponse = await fetch(
      `${watsonxUrl}/ml/v1/text/generation?version=${watsonxApiVersion}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model_id: watsonxModelId,
          project_id: watsonxProjectId,
          input: body.prompt,
          parameters: {
            decoding_method: temperature > 0 ? "sample" : "greedy",
            max_new_tokens: maxNewTokens,
            min_new_tokens: 1,
            temperature,
            repetition_penalty: 1.05,
            stop_sequences: Array.isArray(body.stop) ? body.stop.slice(0, 6) : undefined,
          },
        }),
      },
    );

    const payload = await apiResponse.json().catch(() => ({}));
    if (!apiResponse.ok) {
      sendJson(response, apiResponse.status, {
        error: payload?.errors?.[0]?.message || payload?.message || `watsonx returned ${apiResponse.status}.`,
      });
      return;
    }

    const generated = payload?.results?.[0];
    sendJson(response, 200, {
      text: generated?.generated_text || "",
      stopReason: generated?.stop_reason || null,
      model: watsonxModelId,
      provider: "ibm-watsonx",
      usage: {
        input_tokens: generated?.input_token_count ?? null,
        output_tokens: generated?.generated_token_count ?? null,
      },
    });
  } catch (error) {
    console.error("watsonx request failed:", error);
    sendJson(response, 502, { error: error.message || "watsonx request failed." });
  }
}

async function getWatsonxAccessToken() {
  const now = Date.now();
  if (iamCache.token && iamCache.expiresAt > now + 60_000) {
    return iamCache.token;
  }

  const tokenResponse = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: watsonxApiKey,
    }).toString(),
  });

  if (!tokenResponse.ok) {
    const detail = await tokenResponse.text().catch(() => "");
    throw new Error(`IBM IAM token exchange failed with ${tokenResponse.status}. ${detail.slice(0, 200)}`);
  }

  const payload = await tokenResponse.json();
  if (!payload.access_token) {
    throw new Error("IBM IAM did not return an access_token.");
  }

  iamCache.token = payload.access_token;
  iamCache.expiresAt = now + (Number(payload.expires_in) || 3600) * 1000;
  return iamCache.token;
}

function readJsonBody(request) {
  return new Promise((resolveBody) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) {
        resolveBody(null);
        return;
      }
      try {
        resolveBody(JSON.parse(raw));
      } catch {
        resolveBody(null);
      }
    });
    request.on("error", () => resolveBody(null));
  });
}

function clampNumber(value, min, max, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
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
