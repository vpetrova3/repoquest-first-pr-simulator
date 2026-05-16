# RepoQuest Slide Deck — 10 slides, 5-min pitch

Build this in Google Slides, Keynote, or Pitch. Use the 16:9 cover style: dark background (#0f1417), teal accent (#2dbfa8), white text. Match the cover image's palette.

Each slide below has:
- **Title** (top of slide)
- **Body content** (bullets, callouts, or visuals)
- **Speaker notes** (what you say out loud during pitch — also useful as the video narration backup)

Keep slide text minimal. Judges skim; speakers carry the narrative.

---

## Slide 1 — Title

**Title:** RepoQuest

**Body:**
- Subtitle: *First PR Simulator*
- Tagline: *From confusion to contribution.*
- "Powered by IBM Bob · watsonx Granite" badge
- Team: [your name(s)]
- IBM Bob Hackathon · May 2026

**Speaker notes:**
> "RepoQuest. A first-PR simulator that takes a new developer from an unfamiliar GitHub repo to a reviewer-ready first pull request. Built for the IBM Bob hackathon. Powered live by watsonx Granite."

---

## Slide 2 — The problem

**Title:** Onboarding into an unfamiliar repo is broken.

**Body (4 bullets, big text):**
- 200+ files. No idea where to start.
- READMEs explain setup, not architecture.
- First contributions are scary — wrong file, wrong scope, wrong test.
- Senior engineers repeat the same onboarding talk every quarter.

**Optional visual:** a screenshot of GitHub's file tree on a real repo, with red question marks scattered over it.

**Speaker notes:**
> "Every new engineer faces the same wall. The README tells you how to install dependencies, but not how the system works. You ask for a 'good first issue' and get something either trivial or actually risky. Senior engineers repeat themselves every onboarding cycle. The cost: weeks of lost productivity per hire, multiplied by every team."

---

## Slide 3 — The product

**Title:** Paste a GitHub URL. Get a guided first-PR path.

**Body (numbered, 6 steps):**
1. Repository overview (tech stack, key files, entry points)
2. Architecture map (entry points → product → service → quality)
3. 5 onboarding missions (Beginner → Medium, with mentor hints)
4. First PR plan (title, files, steps, test plan, reviewer checklist)
5. Difficulty radar (3 ranked contribution options)
6. Readiness report (concepts learned, next steps)

**Optional visual:** screenshot of the RepoQuest dashboard.

**Speaker notes:**
> "Six artifacts. Repository overview, architecture map, five guided missions, a first PR plan, a difficulty radar that ranks contribution options by risk, and a readiness report. Every artifact is tailored to the specific repo — not template content."

---

## Slide 4 — How it actually works

**Title:** Two-stage analysis: heuristic floor, watsonx ceiling.

**Body (two columns):**

| Heuristic pass (instant) | watsonx pass (~4 sec) |
|---|---|
| File-tree scan via GitHub API | Granite 3.3 reads the file paths + signals |
| Rule-based tech stack detection | Generates summary tailored to this repo |
| Top-folder architecture inference | Generates 5 contextual missions |
| Template missions, template PR | Generates beginner-safe first PR with real paths |

**Speaker notes:**
> "The trick is the two-pass architecture. Heuristics give us an instant floor — the user sees a working dashboard in under a second. Then watsonx Granite quietly upgrades the missions, the summary, and the PR plan with real reasoning. If watsonx is offline or slow, the heuristic pass is still useful. If it succeeds, the ceiling is much higher."

---

## Slide 5 — IBM Bob's role

**Title:** Bob built it. Granite runs it.

**Body (three columns or three rows):**

**Bob (build time):**
- Analyzed our demo repo (TodoMVC)
- Generated the onboarding mission template
- Designed the first PR plan format
- Reviewed our watsonx integration code
- Caught a token caching bug

**watsonx Granite (run time):**
- Called from `/api/llm` proxy
- Generates summary, missions, PR plan
- IAM token exchange, cached
- Graceful fallback to heuristics

**Result:**
> A live AI feature designed by Bob, powered by Granite, shipped in 24 hours.

**Speaker notes:**
> "Critical distinction. Bob is our development partner — it analyzed the demo repo, drafted mission content, and reviewed our integration code. Granite is the runtime engine — every time a user pastes a URL, Granite generates the personalized output. Bob doesn't ship with the app. Granite does. Both contribute, in different roles."

---

## Slide 6 — Live demo

**Title:** Live demo.

**Body:** Just the URL of your deployed Vercel app, large.

**Speaker notes:**
> "I'll show this live in the demo video. Three things to watch: the AI badge animating from 'enhancing' to 'live'. The missions populating with real paths from the repo. And the first PR plan generated for an actual contribution — not generic advice."

(In a live pitch, switch to the deployed app and walk through it. In a recorded video, this slide just sets up the next scene.)

---

## Slide 7 — Why this fits the hackathon

**Title:** Hitting all four judging criteria.

**Body (4 quadrants):**

| Application of Technology | Presentation |
|---|---|
| Bob = dev partner. watsonx Granite = live engine. Both used meaningfully, not decoratively. | Clear story: confusion → guided path → first PR. Five-minute demo, no jargon. |

| **Business Value** | **Originality** |
|---|---|
| Onboarding cost is universal: every intern, hire, OSS contributor. Saves days, not minutes. | Not a README generator. Not a docs summarizer. A first-PR simulator with mission gamification. |

**Speaker notes:**
> "Application of technology: Bob and Granite play different, complementary roles. Presentation: a clean six-step demo flow that's understandable in under five minutes. Business value: onboarding is a universal pain. Originality: this isn't another README rewriter — the mission format and difficulty radar are novel."

---

## Slide 8 — Architecture

**Title:** A simple, deployable stack.

**Body (visual or text):**

```
Browser (vanilla JS, no build)
      ↓
Vercel static + serverless
      ├── /api/analyze.js   → GitHub REST API
      ├── /api/llm.js       → IBM Cloud IAM → watsonx.ai
      └── /api/llm/status   → exposes provider/model
      ↓
IBM watsonx.ai (Granite 3.3 8B Instruct)
      ↓
JSON missions, summary, first PR plan
```

- **No dependencies in the frontend** — runs anywhere.
- **Vercel serverless** — global edge, free tier.
- **IAM token caching** — minimizes IBM Cloud overhead.
- **Graceful degradation** — heuristics work without any API key.

**Speaker notes:**
> "Dependency-free frontend so anyone can run it locally with one command. Vercel serverless functions proxy the watsonx call so API keys never touch the browser. IBM Cloud IAM tokens are cached across requests. And critically: every part degrades gracefully — heuristic mode, fallback demo, error messages that are actually useful."

---

## Slide 9 — What's next

**Title:** Roadmap beyond the hackathon.

**Body (4 bullets):**
- **Agent mode**: open an actual draft PR on GitHub via API after readiness ≥ 90%.
- **Team mode**: shared mission completion tracking, leaderboards for onboarding cohorts.
- **Repo-specific personas**: "engineering manager", "QA", "docs maintainer" — different mission paths per role.
- **Bob Shell integration**: let users invoke RepoQuest from inside Bob's terminal mode.

**Speaker notes:**
> "Three directions if we keep going. One: turn the first PR plan into an actual draft PR via GitHub's API — close the loop. Two: team mode for onboarding cohorts — track mission completion across new-hire classes. Three: role personas — a QA hire and a docs maintainer should see different mission paths through the same repo."

---

## Slide 10 — Links & thanks

**Title:** Try it. Read the code. Watch Bob design it.

**Body:**
- **App:** [your-vercel-url].vercel.app
- **Repo:** github.com/vpetrova3/repoquest-first-pr-simulator
- **Bob evidence:** repo → `/bob_sessions/`
- **Demo video:** [YouTube link if hosted]

Thank you to **IBM** for Bob and watsonx access, **LabLab** for running the hackathon, and the **TodoMVC team** for being a generous demo target.

**Speaker notes:**
> "All four artifacts in one place. The deployed app, the public repo, the Bob session evidence, and the demo video. Thanks to IBM for the tools, LabLab for organizing, and the TodoMVC team for being our demo. Happy to take questions."

---

## Production tips

- **Font:** Inter or Manrope. Bold weights for titles, regular for body.
- **Colors:** Match the cover image. Dark bg `#0f1417`, teal `#2dbfa8`, blue `#6a8fd9`, white text `#f3f6f4`.
- **Visuals:** One screenshot per slide where helpful. Don't crowd.
- **Pacing:** ~30 seconds per slide for a 5-minute pitch.
- **Export:** PDF for archival, PowerPoint/Keynote for live, slides URL if LabLab takes a link.
