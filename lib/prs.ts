import prs from "@/data/prs.json";

export type Kind = "feature" | "fix" | "test" | "docs" | "ci";

export type PullRequest = {
  title: string;
  url: string;
  repo: string;
  mergedAt: string;
  kind: Kind;
};

// Row order is fixed and matches the order the palette was validated in
// (adjacent rows must stay distinguishable for colour-blind readers).
export const KINDS: { kind: Kind; label: string }[] = [
  { kind: "feature", label: "Features" },
  { kind: "fix", label: "Fixes" },
  { kind: "test", label: "Tests" },
  { kind: "docs", label: "Docs" },
  { kind: "ci", label: "Performance & CI" },
];

export const pullRequests = prs as PullRequest[];

export const repoCount = new Set(pullRequests.map((p) => p.repo)).size;

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function formatMonth(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function findPr(titleIncludes: string) {
  const pr = pullRequests.find((p) => p.title.includes(titleIncludes));
  if (!pr) throw new Error(`No merged PR title includes "${titleIncludes}". Re-run npm run prs?`);
  return pr;
}
