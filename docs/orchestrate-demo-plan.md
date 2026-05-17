# Orchestrate Demo Plan

This is the proof plan for the optional watsonx Orchestrate stretch demo.

## What We Need To Prove

1. `RepoQuest Coach` exists as a watsonx Orchestrate agent.
2. The agent uses the RepoQuest OpenAPI tool named `createRepoQuestBrief`.
3. The tool calls the public Vercel endpoint and returns a real repo onboarding brief.

The deployed Orchestrate agent UI may be scoped to the IBM Cloud account that created it, so the public proof is split into two parts: a live Vercel endpoint that anyone can open, and teammate-provided screen evidence of the private Orchestrate agent running.

## Public Links

- RepoQuest app: https://repoquest-first-pr-simulator.vercel.app
- Live Orchestrate tool endpoint: https://repoquest-first-pr-simulator.vercel.app/api/orchestrate/repo-brief?repo=https%3A%2F%2Fgithub.com%2Ftastejs%2Ftodomvc
- OpenAPI tool definition: [`orchestrate/repoquest-openapi.yaml`](../orchestrate/repoquest-openapi.yaml)
- Agent instructions: [`orchestrate/agent-instructions.md`](../orchestrate/agent-instructions.md)
- Backend endpoint source: [`api/orchestrate/repo-brief.js`](../api/orchestrate/repo-brief.js)

## Teammate Recording Checklist

Ask the teammate who owns the IBM Cloud account to record a short 60-90 second clip:

1. Open watsonx Orchestrate and show the agent named `RepoQuest Coach`.
2. Show the imported tool or action named `createRepoQuestBrief`.
3. Run this prompt:

   ```text
   Analyze https://github.com/tastejs/todomvc and recommend a first PR.
   ```

4. Show the agent response with repo summary, architecture/key files, missions, and first PR plan.
5. If the UI exposes a tool trace, briefly show that the tool was called.

Do not show API keys, personal IBM Cloud settings, billing pages, or private team credentials.

## Live Demo Script

Use this if judges ask where the agent is:

```text
The watsonx Orchestrate agent itself is deployed inside our teammate's IBM Cloud account, so the UI is account-scoped. To make it judge-verifiable, we included the exact agent instructions, the OpenAPI tool definition, and a public Vercel endpoint that the agent calls. The screen recording shows the private Orchestrate agent invoking that public tool and returning the same kind of RepoQuest brief.
```

Then open the public endpoint and point out:

- `source: "RepoQuest Orchestrate tool"`
- `repo.fullName: "tastejs/todomvc"`
- `missions`
- `firstPrPlan`
- `readiness.score`

## Backup If The Agent UI Is Unavailable

1. Open the live endpoint above.
2. Open [`orchestrate/repoquest-openapi.yaml`](../orchestrate/repoquest-openapi.yaml) and show `operationId: createRepoQuestBrief`.
3. Open [`orchestrate/agent-instructions.md`](../orchestrate/agent-instructions.md) and show `RepoQuest Coach`.
4. Explain that the same endpoint is what the deployed agent calls.

This still demonstrates the agent wiring even if the IBM Cloud account owner is not present during the final presentation.
