# IBM Bob Team Quickstart

IBM Bob is required for this hackathon. You do not have to abandon your normal IDE for everything, but each teammate should use IBM Bob IDE for at least one meaningful project task and export the report for judging.

The goal is not "use Bob because it exists." The goal is to prove that Bob helped us understand, build, review, or present RepoQuest.

## What Everyone Should Do

1. Install IBM Bob IDE.
2. Sign in with the hackathon-provisioned IBM Bob account.
3. Open the RepoQuest repository in Bob IDE.
4. Run one focused task using the prompts below.
5. Export the Bob task history markdown.
6. Screenshot the task session consumption summary.
7. Add both files to `bob_sessions/`.
8. Check exports/screenshots for secrets before committing.

## Minimum Evidence Per Person

Each teammate should aim to contribute:

- one Bob task history markdown file
- one Bob task session consumption screenshot
- one short note saying what Bob helped with

Recommended filename format:

```text
bob_sessions/2026-05-16_name-task.md
bob_sessions/2026-05-16_name-task-consumption.png
```

Example:

```text
bob_sessions/2026-05-16_simran-frontend-review.md
bob_sessions/2026-05-16_simran-frontend-review-consumption.png
```

## Role-Based Bob Tasks

### Frontend / UX Polish

Use this if you are working on `index.html`, `styles.css`, or app interaction polish.

```text
We are building RepoQuest: First PR Simulator for the IBM Bob Hackathon.

Please review the frontend in index.html, styles.css, and app.js.

Focus on:
1. whether the UI feels like a professional developer tool
2. whether the flow is clear in under five minutes
3. desktop and mobile layout risks
4. copy clarity for repository analysis, missions, PR plan, and readiness report
5. small frontend improvements that preserve the current functionality

Do not redesign this as a landing page. Keep it as a usable dashboard/workspace.
Return prioritized recommendations and any small code changes you suggest.
```

Good export name:

```text
bob_sessions/2026-05-16_frontend-review.md
```

### Repo Analysis / GitHub API

Use this if you are testing public/private repo analysis.

```text
Please review the repository analysis flow in app.js and scripts/serve.mjs.

Check:
1. public repositories work without a token
2. private repositories use GITHUB_TOKEN only through the local server
3. tokens are never exposed in frontend code
4. error messages are understandable
5. the file scoring and tech stack detection are reasonable for a hackathon MVP

Return risks, suggested fixes, and a short test checklist.
```

Good export name:

```text
bob_sessions/2026-05-16_repo-analysis-flow-review.md
```

### IBM Bob Evidence Lead

Use this to create the core judging evidence.

```text
Analyze this demo repository for RepoQuest:
https://github.com/tastejs/todomvc

Return:
1. project purpose
2. tech stack
3. key folders
4. important files
5. entry points
6. beginner-safe contribution opportunities
7. test or validation ideas
8. risks a new contributor should avoid

The output should be usable inside our RepoQuest app.
```

Good export name:

```text
bob_sessions/2026-05-16_bob-repo-analysis.md
```

### Mission / Product Design

Use this if you are shaping the onboarding missions.

```text
Using RepoQuest's product idea, generate five onboarding missions for a beginner entering an unfamiliar repository.

Each mission should include:
- title
- difficulty
- estimated time
- goal
- relevant files
- mentor hints
- suggested test
- learning outcome

Make the missions practical and connected to a first pull request.
```

Good export name:

```text
bob_sessions/2026-05-16_mission-design.md
```

### QA / Deployment

Use this if you are deploying or testing the final app.

```text
Please create a QA checklist for the RepoQuest hackathon submission.

Include:
1. local run checks
2. public repo analysis checks
3. private repo token checks
4. browser/mobile checks
5. IBM Bob evidence checks
6. security checks for secrets
7. final submission checks

Prioritize issues that could affect judging.
```

Good export name:

```text
bob_sessions/2026-05-16_qa-checklist.md
```

### Pitch / Slides / Video

Use this if you are doing the less technical submission and presentation work.

```text
Help us prepare a 5-minute hackathon demo script for RepoQuest: First PR Simulator.

The demo should show:
1. the problem: unfamiliar repos are hard for new developers
2. paste a GitHub repo URL
3. show repository overview and architecture map
4. show guided missions and mentor hints
5. show first PR plan and readiness report
6. explain how IBM Bob powered the workflow
7. end with the GitHub repo and bob_sessions evidence

Keep it clear, non-technical enough for judges, and under five minutes.
```

Good export name:

```text
bob_sessions/2026-05-16_demo-script.md
```

## What To Tell Teammates Who Prefer Their Own IDE

It is okay to code in your preferred IDE, but for judging we need IBM Bob evidence.

A good workflow is:

1. Use your normal IDE for comfortable editing.
2. Open the same repo in IBM Bob IDE.
3. Ask Bob to review, generate, explain, test, or improve your part.
4. Apply useful suggestions.
5. Export the Bob task report and screenshot.

That counts as meaningful Bob usage because Bob helped with a real project task.

## What Not To Do

- Do not paste API keys or tokens into Bob prompts.
- Do not export screenshots that show secrets.
- Do not wait until the very end to use Bob.
- Do not create fake or irrelevant Bob sessions.
- Do not make every teammate run the exact same prompt.

## Final Check Before Submission

`bob_sessions/` should contain:

- markdown exports from relevant Bob tasks
- matching task session consumption screenshots
- contributions from multiple team members if possible
- no secrets or private credentials
