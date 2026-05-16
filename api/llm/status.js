import { getWatsonxConfig, isWatsonxConfigured, sendJson } from "../_watsonx.js";

export default function handler(req, res) {
  const cfg = getWatsonxConfig();
  sendJson(res, 200, {
    enabled: isWatsonxConfigured(),
    provider: "ibm-watsonx",
    model: cfg.modelId,
  });
}
