# RepoQuest: First PR Simulator

RepoQuest turns any GitHub repository into a guided first pull request journey for new developers. A user pastes a repository URL and gets a repository overview, architecture map, beginner-friendly missions, a first PR plan, and a readiness report.

Built for the **IBM Bob Hackathon, May 2026**.

## Live Demo

- **App:** https://repoquest-first-pr-simulator.vercel.app
- **Repository:** https://github.com/vpetrova3/repoquest-first-pr-simulator
- **IBM Bob evidence:** [`bob_sessions/`](./bob_sessions/)
- **watsonx Orchestrate video evidence:** https://youtu.be/qX_39DoAQms
- **Submission assets:** [`submission/`](./submission/)

## What It Does

RepoQuest is designed for interns, new hires, hackathon teammates, and first-time open-source contributors who need a safe path into an unfamiliar codebase.

Core experience:

1. Paste a public or private GitHub repository URL.
2. RepoQuest fetches repository metadata and file paths.
3. A heuristic pass instantly maps the stack, architecture, likely entry points, and starter files.
4. IBM watsonx Granite upgrades the summary, missions, and first PR plan when the server has watsonx credentials.
5. The user gets five guided missions, mentor hints, suggested tests, a first PR checklist, and readiness signals.

The app stays useful even without AI credentials: the heuristic layer still renders a complete onboarding path.

## IBM Technology Usage

**IBM Bob** was used as the development partner. The exported evidence in [`bob_sessions/`](./bob_sessions/) shows Bob helping with repository analysis, mission design, first PR plan structure, watsonx integration review, and demo script polishing.

**IBM watsonx.ai with Granite** powers the live LLM layer. The frontend first renders heuristic output, then calls the server-side `/api/llm` route to ask Granite for repo-grounded improvements. The status badge makes this visible during the demo: offline, enhancing, then live.

**IBM watsonx Orchestrate** wraps RepoQuest as a conversational onboarding workflow. The `RepoQuest Coach` agent accepts a GitHub URL, calls the RepoQuest OpenAPI tool, and returns a beginner-friendly first PR recommendation. The 90-second video evidence should live at [`submission/orchestrate-agent-demo.mp4`](submission/orchestrate-agent-demo.mp4).

## Product Components

| Component | What judges should notice | Key files |
|---|---|---|
| Workspace UI | Paste a repo URL, review overview, architecture, missions, PR plan, and readiness. | [`index.html`](index.html), [`styles.css`](styles.css), [`app.js`](app.js) |
| GitHub analyzer | Fetches repo metadata and file tree. Public repos work immediately; private repos use a server-side token. | [`api/analyze.js`](api/analyze.js), [`scripts/serve.mjs`](scripts/serve.mjs) |
| Heuristic engine | Provides instant output without relying on an LLM. | [`app.js`](app.js), [`api/_repoquest.js`](api/_repoquest.js) |
| watsonx Granite layer | Upgrades summary, missions, and first PR plan with live Granite output. | [`api/llm.js`](api/llm.js), [`api/llm/status.js`](api/llm/status.js), [`api/_watsonx.js`](api/_watsonx.js) |
| Orchestrate agent tool | Lets a `RepoQuest Coach` agent call RepoQuest as an onboarding tool; video evidence lives in submission materials. | [`orchestrate/`](orchestrate/), [`api/orchestrate/repo-brief.js`](api/orchestrate/repo-brief.js), [`submission/orchestrate-agent-video.md`](submission/orchestrate-agent-video.md) |
| Bob evidence | Proves Bob was used in the build process, not just mentioned in the pitch. | [`bob_sessions/`](bob_sessions/), [`docs/bob-runbook.md`](docs/bob-runbook.md) |
| Submission materials | Cover image, slide outline, and demo narration. | [`submission/`](submission/) |

## How The Architecture Works

```text
Browser UI
  |
  |-- Public repo analysis: GitHub REST API
  |
  |-- Private repo analysis: /api/analyze + server-side GITHUB_TOKEN
  |
  |-- Heuristic onboarding model: file paths + tech-stack signals
  |
  |-- /api/llm: IBM Cloud IAM token + watsonx Granite text generation
  |
  `-- /api/orchestrate/repo-brief: OpenAPI-friendly brief for watsonx Orchestrate
```

The important design choice is the two-stage flow:

- **Heuristic floor:** RepoQuest is fast and functional even with no AI provider configured.
- **watsonx ceiling:** Granite adds higher-quality reasoning when credentials are present.

## GitHub Token Behavior

Public repositories do **not** need a GitHub token. RepoQuest can analyze public repos directly through the GitHub API.

Private repositories require a server-side token because GitHub will otherwise return "not found." For private repo demos, set `GITHUB_TOKEN` as an environment variable on the server. Use a fine-grained GitHub personal access token with read-only access to repository contents.

Security notes:

- Never put a GitHub token in frontend code.
- Never paste tokens into the repository URL field.
- Never commit `.env` files or screenshots that show tokens.
- The token is only read by the server routes and is never sent to the browser.
- If a private repo still fails, check token repo access, organization SSO authorization, expiration, and read permissions.

Related files:

- [`.env.example`](.env.example) documents supported environment variables.
- [`api/analyze.js`](api/analyze.js) handles production GitHub analysis.
- [`scripts/serve.mjs`](scripts/serve.mjs) handles local GitHub analysis.
- [`api/orchestrate/repo-brief.js`](api/orchestrate/repo-brief.js) also uses `GITHUB_TOKEN` so the Orchestrate tool can analyze private repos when allowed.

## Run Locally

No package installation is required for the main app.

```bash
node scripts/serve.mjs
```

Open:

```text
http://localhost:4173
```

Optional environment variables:

```bash
export WATSONX_API_KEY="..."
export WATSONX_PROJECT_ID="..."
export GITHUB_TOKEN="..."
node scripts/serve.mjs
```

Validation:

```bash
node --check app.js
node --check scripts/serve.mjs
node --check api/analyze.js
node --check api/llm.js
node --check api/llm/status.js
node --check api/_watsonx.js
node --check api/_repoquest.js
node --check api/orchestrate/repo-brief.js
```

These commands check JavaScript syntax only. The app itself has no build step.

## watsonx Orchestrate

The Orchestrate layer packages RepoQuest as a conversational agent workflow:

- `RepoQuest Coach` is the watsonx Orchestrate agent.
- `createRepoQuestBrief` is the OpenAPI tool imported into Orchestrate.
- `/api/orchestrate/repo-brief` is the deployed route that returns a structured onboarding brief.
- [`submission/orchestrate-agent-demo.mp4`](submission/orchestrate-agent-demo.mp4) is the expected path for the 90-second video evidence.

The demo prompt used in the recording:

```text
Analyze https://github.com/tastejs/todomvc and recommend a first PR.
```

The core product remains the deployed RepoQuest web app. Orchestrate shows how the same analysis can be exposed as an agentic onboarding assistant.

## Repository Map

```text
.
|-- index.html                 # app shell and UI sections
|-- styles.css                 # responsive visual system
|-- app.js                     # client analysis flow, rendering, prompts
|-- api/                       # Vercel serverless routes
|   |-- _repoquest.js          # shared Orchestrate brief builder
|   |-- _watsonx.js            # IBM Cloud IAM + watsonx helpers
|   |-- analyze.js             # GitHub repo analysis
|   |-- llm.js                 # watsonx Granite generation proxy
|   |-- llm/status.js          # AI provider status
|   `-- orchestrate/
|       `-- repo-brief.js      # Orchestrate tool endpoint
|-- scripts/
|   `-- serve.mjs              # local dev server with matching API routes
|-- orchestrate/               # Orchestrate agent instructions and OpenAPI file
|-- bob_sessions/              # IBM Bob exports and consumption screenshots
|-- docs/                      # runbooks, prompts, team docs
|-- submission/                # cover image, slides outline, narration, Orchestrate video
|-- sample_outputs/            # sample RepoQuest output
|-- .env.example               # documented env vars, no secrets
|-- CONTRIBUTING.md
|-- LICENSE
`-- README.md
```

## Evidence Checklist

- [x] Public app deployed on Vercel
- [x] IBM Bob session exports and consumption screenshots
- [x] Live watsonx Granite integration through `/api/llm`
- [x] watsonx Orchestrate OpenAPI tool
- [x] 90-second Orchestrate agent video path documented in submission materials
- [x] Submission cover, slide outline, and narration assets
- [x] `.env.example` with no secrets

## Security

- Do not commit `.env`, API keys, GitHub tokens, IBM Cloud credentials, or screenshots containing secrets.
- Keep `GITHUB_TOKEN` and `WATSONX_API_KEY` server-side only.
- Rotate any token that was shared in a chat, screenshot, commit, or screen recording.
- Scan Bob exports and screenshots before committing them.

## License

MIT - see [`LICENSE`](LICENSE).
