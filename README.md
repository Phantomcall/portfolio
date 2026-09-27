# Patrick Uje — portfolio

Personal site: selected work, how I work, and a live ledger of every pull request of mine
that a maintainer has merged.

Built with Next.js (App Router), TypeScript and Tailwind CSS v4. Fully static.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Refresh the pull request data

`data/prs.json` is generated from GitHub by `scripts/fetch-prs.mjs`. It needs the GitHub
CLI, signed in (`gh auth status`).

```bash
npm run prs
```

The script keeps only merged PRs into repositories you don't own, sorts them oldest first,
and sorts each into a kind (feature, fix, test, docs, performance & CI) from its
conventional-commit prefix, falling back to keywords in the title. Every count on the page
is computed from this file, so re-run it, commit the JSON and redeploy to update the site.

## Where things live

| Path | What it holds |
| --- | --- |
| `app/page.tsx` | Page content and layout |
| `app/_components/hero-graph.tsx` | Canvas "merge graph" behind the hero: real PRs branching and merging |
| `app/_components/merge-ledger.tsx` | The PR ledger: roving keyboard focus, hover/tap readout, replay |
| `app/_components/project-frame.tsx` | Browser frame that tilts and scrolls a full-page screenshot on hover |
| `app/_components/rates.tsx` | Rates, packages and the USD/NGN toggle |
| `app/_components/redesign.tsx` | Before/after comparison slider and the redesign price |
| `app/_components/use-currency.ts` | Shared USD/NGN choice, so every price on the page switches together |
| `app/_components/availability.tsx` | Live "available now" status and the weekly hours strip |
| `app/_components/motion.tsx` | Scroll reveal, count-up, spotlight cards, copy email, sticky header |
| `app/_components/flair.tsx` | Commit spine, merge ticker, word-rise headings, magnetic buttons, cursor glow |
| `app/_components/repo-marquee.tsx` | Scrolling rows of every repo with a merged PR |
| `app/not-found.tsx` | The 404 page |
| `lib/rates.ts` | Hourly rate, package prices, deadline adjustments and terms |
| `lib/redesign.ts` | Redesign price, process steps and the before/after example |
| `lib/availability.ts` | Working hours (UTC+1) and status logic |
| `lib/projects.ts` | Selected work copy, stack lists, links and accent colours |
| `lib/prs.ts` | PR types, kind order and date formatting |
| `assets/work/` | Full-page project screenshots, 1440px wide |
| `app/globals.css` | Colour and type tokens, and every keyframe animation |

To change prices or hours, edit `lib/rates.ts` or `lib/availability.ts`. Nothing else
needs to change. Every animation respects the visitor's reduced-motion setting.

The five kind colours were checked for colour-blind separation in the row order used in
`lib/prs.ts`. If you reorder the rows, re-check them.

## Deploy

Import the repo into Vercel. There are no build settings to change. Link previews use
Vercel's production URL automatically. Set `SITE_URL` only if you add a custom domain.
