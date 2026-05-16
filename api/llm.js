import {
  clampNumber,
  getWatsonxAccessToken,
  getWatsonxConfig,
  isWatsonxConfigured,
  sendJson,
} from "./_watsonx.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "POST only." });
    return;
  }

  if (!isWatsonxConfigured()) {
    sendJson(res, 503, {
      error: "watsonx not configured. Set WATSONX_API_KEY and WATSONX_PROJECT_ID in Vercel project settings.",
      configured: false,
    });
    return;
  }

  const body = await readBody(req);
  if (!body || typeof body.prompt !== "string" || !body.prompt.trim()) {
    sendJson(res, 400, { error: "Provide a non-empty 'prompt' string." });
    return;
  }

  const cfg = getWatsonxConfig();
  const maxNewTokens = clampNumber(body.maxTokens, 16, 2048, 800);
  const temperature = clampNumber(body.temperature, 0, 1, 0.2);

  try {
    const token = await getWatsonxAccessToken(cfg.apiKey);
    const response = await fetch(`${cfg.url}/ml/v1/text/generation?version=${cfg.apiVersion}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model_id: cfg.modelId,
        project_id: cfg.projectId,
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
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      sendJson(res, response.status, {
        error: payload?.errors?.[0]?.message || payload?.message || `watsonx returned ${response.status}.`,
      });
      return;
    }

    const generated = payload?.results?.[0];
    sendJson(res, 200, {
      text: generated?.generated_text || "",
      stopReason: generated?.stop_reason || null,
      model: cfg.modelId,
      provider: "ibm-watsonx",
      usage: {
        input_tokens: generated?.input_token_count ?? null,
        output_tokens: generated?.generated_token_count ?? null,
      },
    });
  } catch (error) {
    console.error("watsonx request failed:", error);
    sendJson(res, 502, { error: error.message || "watsonx request failed." });
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
