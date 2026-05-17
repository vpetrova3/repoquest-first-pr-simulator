# RepoQuest: First PR Simulator

RepoQuest turns a GitHub repository into a guided first pull request journey for new developers. Paste any repo URL and get a repository overview, architecture map, five onboarding missions with mentor-style hints, a reviewer-ready first PR plan, and a readiness report.

Built for the **IBM Bob Hackathon (May 2026)** with a two-stage analysis pipeline:

- **Heuristic pass** — instant repo analysis from file paths and tech-stack signals. Works with no API keys.
- **watsonx pass** — live IBM watsonx Granite calls that upgrade the summary, missions, and first PR plan with real reasoning grounded in the actual repo.

If watsonx is unconfigured or unavailable, RepoQuest stays useful via the heuristic layer.

## Demo

- **Deployed app:** https://repoquest-first-pr-simulator.vercel.app
- **Public repo:** https://github.com/vpetrova3/repoquest-first-pr-simulator
- **Bob session evidence:** [`bob_sessions/`](./bob_sessions/)
- **Cover image / slides / video script:** [`submission/`](./submission/)

## Run locally

```bash
node scripts/serve.mjs
```

Open [http://localhost:4173](http://localhost:4173). No `npm install` needed — the frontend is dependency-free vanilla JS.

To enable the live watsonx layer locally, export the IBM Cloud env vars before starting:

```bash
export WATSONX_API_KEY="..."
export WATSONX_PROJECT_ID="..."
node scripts/serve.mjs
```

The app shows the AI status badge: **"IBM watsonx · Granite 3.3 · live"** when configured, **"watsonx offline · heuristic mode"** otherwise.

## Deploy to Vercel

1. Push the repo to GitHub (already public).
2. Import on [vercel.com](https://vercel.com/new) — no build command, no output directory.
3. Set environment variables in the Vercel project settings:
   - `WATSONX_API_KEY` — IBM Cloud API key
   - `WATSONX_PROJECT_ID` — watsonx.ai project ID
   - `WATSONX_URL` (optional) — region URL, defaults to `https://us-south.ml.cloud.ibm.com`
   - `WATSONX_MODEL_ID` (optional) — defaults to `ibm/granite-3-3-8b-instruct`
   - `GITHUB_TOKEN` (optional) — fine-grained read-only PAT for private repo analysis
4. Deploy. The serverless functions live at `/api/analyze`, `/api/llm`, `/api/llm/status`, and `/api/orchestrate/repo-brief`.

See [`.env.example`](./.env.example) for the full variable list.

## Optional watsonx Orchestrate Extension

RepoQuest can also be wrapped as a watsonx Orchestrate agent tool. This is optional for the IBM Bob Hackathon, but useful for a stretch demo.

- [`orchestrate/repoquest-openapi.yaml`](orchestrate/repoquest-openapi.yaml) — importable OpenAPI tool for watsonx Orchestrate.
- [`orchestrate/agent-instructions.md`](orchestrate/agent-instructions.md) — copy-ready `RepoQuest Coach` agent profile and prompts.
- `/api/orchestrate/repo-brief` — deployed endpoint that returns repo metadata, architecture layers, missions, first PR plan, and readiness signals.

Where the Orchestrate agent lives:

- **Agent profile:** [`orchestrate/agent-instructions.md`](orchestrate/agent-instructions.md) contains the `RepoQuest Coach` name, description, instructions, starter prompts, and demo script to paste into watsonx Orchestrate.
- **Tool definition:** [`orchestrate/repoquest-openapi.yaml`](orchestrate/repoquest-openapi.yaml) is the OpenAPI tool import. Its `createRepoQuestBrief` operation calls the deployed RepoQuest API.
- **Tool endpoint:** [`api/orchestrate/repo-brief.js`](api/orchestrate/repo-brief.js) is the Vercel serverless route Orchestrate calls.
- **Brief builder:** [`api/_repoquest.js`](api/_repoquest.js) fetches the GitHub repo snapshot and builds the architecture layers, missions, first PR plan, and readiness score returned to the agent.
- **Local testing:** [`scripts/serve.mjs`](scripts/serve.mjs) exposes the same `/api/orchestrate/repo-brief` route when running locally.

How to demo it:

1. Create a watsonx Orchestrate agent named `RepoQuest Coach`.
2. Import [`orchestrate/repoquest-openapi.yaml`](orchestrate/repoquest-openapi.yaml) as an OpenAPI tool.
3. Paste the profile and instructions from [`orchestrate/agent-instructions.md`](orchestrate/agent-instructions.md).
4. Ask: `Analyze https://github.com/tastejs/todomvc and recommend a first PR.`

Demo story: **Bob helped build RepoQuest, watsonx.ai powers the live Granite layer, and watsonx Orchestrate can expose RepoQuest as a reusable onboarding agent.**

## Architecture

```
Browser (vanilla JS, no build, no framework)
      │
      ├── Heuristic analysis: GitHub REST → file tree → rule-based tech stack + missions
      │
      └── /api/llm  →  IBM Cloud IAM (cached token)  →  watsonx.ai /ml/v1/text/generation
                                                        │
                                                        └── Granite 3.3 8B Instruct
                                                            returns JSON for:
                                                              - repository summary
                                                              - 5 onboarding missions
                                                              - first PR plan
```

**Files of interest:**

- [`app.js`](app.js) — frontend: heuristic analysis, watsonx enhancement pipeline (`enhanceWithLlm`), prompt builders, UI rendering.
- [`scripts/serve.mjs`](scripts/serve.mjs) — local Node dev server with `/api/analyze`, `/api/llm`, `/api/llm/status`.
- [`api/`](api/) — Vercel serverless functions (production equivalents of the local routes).
- [`api/_watsonx.js`](api/_watsonx.js) — IAM token exchange, watsonx config, JSON helpers.
- [`orchestrate/`](orchestrate/) — optional watsonx Orchestrate OpenAPI tool and agent instructions.

## Core flow

1. User pastes a GitHub repo URL.
2. RepoQuest fetches the repo metadata and file tree (public via direct GitHub API, private via `/api/analyze` + `GITHUB_TOKEN`).
3. Heuristic pass renders the overview, architecture, and template missions instantly.
4. If watsonx is enabled, three parallel LLM calls upgrade the summary, missions, and first PR plan with Granite output. The AI badge animates from "enhancing…" to "live".
5. User explores missions, reads the first PR plan, copies it to clipboard, and reviews the readiness report.

## IBM Bob in the development loop

Bob was the development partner — not a feature. Every meaningful design decision was reviewed with Bob:

- **Repository analysis** of the demo target (TodoMVC) — output seeded the mission template.
- **Mission generation** — Bob produced the original five-mission structure now refined live by Granite.
- **First PR plan** format — Bob designed the reviewer-checklist shape.
- **watsonx integration review** — Bob audited the proxy code, IAM caching, and prompt wording in `app.js`.
- **Demo script polish** — Bob helped tighten the spoken narration.

Export task histories and consumption screenshots live in [`bob_sessions/`](./bob_sessions/). The [`docs/bob-runbook.md`](docs/bob-runbook.md) is the exact 24-hour playbook used during the hackathon.

## What's new in v0.2

- **Live watsonx Granite integration** (`/api/llm`) — replaces rule-based mission templates with real LLM output, grounded in actual repo paths.
- **AI status badge** with three states: offline, enhancing, live.
- **Heuristic-first architecture** — every code path degrades gracefully if watsonx is unconfigured or fails.
- **Vercel serverless** deployment in `api/`, alongside the existing local `scripts/serve.mjs`.
- **`.env.example`** documenting all environment variables.
- **Cover image template** + slide deck + video script in `submission/`.

## Features

- Live public/private GitHub repo analysis (via `GITHUB_TOKEN` for private)
- Two-stage analysis: heuristic floor + watsonx ceiling
- Repository overview, architecture map, key files
- Five onboarding missions with mentor hints, suggested tests, learning outcomes
- First PR plan: title, files, implementation steps, test plan, reviewer checklist
- Contribution difficulty radar (three ranked options)
- Readiness report with concepts learned and next steps
- IBM Bob prompt pack (copy-to-clipboard for offline Bob IDE use)
- Optional watsonx Orchestrate OpenAPI tool for a RepoQuest Coach agent
- Demo fallback when GitHub API is unavailable
- Mobile-responsive layout

## Repository structure

```text
.
├── index.html
├── styles.css
├── app.js
├── scripts/
│   └── serve.mjs              # local Node dev server with API routes
├── api/                       # Vercel serverless functions (production)
│   ├── _watsonx.js            # shared IAM + helpers
│   ├── _repoquest.js          # shared Orchestrate brief builder
│   ├── analyze.js             # GitHub repo analysis
│   ├── llm.js                 # watsonx Granite proxy
│   ├── llm/status.js          # provider/model status
│   └── orchestrate/
│       └── repo-brief.js      # OpenAPI-friendly RepoQuest brief endpoint
├── orchestrate/               # optional watsonx Orchestrate agent assets
│   ├── README.md
│   ├── agent-instructions.md
│   └── repoquest-openapi.yaml
├── bob_sessions/              # IBM Bob task exports + consumption screenshots
├── submission/                # cover image template, slide deck, video script
├── sample_outputs/
├── docs/
│   ├── bob-runbook.md         # 24-hour Bob execution playbook
│   ├── bob-prompts.md
│   ├── bob-team-quickstart.md
│   ├── bob-workflow.md
│   ├── demo-script.md
│   ├── frontend-brief.md
│   ├── submission-checklist.md
│   └── team-brief.md
├── .env.example
├── package.json
├── vercel.json
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## Security

- Never commit `.env`, API keys, IBM Cloud credentials, or GitHub tokens.
- The `.gitignore` excludes `.env` and `.env.*` (except `.env.example`).
- `GITHUB_TOKEN` and `WATSONX_API_KEY` live server-side only (env vars in Vercel, or env exports for local dev).
- Before pushing `bob_sessions/`, scan markdown exports and PNG screenshots for credentials. If a secret slipped into a Bob prompt, **rotate it immediately** — assume any keystroke into a chat product is logged.

## License

MIT — see [`LICENSE`](LICENSE).
