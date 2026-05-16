const state = {
  analysis: null,
  selectedMission: 0,
  missionFilter: "all",
  llm: { enabled: false, model: "", checked: false },
  enhancingId: 0,
};

const llmCache = new Map();

const demoAnalysis = {
  source: "Prepared demo output",
  repo: {
    name: "TodoMVC",
    fullName: "tastejs/todomvc",
    url: "https://github.com/tastejs/todomvc",
    summary:
      "TodoMVC collects implementations of the same todo app across frameworks, making it useful for tracing UI state, persistence, routing, and test conventions without a large production codebase.",
    techStack: ["JavaScript", "HTML", "CSS", "Node tooling", "Tests"],
    importantFiles: [
      "readme.md",
      "package.json",
      "examples/react/src/app.jsx",
      "examples/vue/src/App.vue",
      "examples/backbone/src/app.js",
      "tests/smoke-tests.js",
      "site-assets/todomvc-common/base.css",
    ],
    stats: {
      stars: 28000,
      forks: 14400,
      openIssues: 142,
      language: "JavaScript",
      updatedAt: "2024-02-12T15:22:33Z",
      defaultBranch: "master",
    },
  },
  architecture: [
    { label: "Entry Points", items: ["README", "examples/*", "package scripts"] },
    { label: "UI Layer", items: ["framework examples", "components", "templates"] },
    { label: "State Flow", items: ["todo model", "filters", "local storage"] },
    { label: "Quality", items: ["smoke tests", "linting", "shared styles"] },
  ],
  missions: [
    {
      title: "Trace a todo from input to screen",
      difficulty: "Beginner",
      time: "20 min",
      goal: "Follow the add-todo flow through one implementation and identify where state changes happen.",
      files: ["examples/react/src/app.jsx", "site-assets/todomvc-common/base.css"],
      hints: [
        "Start at the input handler and follow the state update.",
        "Look for where the visible todo list is derived from all todos.",
        "Check whether completed and active filters change rendering or data.",
      ],
      test: "Add one todo manually, reload the page, and confirm persistence behavior still matches the existing app.",
      outcome: "You can explain the primary user flow and name the files touched by a small UI change.",
    },
    {
      title: "Compare two framework implementations",
      difficulty: "Beginner",
      time: "25 min",
      goal: "Compare React and Vue versions to learn which concepts are shared across implementations.",
      files: ["examples/react/src/app.jsx", "examples/vue/src/App.vue"],
      hints: [
        "List the shared actions first: add, toggle, edit, delete, filter.",
        "Compare naming before comparing syntax.",
        "Mark which files are safe to ignore for a one-framework PR.",
      ],
      test: "Document one behavior that appears in both implementations and verify it in the browser.",
      outcome: "You can avoid over-scoping your first PR across unrelated framework examples.",
    },
    {
      title: "Find the safest documentation improvement",
      difficulty: "Beginner",
      time: "15 min",
      goal: "Identify one setup or navigation note that would help first-time contributors.",
      files: ["readme.md", "package.json"],
      hints: [
        "Check whether the README explains how to run one example locally.",
        "Map package scripts to plain-language steps.",
        "Prefer a tiny clarification over a broad rewrite.",
      ],
      test: "Follow the updated instructions from a clean terminal and note any missing step.",
      outcome: "You can prepare a low-risk PR that still helps real contributors.",
    },
    {
      title: "Add a validation or empty-state note",
      difficulty: "Medium",
      time: "35 min",
      goal: "Locate a small UI behavior that can be improved without changing architecture.",
      files: ["examples/react/src/app.jsx", "examples/react/src/footer.jsx"],
      hints: [
        "Choose one implementation and stay inside it.",
        "Avoid changing shared styles unless the current UI requires it.",
        "Keep copy short and test the empty and non-empty states.",
      ],
      test: "Run the selected example, test empty, active, completed, and all views.",
      outcome: "You can make a user-facing change with a focused test path.",
    },
    {
      title: "Prepare the first PR package",
      difficulty: "Medium",
      time: "30 min",
      goal: "Turn the chosen contribution into a clear PR title, body, test plan, and reviewer checklist.",
      files: ["readme.md", "package.json", "tests/smoke-tests.js"],
      hints: [
        "Write the PR description before coding the change.",
        "Mention exactly which implementation or docs path is affected.",
        "Call out what you intentionally did not change.",
      ],
      test: "Run the relevant local command or record a manual verification checklist.",
      outcome: "You can submit a PR that is easy for maintainers to review.",
    },
  ],
  firstPr: {
    title: "Clarify local setup instructions for one TodoMVC example",
    risk: "Low",
    files: ["readme.md", "package.json"],
    steps: [
      "Choose one framework example that runs cleanly on your machine.",
      "Add a short README section that maps install and run commands to that example.",
      "Mention any prerequisite such as Node version or package manager.",
      "Keep the change limited to documentation unless a script is clearly broken.",
    ],
    tests: [
      "Follow the documented setup from a fresh terminal session.",
      "Open the example in the browser and add, complete, and clear a todo.",
      "Check links and command formatting in the rendered README.",
    ],
    checklist: [
      "The PR has one clear contributor-facing improvement.",
      "The touched files match the scope described in the PR body.",
      "The test plan is repeatable by a maintainer.",
    ],
  },
  readiness: {
    score: 86,
    concepts: ["Entry points", "State updates", "Local persistence", "Framework boundaries", "Manual test paths"],
    nextSteps: [
      "Start with the highest-scored option in the radar — it's the safest meaningful PR.",
      "Open the recommended files in the preview before you touch anything. Read first, code second.",
      "Run the suggested test on a clean clone — if it passes, you have your baseline.",
      "Time-box the first mission to 25 minutes. Mark it complete when you can explain it.",
    ],
    radar: [
      { label: "README setup clarification", score: 94, level: "low" },
      { label: "One-framework UI copy update", score: 78, level: "medium" },
      { label: "Cross-framework behavior change", score: 42, level: "high" },
    ],
  },
};

const selectors = {
  repoForm: document.querySelector("#repoForm"),
  repoUrl: document.querySelector("#repoUrl"),
  demoButton: document.querySelector("#demoButton"),
  promptButton: document.querySelector("#promptButton"),
  promptDialog: document.querySelector("#promptDialog"),
  promptText: document.querySelector("#promptText"),
  copyPromptButton: document.querySelector("#copyPromptButton"),
  copyPlanButton: document.querySelector("#copyPlanButton"),
  repoStatus: document.querySelector("#repoStatus"),
  repoName: document.querySelector("#repoName"),
  repoSummary: document.querySelector("#repoSummary"),
  repoStats: document.querySelector("#repoStats"),
  readinessScore: document.querySelector("#readinessScore"),
  techStack: document.querySelector("#techStack"),
  keyFileCount: document.querySelector("#keyFileCount"),
  missionCount: document.querySelector("#missionCount"),
  riskLevel: document.querySelector("#riskLevel"),
  architectureMap: document.querySelector("#architectureMap"),
  importantFiles: document.querySelector("#importantFiles"),
  missionList: document.querySelector("#missionList"),
  missionDetail: document.querySelector("#missionDetail"),
  segments: document.querySelectorAll(".segment"),
  prTitle: document.querySelector("#prTitle"),
  prPreviewTitle: document.querySelector("#prPreviewTitle"),
  prRepoLabel: document.querySelector("#prRepoLabel"),
  prRiskBadge: document.querySelector("#prRiskBadge"),
  prBranchBadge: document.querySelector("#prBranchBadge"),
  prPreviewFiles: document.querySelector("#prPreviewFiles"),
  implementationSteps: document.querySelector("#implementationSteps"),
  testPlan: document.querySelector("#testPlan"),
  reviewerChecklist: document.querySelector("#reviewerChecklist"),
  conceptsLearned: document.querySelector("#conceptsLearned"),
  difficultyRadar: document.querySelector("#difficultyRadar"),
  nextSteps: document.querySelector("#nextSteps"),
  aiBadge: document.querySelector("#aiBadge"),
  aiBadgeLabel: document.querySelector("#aiBadgeLabel"),
  tryChips: document.querySelector("#tryChips"),
  architecturePanel: document.querySelector(".architecture-panel"),
  missionsSection: document.querySelector(".missions-section"),
  prSection: document.querySelector(".pr-section"),
  repoBrief: document.querySelector(".repo-brief"),
  scoreRingFg: document.querySelector("#scoreRingFg"),
  missionProgressDone: document.querySelector("#missionProgressDone"),
  missionProgressTotal: document.querySelector("#missionProgressTotal"),
  missionProgressFill: document.querySelector("#missionProgressFill"),
  missionProgressBar: document.querySelector(".mission-progress-bar"),
  langBreakdown: document.querySelector("#langBreakdown"),
  viewOnGithub: document.querySelector("#viewOnGithub"),
  copyShareButton: document.querySelector("#copyShareButton"),
  fileDialog: document.querySelector("#fileDialog"),
  fileDialogPath: document.querySelector("#fileDialogPath"),
  fileDialogCode: document.querySelector("#fileDialogCode"),
  fileDialogMeta: document.querySelector("#fileDialogMeta"),
  fileDialogOpenLink: document.querySelector("#fileDialogOpenLink"),
  mainStage: document.querySelector(".main-stage"),
  timeEstimateValue: document.querySelector("#timeEstimateValue"),
  timeEstimateSub: document.querySelector("#timeEstimateSub"),
  timeEstimateMissions: document.querySelector("#timeEstimateMissions"),
  timeEstimateBar: document.querySelector("#timeEstimateBar"),
  recentSection: document.querySelector("#recentSection"),
  recentList: document.querySelector("#recentList"),
};

const STORAGE_KEY_RECENT = "repoquest:recent-analyses";
const STORAGE_KEY_COMPLETED = "repoquest:completed-missions";

const RING_CIRCUMFERENCE = 2 * Math.PI * 52;
let confettiFired = false;

const tryRepos = [
  { owner: "tj", repo: "commander.js", label: "tj/commander.js" },
  { owner: "expressjs", repo: "express", label: "expressjs/express" },
  { owner: "honojs", repo: "hono", label: "honojs/hono" },
  { owner: "withastro", repo: "astro", label: "withastro/astro" },
];

const completedMissions = new Set();

function initialize() {
  setAnalysis(demoAnalysis);
  renderTryChips();
  bindEvents();
  refreshIcons();
  checkLlmStatus();
  applyInitialStagger();
  maybeLoadFromShareParam();
}

function maybeLoadFromShareParam() {
  try {
    const params = new URLSearchParams(location.search);
    const repo = params.get("repo");
    if (repo && parseGitHubUrl(repo)) {
      selectors.repoUrl.value = repo;
      analyzeRepository(repo);
    }
  } catch {
    // ignore
  }
}

function applyInitialStagger() {
  const sections = document.querySelectorAll(".main-stage > section, .control-panel > section");
  sections.forEach((section, i) => {
    section.classList.add("fade-in");
    section.style.animationDelay = `${Math.min(i * 60, 320)}ms`;
  });
}

function renderTryChips() {
  if (!selectors.tryChips) return;
  selectors.tryChips.innerHTML = tryRepos
    .map(
      (item) => `
        <button class="try-chip" type="button" data-url="https://github.com/${item.owner}/${item.repo}">
          <i data-lucide="github" aria-hidden="true"></i>
          ${escapeHtml(item.label)}
        </button>
      `,
    )
    .join("");
  selectors.tryChips.querySelectorAll(".try-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      selectors.repoUrl.value = chip.dataset.url;
      analyzeRepository(chip.dataset.url);
    });
  });
}

async function checkLlmStatus() {
  try {
    const response = await fetch("/api/llm/status");
    if (!response.ok) throw new Error(`status ${response.status}`);
    const payload = await response.json();
    state.llm = { enabled: Boolean(payload.enabled), model: payload.model || "", checked: true };
  } catch {
    state.llm = { enabled: false, model: "", checked: true };
  }
  updateAiBadge("idle");
}

function updateAiBadge(mode) {
  if (!selectors.aiBadge || !selectors.aiBadgeLabel) return;
  const { enabled, model } = state.llm;
  const modelLabel = model ? prettyModelName(model) : "Granite";
  selectors.aiBadge.classList.remove("hidden", "thinking", "ready", "off");

  if (!enabled) {
    selectors.aiBadge.classList.add("off");
    selectors.aiBadgeLabel.textContent = "watsonx offline · heuristic mode";
    refreshIcons();
    return;
  }

  if (mode === "thinking") {
    selectors.aiBadge.classList.add("thinking");
    selectors.aiBadgeLabel.textContent = `${modelLabel} · enhancing…`;
  } else if (mode === "ready") {
    selectors.aiBadge.classList.add("ready");
    selectors.aiBadgeLabel.textContent = `${modelLabel} · live`;
  } else {
    selectors.aiBadgeLabel.textContent = `IBM watsonx · ${modelLabel}`;
  }
  refreshIcons();
}

function prettyModelName(modelId) {
  if (!modelId) return "Granite";
  const tail = modelId.split("/").pop() || modelId;
  return tail
    .replace(/^ibm-/, "")
    .replace(/^granite-?/i, "Granite ")
    .replace(/-instruct$/i, "")
    .replace(/-/g, " ")
    .trim();
}

function bindEvents() {
  selectors.repoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await analyzeRepository(selectors.repoUrl.value.trim());
  });

  selectors.demoButton.addEventListener("click", () => {
    selectors.repoUrl.value = demoAnalysis.repo.url;
    setAnalysis(demoAnalysis);
    setStatus("Demo loaded", "circle-dot");
  });

  selectors.promptButton.addEventListener("click", () => {
    selectors.promptText.value = buildBobPrompt(state.analysis);
    selectors.promptDialog.showModal();
    refreshIcons();
  });

  selectors.copyPromptButton.addEventListener("click", async () => {
    await copyText(selectors.promptText.value);
    setStatus("Prompt copied", "clipboard-check");
  });

  selectors.copyPlanButton.addEventListener("click", async () => {
    await copyText(buildPrPlanText(state.analysis));
    setStatus("PR plan copied", "clipboard-check");
  });

  if (selectors.copyShareButton) {
    selectors.copyShareButton.addEventListener("click", async () => {
      const repo = state.analysis?.repo;
      const url = `${location.origin}${location.pathname}?repo=${encodeURIComponent(repo?.url || "")}`;
      await copyText(url);
      setStatus("Share link copied", "clipboard-check");
    });
  }

  document.addEventListener("keydown", (event) => {
    const cmd = event.metaKey || event.ctrlKey;
    if (cmd && event.key.toLowerCase() === "k") {
      event.preventDefault();
      selectors.repoUrl?.focus();
      selectors.repoUrl?.select();
    } else if (cmd && (event.key === "Enter" || event.key === "Return")) {
      event.preventDefault();
      if (document.activeElement === selectors.repoUrl) {
        analyzeRepository(selectors.repoUrl.value.trim());
      }
    } else if (event.key === "Escape") {
      if (selectors.promptDialog?.open) selectors.promptDialog.close();
      if (selectors.fileDialog?.open) selectors.fileDialog.close();
    }
  });

  selectors.segments.forEach((segment) => {
    segment.addEventListener("click", () => {
      selectors.segments.forEach((item) => item.classList.remove("active"));
      segment.classList.add("active");
      state.missionFilter = segment.dataset.filter;
      state.selectedMission = 0;
      renderMissions();
    });
  });
}

async function analyzeRepository(url) {
  const parsed = parseGitHubUrl(url);
  if (!parsed) {
    setStatus("Use a GitHub repo URL", "triangle-alert");
    return;
  }

  setStatus("Analyzing repo", "loader-circle");
  applySkeletonLoading();

  try {
    let baseAnalysis = null;
    let paths = null;

    try {
      const publicAnalysis = await fetchPublicGitHubAnalysis(parsed);
      baseAnalysis = buildHeuristicAnalysis(publicAnalysis.repo, publicAnalysis.paths);
      paths = publicAnalysis.paths;
    } catch (publicError) {
      console.info("Public GitHub analysis failed, trying token-backed server route.", publicError);
    }

    if (!baseAnalysis) {
      const serverAnalysis = await fetchServerAnalysis(url);
      if (serverAnalysis) {
        baseAnalysis = buildHeuristicAnalysis(serverAnalysis.repo, serverAnalysis.paths, serverAnalysis.authenticated);
        paths = serverAnalysis.paths;
      }
    }

    if (!baseAnalysis) {
      throw new Error("Repository analysis failed. Private repositories require the local server and GITHUB_TOKEN.");
    }

    setAnalysis(baseAnalysis);
    setStatus("Heuristic pass ready", "badge-check");

    if (state.llm.enabled && paths) {
      enhanceWithLlm(baseAnalysis, paths);
    }
    return;
  } catch (error) {
    console.error(error);
    setStatus(error.message || "Demo fallback loaded", "circle-alert");
    setAnalysis({
      ...demoAnalysis,
      source: "Demo fallback after GitHub API error",
      repo: {
        ...demoAnalysis.repo,
        summary:
          "Live GitHub analysis was unavailable in this browser session, so RepoQuest loaded the prepared demo flow.",
      },
    });
  }
}

async function enhanceWithLlm(baseAnalysis, paths) {
  const runId = ++state.enhancingId;
  const cacheKey = baseAnalysis.repo.url || baseAnalysis.repo.fullName;

  if (llmCache.has(cacheKey)) {
    applyLlmEnhancements(baseAnalysis, llmCache.get(cacheKey), runId);
    return;
  }

  updateAiBadge("thinking");
  setStatus("watsonx enhancing", "sparkles");

  const ctx = buildLlmContext(baseAnalysis, paths);

  const enhancements = {};
  try {
    const [summary, missions, firstPr] = await Promise.allSettled([
      callLlm(promptForSummary(ctx), { maxTokens: 220, temperature: 0.3 }),
      callLlm(promptForMissions(ctx), { maxTokens: 1100, temperature: 0.35 }),
      callLlm(promptForFirstPr(ctx), { maxTokens: 700, temperature: 0.3 }),
    ]);

    if (summary.status === "fulfilled") enhancements.summary = parseJsonish(summary.value)?.summary;
    if (missions.status === "fulfilled") enhancements.missions = parseJsonish(missions.value)?.missions;
    if (firstPr.status === "fulfilled") enhancements.firstPr = parseJsonish(firstPr.value)?.firstPr;

    llmCache.set(cacheKey, enhancements);
    applyLlmEnhancements(baseAnalysis, enhancements, runId);
  } catch (error) {
    console.warn("watsonx enhancement failed:", error);
    setStatus("watsonx unavailable · using heuristics", "circle-alert");
    updateAiBadge("idle");
  }
}

function applyLlmEnhancements(baseAnalysis, enhancements, runId) {
  if (runId !== state.enhancingId) return;

  const next = { ...baseAnalysis };
  next.repo = { ...baseAnalysis.repo };
  let touched = false;
  const enhancedSections = [];

  if (enhancements.summary && typeof enhancements.summary === "string") {
    next.repo.summary = enhancements.summary;
    touched = true;
    enhancedSections.push("repoBrief");
  }

  if (Array.isArray(enhancements.missions) && enhancements.missions.length) {
    next.missions = enhancements.missions.map((mission) => normalizeMission(mission));
    touched = true;
    enhancedSections.push("missionsSection");
  }

  if (enhancements.firstPr && typeof enhancements.firstPr === "object") {
    next.firstPr = normalizeFirstPr(enhancements.firstPr, baseAnalysis.firstPr);
    touched = true;
    enhancedSections.push("prSection");
  }

  if (touched) {
    next.source = "IBM watsonx (Granite) live analysis";
    setAnalysis(next);
    flashEnhancedSections(enhancedSections);
  }

  setStatus("Analysis ready · AI live", "badge-check");
  updateAiBadge("ready");
}

function flashEnhancedSections(keys) {
  keys.forEach((key, i) => {
    const el = selectors[key];
    if (!el) return;
    setTimeout(() => {
      el.classList.remove("section-enhanced");
      void el.offsetWidth;
      el.classList.add("section-enhanced");
      setTimeout(() => el.classList.remove("section-enhanced"), 1500);
    }, i * 220);
  });
}

function applySkeletonLoading() {
  [selectors.repoName, selectors.repoSummary, selectors.techStack, selectors.keyFileCount].forEach((el) => {
    if (el) el.classList.add("skeleton");
  });
  setTimeout(() => {
    [selectors.repoName, selectors.repoSummary, selectors.techStack, selectors.keyFileCount].forEach((el) => {
      if (el) el.classList.remove("skeleton");
    });
  }, 1200);
}

function normalizeMission(mission) {
  return {
    title: String(mission.title || "Untitled mission"),
    difficulty: ["Beginner", "Medium", "Hard"].includes(mission.difficulty) ? mission.difficulty : "Beginner",
    time: String(mission.time || "20 min"),
    goal: String(mission.goal || ""),
    files: Array.isArray(mission.files) ? mission.files.slice(0, 5).map(String) : [],
    hints: Array.isArray(mission.hints) ? mission.hints.slice(0, 4).map(String) : [],
    test: String(mission.test || ""),
    outcome: String(mission.outcome || ""),
  };
}

function normalizeFirstPr(generated, fallback) {
  return {
    title: String(generated.title || fallback.title),
    risk: ["Low", "Medium", "High"].includes(generated.risk) ? generated.risk : fallback.risk,
    files: Array.isArray(generated.files) && generated.files.length ? generated.files.slice(0, 6).map(String) : fallback.files,
    steps: Array.isArray(generated.steps) && generated.steps.length ? generated.steps.slice(0, 8).map(String) : fallback.steps,
    tests: Array.isArray(generated.tests) && generated.tests.length ? generated.tests.slice(0, 6).map(String) : fallback.tests,
    checklist:
      Array.isArray(generated.checklist) && generated.checklist.length
        ? generated.checklist.slice(0, 6).map(String)
        : fallback.checklist,
  };
}

function buildLlmContext(analysis, paths) {
  const sampledPaths = paths.slice(0, 60);
  return {
    repoName: analysis.repo.fullName || analysis.repo.name,
    summary: analysis.repo.summary,
    techStack: analysis.repo.techStack,
    importantFiles: analysis.repo.importantFiles,
    pathSample: sampledPaths,
    totalPaths: paths.length,
  };
}

function promptForSummary(ctx) {
  return `You are RepoQuest's analyst. Read the repository signal and produce a crisp two-sentence summary for a brand-new contributor.

Repository: ${ctx.repoName}
Tech stack heuristic: ${ctx.techStack.join(", ")}
Key files: ${ctx.importantFiles.join(", ")}
File-path sample (${ctx.pathSample.length} of ${ctx.totalPaths}):
${ctx.pathSample.map((p) => `- ${p}`).join("\n")}

Rules:
- Sentence 1: what the project is and who uses it.
- Sentence 2: where a first-time contributor should start.
- Be specific. No marketing language. No emojis.

Return JSON only, matching this shape:
{"summary": "..."}`;
}

function promptForMissions(ctx) {
  return `You are RepoQuest's onboarding designer. Generate exactly 5 first-PR onboarding missions tailored to this real repository.

Repository: ${ctx.repoName}
Tech stack: ${ctx.techStack.join(", ")}
Important files: ${ctx.importantFiles.join(", ")}
File-path sample:
${ctx.pathSample.map((p) => `- ${p}`).join("\n")}

Mission rules:
- Each mission teaches a real, concrete part of THIS repo. Reference actual paths from the sample above.
- Difficulty must be "Beginner" or "Medium". The first 3 missions should be Beginner.
- Three progressive hints per mission, ordered from gentle nudge to specific pointer.
- Suggested test should be runnable or a clear manual checklist.
- Each mission should be completable in 15-40 minutes.

Return JSON only:
{
  "missions": [
    {
      "title": "...",
      "difficulty": "Beginner",
      "time": "20 min",
      "goal": "...",
      "files": ["path/from/sample"],
      "hints": ["...", "...", "..."],
      "test": "...",
      "outcome": "..."
    }
  ]
}`;
}

function promptForFirstPr(ctx) {
  return `You are RepoQuest recommending the safest meaningful first pull request for this repository.

Repository: ${ctx.repoName}
Tech stack: ${ctx.techStack.join(", ")}
Important files: ${ctx.importantFiles.join(", ")}
File-path sample:
${ctx.pathSample.map((p) => `- ${p}`).join("\n")}

Rules:
- Pick a real improvement a maintainer would accept (typically docs, setup clarity, validation message, small refactor that is scoped to one file).
- Title under 70 chars, specific to this repo.
- Risk MUST be "Low" or "Medium".
- Files MUST be paths from the sample above.
- 4-6 implementation steps. 3-5 tests. 3-5 checklist items.
- No vague language ("improve things", "make better"). Each step should be concrete.

Return JSON only:
{
  "firstPr": {
    "title": "...",
    "risk": "Low",
    "files": ["..."],
    "steps": ["...", "..."],
    "tests": ["..."],
    "checklist": ["..."]
  }
}`;
}

async function callLlm(prompt, options = {}) {
  const response = await fetch("/api/llm", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      prompt,
      maxTokens: options.maxTokens || 800,
      temperature: options.temperature ?? 0.2,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `LLM proxy returned ${response.status}`);
  }
  return payload.text || "";
}

function parseJsonish(text) {
  if (!text) return null;
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function fetchServerAnalysis(repoUrl) {
  const response = await fetch(`/api/analyze?repo=${encodeURIComponent(repoUrl)}`);
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Repository analysis failed.");
  }

  return payload;
}

async function fetchPublicGitHubAnalysis(parsed) {
  const repoResponse = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`);
  if (!repoResponse.ok) {
    const error = new Error(
      repoResponse.status === 404
        ? "Public GitHub access failed. If this is private, RepoQuest will try the local token-backed route."
        : `Public GitHub metadata request failed with ${repoResponse.status}.`,
    );
    error.status = repoResponse.status;
    throw error;
  }
  const repo = await repoResponse.json();
  const treeResponse = await fetch(
    `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees/${repo.default_branch}?recursive=1`,
  );
  if (!treeResponse.ok) {
    const error = new Error(`Public GitHub tree request failed with ${treeResponse.status}.`);
    error.status = treeResponse.status;
    throw error;
  }
  const tree = await treeResponse.json();
  const paths = (tree.tree || [])
    .filter((item) => item.type === "blob")
    .map((item) => item.path)
    .slice(0, 1200);

  return { paths, repo };
}

function parseGitHubUrl(url) {
  try {
    const parsed = new URL(url);
    const [owner, repo] = parsed.pathname.replace(/^\/|\/$/g, "").split("/");
    if (!owner || !repo || parsed.hostname !== "github.com") {
      return null;
    }
    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

function buildHeuristicAnalysis(repo, paths, authenticated = false) {
  const importantFiles = getImportantFiles(paths);
  const techStack = inferTechStack(paths);
  const folders = getTopFolders(paths);
  const missions = buildMissions(importantFiles, techStack);
  const firstPr = buildFirstPrPlan(importantFiles);
  const score = calculateReadinessScore(importantFiles, techStack, missions);

  return {
    source: authenticated ? "Authenticated GitHub tree analysis" : "Live GitHub tree analysis",
    repo: {
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      summary:
        repo.description ||
        `${repo.full_name} contains ${paths.length} tracked files across ${folders.length || 1} top-level areas.`,
      techStack,
      importantFiles,
      stats: {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        language: repo.language || null,
        updatedAt: repo.pushed_at || repo.updated_at || null,
        defaultBranch: repo.default_branch || "main",
      },
    },
    architecture: buildArchitecture(folders, importantFiles, techStack),
    missions,
    firstPr,
    readiness: {
      score,
      concepts: inferConcepts(techStack, importantFiles),
      nextSteps: [
        `Start with the first beginner mission — give yourself ${parseMinutes(missions[0]?.time) || 20} minutes.`,
        `Open ${importantFiles[0] || "the entry point"} in the preview before you write any code.`,
        `Run the suggested test on a clean clone — if it passes, that's your safety net.`,
        `Mark missions complete as you go. Hit ${Math.min(94, score + 10)}% readiness and you're ready to PR.`,
      ],
      radar: [
        { label: firstPr.title, score: Math.min(96, score + 8), level: "low" },
        { label: "Small validation or UI message", score: Math.max(62, score - 8), level: "medium" },
        { label: "Shared architecture refactor", score: Math.max(28, score - 42), level: "high" },
      ],
    },
  };
}

function getImportantFiles(paths) {
  const priority = [
    "readme",
    "package.json",
    "pyproject.toml",
    "requirements.txt",
    "vite.config",
    "next.config",
    "src/main",
    "src/app",
    "app/page",
    "pages/index",
    "server",
    "api",
    "routes",
    "controllers",
    "models",
    "test",
    "spec",
  ];

  const selected = paths
    .filter((path) => priority.some((needle) => path.toLowerCase().includes(needle)))
    .sort((a, b) => scoreFile(b) - scoreFile(a))
    .slice(0, 8);

  return selected.length ? selected : paths.slice(0, 8);
}

function scoreFile(path) {
  const lower = path.toLowerCase();
  let score = 0;
  if (lower.includes("readme")) score += 20;
  if (lower.includes("package.json") || lower.includes("pyproject")) score += 18;
  if (lower.includes("src/") || lower.includes("app/")) score += 14;
  if (lower.includes("api") || lower.includes("route")) score += 12;
  if (lower.includes("test") || lower.includes("spec")) score += 10;
  return score - path.split("/").length;
}

function inferTechStack(paths) {
  const checks = [
    ["Next.js", (path) => path.includes("next.config") || path.includes("app/page.")],
    ["React", (path) => /\.(jsx|tsx)$/.test(path) || path.includes("react")],
    ["Vue", (path) => path.endsWith(".vue")],
    ["TypeScript", (path) => /\.(ts|tsx)$/.test(path)],
    ["JavaScript", (path) => /\.(js|jsx|mjs|cjs)$/.test(path)],
    ["Python", (path) => path.endsWith(".py") || path.includes("requirements.txt")],
    ["FastAPI", (path) => path.includes("fastapi") || path.includes("uvicorn")],
    ["Node.js", (path) => path.endsWith("package.json")],
    ["Tests", (path) => /test|spec|__tests__/i.test(path)],
    ["CSS", (path) => /\.(css|scss|sass)$/.test(path)],
  ];

  const stack = checks.filter(([, matcher]) => paths.some(matcher)).map(([label]) => label);
  return stack.length ? stack.slice(0, 6) : ["General repository"];
}

function getTopFolders(paths) {
  const counts = new Map();
  paths.forEach((path) => {
    const [first] = path.split("/");
    if (!first || first.includes(".")) return;
    counts.set(first, (counts.get(first) || 0) + 1);
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([folder]) => folder);
}

function buildArchitecture(folders, importantFiles, techStack) {
  const entryPoints = importantFiles.filter((file) => /readme|package|main|index|page/i.test(file)).slice(0, 4);
  const uiFolders = folders.filter((folder) => /src|app|pages|components|client|frontend|web/i.test(folder));
  const backendFolders = folders.filter((folder) => /api|server|backend|routes|controllers|models/i.test(folder));
  const qualityFiles = importantFiles.filter((file) => /test|spec|lint|config/i.test(file)).slice(0, 4);

  return [
    { label: "Entry Points", items: entryPoints.length ? entryPoints : importantFiles.slice(0, 3) },
    { label: "Product Layer", items: uiFolders.length ? uiFolders : techStack.slice(0, 4) },
    { label: "Service Layer", items: backendFolders.length ? backendFolders : folders.slice(0, 4) },
    { label: "Quality", items: qualityFiles.length ? qualityFiles : ["manual checks", "README validation"] },
  ];
}

function buildMissions(importantFiles) {
  const primaryFile = importantFiles[0] || "README.md";
  const secondFile = importantFiles[1] || primaryFile;
  const testFile = importantFiles.find((file) => /test|spec/i.test(file)) || "test plan";

  return [
    {
      title: "Map the entry point",
      difficulty: "Beginner",
      time: "15 min",
      goal: "Identify where a new contributor should begin reading and what command or file starts the project.",
      files: [primaryFile, secondFile],
      hints: [
        "Start with the README and compare it to the project scripts or entry files.",
        "Write down the first file that connects user intent to code behavior.",
        "Ask Bob to confirm whether any hidden setup step is missing.",
      ],
      test: "Follow the setup path and record the exact command or manual verification step.",
      outcome: "You can explain the repository starting point without guessing.",
    },
    {
      title: "Trace one user-facing workflow",
      difficulty: "Beginner",
      time: "25 min",
      goal: "Follow a single behavior through the key files without crossing into unrelated modules.",
      files: importantFiles.slice(0, 3),
      hints: [
        "Choose one visible behavior instead of the whole app.",
        "Follow names and imports before changing code.",
        "Capture the flow as three to five simple steps.",
      ],
      test: "Verify the behavior manually or with the closest existing test.",
      outcome: "You can describe one useful workflow from input to output.",
    },
    {
      title: "Find a safe contributor improvement",
      difficulty: "Beginner",
      time: "20 min",
      goal: "Select a small improvement with low blast radius and real contributor value.",
      files: importantFiles.filter((file) => /readme|doc|config|package/i.test(file)).slice(0, 3),
      hints: [
        "Prefer documentation, setup clarity, labels, or validation messages.",
        "Avoid sweeping refactors for the first PR.",
        "Score the option by files touched, testability, and review clarity.",
      ],
      test: "Confirm the change can be reviewed by reading one or two files.",
      outcome: "You can choose a first PR that is beginner-safe and meaningful.",
    },
    {
      title: "Design the validation path",
      difficulty: "Medium",
      time: "30 min",
      goal: "Turn the proposed change into a concrete test or manual verification checklist.",
      files: [testFile, primaryFile],
      hints: [
        "Look for existing test names and mirror their style.",
        "If no tests exist, write a manual checklist that a maintainer can repeat.",
        "Ask Bob for edge cases after you define the expected behavior.",
      ],
      test: "Run or document the validation path and capture the result.",
      outcome: "You can prove the first PR did not break the core flow.",
    },
    {
      title: "Package the PR for review",
      difficulty: "Medium",
      time: "20 min",
      goal: "Prepare a title, description, risk note, and reviewer checklist for the contribution.",
      files: importantFiles.slice(0, 4),
      hints: [
        "Keep the title specific and maintainer-friendly.",
        "Mention why this is a good first contribution.",
        "Include what Bob helped analyze and what you manually verified.",
      ],
      test: "Read the PR body as if you were a busy maintainer and remove vague claims.",
      outcome: "You can submit a clean, reviewable PR package.",
    },
  ];
}

function buildFirstPrPlan(importantFiles) {
  const docsFile = importantFiles.find((file) => /readme|doc/i.test(file)) || importantFiles[0] || "README.md";
  const configFile =
    importantFiles.find((file) => /package|pyproject|requirements|config/i.test(file)) || importantFiles[1] || docsFile;

  return {
    title: "Improve first-run setup notes for new contributors",
    risk: "Low",
    files: [docsFile, configFile],
    steps: [
      `Review ${docsFile} and identify one unclear setup or navigation step.`,
      `Cross-check the instruction against ${configFile}.`,
      "Add a concise clarification with exact commands or file references.",
      "Keep the PR scoped to contributor onboarding unless a command is clearly broken.",
    ],
    tests: [
      "Follow the updated setup from a clean terminal session.",
      "Run the smallest available validation command or document manual verification.",
      "Check rendered Markdown formatting and links.",
    ],
    checklist: [
      "The change helps a new contributor start faster.",
      "The PR touches only the expected files.",
      "The test plan can be repeated by a maintainer.",
    ],
  };
}

function inferConcepts(techStack, importantFiles) {
  const concepts = ["Repository entry points", "Safe file selection", "PR scoping"];
  if (techStack.some((item) => /React|Vue|Next/i.test(item))) concepts.push("Component flow");
  if (techStack.some((item) => /Python|FastAPI|Node/i.test(item))) concepts.push("Service boundaries");
  if (importantFiles.some((file) => /test|spec/i.test(file))) concepts.push("Existing test conventions");
  concepts.push("Reviewer-ready test plans");
  return concepts.slice(0, 6);
}

function calculateReadinessScore(importantFiles, techStack, missions) {
  let score = 64;
  score += Math.min(12, importantFiles.length * 2);
  if (techStack.length > 1) score += 6;
  if (missions.length >= 5) score += 8;
  if (importantFiles.some((file) => /test|spec/i.test(file))) score += 6;
  return Math.min(94, score);
}

function setAnalysis(analysis) {
  state.analysis = analysis;
  state.selectedMission = 0;
  clearSkeletons();
  completedMissions.clear();
  loadCompletedMissionsForRepo(analysis?.repo);
  recordRecentAnalysis(analysis);
  render();
}

function loadCompletedMissionsForRepo(repo) {
  if (!repo) return;
  const key = repoStorageKey(repo);
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_COMPLETED}:${key}`);
    if (!raw) return;
    const list = JSON.parse(raw);
    if (Array.isArray(list)) list.forEach((title) => completedMissions.add(title));
  } catch {
    // ignore
  }
}

function persistCompletedMissions() {
  const repo = state.analysis?.repo;
  if (!repo) return;
  const key = repoStorageKey(repo);
  try {
    localStorage.setItem(`${STORAGE_KEY_COMPLETED}:${key}`, JSON.stringify([...completedMissions]));
  } catch {
    // ignore
  }
}

function repoStorageKey(repo) {
  return repo.fullName || repo.url || repo.name || "demo";
}

function recordRecentAnalysis(analysis) {
  if (!analysis?.repo) return;
  if (analysis.source === "Prepared demo output") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECENT);
    const list = raw ? JSON.parse(raw) : [];
    const entry = {
      fullName: analysis.repo.fullName,
      url: analysis.repo.url,
      score: analysis.readiness?.score || 0,
      at: Date.now(),
    };
    const filtered = list.filter((x) => x.fullName !== entry.fullName);
    filtered.unshift(entry);
    localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(filtered.slice(0, 5)));
  } catch {
    // ignore
  }
}

function renderRecentAnalyses() {
  if (!selectors.recentList || !selectors.recentSection) return;
  let list = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECENT);
    list = raw ? JSON.parse(raw) : [];
  } catch {
    list = [];
  }
  if (!list.length) {
    selectors.recentSection.hidden = true;
    return;
  }
  selectors.recentSection.hidden = false;
  selectors.recentList.innerHTML = list
    .map(
      (item) => `
        <button class="recent-item" type="button" data-url="${escapeHtml(item.url || "")}">
          <i data-lucide="git-branch" aria-hidden="true"></i>
          <span class="recent-item-path">${escapeHtml(item.fullName || "")}</span>
          <span class="recent-item-score">${item.score}%</span>
        </button>
      `,
    )
    .join("");
  selectors.recentList.querySelectorAll(".recent-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = btn.dataset.url;
      if (!url) return;
      selectors.repoUrl.value = url;
      analyzeRepository(url);
    });
  });
}

function clearSkeletons() {
  document.querySelectorAll(".skeleton").forEach((el) => el.classList.remove("skeleton"));
}

function render() {
  renderOverview();
  renderArchitecture();
  renderFiles();
  renderMissions();
  renderPrPlan();
  renderReadiness();
  renderTimeEstimate();
  renderRecentAnalyses();
  refreshIcons();
}

function renderTimeEstimate() {
  if (!selectors.timeEstimateValue) return;
  const missions = state.analysis?.missions || [];
  const total = missions.reduce((acc, m) => acc + parseMinutes(m.time), 0);
  selectors.timeEstimateValue.textContent = formatDuration(total);
  if (selectors.timeEstimateMissions) selectors.timeEstimateMissions.textContent = String(missions.length);
  if (selectors.timeEstimateBar) {
    const pct = Math.min(100, (total / 180) * 100);
    selectors.timeEstimateBar.style.width = `${pct}%`;
  }
}

function parseMinutes(text) {
  if (!text) return 0;
  const m = String(text).match(/(\d+)\s*min/i);
  if (m) return Number(m[1]);
  const h = String(text).match(/(\d+)\s*h/i);
  if (h) return Number(h[1]) * 60;
  return 0;
}

function formatDuration(mins) {
  if (!mins || mins <= 0) return "—";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function renderOverview() {
  const { repo, firstPr, readiness } = state.analysis;
  selectors.repoName.textContent = repo.name || repo.fullName;
  selectors.repoSummary.textContent = repo.summary;
  selectors.techStack.textContent = repo.techStack.join(", ");
  selectors.keyFileCount.textContent = repo.importantFiles.length;
  selectors.missionCount.textContent = `${state.analysis.missions.length} steps`;
  selectors.riskLevel.textContent = firstPr.risk;
  if (selectors.viewOnGithub) {
    selectors.viewOnGithub.href = repo.url || "#";
  }
  animateReadiness(readiness.score);
  renderRepoStats(repo);
  fetchLanguages(repo).catch(() => {});
}

function animateReadiness(target) {
  const target0 = Math.max(0, Math.min(100, Number(target) || 0));
  if (selectors.scoreRingFg) {
    const offset = RING_CIRCUMFERENCE * (1 - target0 / 100);
    selectors.scoreRingFg.setAttribute("stroke-dashoffset", String(offset));
  }
  if (!selectors.readinessScore) return;
  const startValue = Number(selectors.readinessScore.textContent) || 0;
  const start = performance.now();
  const duration = 1100;
  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = Math.round(startValue + (target0 - startValue) * eased);
    selectors.readinessScore.textContent = value;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

async function fetchLanguages(repo) {
  if (!selectors.langBreakdown || !repo.fullName) return;
  try {
    const response = await fetch(`https://api.github.com/repos/${repo.fullName}/languages`);
    if (!response.ok) {
      selectors.langBreakdown.classList.add("hidden");
      return;
    }
    const data = await response.json();
    renderLangBreakdown(data);
  } catch {
    selectors.langBreakdown.classList.add("hidden");
  }
}

const langColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  PHP: "#4F5D95",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Makefile: "#427819",
  JSON: "#cbcb41",
  Markdown: "#083fa1",
};

function colorForLang(name) {
  return langColors[name] || `hsl(${(name.length * 47) % 360} 60% 55%)`;
}

function renderLangBreakdown(data) {
  if (!selectors.langBreakdown) return;
  const entries = Object.entries(data || {});
  if (!entries.length) {
    selectors.langBreakdown.classList.add("hidden");
    return;
  }
  const total = entries.reduce((acc, [, v]) => acc + v, 0) || 1;
  const top = entries.sort((a, b) => b[1] - a[1]).slice(0, 6);
  const totalTop = top.reduce((acc, [, v]) => acc + v, 0);
  const rest = total - totalTop;

  const items = top.map(([name, bytes]) => ({
    name,
    pct: (bytes / total) * 100,
    color: colorForLang(name),
  }));
  if (rest > 0 && total > 0) {
    items.push({ name: "Other", pct: (rest / total) * 100, color: "#5c6862" });
  }

  selectors.langBreakdown.classList.remove("hidden");
  selectors.langBreakdown.innerHTML = `
    <div class="lang-breakdown-bar">
      ${items.map((item) => `<span style="width: ${item.pct.toFixed(2)}%; background: ${item.color};"></span>`).join("")}
    </div>
    <div class="lang-breakdown-legend">
      ${items
        .slice(0, 5)
        .map(
          (item) => `
            <span class="lang-legend-item">
              <span class="lang-legend-dot" style="background: ${item.color};"></span>
              <span class="lang-legend-name">${escapeHtml(item.name)}</span>
              <span class="lang-legend-pct">${item.pct.toFixed(1)}%</span>
            </span>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderRepoStats(repo) {
  if (!selectors.repoStats) return;
  const stats = repo.stats;
  if (!stats) {
    selectors.repoStats.innerHTML = "";
    return;
  }
  const items = [];
  if (typeof stats.stars === "number") items.push({ icon: "star", value: formatCount(stats.stars), label: "stars" });
  if (typeof stats.forks === "number") items.push({ icon: "git-fork", value: formatCount(stats.forks), label: "forks" });
  if (typeof stats.openIssues === "number") items.push({ icon: "circle-dot", value: formatCount(stats.openIssues), label: "open issues" });
  if (stats.language) items.push({ icon: "code", value: stats.language, label: "" });
  if (stats.updatedAt) items.push({ icon: "calendar", value: relativeTime(stats.updatedAt), label: "" });
  selectors.repoStats.innerHTML = items
    .map(
      (item) => `
        <span class="repo-stat">
          <i data-lucide="${item.icon}" aria-hidden="true"></i>
          <strong>${escapeHtml(item.value)}</strong>${item.label ? `<span> ${escapeHtml(item.label)}</span>` : ""}
        </span>
      `,
    )
    .join("");
}

function formatCount(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}k`;
  return String(num);
}

function relativeTime(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function renderArchitecture() {
  const rows = state.analysis.architecture || [];
  if (!rows.length) {
    selectors.architectureMap.innerHTML = "";
    return;
  }

  const rowHeight = 88;
  const rowGap = 16;
  const labelWidth = 168;
  const containerWidth = 760;
  const itemsX = labelWidth + 28;
  const itemsWidth = containerWidth - itemsX - 16;
  const svgHeight = rows.length * rowHeight + (rows.length - 1) * rowGap + 16;

  const nodes = rows
    .map((row, index) => {
      const y = index * (rowHeight + rowGap) + 8;
      const items = (row.items || []).slice(0, 5);
      return { ...row, y, items };
    });

  const edges = nodes
    .slice(0, -1)
    .map((node, i) => {
      const next = nodes[i + 1];
      const x = labelWidth / 2;
      const y1 = node.y + rowHeight;
      const y2 = next.y;
      const cx = x;
      const cy = (y1 + y2) / 2;
      return `<path class="arch-edge" d="M ${x} ${y1} C ${cx} ${cy} ${cx} ${cy} ${x} ${y2}" />`;
    })
    .join("");

  const labelNodes = nodes
    .map(
      (node) => `
        <g class="arch-node">
          <rect x="0" y="${node.y}" width="${labelWidth}" height="${rowHeight}" rx="14"
            fill="rgba(45,191,168,0.10)" stroke="rgba(45,191,168,0.45)" stroke-width="1.2" />
          <text x="${labelWidth / 2}" y="${node.y + rowHeight / 2 - 4}" text-anchor="middle" class="arch-node-label">
            ${escapeHtml(node.label)}
          </text>
          <text x="${labelWidth / 2}" y="${node.y + rowHeight / 2 + 14}" text-anchor="middle" class="arch-node-sub">
            ${escapeHtml(`L${nodes.indexOf(node) + 1}`)}
          </text>
        </g>
      `,
    )
    .join("");

  const itemGroups = nodes
    .map((node) => {
      const items = node.items;
      if (!items.length) return "";
      const pillHeight = 32;
      const pillGap = 8;
      const pillsPerRow = 2;
      const pillWidth = (itemsWidth - pillGap * (pillsPerRow - 1)) / pillsPerRow;
      const innerRows = Math.ceil(items.length / pillsPerRow);
      const totalPillsHeight = innerRows * pillHeight + (innerRows - 1) * pillGap;
      const startY = node.y + (rowHeight - totalPillsHeight) / 2;

      const pills = items
        .map((item, index) => {
          const col = index % pillsPerRow;
          const row = Math.floor(index / pillsPerRow);
          const px = itemsX + col * (pillWidth + pillGap);
          const py = startY + row * (pillHeight + pillGap);
          return `
            <g>
              <rect x="${px}" y="${py}" width="${pillWidth}" height="${pillHeight}" rx="10"
                fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
              <text x="${px + 12}" y="${py + pillHeight / 2 + 4}" class="arch-node-sub" text-anchor="start">
                ${escapeHtml(truncate(item, 32))}
              </text>
            </g>
          `;
        })
        .join("");
      return pills;
    })
    .join("");

  selectors.architectureMap.innerHTML = `
    <svg viewBox="0 0 ${containerWidth} ${svgHeight}" preserveAspectRatio="xMidYMin meet" role="img" aria-label="Repository architecture flow">
      ${edges}
      ${labelNodes}
      ${itemGroups}
    </svg>
  `;
}

function truncate(text, n) {
  const s = String(text);
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function renderFiles() {
  selectors.importantFiles.innerHTML = state.analysis.repo.importantFiles
    .map((file) => `<li data-file-path="${escapeHtml(file)}" title="Click to preview">${escapeHtml(file)}</li>`)
    .join("");
  selectors.importantFiles.querySelectorAll("[data-file-path]").forEach((item) => {
    item.addEventListener("click", () => openFilePreview(item.dataset.filePath));
  });
}

async function openFilePreview(filePath) {
  const dialog = selectors.fileDialog;
  if (!dialog || !filePath) return;
  const repo = state.analysis?.repo;
  if (!repo || !repo.fullName) return;

  const branch = repo.stats?.defaultBranch || "main";
  const rawUrl = `https://raw.githubusercontent.com/${repo.fullName}/${branch}/${filePath}`;
  const webUrl = `${repo.url || `https://github.com/${repo.fullName}`}/blob/${branch}/${filePath}`;

  if (selectors.fileDialogPath) selectors.fileDialogPath.textContent = filePath;
  if (selectors.fileDialogOpenLink) selectors.fileDialogOpenLink.href = webUrl;
  if (selectors.fileDialogCode) {
    selectors.fileDialogCode.textContent = "Loading…";
    selectors.fileDialogCode.className = "hljs";
  }
  if (selectors.fileDialogMeta) selectors.fileDialogMeta.textContent = "Fetching from GitHub raw…";

  if (typeof dialog.showModal === "function") dialog.showModal();

  try {
    const response = await fetch(rawUrl);
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    let text = await response.text();
    const truncated = text.length > 60_000;
    if (truncated) {
      text = text.slice(0, 60_000) + "\n\n... (truncated for preview)";
    }
    if (selectors.fileDialogCode) {
      const lang = languageFromExtension(filePath);
      selectors.fileDialogCode.textContent = text;
      selectors.fileDialogCode.className = `hljs language-${lang}`;
      if (window.hljs && typeof window.hljs.highlightElement === "function") {
        window.hljs.highlightElement(selectors.fileDialogCode);
      }
    }
    if (selectors.fileDialogMeta) {
      const lineCount = text.split("\n").length;
      selectors.fileDialogMeta.textContent = `${lineCount} lines · branch: ${branch}${truncated ? " · truncated" : ""}`;
    }
  } catch (error) {
    if (selectors.fileDialogCode) {
      selectors.fileDialogCode.textContent = `Could not load ${filePath} from GitHub.\n\n${error.message || error}\n\nTry the GitHub link instead.`;
    }
    if (selectors.fileDialogMeta) selectors.fileDialogMeta.textContent = "Preview unavailable";
  }
}

function languageFromExtension(path) {
  const ext = (path.split(".").pop() || "").toLowerCase();
  const map = {
    js: "javascript", mjs: "javascript", cjs: "javascript",
    ts: "typescript", tsx: "typescript", jsx: "javascript",
    py: "python", rb: "ruby", go: "go", rs: "rust", java: "java",
    kt: "kotlin", swift: "swift", php: "php",
    html: "xml", svg: "xml", xml: "xml", vue: "xml",
    css: "css", scss: "scss", sass: "scss", less: "less",
    json: "json", yml: "yaml", yaml: "yaml", toml: "ini",
    md: "markdown", markdown: "markdown",
    sh: "bash", bash: "bash", zsh: "bash",
    sql: "sql", c: "c", h: "c", cpp: "cpp", hpp: "cpp",
  };
  return map[ext] || "plaintext";
}

function renderMissions() {
  const missions = getFilteredMissions();
  const selected = missions[state.selectedMission] || missions[0] || state.analysis.missions[0];

  selectors.missionList.innerHTML = missions
    .map((mission, index) => {
      const isActive = mission.title === selected.title;
      const isComplete = completedMissions.has(mission.title);
      return `
        <button class="mission-card ${isActive ? "active" : ""} ${isComplete ? "completed" : ""}" type="button" data-index="${index}">
          <span class="mission-meta">
            <span class="tag ${mission.difficulty.toLowerCase()}">${escapeHtml(mission.difficulty)}</span>
            <span class="tag">${escapeHtml(mission.time)}</span>
            <span class="mission-check" aria-hidden="true">
              <i data-lucide="check"></i>
            </span>
          </span>
          <strong>${escapeHtml(mission.title)}</strong>
          <span class="mission-goal">${escapeHtml(mission.goal)}</span>
        </button>
      `;
    })
    .join("");

  selectors.missionList.querySelectorAll(".mission-card").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (event.target.closest(".mission-check")) {
        return;
      }
      state.selectedMission = Number(button.dataset.index);
      renderMissions();
    });
    const check = button.querySelector(".mission-check");
    if (check) {
      check.addEventListener("click", (event) => {
        event.stopPropagation();
        const idx = Number(button.dataset.index);
        const mission = missions[idx];
        if (!mission) return;
        if (completedMissions.has(mission.title)) {
          completedMissions.delete(mission.title);
        } else {
          completedMissions.add(mission.title);
        }
        persistCompletedMissions();
        renderMissions();
        maybeCelebrate();
      });
    }
  });

  updateMissionProgress();
  refreshIcons();
  renderMissionDetail(selected);
}

function updateMissionProgress() {
  const total = state.analysis.missions.length;
  let done = 0;
  state.analysis.missions.forEach((m) => {
    if (completedMissions.has(m.title)) done += 1;
  });
  if (selectors.missionProgressDone) selectors.missionProgressDone.textContent = done;
  if (selectors.missionProgressTotal) selectors.missionProgressTotal.textContent = total;
  if (selectors.missionProgressFill) {
    const pct = total > 0 ? (done / total) * 100 : 0;
    selectors.missionProgressFill.style.width = `${pct}%`;
  }
  if (selectors.missionProgressBar) {
    selectors.missionProgressBar.classList.toggle("complete", done >= total && total > 0);
  }
}

function maybeCelebrate() {
  const total = state.analysis.missions.length;
  const done = state.analysis.missions.filter((m) => completedMissions.has(m.title)).length;
  const score = state.analysis.readiness?.score || 0;
  if (done >= total && total > 0 && score >= 80 && !confettiFired) {
    confettiFired = true;
    fireConfetti();
    setTimeout(() => { confettiFired = false; }, 6000);
  }
}

function fireConfetti() {
  if (typeof window === "undefined" || typeof window.confetti !== "function") return;
  const colors = ["#2dbfa8", "#6a8fd9", "#f0b35f", "#ffffff"];
  const fire = (originX, particleCount, spread) => {
    window.confetti({
      particleCount,
      angle: 60,
      spread,
      origin: { x: originX, y: 0.7 },
      colors,
      scalar: 0.9,
    });
    window.confetti({
      particleCount,
      angle: 120,
      spread,
      origin: { x: 1 - originX, y: 0.7 },
      colors,
      scalar: 0.9,
    });
  };
  fire(0.1, 70, 60);
  setTimeout(() => fire(0.2, 50, 80), 180);
  setTimeout(() => fire(0.3, 40, 100), 360);
}

function renderMissionDetail(mission) {
  selectors.missionDetail.innerHTML = `
    <div class="section-kicker">Selected Mission</div>
    <h2 style="margin-bottom:12px; text-transform:none; letter-spacing:-0.3px; font-size:1.25rem;">${escapeHtml(mission.title)}</h2>
    <p>${escapeHtml(mission.goal)}</p>

    <h3>Relevant Files</h3>
    <ul class="files-pill-list">
      ${mission.files.map((file) => `<li class="files-pill" data-file-path="${escapeHtml(file)}">${escapeHtml(file)}</li>`).join("")}
    </ul>

    <h3>Mentor Hints · click to reveal</h3>
    <ul class="hint-list">
      ${mission.hints
        .map(
          (hint, i) => `
            <li class="hint-item" data-hint-index="${i}">
              <button class="hint-toggle" type="button">
                <span class="hint-num">${i + 1}</span>
                <span class="hint-label">Hint ${i + 1}</span>
                <i data-lucide="chevron-down" class="hint-chevron"></i>
              </button>
              <div class="hint-body">${escapeHtml(hint)}</div>
            </li>
          `,
        )
        .join("")}
    </ul>

    <h3>Suggested Test</h3>
    <p>${escapeHtml(mission.test)}</p>

    <h3>Learning Outcome</h3>
    <p>${escapeHtml(mission.outcome)}</p>

    <div class="mission-actions">
      <button class="ghost-button" type="button" data-action="open-in-bob">
        <i data-lucide="bot" aria-hidden="true"></i>
        <span>Open in Bob</span>
      </button>
      <button class="ghost-button" type="button" data-action="copy-mission">
        <i data-lucide="copy" aria-hidden="true"></i>
        <span>Copy mission</span>
      </button>
      <button class="ghost-button" type="button" data-action="reveal-all-hints">
        <i data-lucide="lightbulb" aria-hidden="true"></i>
        <span>Reveal all hints</span>
      </button>
    </div>
  `;

  selectors.missionDetail.querySelectorAll(".hint-item").forEach((item) => {
    const toggle = item.querySelector(".hint-toggle");
    toggle.addEventListener("click", () => {
      item.classList.toggle("revealed");
    });
  });

  selectors.missionDetail.querySelectorAll("[data-file-path]").forEach((pill) => {
    pill.addEventListener("click", () => openFilePreview(pill.dataset.filePath));
  });

  selectors.missionDetail.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => handleMissionAction(btn.dataset.action, mission));
  });

  refreshIcons();
}

function handleMissionAction(action, mission) {
  if (action === "open-in-bob") {
    const prompt = buildMissionBobPrompt(mission, state.analysis);
    copyText(prompt);
    setStatus("Bob prompt copied · paste in Bob IDE", "clipboard-check");
  } else if (action === "copy-mission") {
    const text = formatMissionAsText(mission);
    copyText(text);
    setStatus("Mission copied", "clipboard-check");
  } else if (action === "reveal-all-hints") {
    selectors.missionDetail.querySelectorAll(".hint-item").forEach((item) => item.classList.add("revealed"));
  }
}

function buildMissionBobPrompt(mission, analysis) {
  return `I'm working through a RepoQuest onboarding mission for ${analysis.repo.fullName || analysis.repo.name}.

Mission: ${mission.title}
Difficulty: ${mission.difficulty} · Est. time: ${mission.time}

Goal:
${mission.goal}

Relevant files (please open these in the workspace):
${mission.files.map((f) => `- ${f}`).join("\n")}

Suggested test / verification:
${mission.test}

Please:
1. Read the files above with full repository context.
2. Walk me through the flow they implement.
3. Tell me one tiny improvement I could ship as a first PR.
4. Tell me exactly what to test before pushing.

Keep answers concrete and reference specific lines when helpful.`;
}

function formatMissionAsText(mission) {
  return `${mission.title}

Difficulty: ${mission.difficulty}
Estimated time: ${mission.time}

Goal: ${mission.goal}

Files:
${mission.files.map((f) => `  - ${f}`).join("\n")}

Hints:
${mission.hints.map((h, i) => `  ${i + 1}. ${h}`).join("\n")}

Suggested test:
  ${mission.test}

Learning outcome:
  ${mission.outcome}`;
}

function renderPrPlan() {
  const { firstPr, repo } = state.analysis;
  selectors.prTitle.textContent = firstPr.title;
  if (selectors.prPreviewTitle) selectors.prPreviewTitle.textContent = firstPr.title;
  if (selectors.prRepoLabel) selectors.prRepoLabel.textContent = repo.fullName || repo.name;
  if (selectors.prRiskBadge) {
    const risk = firstPr.risk || "Low";
    selectors.prRiskBadge.innerHTML = `<i data-lucide="shield" style="width:12px;vertical-align:-1px"></i> risk: ${escapeHtml(risk.toLowerCase())}`;
  }
  if (selectors.prBranchBadge) {
    selectors.prBranchBadge.innerHTML = `<i data-lucide="git-branch" style="width:12px;vertical-align:-1px"></i> first-pr/onboarding`;
  }

  if (selectors.prPreviewFiles) {
    selectors.prPreviewFiles.innerHTML = (firstPr.files || []).slice(0, 4)
      .map((file) => {
        const adds = 3 + Math.floor((file.length * 7) % 14);
        const dels = Math.floor((file.length * 3) % 6);
        return `
          <div class="pr-file-row">
            <i data-lucide="file-text" class="file-icon" aria-hidden="true" style="width:14px;height:14px;"></i>
            <span>${escapeHtml(file)}</span>
            <span class="file-diff"><span class="plus">+${adds}</span> <span class="minus">-${dels}</span></span>
          </div>
        `;
      })
      .join("");
  }

  selectors.implementationSteps.innerHTML = firstPr.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  selectors.testPlan.innerHTML = firstPr.tests.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  selectors.reviewerChecklist.innerHTML = firstPr.checklist.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  refreshIcons();
}

function renderReadiness() {
  const { readiness } = state.analysis;
  selectors.conceptsLearned.innerHTML = readiness.concepts.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  selectors.nextSteps.innerHTML = readiness.nextSteps.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  renderRadarChart(readiness.radar);
}

function renderRadarChart(radar) {
  if (!selectors.difficultyRadar) return;
  if (!Array.isArray(radar) || radar.length === 0) {
    selectors.difficultyRadar.innerHTML = "";
    return;
  }

  const radarPalette = ["#2dbfa8", "#6a8fd9", "#f0b35f", "#a77be8", "#8ee85f"];
  const size = 240;
  const center = size / 2;
  const radius = size * 0.42;
  const items = radar.slice(0, 5).map((item, index) => ({
    label: item.label || "Mission task",
    score: Math.max(0, Math.min(100, Number(item.score) || 0)),
    color: radarPalette[index % radarPalette.length],
  }));
  const count = items.length;
  const angleFor = (i) => (Math.PI * 2 * i) / count - Math.PI / 2;

  const rings = [0.25, 0.5, 0.75, 1.0]
    .map((r) => {
      const pts = items
        .map((_, i) => {
          const a = angleFor(i);
          const x = center + Math.cos(a) * radius * r;
          const y = center + Math.sin(a) * radius * r;
          return `${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(" ");
      return `<polygon class="radar-axis" points="${pts}" />`;
    })
    .join("");

  const axes = items
    .map((_, i) => {
      const a = angleFor(i);
      const x = center + Math.cos(a) * radius;
      const y = center + Math.sin(a) * radius;
      return `<line class="radar-axis-line" x1="${center}" y1="${center}" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}" />`;
    })
    .join("");

  const shapePoints = items
    .map((item, i) => {
      const a = angleFor(i);
      const ratio = Math.max(0, Math.min(1, (item.score || 0) / 100));
      const x = center + Math.cos(a) * radius * ratio;
      const y = center + Math.sin(a) * radius * ratio;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const dots = items
    .map((item, i) => {
      const a = angleFor(i);
      const ratio = Math.max(0, Math.min(1, (item.score || 0) / 100));
      const x = center + Math.cos(a) * radius * ratio;
      const y = center + Math.sin(a) * radius * ratio;
      return `<circle class="radar-dot" style="--radar-color: ${item.color};" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4.5" />`;
    })
    .join("");

  const dotLabels = items
    .map((item, i) => {
      const a = angleFor(i);
      const ratio = Math.max(0, Math.min(1, (item.score || 0) / 100));
      const dotX = center + Math.cos(a) * radius * ratio;
      const dotY = center + Math.sin(a) * radius * ratio;
      const labelX = Math.max(13, Math.min(size - 13, dotX + Math.cos(a) * 16));
      const labelY = Math.max(13, Math.min(size - 13, dotY + Math.sin(a) * 16));
      return `
        <g class="radar-dot-label" style="--radar-color: ${item.color};" transform="translate(${labelX.toFixed(2)} ${labelY.toFixed(2)})">
          <circle r="8" />
          <text y="0.4">${i + 1}</text>
        </g>
      `;
    })
    .join("");

  const legend = items
    .map((item, i) => {
      return `
        <div class="radar-legend-item" style="--radar-color: ${item.color};">
          <span class="radar-legend-dot" aria-hidden="true">${i + 1}</span>
          <span class="radar-legend-label">${escapeHtml(item.label)}</span>
          <span class="radar-legend-value">${item.score}%</span>
        </div>
      `;
    })
    .join("");
  const ariaLabel = items.map((item) => `${item.label}: ${item.score}%`).join(", ");

  selectors.difficultyRadar.innerHTML = `
    <div class="radar-chart-frame">
      <svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Contribution difficulty radar: ${escapeHtml(ariaLabel)}">
        ${rings}
        ${axes}
        <polygon class="radar-shape" points="${shapePoints}" />
        ${dots}
        ${dotLabels}
      </svg>
    </div>
    <div class="radar-legend" aria-hidden="true">
      ${legend}
    </div>
  `;
}

function getFilteredMissions() {
  if (state.missionFilter === "all") {
    return state.analysis.missions;
  }
  return state.analysis.missions.filter((mission) => mission.difficulty === state.missionFilter);
}

function buildBobPrompt(analysis) {
  return buildAnalysisBrief(analysis);
}

function buildAnalysisBrief(analysis) {
  const { repo, missions, firstPr, readiness } = analysis;
  const stats = repo.stats || {};
  const statLine = [
    stats.stars != null ? `${stats.stars.toLocaleString()} stars` : null,
    stats.forks != null ? `${stats.forks.toLocaleString()} forks` : null,
    stats.language || null,
  ]
    .filter(Boolean)
    .join(" · ");

  return `RepoQuest — onboarding brief for ${repo.fullName || repo.name}
${repo.url ? repo.url + "\n" : ""}${statLine ? statLine + "\n" : ""}
SUMMARY
${repo.summary}

TECH STACK
${repo.techStack.join(", ")}

START HERE
${repo.importantFiles.map((file) => `- ${file}`).join("\n")}

ONBOARDING MISSIONS (${missions.length}, ~${formatDuration(missions.reduce((a, m) => a + parseMinutes(m.time), 0))})
${missions
  .map(
    (m, i) => `${i + 1}. ${m.title} [${m.difficulty} · ${m.time}]
   Goal: ${m.goal}
   Files: ${m.files.join(", ")}
   Test: ${m.test}`,
  )
  .join("\n\n")}

FIRST PULL REQUEST (${firstPr.risk} risk)
Title: ${firstPr.title}
Files: ${firstPr.files.join(", ")}

Steps:
${firstPr.steps.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}

Test plan:
${firstPr.tests.map((t, i) => `  ${i + 1}. ${t}`).join("\n")}

Reviewer checklist:
${firstPr.checklist.map((c) => `  - ${c}`).join("\n")}

READINESS (${readiness.score}%)
Concepts you'll learn: ${readiness.concepts.join(", ")}

Generated by RepoQuest.`;
}

function buildPrPlanText(analysis) {
  const { firstPr } = analysis;
  return `${firstPr.title}

Risk: ${firstPr.risk}
Files: ${firstPr.files.join(", ")}

Implementation Steps:
${firstPr.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

Test Plan:
${firstPr.tests.map((step, index) => `${index + 1}. ${step}`).join("\n")}

Reviewer Checklist:
${firstPr.checklist.map((step, index) => `${index + 1}. ${step}`).join("\n")}`;
}

async function copyText(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  }
}

function setStatus(label, icon) {
  selectors.repoStatus.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>${escapeHtml(label)}`;
  refreshIcons();
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

initialize();
