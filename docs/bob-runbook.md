# IBM Bob Runbook — 24-Hour Hackathon Push

Open this document while you have IBM Bob IDE running. It's the single source of truth for which prompts to run, in what order, and how to export evidence into `bob_sessions/` for judging.

## Budget reality check

You have **40 Bobcoins** (~$20 of Bob IDE usage) over 30 days. This runbook uses **5 tasks** total, ~3 Bobcoins each = ~15 Bobcoins. Plenty of headroom.

If a task burns way more than expected, stop and ask Bob "summarize what you've done so far so I can export this" before it spirals.

## Before you start

1. **Install Bob IDE** from [bob.ibm.com](https://bob.ibm.com). Mac (Arm/Intel), Windows, Linux available.
2. **Sign in with the hackathon-provisioned account** (check your LabLab email/Discord, NOT a personal account — judges verify usage on the hackathon tenant).
3. **Open the RepoQuest repo folder** in Bob IDE: `File → Open Folder → repoquest-first-pr-simulator`.
4. **Create `bob_sessions/`** if not present (it is): `bob_sessions/`.
5. **Have this runbook open in a second window** — Bob's chat is the main pane.

## The 5 tasks (run in this order)

Each task = one new Bob chat session. Don't combine — judges export *per task*, and separation reads as deliberate.

---

### Task 1 — Repository analysis of the demo target (10 min)

**Why this one first:** It produces the data that goes into your demo video. The output is *literal* evidence that Bob did the analysis you show in the app.

**In Bob chat, send:**

```
We are building RepoQuest: First PR Simulator for the IBM Bob Hackathon.

Please analyze this public repository for a new contributor:
https://github.com/tastejs/todomvc

Walk the repository structure yourself. Then return:
1. project purpose (2 sentences)
2. tech stack (concrete: frameworks, languages, build tools)
3. key folders (with what each one is for)
4. important files a new contributor should read first (top 8, in order)
5. entry points (how the project starts running)
6. setup notes (the exact commands, not just "see README")
7. testing or validation conventions
8. three beginner-safe contribution areas, with file paths
9. three risks a first-time contributor should avoid

Keep the output practical enough to power a web app screen.
```

**Export:**

1. In Bob chat, open **Views and More Actions** → **History**.
2. Click the task header to see the consumption summary. **Screenshot it.**
3. Click the export task history icon to download the markdown.
4. Save both to:
   - `bob_sessions/2026-05-16_repo-analysis.md`
   - `bob_sessions/2026-05-16_repo-analysis-consumption.png`

---

### Task 2 — Generate the onboarding missions (10 min)

**Why:** This is the most product-defining output. The five missions Bob generates will be referenced live in the demo video.

**In a NEW Bob chat (important — clean session = clean export):**

```
Using the RepoQuest analysis of tastejs/todomvc you produced earlier, generate exactly 5 onboarding missions for a new developer trying to make their first pull request.

Each mission must include:
- title (under 60 chars, action-oriented)
- difficulty: "Beginner" or "Medium" (first 3 must be Beginner)
- estimated time (15-40 min)
- goal (one sentence, concrete)
- relevant files (real paths from this repo)
- three progressive mentor hints (gentle → specific)
- suggested test or manual validation
- learning outcome (what they can do AFTER finishing)

The missions should teach the codebase by doing real work, not by reading. The fifth mission should prepare them to write a real PR.

Return as a clean markdown document I can paste into a slide deck.
```

**Export:**

- `bob_sessions/2026-05-16_mission-generation.md`
- `bob_sessions/2026-05-16_mission-generation-consumption.png`

---

### Task 3 — First PR plan (10 min)

**In a NEW Bob chat:**

```
Recommend the safest meaningful first pull request for tastejs/todomvc, suitable for someone who has just done the 5 RepoQuest onboarding missions.

Return:
- PR title (under 70 chars)
- short PR description (2-3 sentences)
- files to modify (exact paths)
- implementation steps (4-6 concrete steps)
- risk level (Low/Medium/High) + one-line rationale
- risks and non-goals (what NOT to touch)
- test plan (3-5 steps that a maintainer can repeat)
- reviewer checklist (3-5 boxes)

The PR should be beginner-safe but still useful to maintainers — not a typo fix, not a doc rewrite. Ideally a small clarification or validation improvement in ONE file.
```

**Export:**

- `bob_sessions/2026-05-16_first-pr-plan.md`
- `bob_sessions/2026-05-16_first-pr-plan-consumption.png`

---

### Task 4 — Review the RepoQuest + watsonx integration (15 min)

**Why this matters most:** This is where Bob actually helps build RepoQuest itself, not just consume the output. It demonstrates Bob-as-development-partner, which is the hackathon's stated theme.

**In a NEW Bob chat, with the repo open in the workspace:**

```
You have the RepoQuest source code open. Specifically review:
- app.js (the analysis pipeline, especially enhanceWithLlm, promptForSummary, promptForMissions, promptForFirstPr)
- scripts/serve.mjs (the /api/llm proxy and IAM token caching)
- api/llm.js (the Vercel serverless version)
- api/_watsonx.js (shared watsonx helpers)

We added a live IBM watsonx Granite integration in the last few hours. The app calls /api/llm to upgrade heuristic mission, summary, and PR plan output with real Granite text generation. The heuristic pass stays as instant fallback when watsonx is offline.

Please review:
1. Is the watsonx integration architecturally sound? Specifically the heuristic→LLM upgrade pattern.
2. Are the prompts (promptForSummary, promptForMissions, promptForFirstPr in app.js) likely to produce reliable JSON output from Granite 3.3 8B Instruct? Suggest specific wording improvements.
3. Is the IAM token caching in api/_watsonx.js safe across Vercel serverless invocations (where state isn't shared)?
4. Are there error states the app handles poorly?
5. What is the single highest-impact 30-minute improvement before submission?

Be specific. Reference file paths and line numbers. No vague advice.
```

**Export:**

- `bob_sessions/2026-05-16_app-review.md`
- `bob_sessions/2026-05-16_app-review-consumption.png`

**Then act on Bob's #5 recommendation if it's actionable in 30 min.** That's another piece of evidence — Bob's suggestion led to a real code change.

---

### Task 5 — Demo script polish (10 min)

**In a NEW Bob chat:**

```
Help me prepare the spoken narration for a 5-minute hackathon demo video for RepoQuest: First PR Simulator.

The demo will show, in this order:
1. Problem: a new intern facing an unfamiliar repo (15 sec)
2. RepoQuest loads, repo URL pasted, heuristic pass completes instantly (30 sec)
3. The watsonx AI badge animates from "enhancing…" to "live", and the missions + PR plan visibly upgrade with Granite-generated content (45 sec)
4. Walk through one mission and the first PR plan (90 sec)
5. Show the readiness report and difficulty radar (30 sec)
6. Show how Bob IDE was used to design RepoQuest itself — point at bob_sessions/ folder (45 sec)
7. Closing pitch about onboarding pain (15 sec)

Write narration for each scene. Tone: confident, technical, not salesy. Speak it out loud — it should fit in the time budget at a natural pace. Use plain language; assume judges are technical but tired.

End with one 15-word elevator pitch.
```

**Export:**

- `bob_sessions/2026-05-16_demo-script.md`
- `bob_sessions/2026-05-16_demo-script-consumption.png`

---

## After all 5 tasks

```bash
ls bob_sessions/
```

Should show:

```
README.md
2026-05-16_repo-analysis.md
2026-05-16_repo-analysis-consumption.png
2026-05-16_mission-generation.md
2026-05-16_mission-generation-consumption.png
2026-05-16_first-pr-plan.md
2026-05-16_first-pr-plan-consumption.png
2026-05-16_app-review.md
2026-05-16_app-review-consumption.png
2026-05-16_demo-script.md
2026-05-16_demo-script-consumption.png
```

## Pre-commit secret scrub

Before `git add bob_sessions/`, open every file and screenshot and confirm:

- ❌ No API keys, IBM Cloud creds, GitHub tokens, watsonx project IDs in plaintext.
- ❌ No `.env` content, no `Authorization: Bearer` strings, no `WATSONX_API_KEY=...` lines.
- ❌ No personal info (your IBM Cloud email is OK in screenshots if it's a hackathon account).
- ✅ Bob's reasoning, the repo paths, the markdown output — all fine.

If you accidentally pasted a secret into a Bob prompt, **rotate the secret immediately** (regenerate IBM Cloud API key, regenerate GitHub PAT). Don't try to redact — assume any keystroke into a chat product is logged somewhere.

## Quick commit when done

```bash
git add bob_sessions/
git commit -m "Add Bob IDE session evidence for hackathon submission"
git push
```

## Storytelling hooks for the demo

The narrative that wins this hackathon isn't "we used Bob." It's:

> "Bob designed the integration that lets RepoQuest call watsonx Granite live, and watsonx Granite generates the missions you see in the demo. Two parts of the IBM stack, each doing what it does best."

Bob = build-time partner. watsonx = run-time engine. RepoQuest = the product.

Use that frame in slide 1, in the video narration, and in your LabLab long description.
