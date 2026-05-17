# RepoQuest Team Brief

Date: May 16, 2026  
Project: RepoQuest: First PR Simulator  
Repository: https://github.com/vpetrova3/repoquest-first-pr-simulator

## One-Sentence Pitch

RepoQuest helps a new developer go from an unfamiliar GitHub repository to a safe, meaningful first pull request by generating a repository overview, guided onboarding missions, mentor hints, test suggestions, and a reviewer-ready first PR plan.

## What We Have Done So Far

- Built a working browser-based MVP.
- Added GitHub repository URL input.
- Public repository analysis works immediately.
- Private repository analysis works when the local server is started with `GITHUB_TOKEN`.
- Added repository overview, tech stack summary, key files, architecture map, mission dashboard, mission details, mentor hints, test plan, first PR plan, and readiness report.
- Added IBM Bob prompt pack and Bob workflow docs.
- Added `bob_sessions/` folder instructions for exported IBM Bob task reports and screenshots.
- Added `CONTRIBUTING.md` with clone, branch, commit, push, and pull request instructions.
- Added submission checklist and demo script docs.

## How To Run Locally

```bash
git clone https://github.com/vpetrova3/repoquest-first-pr-simulator.git
cd repoquest-first-pr-simulator
node scripts/serve.mjs
```

Open:

```text
http://localhost:4173
```

For private repositories:

```bash
export GITHUB_TOKEN="your_read_only_token_here"
node scripts/serve.mjs
```

Do not commit the token or include it in screenshots.

## LabLab / IBM Bob Requirements To Remember

- The final repository should be public. The IBM Bob Hackathon page warns that private submissions may be harder for judges to review and may lower the score.
- The repo must include exported IBM Bob reports for relevant tasks or sessions.
- The project needs a demo application URL.
- The submission form needs project title, short description, long description, technology/category tags, cover image, video presentation, slide presentation, GitHub repository, app platform, app URL, and optional additional notes.
- Video presentation should be five minutes or less.
- Cover image should be 16:9.
- Judging criteria: application of technology, presentation, business value, and originality.
- Projects must clearly demonstrate meaningful IBM Bob usage.

## 6-Person Task Distribution

### 1. Product / Integration Lead

Owns the final product scope and keeps the team aligned.

- Decide final demo repo and final story.
- Keep `main` stable and review pull requests.
- Make final go/no-go decisions when scope needs cutting.
- Confirm every required submission artifact exists.
- Run final end-to-end demo before submission.

### 2. Frontend / UX Polish Owner

Owns the RepoQuest app experience.

- Polish layout, copy, and mobile responsiveness.
- Make sure public repo analysis and private repo mode are clear in the UI.
- Improve mission cards, first PR plan, and readiness report clarity.
- Fix browser console errors or visual issues.
- Coordinate with pitch lead on screenshots used in slides/video.

### 3. Repo Analysis / GitHub API Owner

Owns repository analysis behavior and demo data quality.

- Test public repo analysis with several repos.
- Test private repo analysis with `GITHUB_TOKEN`.
- Improve file scoring and tech stack detection if needed.
- Prepare one reliable demo repo path in case live analysis is slow.
- Document any limitations clearly in README or demo notes.

### 4. IBM Bob Evidence Lead

Owns the most important judging evidence.

- Open project in IBM Bob IDE using the hackathon-provisioned account.
- Run Bob tasks for repo analysis, mission generation, first PR plan, and app review.
- Export Bob task history markdown files.
- Screenshot task session consumption summaries.
- Put all exports in `bob_sessions/`.
- Check every export and screenshot for secrets before committing.

### 5. QA / Deployment Owner

Owns deployability and final technical readiness.

- Deploy the app and provide the application URL.
- Smoke test public repo flow, private repo flow, demo fallback, Bob prompt modal, mission filtering, and copy buttons.
- Verify README setup instructions from a clean clone.
- Confirm no `.env`, tokens, credentials, or private screenshots are committed.
- Keep the final submission checklist updated.

### 6. Pitch / Slides / Video / Submission Lead

This can be the less technical role.

- Create the slide deck.
- Create or choose a 16:9 cover image.
- Write the 5-minute demo script.
- Record or coordinate the demo video.
- Prepare LabLab submission text: title, short description, long description, tags, platform, app URL, and additional notes.
- Make sure the final pitch clearly shows IBM Bob as the development partner.

## Immediate Workflow

1. Everyone pulls latest `main` and runs the app.
2. Team chooses the final demo repo.
3. Bob Evidence Lead runs the Bob prompts from `docs/bob-prompts.md`.
4. Frontend and Repo Analysis owners polish the app around the chosen demo repo.
5. QA / Deployment owner deploys and tests the app URL.
6. Pitch lead drafts slides and video script using `docs/demo-script.md`.
7. Integration lead checks all submission requirements and approves final scope.

## Suggested Timeline

### Now

- Pull latest repo.
- Confirm everyone can run the app.
- Assign the six roles.
- Pick the demo repository.

### Next 3-6 Hours

- Run IBM Bob sessions and export reports.
- Polish the app flow.
- Deploy the app.
- Draft slides and submission text.

### Final Push

- Record final video.
- Add Bob exports to `bob_sessions/`.
- Verify public GitHub repo is up to date.
- Verify app URL works.
- Submit on LabLab.

## IBM Bob Evidence Plan

Use these Bob tasks:

- Repository analysis
- Mission generation
- First PR plan
- RepoQuest app review
- README or demo script polish

Export for each important Bob task:

- task history markdown file
- task session consumption screenshot

Place them in:

```text
bob_sessions/
```

Recommended filenames:

- `2026-05-16_repo-analysis.md`
- `2026-05-16_repo-analysis-consumption.png`
- `2026-05-16_mission-generation.md`
- `2026-05-16_mission-generation-consumption.png`
- `2026-05-16_first-pr-plan.md`
- `2026-05-16_first-pr-plan-consumption.png`
- `2026-05-16_app-review.md`
- `2026-05-16_app-review-consumption.png`

## Submission Checklist

- Public GitHub repo
- Exported IBM Bob reports in `bob_sessions/`
- Task session consumption screenshots in `bob_sessions/`
- Deployed application URL
- Demo video under 5 minutes
- Slide presentation
- 16:9 cover image
- Project title under 50 characters
- Short description under 255 characters
- Long description over 100 words
- Technology/category tags
- No secrets or credentials committed

## Strategy

- Application of Technology: show Bob-powered repo understanding, mission generation, test suggestions, and first PR planning.
- Presentation: keep the demo story simple: unfamiliar repo to guided missions to first PR readiness.
- Business Value: emphasize onboarding for interns, new hires, open-source contributors, and hackathon teammates.
- Originality: emphasize that RepoQuest is not just a README generator; it is a first-PR simulator.

## Source Links

- LabLab Hackathon Guidelines: https://lablab.ai/ai-articles/hackathon-guidelines
- IBM Bob Hackathon Page: https://lablab.ai/ai-hackathons/ibm-bob-hackathon
- RepoQuest Repository: https://github.com/vpetrova3/repoquest-first-pr-simulator
