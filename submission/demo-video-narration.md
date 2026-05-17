# RepoQuest Demo Video Narration (5 minutes)

## Scene 1: Problem (15 seconds)

"You're a new intern. Day one. Your manager sends you a GitHub repo link and says 'get familiar with the codebase.' You open it. Hundreds of files. No obvious entry point. Where do you even start? What's safe to touch?"

## Scene 2: Heuristic Pass (30 seconds)

"This is RepoQuest. Paste any GitHub repo URL. Hit analyze. Watch this — the heuristic pass completes instantly. No API calls, no waiting. We're scanning file paths, detecting the tech stack, mapping the architecture. React frontend, Express backend, PostgreSQL. Key files identified. Five onboarding missions generated from patterns. This works offline, no credentials required."

## Scene 3: watsonx Enhancement (45 seconds)

"But here's where it gets interesting. See this badge? 'IBM watsonx enhancing.' We're now calling Granite 3.3 — IBM's foundation model — with the actual repo structure. Watch the missions upgrade in real time. Generic templates become specific guidance grounded in this codebase. The summary deepens. The first PR plan gets concrete file paths and implementation steps. The badge flips to 'live.' This is Granite reasoning about your repository, not just pattern matching."

## Scene 4: Mission Walkthrough (90 seconds)

"Let's walk through mission one: 'Add input validation to the task creation form.' Here's what Granite generated. Mentor hint: 'Start by examining the form submission handler in components/TaskForm.jsx. Look for where user input is processed before being added to state.' Relevant files — it's pointing us exactly where to look. Suggested tests: 'Verify empty task names are rejected. Confirm whitespace-only input is trimmed. Check that duplicate tasks show a warning.' Learning outcomes: form validation patterns, user input sanitization, error handling in React.

Now the first PR plan. Title: 'Add client-side validation for task creation.' Files to modify: TaskForm.jsx, TaskForm.test.js, validation utils. Implementation steps — numbered, specific. Step one: add a validation function that checks for empty strings and duplicates. Step two: integrate it into the form submit handler. Step three: add error state and display validation messages. Test plan included. Reviewer checklist: 'Verify validation triggers before API calls. Confirm error messages are user-friendly. Check test coverage for edge cases.' This is reviewer-ready. Copy to clipboard, open your editor, start coding."

## Scene 5: Readiness Report (30 seconds)

"Scroll down. Readiness report. Concepts you'll learn: React hooks, form validation, error boundaries, test-driven development. Next steps after your first PR: tackle mission two, explore the API layer, review the team's code style guide. And here's the difficulty radar — three contribution paths ranked by complexity. Start with documentation fixes, move to UI polish, then tackle feature work. Progressive onboarding."

## Scene 6: Bob IDE Evidence (45 seconds)

"Now here's the meta part. RepoQuest itself was designed using Bob IDE. Every decision — mission structure, PR plan format, watsonx integration — was reviewed with Bob. Open the bob_sessions folder. Exported task histories. Repository analysis. Mission generation. App review. Consumption screenshots proving Bob was the development partner, not just a feature we bolted on. This is how you build with AI in the loop. Bob understood the problem space, validated the architecture, caught edge cases, and helped us ship faster."

## Scene 7: Closing Pitch (15 seconds)

"Onboarding is painful. Reading docs doesn't teach you where to make your first change. RepoQuest bridges that gap. From unfamiliar repo to mergeable PR in minutes. Built with IBM watsonx Granite and designed with Bob IDE."

---

## 15-Word Elevator Pitch

"RepoQuest turns any GitHub repo into a guided first pull request journey for new developers."