const MAX_TREE_PATHS = 1200;

export async function fetchGithubRepoSnapshot(repoUrl, githubToken = "") {
  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed) {
    const error = new Error("Use a GitHub repository URL like https://github.com/owner/repo.");
    error.status = 400;
    throw error;
  }

  const repo = await githubRequest(`/repos/${parsed.owner}/${parsed.repo}`, githubToken);
  const tree = await githubRequest(`/repos/${parsed.owner}/${parsed.repo}/git/trees/${repo.default_branch}?recursive=1`, githubToken);
  const paths = (tree.tree || [])
    .filter((item) => item.type === "blob")
    .map((item) => item.path)
    .slice(0, MAX_TREE_PATHS);

  return {
    authenticated: Boolean(githubToken),
    paths,
    repo,
  };
}

export function buildRepoQuestBrief(snapshot) {
  const repo = snapshot.repo || {};
  const paths = Array.isArray(snapshot.paths) ? snapshot.paths : [];
  const keyFiles = selectKeyFiles(paths);
  const techStack = detectTechStack(repo, paths);
  const architecture = buildArchitecture(paths);
  const missions = buildMissions(paths, keyFiles);
  const firstPrPlan = buildFirstPrPlan(paths, keyFiles);

  return {
    source: "RepoQuest Orchestrate tool",
    generatedAt: new Date().toISOString(),
    repo: {
      name: repo.name || repo.full_name || "Repository",
      fullName: repo.full_name || repo.name || "unknown/repository",
      url: repo.html_url || "",
      description: repo.description || "No repository description provided.",
      defaultBranch: repo.default_branch || "main",
      primaryLanguage: repo.language || "Unknown",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      openIssues: repo.open_issues_count || 0,
      authenticated: Boolean(snapshot.authenticated),
    },
    summary: buildSummary(repo, techStack, paths),
    techStack,
    keyFiles,
    architecture,
    missions,
    firstPrPlan,
    readiness: buildReadiness(paths),
  };
}

export function parseGitHubRepo(repoUrl) {
  try {
    const parsed = new URL(repoUrl);
    if (!["github.com", "www.github.com"].includes(parsed.hostname)) {
      return null;
    }

    const [owner, repo] = parsed.pathname.replace(/^\/|\/$/g, "").split("/");
    if (!owner || !repo) {
      return null;
    }

    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

export function formatGithubError(status) {
  if (status === 400) {
    return "Use a GitHub repository URL like https://github.com/owner/repo.";
  }
  if (status === 401) {
    return "GitHub rejected GITHUB_TOKEN. Check that the token is valid, not expired, and pasted without extra spaces.";
  }
  if (status === 403) {
    return "GitHub denied access. Check token permissions, SSO authorization, rate limits, and repository access.";
  }
  if (status === 404) {
    return "Repository not found through authenticated access. If this is private, the token must have read access to that exact repo.";
  }
  return `GitHub API request failed with ${status}.`;
}

async function githubRequest(path, githubToken) {
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "repoquest-first-pr-simulator",
    "x-github-api-version": "2022-11-28",
  };

  if (githubToken) {
    headers.authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) {
    const error = new Error(`GitHub API request failed with ${response.status}.`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

function buildSummary(repo, techStack, paths) {
  const name = repo.full_name || repo.name || "this repository";
  const stack = techStack.length ? techStack.slice(0, 4).join(", ") : "the detected project files";
  const fileCount = paths.length;
  const description = repo.description ? `${repo.description} ` : "";
  return `${description}RepoQuest found ${fileCount} files and detected ${stack}. A safe first PR should start with setup docs, test clarity, or a small contributor-facing improvement.`;
}

function detectTechStack(repo, paths) {
  const stack = new Set();
  if (repo.language) stack.add(repo.language);
  if (hasPath(paths, /^package\.json$/i)) stack.add("Node.js");
  if (hasPath(paths, /\.tsx?$|tsconfig\.json$/i)) stack.add("TypeScript");
  if (hasPath(paths, /\.jsx?$|vite\.config\.|webpack\.config\./i)) stack.add("JavaScript");
  if (hasPath(paths, /(^|\/)(app|pages|components)\/.*\.(jsx|tsx)$/i)) stack.add("React-style UI");
  if (hasPath(paths, /\.py$|requirements\.txt|pyproject\.toml/i)) stack.add("Python");
  if (hasPath(paths, /\.go$/i)) stack.add("Go");
  if (hasPath(paths, /\.rs$|Cargo\.toml/i)) stack.add("Rust");
  if (hasPath(paths, /\.java$|pom\.xml|build\.gradle/i)) stack.add("Java");
  if (hasPath(paths, /Dockerfile|docker-compose\.ya?ml/i)) stack.add("Docker");
  if (hasPath(paths, /(^|\/)(test|tests|spec|__tests__)\/|\.test\.|\.spec\./i)) stack.add("Tests");
  if (hasPath(paths, /^\.github\/workflows\//i)) stack.add("GitHub Actions");
  return Array.from(stack).slice(0, 8);
}

function selectKeyFiles(paths) {
  const preferred = [
    /^README(\.md|\.rst|\.txt)?$/i,
    /^CONTRIBUTING(\.md|\.rst|\.txt)?$/i,
    /^package\.json$/i,
    /^pyproject\.toml$/i,
    /^requirements\.txt$/i,
    /^src\/(main|index|app)\./i,
    /^app\//i,
    /^pages\//i,
    /^api\//i,
    /^tests?\//i,
    /^\.github\/workflows\//i,
  ];

  const selected = [];
  for (const pattern of preferred) {
    const match = paths.find((path) => pattern.test(path) && !selected.includes(path));
    if (match) selected.push(match);
    if (selected.length >= 8) break;
  }

  if (selected.length < 5) {
    for (const path of paths.slice(0, 80)) {
      if (!selected.includes(path)) selected.push(path);
      if (selected.length >= 8) break;
    }
  }

  return selected;
}

function buildArchitecture(paths) {
  return [
    {
      layer: "Entry points",
      files: compactMatches(paths, [/^README/i, /^package\.json$/i, /^index\.html$/i, /^src\/(main|index|app)\./i]),
    },
    {
      layer: "Application code",
      files: compactMatches(paths, [/^src\//i, /^app\//i, /^pages\//i, /^components\//i, /^api\//i]),
    },
    {
      layer: "Configuration",
      files: compactMatches(paths, [/\.config\./i, /^\.env\.example$/i, /^tsconfig\.json$/i, /^vercel\.json$/i]),
    },
    {
      layer: "Quality",
      files: compactMatches(paths, [/^tests?\//i, /__tests__/i, /\.test\./i, /\.spec\./i, /^\.github\/workflows\//i]),
    },
  ].map((item) => ({
    layer: item.layer,
    files: item.files.length ? item.files : ["Not obvious from file tree"],
  }));
}

function buildMissions(paths, keyFiles) {
  const setupFile = findPath(paths, /^README/i) || keyFiles[0] || "README.md";
  const testFile = findPath(paths, /^tests?\//i) || findPath(paths, /\.test\.|\.spec\./i) || "nearest test file";
  const entryFile = findPath(paths, /^src\/(main|index|app)\./i) || findPath(paths, /^index\.html$/i) || keyFiles[0] || "main entry point";

  return [
    {
      title: "Read the setup path",
      difficulty: "Beginner",
      time: "15 min",
      files: [setupFile],
      outcome: "Explain how a new contributor gets the project running.",
    },
    {
      title: "Trace the main execution path",
      difficulty: "Beginner",
      time: "25 min",
      files: [entryFile],
      outcome: "Identify where control enters the app and where the first user-visible behavior starts.",
    },
    {
      title: "Find the quality check",
      difficulty: "Beginner",
      time: "20 min",
      files: [testFile],
      outcome: "Know which command or file proves a small contribution still works.",
    },
    {
      title: "Choose a low-risk improvement",
      difficulty: "Medium",
      time: "25 min",
      files: keyFiles.slice(0, 3),
      outcome: "Pick a documentation, setup, or test clarification that avoids core behavior changes.",
    },
    {
      title: "Draft the first PR",
      difficulty: "Medium",
      time: "30 min",
      files: keyFiles.slice(0, 4),
      outcome: "Produce a title, implementation checklist, and reviewer notes for the first pull request.",
    },
  ];
}

function buildFirstPrPlan(paths, keyFiles) {
  const docs = keyFiles.filter((path) => /readme|contributing|docs\//i.test(path));
  const files = (docs.length ? docs : keyFiles).slice(0, 3);
  return {
    title: docs.length ? "Clarify first-time contributor setup" : "Add a small contributor-facing clarification",
    risk: "Low",
    files,
    steps: [
      "Read the setup and test instructions before editing.",
      "Make one narrow documentation or test-discovery improvement.",
      "Run the smallest available validation command.",
      "Write the PR summary around what changed, why it helps, and how it was checked.",
    ],
    reviewerChecklist: [
      "The change is scoped to contributor onboarding.",
      "No secrets, tokens, or local-only paths were committed.",
      "The validation command is included in the PR description.",
    ],
  };
}

function buildReadiness(paths) {
  const signals = [
    { label: "README present", ok: hasPath(paths, /^README/i) },
    { label: "Contributor docs present", ok: hasPath(paths, /^CONTRIBUTING/i) },
    { label: "Tests visible", ok: hasPath(paths, /^tests?\//i) || hasPath(paths, /\.test\.|\.spec\./i) },
    { label: "CI visible", ok: hasPath(paths, /^\.github\/workflows\//i) },
    { label: "Package or dependency manifest visible", ok: hasPath(paths, /^package\.json$|pyproject\.toml|requirements\.txt|Cargo\.toml|go\.mod/i) },
  ];
  const score = 50 + signals.filter((signal) => signal.ok).length * 10;
  return {
    score: Math.min(100, score),
    signals,
    nextBestAction: "Start with the highest-signal docs or test path and make one low-risk clarification.",
  };
}

function compactMatches(paths, patterns) {
  const matches = [];
  for (const pattern of patterns) {
    const found = paths.find((path) => pattern.test(path) && !matches.includes(path));
    if (found) matches.push(found);
  }
  return matches.slice(0, 5);
}

function findPath(paths, pattern) {
  return paths.find((path) => pattern.test(path));
}

function hasPath(paths, pattern) {
  return paths.some((path) => pattern.test(path));
}
