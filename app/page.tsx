import Image from "next/image";
import { MergeLedger, type LedgerRow } from "@/app/_components/merge-ledger";
import { projects } from "@/lib/projects";
import { KINDS, findPr, formatDate, formatMonth, pullRequests, repoCount } from "@/lib/prs";

const EMAIL = "pinzypatz@gmail.com";
const GITHUB = "https://github.com/Phantomcall";

const rows: LedgerRow[] = KINDS.map(({ kind, label }) => ({
  kind,
  label,
  prs: pullRequests
    .map((p, i) => ({ ...p, i }))
    .filter((p) => p.kind === kind)
    .map(({ title, url, repo, mergedAt, i }) => ({ title, url, repo, i, date: formatDate(mergedAt) })),
}));

// pullRequests is sorted oldest first, so the latest merge is the highest index.
const latestIndex = pullRequests.length - 1;
const latestRow = rows.findIndex((r) => r.prs.some((p) => p.i === latestIndex));
const latest = { row: latestRow, col: rows[latestRow].prs.findIndex((p) => p.i === latestIndex) };

const since = formatMonth(pullRequests[0].mergedAt);

const practices = [
  {
    title: "Tested",
    body: "I add tests where they catch real regressions: interaction tests in Storybook, automated accessibility checks and visual snapshots.",
    evidence: "Storybook with interaction tests, an accessibility addon and Chromatic visual snapshots",
    pr: findPr("Storybook with stories"),
  },
  {
    title: "Accessible",
    body: "Keyboard paths, focus management and screen-reader announcements are part of done, not a follow-up ticket.",
    evidence: "Wired Mirror to the live vault and closed its accessibility gaps",
    pr: findPr("a11y gaps"),
  },
  {
    title: "Fast",
    body: "I measure first, fix what the numbers show, then add a CI gate so the page stays fast after I leave.",
    evidence: "Lighthouse CI gate, next/image optimisation and below-the-fold code-splitting",
    pr: findPr("Lighthouse CI gate"),
  },
  {
    title: "Reviewable",
    body: "Small pull requests with a clear description, and CI that lints, type-checks, tests and builds every change.",
    evidence: "GitHub Actions workflow that lints, type-checks, tests and builds every PR",
    pr: findPr("lint/typecheck/test/build"),
  },
];

const skills = [
  ["Languages", "TypeScript, JavaScript, HTML, CSS"],
  ["Frameworks & UI", "React, Next.js (App Router), Tailwind CSS, Radix UI, Framer Motion, HTML Canvas"],
  ["Testing", "Storybook, Vitest, interaction and accessibility tests, Chromatic"],
  ["Data & APIs", "TanStack Query, REST APIs, Supabase, Zod"],
  ["Web3", "wagmi, viem, RainbowKit"],
  ["Tooling", "Git, GitHub Actions, Lighthouse CI, ESLint, Linux"],
  ["Education", "B.Sc. Computer Science, final year"],
];

const linkClass = "text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:decoration-gold";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-10 rounded bg-ink px-4 py-2 font-display text-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>

      <header className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-6 sm:px-8">
        <a href="#main" className="font-display text-lg font-semibold tracking-tight">
          Patrick Uje
        </a>
        <nav aria-label="Sections" className="flex gap-5 font-mono text-[0.72rem] tracking-wide uppercase [font-stretch:88%] sm:gap-7">
          <a href="#work" className="hover:text-gold">Work</a>
          <a href="#practice" className="hover:text-gold">How I work</a>
          <a href="#contact" className="hover:text-gold">Contact</a>
        </nav>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Hero: the claim, then the evidence for it. */}
        <section aria-labelledby="intro" className="pt-10 pb-20 sm:pt-16 sm:pb-28">
          <p className="font-mono text-[0.72rem] tracking-wide text-graphite uppercase [font-stretch:88%]">
            Frontend engineer · React, Next.js, TypeScript
          </p>
          <h1
            id="intro"
            className="mt-5 max-w-[17ch] font-display text-[clamp(2.4rem,6.2vw,4.9rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-balance"
          >
            I build React interfaces that are tested, accessible and fast.
          </h1>
          <p className="mt-7 max-w-[34rem] text-lg leading-relaxed text-pretty text-graphite sm:text-xl">
            Since {since}, maintainers of {repoCount} open-source projects have reviewed and merged{" "}
            {pullRequests.length} of my pull requests. Each mark below is one of them.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-display font-semibold">
            <a
              href={`mailto:${EMAIL}`}
              className="rounded-md bg-ink px-5 py-3 text-paper transition-colors hover:bg-[#223158]"
            >
              Email me
            </a>
            <a href={GITHUB} className={linkClass}>
              GitHub profile ↗
            </a>
          </div>

          <div className="mt-14">
            <MergeLedger rows={rows} latest={latest} />
            <details className="group mt-4">
              <summary className="cursor-pointer font-mono text-xs text-graphite marker:text-gold hover:text-ink">
                Browse all {pullRequests.length} pull requests as a list
              </summary>
              <div className="mt-6 grid gap-10 md:grid-cols-2">
                {rows.map((row) => (
                  <section key={row.kind} aria-labelledby={`list-${row.kind}`}>
                    <h2 id={`list-${row.kind}`} className="flex items-center gap-2 font-display font-semibold">
                      <span aria-hidden className="size-2.5 rounded-[2px]" style={{ background: `var(--color-k-${row.kind})` }} />
                      {row.label} <span className="font-mono text-xs font-normal text-graphite">{row.prs.length}</span>
                    </h2>
                    <ol className="mt-3 space-y-2.5 border-l border-rule pl-4">
                      {[...row.prs].reverse().map((pr) => (
                        <li key={pr.url} className="leading-snug">
                          <a href={pr.url} className="hover:text-gold hover:underline">
                            {pr.title}
                          </a>
                          <span className="mt-0.5 block font-mono text-[0.7rem] text-graphite">
                            {pr.repo} · {pr.date}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            </details>
          </div>
        </section>

        <section id="work" aria-labelledby="work-title" className="scroll-mt-8 border-t border-rule py-20 sm:py-28">
          <h2 id="work-title" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Selected work
          </h2>
          <div className="mt-12 space-y-20 sm:space-y-28">
            {projects.map((p) => (
              <article key={p.name} className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:gap-12">
                <div className="self-start overflow-hidden rounded-lg border border-rule bg-panel shadow-[0_1px_0_#ccd3dd,0_18px_40px_-28px_#14203a66]">
                  <Image
                    src={p.image}
                    alt={p.imageAlt}
                    sizes="(min-width: 1024px) 640px, 100vw"
                    placeholder="blur"
                    className="h-auto w-full"
                  />
                </div>
                <div>
                  <h3 className="font-display text-[1.9rem] leading-tight font-semibold tracking-tight">{p.name}</h3>
                  <p className="mt-3 text-lg leading-relaxed text-pretty">{p.summary}</p>
                  <p className="mt-4 font-mono text-[0.72rem] leading-relaxed tracking-wide text-graphite uppercase [font-stretch:88%]">
                    {p.role}
                    {p.context && (
                      <>
                        <br />
                        {p.context}
                      </>
                    )}
                  </p>
                  <ul className="mt-5 space-y-3 leading-relaxed">
                    {p.work.map((w) => (
                      <li key={w} className="relative pl-5 text-pretty before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-gold">
                        {w}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 font-mono text-xs leading-relaxed text-graphite">{p.stack.join(" · ")}</p>
                  <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-display font-semibold">
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} className={linkClass}>
                        {l.label} ↗<span className="sr-only"> for {p.name}</span>
                      </a>
                    ))}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="practice" aria-labelledby="practice-title" className="scroll-mt-8 border-t border-rule py-20 sm:py-28">
          <h2 id="practice-title" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            How I work
          </h2>
          <p className="mt-4 max-w-[36rem] text-lg leading-relaxed text-graphite">
            Four habits, each with a merged pull request that shows it.
          </p>
          <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2">
            {practices.map(({ title, body, evidence, pr }) => (
              <div key={title} className="border-t-2 border-ink pt-5">
                <h3 className="font-display text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-relaxed text-pretty">{body}</p>
                <a href={pr.url} className="mt-4 block rounded-md border border-rule bg-panel px-4 py-3 transition-colors hover:border-gold">
                  <span className="block font-mono text-[0.68rem] tracking-wide text-graphite uppercase [font-stretch:88%]">
                    Evidence · {pr.repo} #{pr.url.split("/").pop()}
                  </span>
                  <span className="mt-1 block font-display leading-snug font-semibold">{evidence}</span>
                </a>
              </div>
            ))}
          </div>

          <dl className="mt-20 grid border-t border-rule sm:grid-cols-[11rem_1fr]">
            {skills.map(([term, detail]) => (
              <div key={term} className="contents">
                <dt className="border-b border-rule pt-4 font-mono text-[0.72rem] tracking-wide text-graphite uppercase [font-stretch:88%] sm:py-4">
                  {term}
                </dt>
                <dd className="border-b border-rule pt-1 pb-4 sm:py-4 sm:pl-8">{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="contact" aria-labelledby="contact-title" className="scroll-mt-8 border-t border-rule py-20 sm:py-28">
          <h2 id="contact-title" className="max-w-[20ch] font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.02em] text-balance">
            Hiring a frontend engineer, or need an interface built?
          </h2>
          <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-graphite">
            Email me with what you’re building and I’ll tell you how I’d approach it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-display font-semibold">
            <a href={`mailto:${EMAIL}`} className="rounded-md bg-ink px-5 py-3 text-paper transition-colors hover:bg-[#223158]">
              {EMAIL}
            </a>
            <a href={GITHUB} className={linkClass}>
              GitHub profile ↗
            </a>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-rule py-8 font-mono text-[0.7rem] text-graphite">
          <span>© {new Date().getFullYear()} Amune Patrick Uje</span>
          <span>Pull request data from GitHub, last merge {formatDate(pullRequests[latestIndex].mergedAt)}</span>
        </div>
      </footer>
    </>
  );
}
