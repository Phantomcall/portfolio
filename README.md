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
| `app/_components/merge-ledger.tsx` | The PR ledger: roving keyboard focus, hover/tap readout |
| `lib/projects.ts` | Selected work copy, stack lists and links |
| `lib/prs.ts` | PR types, kind order and date formatting |
| `assets/work/` | Project screenshots (1440×810) |
| `app/globals.css` | Colour, type tokens and the ledger's load animation |

The five kind colours were checked for colour-blind separation in the row order used in
`lib/prs.ts`. If you reorder the rows, re-check them.

## Deploy

Import the repo into Vercel. There are no build settings to change. Link previews use
Vercel's production URL automatically. Set `SITE_URL` only if you add a custom domain.
