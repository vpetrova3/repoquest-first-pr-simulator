# Frontend Brief For RepoQuest

This is the design and structure brief for the teammate working on frontend polish.

## Product Direction

RepoQuest should feel like a focused developer tool, not a marketing landing page. The user should immediately be able to paste a GitHub repo URL and see a practical first-PR journey.

The tone should be:

- professional
- clean
- modern
- calm
- hackathon-demo ready
- easy to scan in under five minutes

Avoid a heavy 3D/animated landing page. The priority is a polished app workflow that judges can understand quickly.

## Current App Structure

The MVP is a single-page app with these main sections:

1. Repository input panel
2. Repository overview
3. Architecture map
4. Guided missions
5. First PR plan
6. Readiness report

This should stay as one smooth dashboard/workspace for now. We do not need multiple routes/pages unless there is time after the core demo is polished.

## Required Screens / Sections

### 1. Repository Input

Purpose: let the user paste a GitHub repo URL.

Must include:

- GitHub repository URL input
- Analyze button
- Use Demo button
- Bob Prompt button
- clear status text such as Ready, Analyzing repo, Analysis ready, Private analysis ready

### 2. Repository Overview

Purpose: summarize what the repo is and whether it is approachable.

Must include:

- repo name
- plain-English repo summary
- tech stack
- number of key files
- mission count
- first PR risk
- readiness score

### 3. Architecture Map

Purpose: show the repo structure in a simple way.

Must include:

- Entry Points
- Product/UI Layer
- Service/Data Layer if detected
- Quality/Tests
- important files or folders as small tags/chips

Keep it readable. It does not need to be a complex diagram.

### 4. Guided Missions

Purpose: show the onboarding path.

Must include five missions:

- title
- difficulty
- estimated time
- short goal
- relevant files
- mentor hints
- suggested test
- learning outcome

The mission detail view should feel like a mentor panel, not a generic card dump.

### 5. First PR Plan

Purpose: give the user a safe first contribution.

Must include:

- PR title
- implementation steps
- test plan
- reviewer checklist
- risk level

### 6. Readiness Report

Purpose: end the demo with a clear conclusion.

Must include:

- readiness score
- concepts learned
- difficulty radar
- next steps

## Logo / Brand

Use the current simple `RQ` mark for now.

Logo direction:

- simple square mark
- letters `RQ`
- dark navy background
- white text
- small enough to work in the top-left app header

Do not spend much time designing a complex logo. A clean wordmark is enough for hackathon submission.

Suggested text lockup:

```text
RQ  RepoQuest
    First PR Simulator
```

## Color Theme

Use a restrained professional palette. Keep the current direction unless there is a strong reason to change it.

Current palette:

- Background: `#f6f7f4`
- Surface/card: `#ffffff`
- Soft surface: `#f0f4f3`
- Main text: `#17201c`
- Muted text: `#5c6862`
- Line/border: `#d8dfda`
- Primary teal: `#137d6d`
- Dark teal: `#0c5f54`
- Navy/ink: `#243145`
- Amber warning/accent: `#c47a23`
- Red risk/accent: `#af3d3d`

Design notes:

- Use teal for active states, success, and section labels.
- Use navy for strong structural blocks like architecture labels.
- Use amber/red only for risk or warning states.
- Avoid purple gradients, heavy neon, or overly playful colors.

## Typography

Use system UI fonts:

```css
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Guidance:

- Hero/dashboard title: bold, compact, not huge.
- Section headings: clear and medium-sized.
- Cards: readable body text, not oversized.
- Avoid negative letter spacing.
- Make sure button text fits on mobile.

## Animation Direction

Use light professional animations only.

Good:

- subtle hover states
- soft card transitions
- button loading/active state
- small status changes
- gentle mission-card selection state

Avoid:

- heavy 3D scenes
- distracting animated backgrounds
- particle effects
- large page transitions
- anything that slows down the demo

If there is time, add only one or two tasteful microinteractions.

## Layout Guidance

Desktop:

- sticky top nav
- left control/sidebar panel
- right main workspace
- cards should be aligned and easy to scan

Mobile:

- stack sections vertically
- input and buttons full width
- avoid horizontal overflow
- mission details should remain readable

## UX Priorities

The judge should understand this flow without explanation:

```text
Paste repo -> See overview -> Open missions -> See first PR plan -> Read readiness report -> See Bob evidence
```

Most important screens for the video:

1. repo input
2. overview + architecture map
3. mission detail
4. first PR plan
5. readiness report
6. bob_sessions folder / IBM Bob evidence

## Frontend Do / Do Not

Do:

- keep the product usable as the first screen
- preserve all existing functionality
- keep IBM Bob evidence visible
- keep public repo analysis working without a token
- keep private repo instructions clear
- test desktop and mobile

Do not:

- turn it into a generic landing page
- remove the current GitHub input flow
- require npm packages unless the team agrees
- put tokens in frontend code
- hide the Bob evidence plan
- add complex 3D unless the core demo is already done

## Files Frontend Will Likely Touch

- `index.html`
- `styles.css`
- `app.js`
- `README.md` only if setup or UI behavior changes

## Acceptance Checklist

- App still runs with `node scripts/serve.mjs`.
- Public repo URL still analyzes without `GITHUB_TOKEN`.
- Private repo mode still works with `GITHUB_TOKEN`.
- Demo fallback still works.
- Bob Prompt modal still opens.
- Mission filters still work.
- Copy buttons still work.
- No console errors in browser.
- Mobile layout is readable.
- No secrets are committed.
