# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Static Astro 7 site (Tailwind 4, MDX) for English-speaking freelancers in Germany, deployed to Cloudflare Workers with a
small Worker for affiliate redirects and the contact form. See `README.md` for the launch checklist and article
component examples, and `docs/ARTICLES.md` for the article plan and per-article requirements.

## Commands

- `npm ci` — install (`.npmrc` disables install scripts and saves exact versions; don't add version ranges)
- `astro dev --background` — dev server at http://localhost:4321; manage with `astro dev stop|status|logs`
- `npm run build` — static build into `dist/`; this is also the content validator (see below)
- `npm run check` — `astro check` type-checking (there is no test suite or linter)
- `npm run preview` — build, then run site + Worker locally via `wrangler dev`
- `npm run deploy` — build and `wrangler deploy` (outward-facing; don't run without being asked)

## Architecture

**Routing.** `output: 'static'`, `trailingSlash: 'never'`, `build.format: 'file'` (pages emit as `/about.html`; use
`cleanPath()` from `src/lib/articles.ts` when comparing `Astro.url.pathname`). Articles live in
`src/content/articles/<hub>/<slug>.mdx`; the entry `id` is `<hub>/<slug>` and is the URL, rendered by
`src/pages/[...slug].astro`. Hub index pages come from `src/pages/[hub].astro`, driven by the `hubs` array in
`src/data/site.ts`. Hub ids are the single source of truth: the content schema (`src/content.config.ts`) uses
`z.enum(hubIds)`, so adding a hub means editing `site.ts` (the `HubId` type and the array).

**Always fetch articles through `getArticles()`** in `src/lib/articles.ts` — it filters `draft: true` out of production
builds (drafts still appear in dev) and sorts by `lastChecked`.

**Build-time content guards** (the build throws, intentionally):
- `[...slug].astro`: article body lacks `<ShortAnswer` (except `type: 'tool'`)
- `content.config.ts`: `sources` must have at least one entry; `description` ≤ 170 chars
- `Term.astro`: `<Term de="…">` not found in `src/data/glossary.ts` and no `en` prop given
- `AffiliateLink.astro`: slug not in `src/data/links.ts`

**MDX components** are injected globally via the `components` map in `[...slug].astro` — articles use them without
imports. A new article component must be added to that map.

**Worker** (`worker/index.ts`) only runs for `/go/*` and `/api/*` (`run_worker_first` in `wrangler.jsonc`); everything
else is served from `dist/` as static assets. It imports `affiliateLinks` from `src/data/links.ts`, so links are shared
between the site and the Worker. `/go/<slug>?from=<page>` redirects, appends the page as the affiliate sub-ID, and writes
an anonymous data point to the Analytics Engine dataset `affiliate_clicks`. `/api/contact` verifies Cloudflare Turnstile,
rate-limits, and sends mail via Brevo. Secrets (`TURNSTILE_SECRET`, `BREVO_API_KEY`) are set with `wrangler secret put`,
never in `wrangler.jsonc`.

**Data files** in `src/data/` hold editable site content: `site.ts` (author, hubs, Turnstile key, newsletter endpoint),
`links.ts`, `glossary.ts`, `calculators.ts`, and `rates.ts` (statutory health insurance values used by
`HealthCostCalculator`; must be updated every January with sources and `lastChecked`).

## Constraints

- **CSP** is configured in `astro.config.mjs` (`security.csp`): Astro hashes its own scripts/styles at build time. Avoid
  inline `style=` attributes, inline event handlers, and third-party scripts/fonts/images; anything external needs a CSP
  change. Syntax highlighting is off because Shiki's inline styles would break the CSP.
- **Privacy/GDPR**: fonts are self-hosted (Inter via `@fontsource-variable`, Astro `fonts` config); no cookies or IP
  logging in click tracking. Keep it that way.
- **Styling**: use the semantic Tailwind tokens (`bg-surface`, `text-muted`, `text-accent`, `border-line` …) defined as
  CSS variables in `src/styles/global.css` (`@theme inline`), which handle light/dark. Don't hardcode colors. Dark mode
  follows the OS unless overridden by `data-theme` on `<html>` (set by `ThemeToggle`).
- **Article conventions**: comparison tables put options in columns, attributes in rows, ending with a "Best for" row;
  set `hasAffiliateLinks: true` when linking through `/go/…`; update `lastChecked` when facts are re-checked.
- Security headers and asset caching live in `public/_headers`.
