# TodoMVC First PR Onboarding Missions

## Mission 1: Trace a Todo from Input to Screen

**Difficulty:** Beginner  
**Estimated Time:** 15-20 minutes

**Goal:** Follow the data flow from when a user types a todo item to when it appears on screen in one framework implementation.

**Relevant Files:**
- `examples/vanilla-es6/src/app.js`
- `examples/vanilla-es6/src/view.js`
- `examples/vanilla-es6/src/store.js`
- `examples/vanilla-es6/index.html`

**Mentor Hints:**
1. Start by opening the vanilla ES6 example and look for the input element in `index.html`. What event listener might be attached to it?
2. Search for "keypress" or "submit" handlers in `app.js`. When Enter is pressed, which method gets called?
3. Follow the chain: input → controller method → store update → view render. Add a `console.log()` at each step to see the data transform.

**Validation:**
Add temporary `console.log()` statements at each step of the flow, then open the example in a browser and create a todo. Verify you see your logs in the correct order.

**Learning Outcome:**
You can now explain how user input flows through a TodoMVC implementation and identify where to add features or fix bugs in the data pipeline.

---

## Mission 2: Compare Two Framework Implementations

**Difficulty:** Beginner  
**Estimated Time:** 20-25 minutes

**Goal:** Identify three structural differences between how React and Vue implement the same todo functionality.

**Relevant Files:**
- `examples/react/src/app.jsx`
- `examples/react/src/todoItem.jsx`
- `examples/vue/src/App.vue`
- `examples/vue/src/components/TodoItem.vue`

**Mentor Hints:**
1. Open both implementations side-by-side. Look at how each handles state management—where is the todo list stored?
2. Compare how each framework handles the "toggle complete" action. What's different about the syntax and approach?
3. Notice how React uses JSX while Vue uses template syntax. Find the same UI element (like the checkbox) in both and compare the code.

**Validation:**
Create a markdown document listing three differences with code snippets from each framework. Share it with a teammate or mentor for feedback.

**Learning Outcome:**
You understand how different frameworks solve the same problem and can discuss trade-offs between approaches—essential for contributing to multi-framework projects.

---

## Mission 3: Find the Safest Documentation Improvement

**Difficulty:** Beginner  
**Estimated Time:** 15-20 minutes

**Goal:** Locate one README or documentation file that has a typo, broken link, or outdated instruction that you can fix.

**Relevant Files:**
- `README.md`
- `examples/*/README.md` (any framework subdirectory)
- `CONTRIBUTING.md`
- `docs/*.md`

**Mentor Hints:**
1. Start with the main `README.md`. Read through it carefully—are all the links working? Is the language clear?
2. Pick one framework example (like `examples/react/`) and read its README. Try following the setup instructions—do they work?
3. Look for common issues: outdated Node.js version requirements, broken npm package links, or unclear build commands.

**Validation:**
Test any setup instructions you find. If you spot an issue, verify it's actually wrong by trying the steps yourself. Document what's broken and what the fix should be.

**Learning Outcome:**
You've identified a real, low-risk contribution opportunity and understand how to validate documentation changes before submitting a PR.

---

## Mission 4: Add a Validation or Empty-State Note

**Difficulty:** Medium  
**Estimated Time:** 30-40 minutes

**Goal:** Add a helpful comment or console warning when a user tries to add an empty todo in one framework implementation.

**Relevant Files:**
- `examples/vanilla-es6/src/app.js`
- `examples/vanilla-es6/src/controller.js`
- `examples/vanilla-es6/src/view.js`

**Mentor Hints:**
1. Find where new todos are added (look for methods like `addItem` or `create`). What happens if the input is empty or just whitespace?
2. Add a simple validation: `if (!title.trim()) { console.warn('Cannot add empty todo'); return; }`. Test it in the browser.
3. Consider improving the user experience: should the input field shake? Should a message appear? Keep it simple for now—just prevent the empty todo from being added.

**Validation:**
Open the vanilla ES6 example in a browser. Try to add an empty todo or one with only spaces. Verify your validation prevents it and provides feedback.

**Learning Outcome:**
You can now make functional code changes, test them locally, and understand the balance between user experience and code simplicity—ready for real feature work.

---

## Mission 5: Prepare Your First PR Package

**Difficulty:** Medium  
**Estimated Time:** 35-40 minutes

**Goal:** Create a complete PR proposal for one of the improvements you identified, including title, description, testing steps, and screenshots.

**Relevant Files:**
- `CONTRIBUTING.md`
- The specific files you plan to change (from previous missions)
- `.github/PULL_REQUEST_TEMPLATE.md` (if it exists)

**Mentor Hints:**
1. Review `CONTRIBUTING.md` to understand the project's PR requirements. Do they want issues filed first? Are there coding standards?
2. Write your PR description using this structure: What problem does this solve? What changes did you make? How can reviewers test it?
3. Take before/after screenshots or create a simple test case. Make it easy for maintainers to see the value of your change.

**Validation:**
Share your PR proposal (without submitting it yet) with a mentor or peer. Ask: Is the problem clear? Are the changes minimal? Is it easy to review?

**Learning Outcome:**
You understand the full PR lifecycle and can package your work professionally. You're ready to submit real contributions that maintainers will want to merge.

---

## Next Steps

After completing these missions, you're ready to:
1. Fork the tastejs/todomvc repository
2. Create a branch for your change
3. Submit your first pull request
4. Engage with maintainer feedback professionally

Remember: Start small, test thoroughly, and communicate clearly. Every major contributor started with a simple first PR!