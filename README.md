# Freelance in Germany

Static Astro site with Tailwind, MDX articles and a small Cloudflare Worker for affiliate redirects and the contact form.

## Commands

| Command | What it does |
| --- | --- |
| `npm ci` | Install exact versions from the lockfile |
| `npm run dev` | Local dev server at http://localhost:4321 |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Build, then run the site and the worker locally with Wrangler |
| `npm run deploy` | Build and deploy to Cloudflare |
| `npm run check` | Type-check everything |

## Where things live

| Path | Contents |
| --- | --- |
| `src/content/articles/<hub>/<slug>.mdx` | Articles. The folder sets the URL: `/<hub>/<slug>` |
| `src/content.config.ts` | Article frontmatter schema |
| `src/data/site.ts` | Site name, author, hubs (topics), Turnstile site key, newsletter endpoint |
| `src/data/links.ts` | Affiliate links used by `/go/<slug>` |
| `src/data/rates.ts` | Health insurance rates for the calculator. **Update every January.** |
| `src/data/calculators.ts` | Calculator cards on the homepage |
| `src/components/` | Design components (see below) |
| `src/layouts/` | Base, article and simple text page layouts |
| `src/styles/global.css` | Tailwind setup and design tokens (light and dark) |
| `worker/index.ts` | `/go/*` affiliate redirects with click counting, `/api/contact` |
| `wrangler.jsonc` | Cloudflare config |
| `public/_headers` | Security headers |

## Writing an article

Create `src/content/articles/health-insurance/my-article.mdx`. These components work in every article without importing:

```mdx
<ShortAnswer>The answer in 3–4 lines.</ShortAnswer>

A <Term de="Krankenkasse" en="public health insurer" /> is …

<Callout title="Deadline">Do this before …</Callout>

<ComparisonTable>
| | Public | Private |
| --- | --- | --- |
| Price based on | Income | Age and health |
</ComparisonTable>

<HealthCostCalculator />

<ProviderCard name="Provider" bestFor="…" link="provider-a" highlight />
<AffiliateLink slug="provider-a">inline affiliate link</AffiliateLink>

import letter from '../../../assets/letters/prepayment.png';
<AnnotatedLetter src={letter} alt="…" title="…" notes={[{ x: 72, y: 12, label: 'Steuernummer', text: '…' }]} />
<Figure src={diagram} alt="…" caption="…" />
```

German terms come from `src/data/glossary.ts`; a term that isn't there fails the build, so the glossary page grows
as you write. The build also fails if an article has no `<ShortAnswer>` or no sources.

Comparison tables turn into stacked cards on phones automatically. Put the options in columns, attributes in rows,
and end with a "Best for" row.

Your photo: add `src/assets/author.jpg` and follow the comment in `src/data/site.ts`.

Set `draft: true` in the frontmatter to hide an article from the build (it still shows in `npm run dev`).

## Before launch

- [ ] Real domain in `astro.config.mjs` (`site`) and `public/robots.txt`
- [ ] Author name and bio in `src/data/site.ts`, About page text
- [ ] Impressum and privacy policy completed (see TODOs)
- [ ] Real affiliate URLs in `src/data/links.ts`, real provider names in articles
- [ ] Newsletter endpoint in `src/data/site.ts`
- [ ] Contact form: Turnstile site key in `src/data/site.ts`, `CONTACT_TO` / `CONTACT_FROM` in `wrangler.jsonc`, then
      `npx wrangler secret put TURNSTILE_SECRET` and `npx wrangler secret put BREVO_API_KEY`

## Affiliate click stats

Clicks on `/go/<slug>?from=<page>` are stored anonymously (no IP, no cookies) in the Workers Analytics Engine dataset
`affiliate_clicks`: blob1 = link, blob2 = page, blob3 = country, blob4 = device. Query it with the Analytics Engine SQL
API, e.g. `SELECT blob1 AS link, blob2 AS page, SUM(_sample_interval) AS clicks FROM affiliate_clicks WHERE timestamp > NOW() - INTERVAL '30' DAY GROUP BY link, page ORDER BY clicks DESC`.
The page is also passed to the affiliate network as a sub-ID, so their reports show which article earned each signup.

## Dependency hygiene

`.npmrc` turns off install scripts and saves exact versions. Use `npm ci`, review update PRs, and avoid installing
package versions published in the last few days.
