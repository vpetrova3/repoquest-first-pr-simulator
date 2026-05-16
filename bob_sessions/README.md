# IBM Bob Session Exports

This folder holds the IBM Bob IDE task evidence required for the hackathon submission.

## How to populate this folder

Follow the **24-hour runbook**: [`../docs/bob-runbook.md`](../docs/bob-runbook.md).

It walks through five Bob tasks in order, with exact prompts to paste, time estimates, and export filenames. Run each task in a *separate* Bob chat session so the exports are clean and judges can inspect them one at a time.

## Expected contents after running all 5 tasks

```
bob_sessions/
├── README.md                                          (this file)
├── 2026-05-16_repo-analysis.md                        (Task 1 — analyze tastejs/todomvc)
├── 2026-05-16_repo-analysis-consumption.png
├── 2026-05-16_mission-generation.md                   (Task 2 — generate 5 missions)
├── 2026-05-16_mission-generation-consumption.png
├── 2026-05-16_first-pr-plan.md                        (Task 3 — recommend safe first PR)
├── 2026-05-16_first-pr-plan-consumption.png
├── 2026-05-16_app-review.md                           (Task 4 — review RepoQuest + watsonx code)
├── 2026-05-16_app-review-consumption.png
├── 2026-05-16_demo-script.md                          (Task 5 — polish demo narration)
└── 2026-05-16_demo-script-consumption.png
```

## Pre-commit security check

Before `git add bob_sessions/` and pushing, inspect every markdown export and PNG screenshot:

- ❌ No API keys, IBM Cloud credentials, GitHub tokens
- ❌ No `.env` content or `Authorization: Bearer` strings
- ❌ No `WATSONX_API_KEY=...` or `WATSONX_PROJECT_ID=...` values
- ❌ No personal info (your IBM Cloud email is OK if it's a hackathon-provisioned account)
- ✅ Bob's analytical output, file path references, code suggestions — all fine

If a secret accidentally landed in a Bob prompt, **rotate the secret** (regenerate the IBM Cloud API key, regenerate the GitHub PAT). Don't try to redact files after the fact — assume chat input is logged.

## What judges should see here

This folder is the centerpiece of the **"Application of Technology"** judging criterion. The story it tells:

1. Bob analyzed our demo repository so we could ground RepoQuest in real signal (Task 1).
2. Bob generated the original onboarding mission structure that watsonx now refines live (Tasks 2 + 3).
3. Bob reviewed the watsonx integration code itself and caught issues during development (Task 4).
4. Bob helped polish the demo narration we used in the video (Task 5).

Bob built it. watsonx Granite runs it. Both products do what each is best at.
