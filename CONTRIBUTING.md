# Contributing To RepoQuest

RepoQuest is in final hackathon submission mode. Keep changes focused, reviewable, and safe for a public repository.

## Quick Start

```bash
git clone https://github.com/vpetrova3/repoquest-first-pr-simulator.git
cd repoquest-first-pr-simulator
node scripts/serve.mjs
```

Open:

```text
http://localhost:4173
```

No package installation is required for normal development. If Node is missing, install Node.js first.

## Environment Variables

Create a local `.env` only if you need live AI or private repo testing. Never commit it.

Useful variables:

- `WATSONX_API_KEY` - IBM Cloud API key for live Granite output.
- `WATSONX_PROJECT_ID` - watsonx.ai project ID.
- `WATSONX_URL` - optional region URL, defaults to `https://us-south.ml.cloud.ibm.com`.
- `WATSONX_MODEL_ID` - optional Granite model override.
- `GITHUB_TOKEN` - optional read-only GitHub token for private repository analysis.

Public GitHub repositories work without `GITHUB_TOKEN`. Private repositories require a server-side token with read-only repository contents access. Do not paste tokens into the app UI, source files, screenshots, issue comments, pull requests, or Bob prompts.

## Branch Workflow

Start from the latest `main`:

```bash
git checkout main
git pull origin main
```

Create a short branch:

```bash
git checkout -b docs/final-readme
```

Good branch examples:

- `docs/bob-evidence`
- `fix/mobile-overlap`
- `feature/orchestrate-proof`
- `docs/submission-polish`

## Before You Commit

Check the files you changed:

```bash
git status
git diff
```

Run syntax checks for JavaScript changes:

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

## Commit And Push

```bash
git add README.md CONTRIBUTING.md
git commit -m "Polish final project docs"
git push -u origin docs/final-readme
```

Open a pull request into `main`. Keep the PR description short:

- What changed
- How it was tested
- Whether any screenshots or secrets were reviewed

## Contribution Areas

| Area | Files |
|---|---|
| Frontend UI and interactions | `index.html`, `styles.css`, `app.js` |
| GitHub analysis | `api/analyze.js`, `scripts/serve.mjs` |
| watsonx Granite integration | `api/llm.js`, `api/llm/status.js`, `api/_watsonx.js` |
| Orchestrate agent tool | `orchestrate/`, `api/orchestrate/repo-brief.js`, `api/_repoquest.js` |
| IBM Bob evidence | `bob_sessions/`, `docs/bob-runbook.md` |
| Submission materials | `submission/`, `docs/orchestrate-demo-plan.md` |

## IBM Bob Evidence

When adding Bob evidence:

1. Export the task history markdown from IBM Bob.
2. Capture the task session consumption screenshot.
3. Add both files to `bob_sessions/`.
4. Confirm there are no tokens, API keys, private URLs, emails, or billing/account pages in the export or screenshot.
5. Commit the evidence with a clear message.

Useful task types:

- Repository analysis
- Mission generation
- First PR plan review
- watsonx integration review
- Demo script polish

## Private Repository Testing

Use a fine-grained GitHub personal access token with the least access possible.

```bash
export GITHUB_TOKEN="paste_read_only_token_here"
node scripts/serve.mjs
```

If a private repo returns "not found":

- Confirm the token has access to that exact repository.
- Confirm organization SSO is authorized if required.
- Confirm the token has not expired.
- Confirm the token is set in the same terminal session running the server.

## Safety Rules

- Do not commit `.env` files.
- Do not commit IBM Cloud credentials.
- Do not commit GitHub tokens.
- Do not show keys in demo recordings.
- Review screenshots before pushing.
- Avoid unrelated refactors during final submission.
- Pull latest `main` before starting new work.
