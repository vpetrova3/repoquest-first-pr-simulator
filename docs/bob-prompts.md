# IBM Bob Prompt Pack

Use these prompts in IBM Bob IDE while the RepoQuest project is open. Export each relevant task history markdown file and a task session consumption screenshot into `bob_sessions/`.

## Setup

1. Install IBM Bob IDE.
2. Sign in with the hackathon-provisioned IBM Bob account.
3. Make sure the selected Bob team/account is the hackathon instance, not a personal account.
4. Open this repository folder in Bob IDE.
5. Use these prompts as separate Bob tasks so the exports are clean and easy for judges to inspect.

## Prompt 1: Analyze The Demo Repository

```text
We are building RepoQuest: First PR Simulator for the IBM Bob Hackathon.

Please analyze this public repository for a new contributor:
https://github.com/tastejs/todomvc

Return:
1. project purpose
2. tech stack
3. key folders
4. important files
5. entry points
6. setup notes
7. testing or validation conventions
8. beginner-safe contribution areas
9. risks a first-time contributor should avoid

Keep the output practical enough to power a web app screen.
```

Export as:

- `bob_sessions/2026-05-16_repo-analysis.md`
- `bob_sessions/2026-05-16_repo-analysis-consumption.png`

## Prompt 2: Generate RepoQuest Missions

```text
Using the repository analysis, generate five onboarding missions for RepoQuest.

Each mission should include:
- title
- difficulty
- estimated time
- objective
- relevant files
- three progressive mentor hints
- suggested test or manual validation
- learning outcome

The missions should guide a beginner from understanding the repo to preparing a safe first PR.
```

Export as:

- `bob_sessions/2026-05-16_mission-generation.md`
- `bob_sessions/2026-05-16_mission-generation-consumption.png`

## Prompt 3: Create The First PR Plan

```text
Recommend the safest meaningful first pull request for this repository.

Return:
- PR title
- short PR description
- files to modify
- implementation steps
- risk level
- risks and non-goals
- test plan
- reviewer checklist

Make this beginner-safe but still useful to maintainers.
```

Export as:

- `bob_sessions/2026-05-16_first-pr-plan.md`
- `bob_sessions/2026-05-16_first-pr-plan-consumption.png`

## Prompt 4: Review RepoQuest Itself

```text
Review this RepoQuest prototype for the IBM Bob Hackathon.

Please check:
1. whether the app clearly shows IBM Bob usage
2. whether the demo flow is understandable in under five minutes
3. whether the README explains setup and submission requirements
4. whether the bob_sessions folder instructions match the hackathon guide
5. what small improvements would make the project stronger before submission

Prioritize hackathon judging clarity over adding new features.
```

Export as:

- `bob_sessions/2026-05-16_app-review.md`
- `bob_sessions/2026-05-16_app-review-consumption.png`

## How To Export From Bob IDE

1. Open Bob chat in Bob IDE.
2. Select **Views and More Actions**.
3. Open **History**.
4. Select the relevant project task.
5. Click the task header to open the task session consumption summary.
6. Take a screenshot of the consumption summary.
7. Click the export task history icon to download the markdown report.
8. Put both files in `bob_sessions/`.
9. Repeat for every relevant Bob task from each team member.

Before pushing exports, inspect them for credentials, API keys, tokens, or private data.
