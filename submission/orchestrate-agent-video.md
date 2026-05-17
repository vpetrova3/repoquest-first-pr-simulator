# watsonx Orchestrate Video Evidence

## Video File





## What The Video Shows

The video demonstrates the watsonx Orchestrate extension for RepoQuest.

Expected flow:

1. The teammate opens the deployed watsonx Orchestrate agent named `RepoQuest Coach`.
2. The agent uses the `createRepoQuestBrief` OpenAPI tool from [`orchestrate/repoquest-openapi.yaml`](../orchestrate/repoquest-openapi.yaml).
3. The prompt asks:

   ```text
   Analyze https://github.com/tastejs/todomvc and recommend a first PR.
   ```

4. The agent returns a beginner-friendly repository summary, key files or architecture notes, onboarding missions, and a first PR recommendation.

## Why This Matters

The main RepoQuest app is a browser experience powered by GitHub analysis and IBM watsonx Granite. The Orchestrate agent shows a second interface for the same product idea: a conversational `RepoQuest Coach` that calls RepoQuest as a tool and turns the result into onboarding guidance.

IBM Bob remains the build-time development partner, watsonx Granite remains the live runtime model, and watsonx Orchestrate wraps RepoQuest as an agentic workflow.
