// Regenerates data/prs.json from GitHub: every merged PR authored by the
// account below, excluding PRs into repos the account owns (forks don't
// count as "merged by a maintainer").
//
// Requires the GitHub CLI, signed in:  gh auth status
// Run:                                  npm run prs

import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const AUTHOR = "Phantomcall";

const raw = execFileSync(
  "gh",
  [
    "search", "prs",
    "--author", AUTHOR,
    "--merged",
    "--limit", "1000",
    "--json", "title,url,repository,closedAt",
  ],
  { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
);

// Conventional-commit type -> kind. Scope can override (feat(ci): ... is CI work).
const TYPE_KIND = {
  feat: "feature", feature: "feature", design: "feature", merge: "feature",
  refactor: "feature", style: "feature",
  fix: "fix", bugfix: "fix", hotfix: "fix",
  test: "test", tests: "test",
  docs: "docs", doc: "docs",
  ci: "ci", perf: "ci", build: "ci", chore: "ci",
};

// Keyword rules: the only signal for unprefixed titles, and a refinement for
// feat: titles that are really tests/docs/CI. First match wins.
const KEYWORDS = [
  ["test", /\btests?\b|testing|fuzz|chaos|stress|storybook|coverage|e2e|harness|adversarial/],
  ["docs", /\bdocs?\b|documentation|readme|rustdoc|natspec|runbook|contributing|guidelines/],
  ["ci", /\bci\b|workflow|pipeline|github actions|clippy|lighthouse|profiling|slither|build profiles|\bperf\b|optimi[sz](e|ation)/],
  ["fix", /\bfix(es|ed)?\b|\bbug\b|\bguard\b|prevent|harden|duplicate/],
];

function keywordKind(t, { allowFix }) {
  for (const [kind, re] of KEYWORDS) {
    if (kind === "fix" && !allowFix) continue;
    if (re.test(t)) return kind;
  }
  return null;
}

function kindOf(title) {
  const t = title.trim().toLowerCase();
  const m = t.match(/^([a-z]+)(?:\(([^)]*)\))?!?:/);
  if (m && TYPE_KIND[m[1]]) {
    if (m[2] && /\b(ci|workflow|build)\b/.test(m[2])) return "ci";
    const kind = TYPE_KIND[m[1]];
    // "feat: add unit tests for …" is test work, whatever the prefix says.
    // A feat that mentions "guard" or "fix" is still a feature, so no fix override.
    if (kind === "feature") return keywordKind(t, { allowFix: false }) ?? kind;
    return kind;
  }
  return keywordKind(t, { allowFix: true }) ?? "feature";
}

const prs = JSON.parse(raw)
  .filter((p) => p.repository.nameWithOwner.split("/")[0].toLowerCase() !== AUTHOR.toLowerCase())
  .map((p) => ({
    title: p.title.replace(/\s+/g, " ").trim(),
    url: p.url,
    repo: p.repository.nameWithOwner,
    mergedAt: p.closedAt,
    kind: kindOf(p.title),
  }))
  .sort((a, b) => a.mergedAt.localeCompare(b.mergedAt));

mkdirSync(new URL("../data/", import.meta.url), { recursive: true });
writeFileSync(new URL("../data/prs.json", import.meta.url), JSON.stringify(prs, null, 2) + "\n");

const counts = prs.reduce((acc, p) => ((acc[p.kind] = (acc[p.kind] ?? 0) + 1), acc), {});
console.log(`${prs.length} merged PRs across ${new Set(prs.map((p) => p.repo)).size} repos`, counts);
