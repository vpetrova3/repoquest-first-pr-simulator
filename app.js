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
      "Run IBM Bob on the selected repo and export the task history.",
      "Replace demo output with Bob-refined architecture and mission notes.",
      "Record a 3 to 5 minute walkthrough ending on the public bob_sessions folder.",
    ],
    radar: [
      { label: "README setup clarification", score: 94, level: "low" },
      { label: "One-framework UI copy update", score: 78, level: "medium" },
      { label: "Cross-framework behavior change", score: 42, level: "high" },
    ],
  },
  evidence: [
    "Use Bob IDE to analyze the selected repository structure.",
    "Export Bob task history markdown into bob_sessions/.",
    "Add screenshots of Bob task consumption summaries.",
    "Show Bob-generated missions and PR plan in the demo video.",
  ],
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
  readinessScore: document.querySelector("#readinessScore"),
  techStack: document.querySelector("#techStack"),
  keyFileCount: document.querySelector("#keyFileCount"),
  missionCount: document.querySelector("#missionCount"),
  riskLevel: document.querySelector("#riskLevel"),
  architectureMap: document.querySelector("#architectureMap"),
  importantFiles: document.querySelector("#importantFiles"),
  evidenceList: document.querySelector("#evidenceList"),
  missionList: document.querySelector("#missionList"),
  missionDetail: document.querySelector("#missionDetail"),
  segments: document.querySelectorAll(".segment"),
  prTitle: document.querySelector("#prTitle"),
  implementationSteps: document.querySelector("#implementationSteps"),
  testPlan: document.querySelector("#testPlan"),
  reviewerChecklist: document.querySelector("#reviewerChecklist"),
  conceptsLearned: document.querySelector("#conceptsLearned"),
  difficultyRadar: document.querySelector("#difficultyRadar"),
  nextSteps: document.querySelector("#nextSteps"),
  aiBadge: document.querySelector("#aiBadge"),
  aiBadgeLabel: document.querySelector("#aiBadgeLabel"),
};

function initialize() {
  setAnalysis(demoAnalysis);
  bindEvents();
  refreshIcons();
  checkLlmStatus();
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

  if (enhancements.summary && typeof enhancements.summary === "string") {
    next.repo.summary = enhancements.summary;
    touched = true;
  }

  if (Array.isArray(enhancements.missions) && enhancements.missions.length) {
    next.missions = enhancements.missions.map((mission) => normalizeMission(mission));
    touched = true;
  }

  if (enhancements.firstPr && typeof enhancements.firstPr === "object") {
    next.firstPr = normalizeFirstPr(enhancements.firstPr, baseAnalysis.firstPr);
    touched = true;
  }

  if (touched) {
    next.source = "IBM watsonx (Granite) live analysis";
    next.evidence = [
      `watsonx generated repository understanding for ${baseAnalysis.repo.fullName || baseAnalysis.repo.name}.`,
      "Heuristic pass produced the initial map; Granite refined missions, summary, and first PR plan in the live app.",
      "Run Bob IDE prompts in parallel to capture session evidence for bob_sessions/.",
      "Demo video should show the moment the watsonx badge flips from 'enhancing' to 'live'.",
    ];
    setAnalysis(next);
  }

  setStatus("Analysis ready · AI live", "badge-check");
  updateAiBadge("ready");
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
    },
    architecture: buildArchitecture(folders, importantFiles, techStack),
    missions,
    firstPr,
    readiness: {
      score,
      concepts: inferConcepts(techStack, importantFiles),
      nextSteps: [
        "Open this repository in IBM Bob IDE and ask Bob to validate the generated map.",
        "Export the Bob task history and consumption screenshot into bob_sessions/.",
        "Use the PR plan as the final demo moment after one mission walkthrough.",
      ],
      radar: [
        { label: firstPr.title, score: Math.min(96, score + 8), level: "low" },
        { label: "Small validation or UI message", score: Math.max(62, score - 8), level: "medium" },
        { label: "Shared architecture refactor", score: Math.max(28, score - 42), level: "high" },
      ],
    },
    evidence: [
      `RepoQuest fetched ${paths.length} files from ${repo.full_name}${repo.private ? " using authenticated server-side access" : ""}.`,
      "IBM Bob IDE should validate architecture, missions, tests, and PR scope.",
      "Export final Bob task histories into bob_sessions/ before submission.",
      "Use the generated prompt pack to keep Bob usage visible in the demo.",
    ],
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
  render();
}

function render() {
  renderOverview();
  renderArchitecture();
  renderFiles();
  renderEvidence();
  renderMissions();
  renderPrPlan();
  renderReadiness();
  refreshIcons();
}

function renderOverview() {
  const { repo, firstPr, readiness } = state.analysis;
  selectors.repoName.textContent = repo.fullName || repo.name;
  selectors.repoSummary.textContent = repo.summary;
  selectors.readinessScore.textContent = readiness.score;
  selectors.techStack.textContent = repo.techStack.join(", ");
  selectors.keyFileCount.textContent = repo.importantFiles.length;
  selectors.missionCount.textContent = `${state.analysis.missions.length} steps`;
  selectors.riskLevel.textContent = firstPr.risk;
}

function renderArchitecture() {
  selectors.architectureMap.innerHTML = state.analysis.architecture
    .map(
      (row) => `
        <div class="arch-row">
          <div class="arch-label">${escapeHtml(row.label)}</div>
          <div class="arch-items">
            ${row.items.map((item) => `<span class="arch-item">${escapeHtml(item)}</span>`).join("")}
          </div>
        </div>
      `,
    )
    .join("");
}

function renderFiles() {
  selectors.importantFiles.innerHTML = state.analysis.repo.importantFiles
    .map((file) => `<li>${escapeHtml(file)}</li>`)
    .join("");
}

function renderEvidence() {
  selectors.evidenceList.innerHTML = state.analysis.evidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderMissions() {
  const missions = getFilteredMissions();
  const selected = missions[state.selectedMission] || missions[0] || state.analysis.missions[0];

  selectors.missionList.innerHTML = missions
    .map(
      (mission, index) => `
        <button class="mission-card ${mission.title === selected.title ? "active" : ""}" type="button" data-index="${index}">
          <strong>${escapeHtml(mission.title)}</strong>
          <span>${escapeHtml(mission.goal)}</span>
          <span class="mission-meta">
            <span class="tag ${mission.difficulty.toLowerCase()}">${escapeHtml(mission.difficulty)}</span>
            <span class="tag">${escapeHtml(mission.time)}</span>
          </span>
        </button>
      `,
    )
    .join("");

  selectors.missionList.querySelectorAll(".mission-card").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedMission = Number(button.dataset.index);
      renderMissions();
    });
  });

  renderMissionDetail(selected);
}

function renderMissionDetail(mission) {
  selectors.missionDetail.innerHTML = `
    <div class="section-kicker">Selected Mission</div>
    <h3>${escapeHtml(mission.title)}</h3>
    <p>${escapeHtml(mission.goal)}</p>
    <h3>Relevant Files</h3>
    <ul class="evidence-list">
      ${mission.files.map((file) => `<li>${escapeHtml(file)}</li>`).join("")}
    </ul>
    <h3>Mentor Hints</h3>
    <ul class="hint-list">
      ${mission.hints.map((hint) => `<li>${escapeHtml(hint)}</li>`).join("")}
    </ul>
    <h3>Suggested Test</h3>
    <p>${escapeHtml(mission.test)}</p>
    <h3>Learning Outcome</h3>
    <p>${escapeHtml(mission.outcome)}</p>
  `;
}

function renderPrPlan() {
  const { firstPr } = state.analysis;
  selectors.prTitle.textContent = firstPr.title;
  selectors.implementationSteps.innerHTML = firstPr.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  selectors.testPlan.innerHTML = firstPr.tests.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  selectors.reviewerChecklist.innerHTML = firstPr.checklist.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
}

function renderReadiness() {
  const { readiness } = state.analysis;
  selectors.conceptsLearned.innerHTML = readiness.concepts.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  selectors.nextSteps.innerHTML = readiness.nextSteps.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  selectors.difficultyRadar.innerHTML = readiness.radar
    .map(
      (item) => `
        <div class="radar-row">
          <header>
            <span>${escapeHtml(item.label)}</span>
            <span>${item.score}%</span>
          </header>
          <div class="bar ${escapeHtml(item.level)}">
            <span style="width: ${item.score}%"></span>
          </div>
        </div>
      `,
    )
    .join("");
}

function getFilteredMissions() {
  if (state.missionFilter === "all") {
    return state.analysis.missions;
  }
  return state.analysis.missions.filter((mission) => mission.difficulty === state.missionFilter);
}

function buildBobPrompt(analysis) {
  const fileList = analysis.repo.importantFiles.map((file) => `- ${file}`).join("\n");
  return `You are helping us build RepoQuest: First PR Simulator for the IBM Bob Hackathon.

Repository: ${analysis.repo.fullName || analysis.repo.name}
URL: ${analysis.repo.url}

Current RepoQuest draft summary:
${analysis.repo.summary}

Important files identified by RepoQuest:
${fileList}

Please use full repository context to:
1. Validate or correct the architecture map.
2. Identify the real entry points, workflows, and test conventions.
3. Generate five beginner-friendly onboarding missions.
4. Recommend one beginner-safe but meaningful first PR.
5. Provide a PR title, description, implementation steps, risk notes, and test plan.
6. Summarize what should be exported into bob_sessions/ for judging.

Return the answer in sections: Repository Overview, Architecture Map, Missions, First PR Plan, Test Plan, Bob Evidence Notes.`;
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
