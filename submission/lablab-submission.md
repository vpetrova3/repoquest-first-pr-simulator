# LabLab Submission Form — Copy/Paste Ready

Use this file as the source of truth for filling out the LabLab submission form. Each section below is sized to fit the form field's character limit.

---

## Project title (≤ 50 chars)

```
RepoQuest: First PR Simulator
```

(29 chars — well under limit.)

**Alternate (if "first PR" feels too narrow):**
```
RepoQuest — Guided First-PR Onboarding
```
(38 chars.)

---

## Short description (≤ 255 chars)

```
RepoQuest turns any GitHub repo into a guided first-PR journey for new developers. Heuristic analysis runs instantly; IBM watsonx Granite then generates tailored missions, mentor hints, and a reviewer-ready PR plan. Designed with IBM Bob.
```

(238 chars.)

---

## Long description (≥ 100 words)

```
RepoQuest is a first-PR simulator that takes a new developer from an unfamiliar GitHub repository to a meaningful, reviewer-ready first pull request. The product solves a universal onboarding problem: READMEs explain setup but not architecture, "good first issues" are often either trivial or actually risky, and senior engineers repeat the same context every onboarding cycle.

The user pastes any GitHub URL. A heuristic pass fetches the file tree and produces an instant repository overview, tech stack summary, architecture map, and template missions — all without any LLM call. The app then transparently upgrades that output by calling IBM watsonx Granite 3.3 8B Instruct through the IBM Cloud API. Three parallel calls regenerate the repository summary, five onboarding missions, and a first PR plan — each grounded in actual paths from the analyzed repo. The "AI status" badge animates from "enhancing…" to "live" so the watsonx upgrade is visible mid-demo. If watsonx is offline or rate-limited, the heuristic layer keeps RepoQuest useful.

IBM Bob played a different role: development partner. We used Bob IDE to analyze our demo repository (tastejs/todomvc), draft the original mission template, design the first PR plan format, review the watsonx proxy code, and tighten the demo narration. Every Bob session is exported with consumption screenshots in /bob_sessions for judging.

The stack is intentionally minimal: dependency-free vanilla JS frontend, Vercel serverless functions for the GitHub and watsonx proxies, IBM Cloud IAM tokens cached across requests. The app runs locally with one command and deploys to Vercel with no build step.

Target users: new engineering hires, interns, open-source contributors finding their first issue, hackathon teammates joining an existing codebase, and engineering leads who want a reusable onboarding tool. Bob built it. Granite runs it. RepoQuest ships it.
```

(~320 words.)

---

## Tags (pick 5-8)

Copy as a comma-separated list or paste individually depending on what LabLab's form accepts:

```
ibm-bob, ibm-watsonx, granite, developer-onboarding, first-pr, github, ai-coding-assistant, hackathon
```

If the form forces fewer:

```
ibm-bob, ibm-watsonx, granite, developer-onboarding, first-pr
```

---

## App platform

```
Web (browser-based)
```

If a dropdown asks for OS:

```
Cross-platform — runs in any modern browser
```

---

## Required submission links

| Field | Value |
|---|---|
| GitHub repository | https://github.com/vpetrova3/repoquest-first-pr-simulator |
| Demo URL | [paste your Vercel URL after deploying] |
| Demo video | [YouTube unlisted link or LabLab-uploaded MP4] |
| Cover image | submission/cover.png (1600×900) |
| Slide deck | submission/slide-deck.md → exported to PDF or hosted Google Slides link |
| Bob session evidence | https://github.com/vpetrova3/repoquest-first-pr-simulator/tree/main/bob_sessions |

---

## Team members

Replace with real names and roles:

- [Your name] — Product / Integration Lead
- [Teammate 2] — Frontend / UX Polish
- [Teammate 3] — Repo Analysis / GitHub API
- [Teammate 4] — IBM Bob Evidence Lead
- [Teammate 5] — QA / Deployment
- [Teammate 6] — Pitch / Slides / Video / Submission

(LabLab usually asks for emails too. Check the form.)

---

## Judging-criteria one-liners

If the form has a "how does your project address each criterion" field, here are tight answers:

**Application of Technology:**
> RepoQuest uses IBM Bob as a build-time development partner and IBM watsonx Granite as a run-time engine. Bob designed the integration during development; Granite generates the live missions, summary, and first PR plan when a user pastes a repo URL. Both products are used meaningfully, not decoratively, and their roles are complementary.

**Presentation:**
> The demo is a clean six-step flow: paste URL → overview → missions → PR plan → readiness → Bob evidence. The watsonx "AI status" badge gives judges a visible moment when the LLM upgrade happens. Under five minutes, no jargon, ends on the public bob_sessions/ folder.

**Business Value:**
> Onboarding into unfamiliar codebases is a universal cost — every intern, new hire, and open-source contributor pays it. RepoQuest is designed for interns, engineering hires, OSS contributors, and bootcamp students. Faster ramp-up saves days, not minutes, multiplied across every team and every cohort.

**Originality:**
> Not a README generator. Not a docs summarizer. RepoQuest's mission-based first-PR simulator format is novel: ordered onboarding missions with progressive mentor hints, contribution difficulty scoring, and a reviewer-ready PR plan. The two-stage (heuristic → watsonx) architecture is also distinctive — it keeps the product useful even when the LLM is unavailable.

---

## Common form questions (preemptive answers)

**"What inspired this project?"**
> Every engineer remembers their first day on an unfamiliar repo — the README explains setup but not the system, and 'good first issues' tend to be either trivial or accidentally risky. We wanted an AI tool that gives a real onboarding path, not another summarizer.

**"What did you learn?"**
> Two things stood out. First, the heuristic→LLM upgrade pattern is more useful than pure-LLM: instant baseline, then better output once the model returns. Second, Bob is genuinely good as a code-review partner — it caught real issues in our watsonx proxy that we missed.

**"What's next?"**
> Agent mode: turn the first PR plan into an actual draft PR via GitHub's API. Team mode: shared onboarding cohorts. Repo-specific personas: different mission paths for QA, docs, engineering roles.

**"Why IBM Bob?"**
> Bob's full-repository context is what made the design pass actually useful. Most chat-based AI assistants only see what you paste in. Bob reading the whole codebase means its review of our watsonx integration code spotted issues across files — exactly what we needed during a 24-hour build.

---

## Final pre-submit checklist

Before you hit submit on LabLab, verify each:

- [ ] Public GitHub repo is accessible (open in incognito/private window to confirm)
- [ ] Deployed Vercel URL loads in a clean browser, no errors
- [ ] AI status badge shows "Granite · live" (not "offline") when env vars are set
- [ ] `bob_sessions/` folder contains 5 markdown + 5 PNG files, no secrets
- [ ] Demo video under 5:00, audio clean, no API keys visible on screen
- [ ] Cover image is PNG, 1600×900, 16:9, named clearly
- [ ] Slides exported (PDF or hosted link)
- [ ] No `.env` file committed (run `git ls-files | grep -i env` — only `.env.example` should appear)
- [ ] No `WATSONX_API_KEY`, `GITHUB_TOKEN`, or `Authorization: Bearer` strings anywhere in the repo
- [ ] README's "Demo" section has the real deployed URL filled in
- [ ] Team member names and emails are correct

`git log --all -p | grep -iE "watsonx_api_key|github_token|bearer [A-Za-z0-9]" ` should return nothing.
