# First 30 articles

Publish in this order. Numbers 1–10 are the launch set. Each article lives at
`src/content/articles/<hub>/<slug>.mdx` and is served at `/<hub>/<slug>`.

Status: `to write` · `draft` · `review` · `live`

| # | Title | Hub | Slug | Type | Earns from | Status |
|---|---|---|---|---|---|---|
| 1 | Health insurance for freelancers in Germany: the complete guide | health-insurance | `freelancers` | pillar | Insurance affiliates | live |
| 2 | Public vs. private health insurance for freelancers | health-insurance | `public-vs-private` | comparison | Insurance affiliates, broker referrals | live |
| 3 | How much public health insurance costs freelancers (with calculator) | health-insurance | `public-cost` | tool | Insurance affiliates | live |
| 4 | How to become a freelancer in Germany: step by step | start | `become-a-freelancer` | pillar | Banking, accounting software | live |
| 5 | Freiberufler vs. Gewerbe: which one are you? | start | `freiberufler-vs-gewerbe` | cluster | Accounting software | live |
| 6 | Getting your tax number: the tax registration questionnaire in English | start | `tax-registration-questionnaire` | cluster | Accounting software, tax advisor leads | review |
| 7 | Best business bank accounts for freelancers | banking | `business-bank-accounts` | comparison | Bank affiliates | to write |
| 8 | Best accounting software for freelancers in English | taxes | `accounting-software` | comparison | Accounting software | to write |
| 9 | Taxes for freelancers in Germany: the complete guide | taxes | `freelancer-taxes` | pillar | Tax software, tax advisor leads | to write |
| 10 | Freelancer numbers: every threshold and rate for the coming year | — | page `/freelancer-numbers` | yearly page | Links into all hubs | to write |
| 11 | Private health insurance: costs in old age and switching back | health-insurance | `private-costs-old-age` | cluster | Broker referrals | to write |
| 12 | Expat health insurance: when it is accepted and when it is not | health-insurance | `expat-health-insurance` | cluster | Insurance affiliates | to write |
| 13 | Health insurance for freelancers with a family | health-insurance | `family` | cluster | Insurance affiliates | to write |
| 14 | Sick pay for freelancers: how to get covered | health-insurance | `sick-pay` | cluster | Insurance affiliates | to write |
| 15 | Best health insurance options for English speakers | health-insurance | `best-for-english-speakers` | comparison | Insurance affiliates | to write |
| 16 | The freelance visa: residence permits for self-employment | start | `freelance-visa` | cluster | Relocation and lawyer leads | to write |
| 17 | The small business VAT exemption (Kleinunternehmerregelung) | taxes | `kleinunternehmer` | cluster | Accounting software | live |
| 18 | How to write a German invoice (with free template) | taxes | `invoice` | cluster | Accounting software, email signups | live |
| 19 | VAT returns explained (Umsatzsteuervoranmeldung) | taxes | `vat-returns` | cluster | Accounting software | review |
| 20 | Tax prepayments: why they arrive and how to lower them | taxes | `tax-prepayments` | tool | Tax software | to write |
| 21 | Deductible expenses for freelancers | taxes | `deductible-expenses-for-freelancers` | cluster | Accounting software | live |
| 22 | Do you need a tax advisor? Costs and finding an English-speaking one | taxes | `tax-advisor` | cluster | Tax advisor leads | live |
| 23 | Best tax software in English for freelancers | taxes | `tax-software` | comparison | Tax software | to write |
| 24 | Which insurance does a freelancer in Germany need? | insurance | `which-insurance` | pillar | Insurance affiliates | to write |
| 25 | Liability insurance for freelancers: personal and professional | insurance | `liability` | comparison | Insurance affiliates | to write |
| 26 | Disability insurance for freelancers (Berufsunfähigkeit) | insurance | `disability` | cluster | Broker referrals | to write |
| 27 | Pension options for freelancers: public, Rürup and private | insurance | `pension` | cluster | Pension product affiliates | to write |
| 28 | Mandatory pension insurance for some self-employed (teachers, coaches) | insurance | `mandatory-pension` | cluster | Insurance affiliates | to write |
| 29 | Getting paid by international clients: the cheapest options | banking | `international-payments` | comparison | Money transfer affiliates | to write |
| 30 | Separating business and personal money as a freelancer | banking | `business-vs-personal` | cluster | Bank affiliates | to write |

## Every article needs

- A `<ShortAnswer>` at the top and at least one source (the build fails without them; type `tool` is exempt from the
  short answer)
- No `[VERIFY: …]` notes left before you set `draft: false`; check each against a primary source and add it to `sources`
- `lastChecked` date in the frontmatter, updated whenever you re-check the facts
- German terms added to `src/data/glossary.ts` and used with `<Term de="…" />`
- A "Best for" row in every comparison table
- `hasAffiliateLinks: true` when the page links through `/go/…`

## Open tasks

### Screenshots for #6 (tax registration questionnaire)

Take them yourself in Mein ELSTER rather than reusing images from other sites (copyright, outdated layouts). You can
open the form and capture the screens without submitting anything. Black out personal data (name, tax ID, address)
before saving. Save under `src/assets/elster/` and add them with `<Figure>` or `<AnnotatedLetter>` (English labels for
the German fields).

- [ ] **Required:** Mein ELSTER → Formulare & Leistungen → Alle Formulare, with "Fragebogen zur steuerlichen Erfassung"
      visible. Replaces the `{/* IMAGE */}` placeholder in the "How do you submit it?" section.
      Save as `src/assets/elster/alle-formulare.png`.
- [ ] Optional: the form for sole proprietors (Einzelunternehmen), sections "Art der Tätigkeit" / "Beginn der
      Tätigkeit", for the "Your activity and start date" section.
- [ ] Optional: the profit estimate (expected Gewinn), for the "Expected profit and turnover" section.
- [ ] Optional: the VAT questions (Kleinunternehmerregelung, Soll-/Istversteuerung), for the "VAT questions" section.

Reference search terms (for seeing what to capture, not for reusing images): `Mein ELSTER "Alle Formulare" Fragebogen
zur steuerlichen Erfassung`, `Fragebogen zur steuerlichen Erfassung Einzelunternehmen ELSTER Formularauswahl`,
`Fragebogen zur steuerlichen Erfassung ELSTER Ausfüllhilfe Screenshots`. Add `2025` or `2026` to filter out old layouts.
