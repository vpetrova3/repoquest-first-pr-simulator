# Demo Video Script — RepoQuest (4:30 target, 5:00 hard cap)

**Format:** Screen recording with voiceover. Single take is fine. No music needed — clear narration carries it.

**Tools:** macOS QuickTime ("New Screen Recording") or Loom or OBS. Record at 1080p minimum.

**Pre-flight (do these BEFORE hitting record):**

1. App is deployed and running at your Vercel URL — open it in a clean browser window (no devtools, no extensions sidebar).
2. Watsonx env vars are set in Vercel — the AI badge should say "IBM watsonx · Granite 3.3" (not "watsonx offline").
3. Bob IDE is open in a second window, with the Task 4 export visible (`bob_sessions/2026-05-16_app-review.md`).
4. `bob_sessions/` folder is open in Finder or a file browser, showing all 5 markdown + 5 PNG files.
5. Browser zoom at 100%. Window sized so the whole RepoQuest layout fits — 1440×900 works well.
6. The repo URL input is pre-cleared (no value), ready for the demo URL.

---

## Scene 1 — Hook (0:00 – 0:18)

**Visible:** RepoQuest landing page, AI badge showing "IBM watsonx · Granite 3.3".

> "You join a new team. The repo has 200 files. The README explains setup but not architecture. Your manager says 'submit a first PR this week.' Where do you even start?
>
> This is RepoQuest. Paste any GitHub URL and get a guided path from confused-intern to first pull request — designed with IBM Bob, powered live by watsonx Granite."

*Action: type/paste `https://github.com/tastejs/todomvc` in the URL field and click Analyze.*

---

## Scene 2 — Heuristic pass (0:18 – 0:48)

**Visible:** Repo overview, tech stack, key files, architecture map appearing.

> "The first response is instant — a heuristic pass identifies the tech stack, the entry points, and the architecture layers without any LLM call. That's important: even on a flaky network or with watsonx offline, RepoQuest gives a useful baseline in under a second."

*Action: scroll through the overview, point cursor at the metric cards (Tech Stack, Key Files, Mission Path, First PR Risk).*

> "Eight key files surfaced. JavaScript, HTML, CSS, multi-framework examples. The architecture map breaks the repo into entry points, product layer, service layer, and quality. This is the floor — and now watsonx raises the ceiling."

---

## Scene 3 — The watsonx moment (0:48 – 1:30)

**Visible:** Top-right AI badge animating from "Granite · enhancing…" (amber pulse) to "Granite · live" (green pulse). Missions and PR plan visibly update.

> "Watch the AI status pill. It's calling IBM watsonx — passing the file tree to Granite 3.3 8B Instruct via the IBM Cloud API. About four seconds, three parallel calls: one for the summary, one for five missions tailored to this repo, one for the first PR plan."

*Action: zoom in on the badge if your recording tool allows; otherwise just point cursor at it.*

> "And there — the missions and PR plan are now Granite-generated, referencing real paths from this repository. The badge flips to 'live'."

*Action: scroll to the missions section.*

---

## Scene 4 — One mission deep-dive (1:30 – 2:30)

**Visible:** Mission list on the left, mission detail on the right.

> "Five missions, ordered beginner to medium. The first three are designed to be safe and confidence-building — trace a behavior, compare two implementations, find a docs improvement."

*Action: click on the first mission ("Trace a todo from input to screen" or whatever Granite generated).*

> "Each mission has a goal, the exact files to touch, three progressive mentor hints — gentle nudge first, specific pointer last — a runnable test or manual validation, and a learning outcome. That last part matters: a new dev should be able to articulate what they now know."

*Action: read aloud one hint and the learning outcome.*

---

## Scene 5 — First PR plan (2:30 – 3:15)

**Visible:** First PR Plan section with title, implementation steps, test plan, reviewer checklist.

*Action: scroll to the PR Plan section.*

> "The output we care most about — a reviewer-ready first PR. Title under 70 characters, scoped to one file. Implementation steps are concrete, not vague. Test plan is repeatable by a maintainer. Reviewer checklist is three to five items, not a wishlist."

*Action: hover the "Copy Plan" button.*

> "One click copies the whole plan to clipboard, ready to paste into a real PR description. The radar shows three contribution options ranked by risk — this PR scores 94 percent on first-PR safety."

---

## Scene 6 — Readiness report (3:15 – 3:45)

**Visible:** Readiness Report section with concepts learned, difficulty radar, next steps.

*Action: scroll to the readiness section.*

> "After running the missions, the contributor sees a readiness report — what they learned, where they should look next, and an explicit next-step: open this repo in IBM Bob IDE and validate the analysis with full project context."

---

## watsonx Orchestrate clip (60-90 seconds)

Use the teammate's Orchestrate recording as a quick cutaway or appendix in the final video.

**Visible:** watsonx Orchestrate agent named `RepoQuest Coach`, prompt entered, response returned.

> "We also wrapped RepoQuest as a watsonx Orchestrate agent. The agent is called RepoQuest Coach. It calls our OpenAPI tool, asks RepoQuest for a structured repo brief, and turns that into a conversational first-PR recommendation. This is the same onboarding engine, shown through an agent workflow."

Video evidence path: [`submission/orchestrate-agent-demo.mp4`](orchestrate-agent-demo.mp4).

---

## Scene 7 — IBM Bob in the dev loop (3:45 – 4:30)

**Visible:** Switch to Bob IDE window OR show the `bob_sessions/` folder in Finder.

> "RepoQuest didn't just use Bob as a feature — Bob built RepoQuest with us. We ran five Bob tasks during development."

*Action: open Bob IDE, briefly show the chat history sidebar.*

> "One: Bob analyzed our demo repository to seed the missions you just saw. Two: Bob generated the onboarding mission template. Three: Bob proposed the first PR plan. Four: Bob reviewed our watsonx integration code — caught a token caching issue, suggested better prompt wording."

*Action: switch to Finder, open `bob_sessions/` folder, show the markdown + PNG files.*

> "Every Bob session is exported here — task histories and consumption screenshots, ready for the judges. Bob designed the integration. Watsonx Granite powers the live app. Two parts of the IBM stack, each doing what it does best."

---

## Scene 8 — Closing pitch (4:30 – 4:45)

**Visible:** RepoQuest landing page again, AI badge "Granite · live".

> "RepoQuest: turning unfamiliar repos into a guided first-PR journey for interns, open-source contributors, and anyone joining a new team. The repo is public, the app is live, the Bob evidence is in the folder. Thanks for watching."

---

## Post-recording checklist

- [ ] Total length is between 4:00 and 5:00 (LabLab cap is usually 5:00).
- [ ] Audio is clean — no background hum, no clipping.
- [ ] No secrets visible on screen (no API keys in URL bars, no `.env` content, no Authorization headers in DevTools).
- [ ] Video resolution is at least 1080p.
- [ ] Export as MP4 (most compatible).
- [ ] Upload to YouTube as **unlisted** if LabLab takes a link, or upload directly to the submission form if they accept files.

## If a take goes wrong

The most common failures and what to do:

| Problem | Fix |
|---|---|
| Watsonx call is slow (>10s) | Pause narration during the wait — say "this takes about ten seconds in the live demo" and continue. |
| Watsonx errors mid-demo | Fall back to the heuristic narrative: "Even when the LLM call fails, RepoQuest stays useful." Score-wise this is actually a strength to highlight. |
| You stumble on words | Don't restart the whole video — just pause, breathe, restart that sentence. Edit out the pause in iMovie or QuickTime trim. |
| Mission text didn't refresh after watsonx call | Hit refresh once, paste URL again. The cache is per-session so it'll re-call. |
