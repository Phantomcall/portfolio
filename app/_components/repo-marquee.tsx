import type { CSSProperties } from "react";
import { pullRequests, repoCount, type Kind } from "@/lib/prs";

type Repo = { owner: string; name: string; count: number; kind: Kind };

// Every repo with a merged PR, most-merged first, coloured by its most common kind.
const repos: Repo[] = Object.values(
  pullRequests.reduce<Record<string, { repo: string; count: number; kinds: Partial<Record<Kind, number>> }>>((acc, pr) => {
    const entry = (acc[pr.repo] ??= { repo: pr.repo, count: 0, kinds: {} });
    entry.count++;
    entry.kinds[pr.kind] = (entry.kinds[pr.kind] ?? 0) + 1;
    return acc;
  }, {}),
)
  .map(({ repo, count, kinds }) => {
    const [owner, name] = repo.split("/");
    const kind = (Object.entries(kinds).sort((a, b) => b[1] - a[1])[0][0] ?? "feature") as Kind;
    return { owner, name, count, kind };
  })
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

// Two rows, dealt alternately so both carry some of the busiest repos.
const rows = [repos.filter((_, i) => i % 2 === 0), repos.filter((_, i) => i % 2 === 1)];

function Chip({ repo }: { repo: Repo }) {
  return (
    <span className="flex shrink-0 items-center gap-2 rounded-full border border-rule/80 bg-surface/80 py-1.5 pr-2 pl-3 font-mono text-xs whitespace-nowrap">
      <span className="size-2 rounded-full" style={{ background: `var(--color-k-${repo.kind})` }} />
      <span className="text-mist">{repo.owner}/</span>
      <span className="-ml-2 text-snow">{repo.name}</span>
      <span className="rounded-full bg-raised px-1.5 py-0.5 text-[0.62rem] text-mist">×{repo.count}</span>
    </span>
  );
}

/**
 * Two rows of repositories drifting in opposite directions. Decorative: the same PRs are
 * listed in full (and accessibly) in the ledger's "Browse all" list, so it's hidden from
 * assistive tech. Pauses on hover; still under reduced motion.
 */
export function RepoMarquee() {
  return (
    <section aria-hidden className="relative border-y border-rule/60 bg-surface/20 py-7">
      <p className="mb-5 text-center font-mono text-[0.7rem] tracking-wide text-mist uppercase [font-stretch:88%]">
        Merged into <span className="text-snow">{repoCount}</span> repositories
      </p>
      <div className="marquee space-y-3 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="flex overflow-hidden">
            <div
              className="marquee-track flex w-max gap-3 pr-3"
              data-reverse={r === 1 || undefined}
              style={{ "--dur": `${row.length * 2.6}s` } as CSSProperties}
            >
              {/* Two copies back to back, so shifting by half loops seamlessly. */}
              {[...row, ...row].map((repo, i) => (
                <Chip key={`${repo.owner}/${repo.name}-${i}`} repo={repo} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
