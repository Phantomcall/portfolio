import type { CSSProperties } from "react";
import { Availability } from "@/app/_components/availability";
import { HeroGraph, type GraphPr } from "@/app/_components/hero-graph";
import { MergeLedger, type LedgerRow } from "@/app/_components/merge-ledger";
import { CommitSpine, CursorGlow, HeroTicker, Magnetic, SplitHeading, type TickerItem } from "@/app/_components/flair";
import { CopyEmail, CountUp, Reveal, SiteHeader, Spotlight } from "@/app/_components/motion";
import { ProjectFrame } from "@/app/_components/project-frame";
import { Rates } from "@/app/_components/rates";
import { RepoMarquee } from "@/app/_components/repo-marquee";
import { BeforeAfter, RedesignPrice } from "@/app/_components/redesign";
import { projects } from "@/lib/projects";
import { example, gains, keeps, steps } from "@/lib/redesign";
import { KINDS, findPr, formatDate, formatMonth, pullRequests, repoCount } from "@/lib/prs";

const NAME = "Patrick Uje";
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

// The hero graph replays the most recent merges, in order, as branches.
const graphPrs: GraphPr[] = pullRequests.slice(-60).map((p) => {
  const repo = p.repo.split("/")[1];
  return { kind: p.kind, label: `${repo.length > 22 ? `${repo.slice(0, 21)}…` : repo} #${p.url.split("/").pop()}` };
});

// The hero ticker types out the eight most recent merges, newest first.
const ticker: TickerItem[] = pullRequests
  .slice(-8)
  .reverse()
  .map((p) => ({ ref: `${p.repo.split("/")[1]}#${p.url.split("/").pop()}`, title: p.title, kind: p.kind }));

// Headline words. The three promises get their own animated gradient.
const HEADLINE: { text: string; from?: string; to?: string }[] = [
  { text: "I" },
  { text: "build" },
  { text: "React" },
  { text: "interfaces" },
  { text: "that" },
  { text: "are" },
  { text: "tested,", from: "#3ddba5", to: "#6ea8ff" },
  { text: "accessible", from: "#b3a8ff", to: "#6ea8ff" },
  { text: "and" },
  { text: "fast.", from: "#ffc845", to: "#ff8a5b" },
];

const practices = [
  {
    title: "Tested",
    body: "I add tests where they catch real regressions: interaction tests in Storybook, automated accessibility checks and visual snapshots.",
    evidence: "Storybook with interaction tests, an accessibility addon and Chromatic visual snapshots",
    pr: findPr("Storybook with stories"),
    color: "#3ddba5",
  },
  {
    title: "Accessible",
    body: "Keyboard paths, focus management and screen-reader announcements are part of done, not a follow-up ticket.",
    evidence: "Wired Mirror to the live vault and closed its accessibility gaps",
    pr: findPr("a11y gaps"),
    color: "#b3a8ff",
  },
  {
    title: "Fast",
    body: "I measure first, fix what the numbers show, then add a CI gate so the page stays fast after I leave.",
    evidence: "Lighthouse CI gate, next/image optimisation and below-the-fold code-splitting",
    pr: findPr("Lighthouse CI gate"),
    color: "#ffc845",
  },
  {
    title: "Reviewable",
    body: "Small pull requests with a clear description, and CI that lints, type-checks, tests and builds every change.",
    evidence: "GitHub Actions workflow that lints, type-checks, tests and builds every PR",
    pr: findPr("lint/typecheck/test/build"),
    color: "#6ea8ff",
  },
];

const skills: [string, string[]][] = [
  ["Languages", ["TypeScript", "JavaScript", "HTML", "CSS"]],
  ["Frameworks & UI", ["React", "Next.js", "Tailwind CSS", "Radix UI", "Framer Motion", "HTML Canvas"]],
  ["Testing", ["Storybook", "Vitest", "Accessibility tests", "Chromatic"]],
  ["Data & APIs", ["TanStack Query", "REST APIs", "Supabase", "Zod"]],
  ["Web3", ["wagmi", "viem", "RainbowKit"]],
  ["Tooling", ["Git", "GitHub Actions", "Lighthouse CI", "ESLint", "Linux"]],
];

const eyebrow = "font-mono text-[0.7rem] tracking-wide text-mist uppercase [font-stretch:88%]";
const sectionTitle = "font-display text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-balance";
const textLink = "text-glow-gold underline decoration-glow-gold/40 underline-offset-4 transition-colors hover:decoration-glow-gold";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded bg-snow px-4 py-2 font-display text-night focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>

      <SiteHeader name={NAME} />
      <CursorGlow />
      <CommitSpine />

      <main id="main">
        {/* ---------------- Hero ---------------- */}
        <section id="top" aria-labelledby="intro" className="relative isolate -mt-[4.25rem] overflow-hidden pt-[4.25rem]">
          <div aria-hidden className="absolute -top-56 left-[10%] -z-10 h-[38rem] w-[52rem] rounded-full bg-[radial-gradient(closest-side,#3987e540,transparent)]" />
          <div aria-hidden className="absolute top-24 -right-40 -z-10 h-[34rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,#9085e933,transparent)]" />
          <div aria-hidden className="absolute bottom-0 left-1/3 -z-10 h-[20rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,#199e7026,transparent)]" />
          <HeroGraph prs={graphPrs} />

          <div className="relative mx-auto flex min-h-[min(52rem,calc(100dvh-4.25rem))] max-w-6xl flex-col justify-center px-5 py-12 sm:px-8 lg:py-10">
            <p className={`${eyebrow} flex items-center gap-2.5`}>
              <span aria-hidden className="size-2 animate-pulse-dot rounded-full bg-glow-aqua text-glow-aqua motion-reduce:animate-none" />
              Frontend engineer · open to freelance and full-time roles
            </p>
            <h1
              id="intro"
              className="mt-6 max-w-[15ch] font-display text-[clamp(2.7rem,7.4vw,6rem)] leading-[0.98] font-semibold tracking-[-0.035em]"
            >
              {HEADLINE.map((w, i) => (
                <span key={w.text}>
                  <span
                    className={w.from ? "sheen" : "word"}
                    style={{ "--w": i, "--from": w.from, "--to": w.to } as CSSProperties}
                  >
                    {w.text}
                  </span>{" "}
                </span>
              ))}
            </h1>
            {/* Above the fold, so these rise in on load rather than waiting for a scroll. */}
            <div className="rise" style={{ "--delay": "500ms" } as CSSProperties}>
              <p className="mt-7 max-w-[36rem] text-lg leading-relaxed text-pretty text-mist sm:text-xl">
                I’m {NAME}. The branching lines on this page are my real pull requests, merging back in the order
                maintainers accepted them.<span className="max-lg:hidden"> Move your cursor through them.</span>
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 font-display font-semibold">
                <Magnetic>
                  <a href={`mailto:${EMAIL}`} className="cta-ring inline-block rounded-full px-7 py-3.5 text-snow">
                    Email me
                  </a>
                </Magnetic>
                <a
                  href="#work"
                  className="rounded-full border border-rule bg-surface/60 px-7 py-3.5 text-snow backdrop-blur transition-colors hover:border-mist"
                >
                  See the work
                </a>
                <a href={GITHUB} className={`${textLink} px-2`}>
                  GitHub ↗
                </a>
              </div>
            </div>

            <div className="rise mt-8" style={{ "--delay": "650ms" } as CSSProperties}>
              <HeroTicker items={ticker} />
            </div>

            <div className="rise" style={{ "--delay": "800ms" } as CSSProperties}>
              <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-6 border-t border-rule/70 pt-6">
                {[
                  { value: pullRequests.length, label: "Merged pull requests", color: "text-glow-blue" },
                  { value: repoCount, label: "Open-source repos", color: "text-glow-aqua" },
                  { value: projects.length, label: "Live products", color: "text-glow-gold" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col-reverse justify-end">
                    <dt className={`${eyebrow} mt-1`}>{s.label}</dt>
                    <dd className={`font-display text-4xl font-semibold tracking-tight sm:text-5xl ${s.color}`}>
                      <CountUp value={s.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <RepoMarquee />

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {/* ---------------- Proof ---------------- */}
          <section id="proof" aria-labelledby="proof-title" className="scroll-mt-20 py-24 sm:py-32">
            <Reveal>
              <p className={eyebrow}>The proof</p>
              <SplitHeading id="proof-title" text="Every claim here links to merged code." className={`${sectionTitle} mt-4 max-w-[18ch]`} />
              <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-mist">
                Since {since}, maintainers of {repoCount} open-source projects have reviewed and merged{" "}
                {pullRequests.length} of my pull requests. Each square is one of them. Hover, tap or use the arrow keys.
              </p>
            </Reveal>
            <Reveal delay={150} className="mt-12">
              <MergeLedger rows={rows} latest={latest} />
              <details className="group mt-5">
                <summary className="cursor-pointer font-mono text-xs text-mist marker:text-glow-gold hover:text-snow">
                  Browse all {pullRequests.length} pull requests as a list
                </summary>
                <div className="mt-8 grid gap-10 md:grid-cols-2">
                  {rows.map((row) => (
                    <section key={row.kind} aria-labelledby={`list-${row.kind}`}>
                      <h3 id={`list-${row.kind}`} className="flex items-center gap-2 font-display font-semibold">
                        <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: `var(--color-k-${row.kind})` }} />
                        {row.label} <span className="font-mono text-xs font-normal text-mist">{row.prs.length}</span>
                      </h3>
                      <ol className="mt-3 space-y-2.5 border-l border-rule pl-4">
                        {[...row.prs].reverse().map((pr) => (
                          <li key={pr.url} className="leading-snug">
                            <a href={pr.url} className="hover:text-glow-gold hover:underline">
                              {pr.title}
                            </a>
                            <span className="mt-0.5 block font-mono text-[0.7rem] text-mist">
                              {pr.repo} · {pr.date}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </section>
                  ))}
                </div>
              </details>
            </Reveal>
          </section>

          {/* ---------------- Work ---------------- */}
          <section id="work" aria-labelledby="work-title" className="scroll-mt-20 border-t border-rule py-24 sm:py-32">
            <Reveal>
              <p className={eyebrow}>Selected work</p>
              <SplitHeading id="work-title" text="Three products, live right now." className={`${sectionTitle} mt-4 max-w-[16ch]`} />
              <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-mist">
                Hover a screenshot to scroll through the real page.
              </p>
            </Reveal>
            <div className="mt-16 space-y-28 sm:space-y-36">
              {projects.map((p, i) => (
                <article
                  key={p.name}
                  className={`frame-wrap grid items-center gap-10 lg:gap-14 ${i % 2 ? "lg:grid-cols-[5fr_7fr]" : "lg:grid-cols-[7fr_5fr]"}`}
                >
                  <Reveal className={i % 2 ? "lg:order-2" : undefined}>
                    <ProjectFrame
                      image={p.image}
                      alt={p.imageAlt}
                      accent={p.accent}
                      url={p.links.find((l) => l.label === "Live site")?.href}
                    />
                  </Reveal>
                  <Reveal delay={120}>
                    <p className="font-mono text-[0.7rem] tracking-wide uppercase [font-stretch:88%]" style={{ color: p.accent }}>
                      {p.role}
                    </p>
                    <h3 className="mt-3 font-display text-[2.4rem] leading-none font-semibold tracking-tight">{p.name}</h3>
                    <p className="mt-4 text-lg leading-relaxed text-pretty">{p.summary}</p>
                    {p.context && <p className="mt-3 text-sm text-mist">{p.context}</p>}
                    <ul className="mt-6 space-y-3 leading-relaxed text-mist">
                      {p.work.map((w) => (
                        <li key={w} className="flex gap-3 text-pretty">
                          <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0" style={{ background: p.accent }} />
                          {w}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <li key={s} className="rounded-full border border-rule bg-surface px-3 py-1 font-mono text-[0.68rem] text-mist">
                          {s}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-7 flex flex-wrap gap-3 font-display font-semibold">
                      {p.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          className="rounded-full border px-5 py-2.5 transition-colors hover:bg-white/5"
                          style={{ borderColor: `${p.accent}66`, color: p.accent }}
                        >
                          {l.label} ↗<span className="sr-only"> for {p.name}</span>
                        </a>
                      ))}
                    </p>
                  </Reveal>
                </article>
              ))}
            </div>
          </section>

          {/* ---------------- How I work ---------------- */}
          <section id="practice" aria-labelledby="practice-title" className="scroll-mt-20 border-t border-rule py-24 sm:py-32">
            <Reveal>
              <p className={eyebrow}>How I work</p>
              <SplitHeading id="practice-title" text="Four habits, each with a pull request that shows it." className={`${sectionTitle} mt-4 max-w-[18ch]`} />
            </Reveal>
            <div className="mt-14 grid gap-5 md:grid-cols-2">
              {practices.map(({ title, body, evidence, pr, color }, i) => (
                <Reveal key={title} delay={i * 90} className="h-full">
                  <Spotlight color={color} className="flex h-full flex-col rounded-2xl border border-rule bg-surface p-6 sm:p-8">
                    <h3 className="flex items-center gap-3 font-display text-2xl font-semibold">
                      <span aria-hidden className="size-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
                      {title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-pretty text-mist">{body}</p>
                    <a href={pr.url} className="group mt-auto block pt-6">
                      <span className="block rounded-xl border border-rule bg-night/60 px-4 py-3 transition-colors group-hover:border-mist/60">
                        <span className="block font-mono text-[0.65rem] tracking-wide text-mist uppercase [font-stretch:88%]">
                          Evidence · {pr.repo} #{pr.url.split("/").pop()}
                        </span>
                        <span className="mt-1 block font-display leading-snug font-semibold">
                          {evidence} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                        </span>
                      </span>
                    </a>
                  </Spotlight>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-20">
              <h3 className="font-display text-2xl font-semibold">Toolkit</h3>
              <dl className="mt-6 grid border-t border-rule sm:grid-cols-[11rem_1fr]">
                {skills.map(([term, items]) => (
                  <div key={term} className="contents">
                    <dt className={`${eyebrow} border-rule pt-5 sm:border-b sm:py-5`}>{term}</dt>
                    <dd className="flex flex-wrap gap-2 border-b border-rule pt-3 pb-5 sm:py-4">
                      {items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-rule bg-surface px-3 py-1 text-sm transition-colors hover:border-glow-blue/60 hover:text-glow-blue"
                        >
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
                <div className="contents">
                  <dt className={`${eyebrow} pt-5 sm:border-b sm:border-rule sm:py-5`}>Education</dt>
                  <dd className="border-b border-rule pt-2 pb-5 sm:py-5">B.Sc. Computer Science, final year</dd>
                </div>
              </dl>
            </Reveal>
          </section>

          {/* ---------------- Redesigns ---------------- */}
          <section id="redesign" aria-labelledby="redesign-title" className="scroll-mt-20 border-t border-rule py-24 sm:py-32">
            <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-end">
              <Reveal>
                <p className={eyebrow}>Redesigns</p>
                <SplitHeading
                  id="redesign-title"
                  text="Already have a site? I’ll make it faster and easier to use."
                  className={`${sectionTitle} mt-4 max-w-[17ch]`}
                />
                <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-mist">
                  Keep what works, fix what doesn’t, and measure the difference. Here’s one I did on this site.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <RedesignPrice />
              </Reveal>
            </div>

            <Reveal delay={150} className="mt-12">
              <BeforeAfter {...example} />
            </Reveal>

            <ol className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <Reveal as="li" key={step.title} delay={i * 90} className="relative h-full rounded-2xl border border-rule bg-surface p-6">
                    <span
                      aria-hidden
                      className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-glow-violet to-glow-blue font-display font-semibold text-night"
                    >
                      {i + 1}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold">
                      <span className="sr-only">Step {i + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-mist">{step.body}</p>
                    {i < steps.length - 1 && (
                      <span aria-hidden className="absolute top-10 -right-5 hidden h-px w-5 bg-gradient-to-r from-glow-violet to-transparent lg:block" />
                    )}
                </Reveal>
              ))}
            </ol>

            <Reveal className="mt-12 grid gap-5 md:grid-cols-2">
              {[
                { title: "What you keep", items: keeps, color: "#3ddba5" },
                { title: "What you gain", items: gains, color: "#b3a8ff" },
              ].map((list) => (
                <div key={list.title} className="rounded-2xl border border-rule bg-surface/60 p-6">
                  <h3 className="font-display text-lg font-semibold">{list.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {list.items.map((item) => (
                      <li key={item} className="flex gap-3 leading-snug">
                        <span aria-hidden className="mt-[0.2em] font-mono text-sm" style={{ color: list.color }}>
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Reveal>
          </section>

          {/* ---------------- Rates & availability ---------------- */}
          <section id="rates" aria-labelledby="rates-title" className="scroll-mt-20 border-t border-rule py-24 sm:py-32">
            <Reveal>
              <p className={eyebrow}>Rates &amp; availability</p>
              <SplitHeading id="rates-title" text="Clear prices, and when you can reach me." className={`${sectionTitle} mt-4 max-w-[18ch]`} />
              <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-mist">
                Packages show starting prices. Your scope, custom features and deadline set the final quote, which you
                get in writing before any work starts.
              </p>
            </Reveal>
            <div className="mt-14">
              <Rates />
            </div>
            <Reveal className="mt-16">
              <Availability />
            </Reveal>
          </section>

          {/* ---------------- Contact ---------------- */}
          <section id="contact" aria-labelledby="contact-title" className="relative isolate scroll-mt-20 border-t border-rule py-28 sm:py-40">
            <div aria-hidden className="absolute top-10 left-1/4 -z-10 h-80 w-[36rem] rounded-full bg-[radial-gradient(closest-side,#9085e92e,transparent)]" />
            <Reveal>
              <h2
                id="contact-title"
                className="max-w-[16ch] font-display text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-balance"
              >
                Got something to build?{" "}
                <span className="sheen" style={{ "--w": 0, "--from": "#6ea8ff", "--to": "#3ddba5" } as CSSProperties}>
                  Let’s talk.
                </span>
              </h2>
              <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-mist">
                Hiring a frontend engineer, or need an interface built? Email me with what you’re building and I’ll tell
                you how I’d approach it.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4 font-display font-semibold">
                <Magnetic strength={0.18}>
                  <a href={`mailto:${EMAIL}`} className="cta-ring inline-block rounded-full px-7 py-4 text-snow sm:text-lg">
                    {EMAIL}
                  </a>
                </Magnetic>
                <CopyEmail email={EMAIL} />
                <a href={GITHUB} className={`${textLink} px-2`}>
                  GitHub ↗
                </a>
              </div>
            </Reveal>
          </section>
        </div>
      </main>

      <footer className="signoff mx-auto max-w-6xl overflow-hidden px-5 sm:px-8">
        <div className="border-t border-rule pt-14">
          <p
            aria-hidden
            className="signoff-text pb-[0.14em] font-display text-[clamp(3.6rem,15.5vw,13.5rem)] leading-[0.9] font-semibold tracking-[-0.055em] whitespace-nowrap select-none"
          >
            Patrick Uje
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-8 font-mono text-[0.7rem] text-mist">
          <span>© {new Date().getFullYear()} Amune Patrick Uje</span>
          <span>Pull request data from GitHub, last merge {formatDate(pullRequests[latestIndex].mergedAt)}</span>
          <a href="#top" className="group inline-flex items-center gap-2 text-snow hover:text-glow-aqua">
            Back to top
            <span aria-hidden className="inline-block transition-transform group-hover:-translate-y-1">↑</span>
          </a>
        </div>
      </footer>
    </>
  );
}
