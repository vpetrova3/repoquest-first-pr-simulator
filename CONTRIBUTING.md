# Contributing To RepoQuest

Use this guide when a teammate needs to clone the repo, run the app, make changes, and push work back to GitHub.

## 1. Clone The Repository

```bash
git clone https://github.com/vpetrova3/repoquest-first-pr-simulator.git
cd repoquest-first-pr-simulator
```

## 2. Run The App

This prototype does not require package installation.

```bash
node scripts/serve.mjs
```

Open:

```text
http://localhost:4173
```

If `node` is missing, install Node.js from the official Node.js website or use a teammate machine that already has Node available.

### Private Repositories

To analyze private GitHub repositories, start the server with a read-only GitHub token:

```bash
export GITHUB_TOKEN="paste_your_token_here"
node scripts/serve.mjs
```

Use a fine-grained personal access token with repository contents read access only. Never commit this token, paste it into frontend files, or include it in screenshots.

Public repositories still work without a token. If a private repository says it was not found, check that the token has access to that exact repo and that any required organization SSO authorization is complete.

## 3. Get The Latest Code Before Editing

```bash
git checkout main
git pull origin main
```

## 4. Create A Feature Branch

Use a short branch name that describes the work:

```bash
git checkout -b feature/demo-polish
```

Good examples:

- `feature/bob-session-docs`
- `feature/readiness-report-copy`
- `fix/mobile-layout`
- `docs/submission-checklist`

## 5. Make Changes

Edit the files, then check what changed:

```bash
git status
git diff
```

For JavaScript changes, run:

```bash
node --check app.js
node --check scripts/serve.mjs
```

## 6. Commit Changes

Stage the files:

```bash
git add README.md docs/bob-prompts.md
```

Or stage everything you changed:

```bash
git add .
```

Commit with a clear message:

```bash
git commit -m "Improve Bob prompt documentation"
```

## 7. Push Your Branch

```bash
git push -u origin feature/demo-polish
```

Then open a pull request on GitHub into `main`.

## 8. Merge Or Update Main

After the pull request is approved and merged:

```bash
git checkout main
git pull origin main
```

## 9. Adding IBM Bob Evidence

The hackathon requires IBM Bob task session reports.

When adding Bob exports:

1. Open the project in IBM Bob IDE.
2. Run a focused Bob task such as repo analysis, mission generation, PR plan, or app review.
3. Export the task history markdown.
4. Screenshot the task session consumption summary.
5. Add both files to `bob_sessions/`.
6. Check that no credentials, tokens, API keys, or private data are visible.
7. Commit and push the files.

Example:

```bash
git checkout -b docs/bob-session-exports
git add bob_sessions/
git commit -m "Add IBM Bob session exports"
git push -u origin docs/bob-session-exports
```

## Safety Rules

- Do not commit `.env` files.
- Do not commit IBM Cloud credentials.
- Do not commit API keys or tokens.
- Review screenshots before pushing them.
- Pull latest `main` before starting new work.
