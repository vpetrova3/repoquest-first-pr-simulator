# IBM watsonx Orchestrate Extension

This folder contains an optional watsonx Orchestrate integration for RepoQuest.

The hackathon requirement is IBM Bob usage. Orchestrate is a stretch addition: it lets us present RepoQuest as an agent tool that can be called from a `RepoQuest Coach` agent.

## What This Adds

- `repoquest-openapi.yaml` — OpenAPI tool definition for watsonx Orchestrate.
- `agent-instructions.md` — copy-ready agent profile, instructions, starter prompts, and demo script.
- `/api/orchestrate/repo-brief` — RepoQuest endpoint that returns a concise onboarding brief for a GitHub repo.

## Setup

1. Deploy RepoQuest to Vercel.
2. In `repoquest-openapi.yaml`, replace:

   ```text
   https://YOUR-VERCEL-APP.vercel.app
   ```

   with the deployed RepoQuest URL.

3. In watsonx Orchestrate, create a new agent named `RepoQuest Coach`.
4. Import `repoquest-openapi.yaml` as an OpenAPI tool.
5. Copy the profile and instructions from `agent-instructions.md`.
6. Deploy the agent.

## Test Locally

Start RepoQuest:

```bash
node scripts/serve.mjs
```

Then open:

```text
http://localhost:4173/api/orchestrate/repo-brief?repo=https%3A%2F%2Fgithub.com%2Ftastejs%2Ftodomvc
```

You should receive JSON with repo metadata, key files, architecture layers, missions, a first PR plan, and readiness signals.

## Private Repositories

For private repository analysis, set `GITHUB_TOKEN` on the deployed RepoQuest server. Do not put GitHub tokens inside the Orchestrate agent prompt or OpenAPI file.
