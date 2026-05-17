# Slide deck format — apply this to your current Google Slides

8 slides. Each slide has ONE idea. Judges skim, you carry the story with the spoken narration.

## Master settings (apply to all slides)

| Setting | Value |
|---|---|
| Aspect ratio | 16:9 (Slide → Page setup → Widescreen 16:9) |
| Background | Dark — match cover image: `#0a0f12` → `#0d141a` radial |
| Title font | Inter Bold or Manrope Bold — 64pt for titles, 96pt for hero slide |
| Body font | Inter Regular — 22pt body, 18pt captions |
| Accent color | Teal `#2dbfa8` — use for highlights, the underline bars, score numbers |
| Secondary accent | Blue `#6a8fd9` — second accent for variation |
| Body text color | `#f3f6f4` (white-ish), `#94a09f` (muted) |
| Padding | 80px left/right, 60px top/bottom — leave generous whitespace |

If you can't change the background to a custom gradient, use solid `#0a0f12`. The cover image is in `submission/cover.png` if you want to drop it as the first slide.

---

## Slide 1 — Title (use the cover image)

**Layout:** Full-bleed cover image.

**Action:** Insert `submission/cover.png` to fill the entire slide. Don't add any text — the cover already says everything.

**Speaker notes (Slide → Speaker notes):**
> RepoQuest. A first-PR simulator that takes a new developer from an unfamiliar GitHub repo to a reviewer-ready first pull request. Built for the IBM Bob hackathon. Powered live by watsonx Granite.

---

## Slide 2 — The problem

**Title (big, white):** Onboarding into an unfamiliar repo is broken.

**Body (4 bullets, 28pt, muted color):**
- 200+ files. No obvious entry point.
- READMEs explain setup, not architecture.
- First contributions are scary — wrong scope, wrong file, wrong test.
- Senior engineers repeat the same context every quarter.

**Visual (optional, right side):** A screenshot of GitHub's file tree on a real repo with some red question marks scattered over it. Or skip it and let the text breathe.

**Speaker notes:** Every new engineer hits the same wall. The cost: weeks of lost productivity per hire, every team, every cycle.

---

## Slide 3 — Paste a URL. Get a path.

**Title:** Paste a GitHub URL. Get a guided first-PR path.

**Body (6 numbered items, 22pt, two columns):**

Left column:
1. Repository overview (tech stack, key files, entry points)
2. Architecture map (entry points → product → service → quality)
3. 5 onboarding missions with mentor hints

Right column:
4. Reviewer-ready first PR plan
5. Difficulty radar (3 ranked options)
6. Readiness report

**Visual (optional):** Small screenshot of the RepoQuest dashboard.

**Speaker notes:** Every artifact is tailored to the specific repo — not template content.

---

## Slide 4 — How it actually works

**Title:** Two-stage analysis. Heuristic floor. watsonx ceiling.

**Body (two columns, side-by-side comparison):**

| **Heuristic pass (instant)** | **watsonx pass (~4 sec)** |
|---|---|
| File tree from GitHub API | Granite 3.3 reads paths + signals |
| Rule-based tech stack detection | Repo-specific summary |
| Top-folder architecture layers | 5 contextual missions |
| Template missions and PR | Beginner-safe first PR with real paths |

**Speaker notes:** Heuristics give an instant floor. watsonx quietly raises the ceiling. If watsonx is offline or slow, the floor is still useful.

---

## Slide 5 — The IBM stack, used three ways

**Title:** Bob built it. Granite runs it. Orchestrate wraps it.

**Body (three columns, equal width):**

**IBM Bob — build time**
- Analyzed our demo repo
- Designed mission structure
- Reviewed watsonx proxy code
- Caught IAM token caching bug
- Polished demo script

**watsonx Granite — run time**
- Called from `/api/llm` proxy
- IBM Cloud IAM auth, cached
- Regenerates summary, missions, PR plan
- Graceful fallback to heuristics

**watsonx Orchestrate — agent layer**
- `RepoQuest Coach` agent
- OpenAPI tool: `createRepoQuestBrief`
- Conversational interface over the same product
- Same engine, different surface

**Speaker notes:** Critical distinction — Bob is our development partner, Granite is the runtime engine, Orchestrate is the agent layer. Three roles, one stack.

---

## Slide 6 — Live demo

**Title:** Live demo.

**Body (centered, large mono font):**
```
repoquest-first-pr-simulator.vercel.app
```

That's it. Don't crowd it. The video plays here in the live pitch.

**Speaker notes:** Three things to watch: the AI badge animating to "live", the missions populating with real paths, and the first PR plan generated for an actual contribution.

---

## Slide 7 — Why this fits the hackathon

**Title:** Hitting the four judging criteria.

**Body (2x2 grid, equal-size quadrants):**

| **Application of Technology** | **Presentation** |
|---|---|
| Bob = build partner. watsonx Granite = live engine. Orchestrate = agent layer. Three IBM products, three distinct roles. | Clear story: confusion → guided path → first PR. Five minutes, no jargon, ends on Bob evidence. |

| **Business Value** | **Originality** |
|---|---|
| Onboarding is a universal cost: interns, hires, OSS contributors. Saves days, not minutes, across every team. | Not a README generator. A first-PR simulator with mission gamification and a reviewer-ready PR plan. |

**Speaker notes:** Each quadrant has a one-line proof. Read them out if you have time.

---

## Slide 8 — Links and thanks

**Title:** Try it. Read the code. Watch Bob design it.

**Body (centered, large):**

- **App:** `repoquest-first-pr-simulator.vercel.app`
- **Repo:** `github.com/vpetrova3/repoquest-first-pr-simulator`
- **Bob evidence:** `repo/bob_sessions/`
- **Orchestrate video:** `youtu.be/qX_39DoAQms`

**Bottom of slide, muted text:**
Built with **IBM Bob** · Powered live by **watsonx Granite** · Wrapped by **watsonx Orchestrate**

Thanks to **IBM** for the tools and **LabLab** for organizing.

**Speaker notes:** All four artifacts in one place. Open to questions.

---

## Production tips

- **Don't put walls of text.** Each slide should be skimmable in 3 seconds.
- **Use the cover palette consistently.** Teal `#2dbfa8` for accents and key numbers, blue `#6a8fd9` for secondary, white for hero text, muted gray for supporting copy.
- **One screenshot per slide max.** More than that and the slide becomes a brochure.
- **Add a thin teal divider line** under each title — 4px tall, 220px wide, 100% opacity teal. Matches the cover style.
- **Export as PDF** for archival, keep Google Slides as the live version. If LabLab takes a slides link, share the Google Slides URL with "Anyone with the link can view" permission.

## Pacing

If you talk to slides in a live pitch (separate from the demo video):
- 8 slides × ~30 seconds each = **4 minutes**
- Leave 1 minute for Q&A
- Skip slide 6 ("Live demo") if the video already played

If slides are just attached to the LabLab submission (no live pitch):
- Slide 1 is the cover (re-uses cover image)
- The remaining slides exist for judges who scroll through
- Speaker notes are still useful — they may be visible to judges

## Checklist before sharing the deck

- [ ] All 8 slides exist
- [ ] Slide 1 is the cover image (no text on top)
- [ ] Each slide has speaker notes (`Slide → Speaker notes`)
- [ ] No API keys, tokens, or `.env` values on any slide
- [ ] Sharing permissions set: "Anyone with the link can view"
- [ ] Slide link added to the LabLab submission form
