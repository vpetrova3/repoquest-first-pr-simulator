# RepoQuest: First PR Simulator

RepoQuest is an IBM Bob-powered developer onboarding tool that helps new developers go from an unfamiliar codebase to a meaningful first pull request.

Instead of generating static documentation, RepoQuest turns a GitHub repository into a guided journey with architecture summaries, developer missions, mentor-style hints, test suggestions, contribution difficulty scoring, and a first-PR readiness report.

Built for the IBM Bob Hackathon.

## Demo

Open the app locally:

```bash
node scripts/serve.mjs
```

Then visit:

```text
http://localhost:4173
```

No package install is required. The prototype is dependency-free so it can run during the hackathon even if a machine does not have `npm`, `pnpm`, or `yarn`.

## Private Repositories

Public repositories work with no token. Private repositories require a GitHub token because the browser cannot read private GitHub data by itself.

Use a fine-grained GitHub personal access token with read-only access to the private repository contents. Do not commit the token.

Start the local server with:

```bash
export GITHUB_TOKEN="paste_your_token_here"
node scripts/serve.mjs
```

Then open `http://localhost:4173` and paste the private GitHub repository URL.

For deployment, set `GITHUB_TOKEN` as a private environment variable on the hosting platform. Never put the token in `app.js`, `index.html`, screenshots, commits, or `bob_sessions/`.

## Deployment

This is a static app. Fast options:

- GitHub Pages: deploy from the repository root.
- Netlify: deploy the repository with publish directory set to `.`.
- Vercel: import the repository as a static project with no build command.

## Core Flow

1. User enters a public GitHub repository URL.
2. RepoQuest fetches repository metadata and the file tree through the GitHub API.
3. RepoQuest generates a first-pass overview, architecture map, mission path, and first PR plan.
4. IBM Bob IDE validates and improves the repository analysis with full project context.
5. The team exports Bob task reports into `bob_sessions/`.
6. The user receives a readiness report and reviewer-ready first PR plan.

## IBM Bob Usage

IBM Bob is a core part of the project workflow:

- Bob analyzes repository structure, important files, and code flow.
- Bob validates the architecture map.
- Bob generates or refines onboarding missions.
- Bob suggests tests and validation steps.
- Bob prepares the first PR title, description, risk notes, and reviewer checklist.
- Bob helps build, review, and polish the RepoQuest prototype.

Export all relevant Bob task history markdown files and task session consumption screenshots into [`bob_sessions/`](./bob_sessions/) before submission.

## Features

- GitHub repo input
- Live public repository tree analysis
- Prepared demo fallback
- Repository overview
- Architecture map
- Guided onboarding missions
- Mentor-style hints
- Suggested tests
- Contribution difficulty radar
- First PR recommendation
- Readiness report
- IBM Bob prompt pack
- Submission docs and Bob export folder

## Repository Structure

```text
.
|-- index.html
|-- styles.css
|-- app.js
|-- scripts/
|   `-- serve.mjs
|-- sample_outputs/
|   `-- repoquest-demo.json
|-- bob_sessions/
|   `-- README.md
|-- docs/
|   |-- bob-workflow.md
|   |-- demo-script.md
|   `-- submission-checklist.md
|-- package.json
|-- LICENSE
`-- README.md
```

## Hackathon Submission

See:

- [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- [`docs/bob-workflow.md`](./docs/bob-workflow.md)
- [`docs/bob-prompts.md`](./docs/bob-prompts.md)
- [`docs/demo-script.md`](./docs/demo-script.md)
- [`docs/submission-checklist.md`](./docs/submission-checklist.md)

## Security

Do not commit IBM Cloud credentials, API keys, `.env` files, tokens, or screenshots that reveal secrets. Review `bob_sessions/` carefully before submitting the public repository.
