# IBM Bob Evidence

This folder contains the IBM Bob task exports and usage screenshots for RepoQuest.

Bob was used as a build-time development partner. The sessions here show Bob helping the team analyze the demo repository, shape the onboarding missions, design the first PR plan, review the watsonx integration, and polish the demo narrative.

## Evidence Index

| Evidence | What it demonstrates |
|---|---|
| [`2026-05-16-repo-analysis.md`](2026-05-16-repo-analysis.md) | Bob analyzed the TodoMVC demo repository and identified architecture, stack, key files, and beginner-safe contribution areas. |
| [`2026-05-16-repo-analysis-consumption.png`](2026-05-16-repo-analysis-consumption.png) | Usage screenshot for the repository analysis session. |
| [`2026-05-16-mission-generation.md`](2026-05-16-mission-generation.md) | Bob helped generate the mission structure that inspired RepoQuest's guided onboarding flow. |
| [`2026-05-16-mission-generation-consumption.png`](2026-05-16-mission-generation-consumption.png) | Usage screenshot for the mission generation session. |
| [`2026-05-16_first-pr-plan.md`](2026-05-16_first-pr-plan.md) | Bob helped define a safe, reviewer-ready first PR format. |
| [`2026-05-16-first-pr-plan-consumption.png`](2026-05-16-first-pr-plan-consumption.png) | Usage screenshot for the first PR planning session. |
| [`2026-05-16_app-review.md`](2026-05-16_app-review.md) | Bob reviewed the RepoQuest app and watsonx integration, including prompts, proxy behavior, and fallback handling. |
| [`2026-05-16-app-review-consumption.png`](2026-05-16-app-review-consumption.png) | Usage screenshot for the app review session. |
| [`2026-05-16_demo-script.md`](2026-05-16_demo-script.md) | Bob helped refine the final demo narration and story. |
| [`2026-05-16-demo-script-consumption.png`](2026-05-16-demo-script-consumption.png) | Usage screenshot for the demo script session. |

## Judge Takeaway

RepoQuest uses the IBM stack in two different ways:

- **IBM Bob:** development partner used during product design, code review, and storytelling.
- **IBM watsonx Granite:** runtime model used by the deployed app to improve repo summaries, missions, and first PR plans.
- **IBM watsonx Orchestrate:** agent workflow evidence included in [`../submission/`](../submission/).

The Bob evidence here supports the claim that Bob influenced the product decisions, not just the final presentation.

## Safety Review

These files should not contain API keys, GitHub tokens, IBM Cloud credentials, `.env` contents, billing pages, or private account settings. If any secret appears in an export or screenshot, rotate that secret before submission.
