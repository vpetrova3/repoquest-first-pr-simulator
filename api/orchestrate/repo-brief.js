import { sendJson } from "../_watsonx.js";
import { buildRepoQuestBrief, fetchGithubRepoSnapshot, formatGithubError } from "../_repoquest.js";

const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    sendJson(res, 405, { error: "GET or POST only." });
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const body = req.method === "POST" ? await readBody(req) : null;
  const repoUrl = url.searchParams.get("repo") || body?.repo || "";

  try {
    const snapshot = await fetchGithubRepoSnapshot(repoUrl, githubToken);
    sendJson(res, 200, buildRepoQuestBrief(snapshot));
  } catch (error) {
    const status = error.status || 500;
    sendJson(res, status, { error: formatGithubError(status) });
  }
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) {
        resolve(null);
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(null);
      }
    });
    req.on("error", () => resolve(null));
  });
}
