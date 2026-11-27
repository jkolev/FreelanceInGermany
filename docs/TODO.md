# To-do: checks and updates

Things to check, update or verify later, by date. Tick items off when done, and update `lastChecked` in every article
whose facts you re-checked. Fact changes follow the usual rule: confirm against a primary source (law text, BGBl.,
Bundestag/Bundesrat documents, official bodies) before publishing.

## After 20 November 2026: Bundesrat session (done 2026-11-25)

- [x] **2027 social insurance figures** approved by the Bundesrat on 20 November 2026 (BR-Drs. 576/26 Beschluss).
      Updated freelancer-numbers, sick-pay, health-insurance/freelancers, public-cost, the calculator page and
      `rates.ts` (`gkvNext`).
  - [ ] Optional: once published in the BGBl., add the citation as a source on freelancer-numbers.
- [ ] **Care reform** (Pflegeneuordnungsgesetz): note the Bundesrat's first-round opinion of 20 November (no decision).

## December 2026: bills that should pass before 1 January

Check DIP (dip.bundestag.de) for each. If a bill passed, check the final text, because committee changes are common.

- [ ] **Einkommensteuerreformgesetz 2027** (BT-Drs. 21/8235): allowance €12,564, 42% from €70,601, 45% from
      €250,000, 47% from €280,000, child allowance €10,056.
  - [ ] `freelancer-numbers.mdx`: tariff table "(bill)", the Callout "The 2027 tariff is not law yet", the FAQ.
  - [ ] `taxes/freelancer-taxes.mdx`: paragraph "For 2027, a draft law would raise the allowance…".
- [ ] **Pflegeneuordnungsgesetz** (BT-Drs. 21/8869; planned Bundestag vote 11 December, Bundesrat 18 December):
      care ceiling €6,075 → €6,375, childless surcharge 0.6 → 0.9 points.
  - [ ] `freelancer-numbers.mdx`: care rows, the euro example, the paragraph about the two ceilings, status row.
  - [ ] `src/data/rates.ts`: `careMaxBase` and `careChildlessSurcharge` for 2027.
  - [ ] Health insurance articles and the calculator page, wherever they mention care for 2027.
- [ ] **Jahressteuergesetz 2026** (BT-Drs. 21/8283): interest on back taxes 0.15% → 0.3% a month from 2027.
  - [ ] `freelancer-numbers.mdx` (last paragraph) and `taxes/tax-prepayments.mdx` (FAQ and section on interest).
- [ ] **Founders' monthly VAT returns** (§ 18 (2) S. 6 UStG): check whether the suspension was extended past 2026.
  - [ ] `taxes/vat-returns.mdx` (Callout), `taxes/freelancer-taxes.mdx`, `freelancer-numbers.mdx` (Callout).
- [ ] **Pension contribution rate 2027**: confirm 18.6% (Beitragssatzverordnung). If it changes, recalculate every
      pension amount in `freelancer-numbers.mdx`.
- [ ] **Insurers' own additional rates** for 2027 (most announce in December): check the example insurers named in
      the health insurance articles.

## January 2027: yearly data switch

- [ ] `src/data/rates.ts`: make 2027 the current `gkv` object (with `lastChecked`), update `gkvSources` to the 2027
      pages (TK Rechengrößen 2027, an insurer's 2027 table for voluntary members), then reset `gkvNext` for 2028.
- [ ] `src/lib/gkv.test.ts`: new reference cases from a 2027 insurer table. Run `npm test`.
- [ ] `src/data/income-tax.ts`: add `incomeTax2027` from the final § 32a EStG text (zone limits and coefficients),
      the solidarity surcharge limit and allowances; switch `incomeTax` to it.
- [ ] `src/lib/income-tax.test.ts`: reference values from the official 2027 basic and splitting tables. Run `npm test`.
- [ ] `freelancer-numbers.mdx`: once everything is final, turn "planned/bill" labels into final values.
- [ ] **ELSTER default delivery** started on 1 January 2027: rewrite "From 2027…" in `taxes/freelancer-taxes.mdx`
      (short answer and Callout) as current fact. Check whether VAT notices are now included.
- [ ] **Founders' VAT rule**, if not extended: the three Callouts now describe the present, not the future.
- [ ] **Sick pay rules from 2027** (`health-insurance/public-cost.mdx`, Callout "From 2027, choosing sick pay late
      means a wait"): rewrite in the present tense.
- [ ] **Deadlines in articles**: the "2026 return due 2 August 2027 / 29 February 2028" sentences stay valid until
      August 2027; plan the switch to the 2027 tax year (31 July 2028 is a Monday; advisor deadline 28 February 2029,
      a Wednesday; check for law changes first).
- [ ] Search all articles for year-specific wording (`grep -rn "2026\|2027" src/content/articles`) and update what has
      gone out of date. Most hits: freelancer-numbers, health-insurance/freelancers, public-cost, invoice,
      freelancer-taxes, tax-prepayments, vat-returns.

## Later in 2027

- [ ] **August 2027**: move the filing-deadline examples to the 2027 tax year (see above).
- [ ] **Autumn 2027**: `freelancer-numbers.mdx` becomes the 2028 page: new title, columns 2027 | 2028, new
      cabinet figures (social insurance in October, health ministry average rate by 1 November).
- [ ] **Late 2027**: e-invoicing. Issuing becomes mandatory for everyone on 1 January 2028; check for new BMF letters
      and update `taxes/invoice.mdx`, `taxes/freelancer-taxes.mdx`, `freelancer-numbers.mdx`.

## Site and launch tasks (no fixed date)

- [ ] **#6 tax registration questionnaire**: published 2026-11-27 without screenshots. Optional: add the ELSTER
      screenshot later (see "Open tasks" in `ARTICLES.md`).
- [ ] **Contact form**: configured 2026-11-19 (site key, both secrets, addresses). Send a test message through the
      live form after the next deploy; if it fails, check the Worker logs in the Cloudflare dashboard for the Brevo error.
- [ ] **Empty hubs** (insurance, banking): add `noindex` or hide them until they have articles.
- [ ] **Search engines**: Google Search Console and Bing Webmaster Tools, submit `sitemap-index.xml`.
- [ ] **Affiliate programs** (Accountable and Norman done). Join the ones mentioned in published comparisons, then send
      the links so they can go into `src/data/links.ts` and get provider cards:
  - [ ] Kontist (business account and tax service) — `banking/business-bank-accounts`, `taxes/accounting-software`
  - [ ] Qonto — `banking/business-bank-accounts`
  - [ ] Finom — `banking/business-bank-accounts`
  - [ ] N26 Business — `banking/business-bank-accounts`
  - [ ] sevdesk — `taxes/accounting-software`
  - [ ] Sorted — `taxes/accounting-software`
  - [ ] Optional, for the "Other options" section: Holvi, FYRST, Revolut Business, Wise Business
  - [ ] Feather (insurance) — `health-insurance/public-vs-private` (`/go/feather` still points to the plain homepage)
- [ ] **Newsletter**: choose a provider and set `newsletterAction` in `src/data/site.ts` (the signup is hidden until
      then).
- [ ] **Author photo**: add `src/assets/author.jpg` (see the comment in `src/data/site.ts`).
- [ ] **Cloudflare WAF**: custom rule blocking `/wp-`, `.php`, `xmlrpc`, `/.env`, `/.git` scans (optional).
- [ ] **README.md "Before launch"**: out of date (robots.txt, author, Impressum are done); tidy it up.
- [ ] **Git**: older commits use the work email address; decide whether to rewrite them. Consider
      `IdentitiesOnly yes` for the `github-personal` host in `~/.ssh/config`.
