# Recording script — your 3:30 portion

You're recording **3 chunks** (~3:30 total). The teammate's 90-second Orchestrate clip slots in between chunks B and C. Final video is ~4:55, under the 5:00 cap.

```
[A] Hook + intro            0:00 → 0:25     (25 sec)
[B] Live app demo           0:25 → 2:25     (2:00)
[--] Orchestrate clip       2:25 → 3:55     (1:30 — teammate's video, paste in)
[C] Bob evidence + close    3:55 → 4:55     (1:00)
```

Record A and B together if you can keep going; record C separately. Don't worry about being perfect — pause, breathe, restart sentences. You can cut the pauses out in iMovie/QuickTime trim.

---

## Pre-flight (5 minutes before you hit record)

- App open in a clean Chrome window at `https://repoquest-first-pr-simulator.vercel.app`.
- AI badge shows **"Granite · live"** (not offline). If offline, the watsonx env vars in Vercel need a re-check.
- URL bar cleared. Demo button hidden by zoom level if possible — you want to type the URL fresh.
- Bob IDE or `bob_sessions/` folder open in a second window/tab so you can switch fast.
- Window sized so the whole RepoQuest layout fits — **1440 × 900** works well.
- Browser zoom **100%**. Hide bookmarks bar. Close DevTools.
- Mic check. Record a 10-second test, listen back, adjust gain if you can hear background hum.
- Tools: QuickTime "New Screen Recording" or Loom. **1080p minimum.**

---

## [A] Hook + intro — 0:00 to 0:25

**On screen:** RepoQuest landing page (empty URL field, AI badge showing "Granite · live").

Say this almost word-for-word — it's tight:

> "You join a new team. The repo has two hundred files. The README explains how to install dependencies, but nothing about the system. Your manager says 'get familiar, ship something this week.' Where do you even start?
>
> This is RepoQuest. From an unfamiliar repo to your first reviewer-ready pull request. Designed with IBM Bob, powered live by watsonx Granite."

*Action mid-sentence ("This is RepoQuest..."):* type `https://github.com/tastejs/todomvc` into the URL field. Don't click Analyze yet.

---

## [B] Live app demo — 0:25 to 2:25

This is the big one. Two minutes covering the heuristic pass, the watsonx upgrade moment, one mission, and the PR plan.

### Sub-scene B1: Heuristic pass (0:25 → 0:55, ~30 sec)

*Action:* click **Analyze**.

> "The first response is instant. RepoQuest fetches the file tree from GitHub, detects the tech stack — JavaScript, multi-framework — surfaces the key files, and lays out the architecture in four layers. This pass uses no LLM at all. It's heuristic. The user gets a working dashboard in under a second, even if AI is offline."

*Action:* scroll slowly down to the architecture map. Hover over one of the layer nodes briefly.

> "Entry points, product layer, service layer, quality. Eight starter files. The user has somewhere to look before any AI even responds."

### Sub-scene B2: The watsonx moment (0:55 → 1:30, ~35 sec)

*Action:* point cursor at the AI badge in the top right.

> "Now watch this badge. It just flipped from 'enhancing' to 'live.' That was three parallel calls to IBM watsonx — Granite 3.3 8B Instruct — through the IBM Cloud API. The repo summary, the five onboarding missions, and the first PR plan have all been regenerated with real reasoning grounded in the actual file paths of this repository."

*Action:* scroll down to the missions section. The mission titles should be the watsonx-generated ones.

> "These mission titles weren't templates. They reference real files from this repo. That's the difference between pattern matching and reasoning."

### Sub-scene B3: One mission deep-dive (1:30 → 2:00, ~30 sec)

*Action:* click on the first beginner mission ("Trace a todo from input to screen" or whatever Granite generated).

> "Each mission has a goal, the files to open, three progressive mentor hints — gentle nudge first, specific pointer last — a suggested test, and a learning outcome. The learning outcome matters: a new contributor should be able to articulate what they now understand."

*Action:* click one hint open to reveal it. Read it out loud:

> *(read the hint text on screen, then continue)*
>
> "Click any file pill and it opens the source from GitHub right in the app, syntax-highlighted. You can read context before you change anything."

### Sub-scene B4: First PR plan (2:00 → 2:25, ~25 sec)

*Action:* scroll to the First PR Plan section. Cursor on the mock PR preview card.

> "This is the artifact we care most about. A reviewer-ready first pull request — title under seventy characters, concrete implementation steps, a test plan a maintainer can repeat, a three-item reviewer checklist. The mock GitHub preview on the left shows what it'll look like as a draft PR with file diffs. One click downloads it as a markdown file you paste into your real PR description. The radar tells you it's a ninety-four percent first-PR safe contribution."

*End B at 2:25.*

---

## [Orchestrate clip splices in here: 2:25 → 3:55]

This is your teammate's video. No narration from you needed; their video has its own audio. Just splice it in cleanly. Make sure the audio handoff from your last sentence ("a ninety-four percent first-PR safe contribution") to their first sentence has a clean cut, no overlap.

---

## [C] Bob evidence + closing — 3:55 to 4:55

Record this as a separate clip after the splice.

### Sub-scene C1: Bob evidence (3:55 → 4:25, ~30 sec)

*On screen:* Open the `bob_sessions/` folder on GitHub (or in Finder if you prefer that look). Show the markdown + PNG files.

> "RepoQuest didn't just use IBM Bob as a talking point — Bob built RepoQuest with us. Every Bob session is exported here. Bob analyzed our demo repo to seed the missions you just saw. Bob generated the mission template structure. Bob reviewed our watsonx integration code and caught issues in our IAM token caching. Bob polished the demo script you've been listening to."

*Action:* Click into one of the markdown files briefly to show it's a real session.

> "Build-time partner. Not a logo."

### Sub-scene C2: Closing pitch (4:25 → 4:55, ~30 sec)

*On screen:* Back to the RepoQuest landing page. AI badge "Granite · live."

> "RepoQuest. From an unfamiliar codebase to a meaningful first pull request. The IBM stack, used three ways: Bob designed it, watsonx Granite runs it live, and watsonx Orchestrate wraps it as a conversational agent.
>
> Built for interns, new hires, open-source contributors, and anyone joining a new team. The app is live, the repo is public, the Bob evidence is in the folder. Thanks for watching."

---

## Recording tips

- **Don't memorize.** Read the script through three times to get the rhythm, then improvise the exact words. The structure matters more than verbatim phrasing.
- **Pause between sentences.** Silence sounds confident. You can cut long pauses out in editing.
- **If you stumble**, just stop, take a breath, and restart the sentence. Cut the stumble out later.
- **Smile while you talk** — even on a screen recording with no face, your voice sounds 30% warmer.
- **Don't apologize on camera.** No "uh sorry that didn't work" — just stop, cut, retake.

## After recording

- Trim silence at the front and back of each clip.
- Splice in this order: A → B → Orchestrate clip → C.
- Add a 0.3-second crossfade audio between A→B and between Orchestrate clip→C so the transitions don't pop.
- Export as MP4, 1080p, ≤200MB if possible (some submission platforms cap upload size).
- Upload to YouTube as **unlisted** if LabLab takes a link; or upload the MP4 directly if they accept files.

## Final pre-submit check

- [ ] Total length between 4:00 and 5:00.
- [ ] No API keys, tokens, or `.env` content visible on screen at any point.
- [ ] No Authorization headers in DevTools (DevTools should be closed anyway).
- [ ] Audio is clean and consistent across all three of your clips.
- [ ] Orchestrate clip audio levels match your clips (boost or attenuate in editor if not).
