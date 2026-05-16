const tokenCache = { token: "", expiresAt: 0 };

export function getWatsonxConfig() {
  return {
    apiKey: process.env.WATSONX_API_KEY || "",
    projectId: process.env.WATSONX_PROJECT_ID || "",
    url: (process.env.WATSONX_URL || "https://us-south.ml.cloud.ibm.com").replace(/\/$/, ""),
    modelId: process.env.WATSONX_MODEL_ID || "ibm/granite-3-3-8b-instruct",
    apiVersion: process.env.WATSONX_API_VERSION || "2024-05-31",
  };
}

export function isWatsonxConfigured() {
  const cfg = getWatsonxConfig();
  return Boolean(cfg.apiKey && cfg.projectId);
}

export async function getWatsonxAccessToken(apiKey) {
  const now = Date.now();
  if (tokenCache.token && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.token;
  }

  const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: apiKey,
    }).toString(),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`IBM IAM token exchange failed with ${response.status}. ${detail.slice(0, 200)}`);
  }

  const payload = await response.json();
  if (!payload.access_token) {
    throw new Error("IBM IAM did not return an access_token.");
  }

  tokenCache.token = payload.access_token;
  tokenCache.expiresAt = now + (Number(payload.expires_in) || 3600) * 1000;
  return tokenCache.token;
}

export function sendJson(res, status, payload) {
  res.status(status).setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.send(JSON.stringify(payload));
}

export function clampNumber(value, min, max, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}
