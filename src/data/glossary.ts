/**
 * German terms used across the site. <Term de="Krankenkasse" /> looks its meaning up here,
 * and /glossary lists every entry, so the glossary grows as you write.
 */
export interface GlossaryEntry {
  /** One line, shown when a reader taps the term */
  en: string;
  /** Optional longer explanation for the glossary page */
  more?: string;
  /** Optional guide that explains the term in depth */
  href?: string;
}

export const glossary: Record<string, GlossaryEntry> = {
  Anmeldung: { en: 'registering your address at the local citizens’ office' },
  Finanzamt: { en: 'tax office' },
  Freiberufler: { en: 'liberal professional, a freelancer who does not register a trade' },
  Gewerbe: { en: 'trade business, which must be registered with the trade office' },
  GKV: { en: 'public health insurance system', href: '/health-insurance/public-vs-private' },
  Krankengeld: { en: 'sick pay from your health insurer, for longer illnesses' },
  Krankenkasse: { en: 'public health insurer', href: '/health-insurance/public-vs-private' },
  PKV: { en: 'private health insurance', href: '/health-insurance/public-vs-private' },
  Steuernummer: { en: 'tax number, issued by your tax office; it goes on your invoices' },
  Vorauszahlung: { en: 'tax prepayment, set by the tax office and due on fixed dates' },
  'Homeoffice-Pauschale': { en: 'flat rate of 6 euros per home-office day, up to 1,260 euros a year; no dedicated room needed' },
  Betriebsausgaben: { en: 'business expenses caused by your self-employed work; they reduce your taxable profit' },
  Fahrtenbuch: { en: 'driver’s logbook you keep yourself to prove business and private trips; it must meet strict formal rules' },
  Verpflegungsmehraufwand: { en: 'flat-rate allowance for extra meal costs on business trips away from home' },
  ELSTER: { en: 'official online tax portal of the German tax authorities' },
  'Anlage EÜR': { en: 'form for your Einnahmenüberschussrechnung, the simple profit calculation: income minus expenses' },
  'Anlage S': { en: 'tax return form used to declare income from freelance work' },
  Abschreibung: { en: 'depreciation, spreading the cost of a larger purchase over its useful life' },
  BMF: { en: 'Federal Ministry of Finance (Bundesfinanzministerium)' },
  Bewirtungsbeleg: { en: 'restaurant receipt plus the extra details the tax office requires for client meals' },
  Entfernungspauschale: { en: 'flat allowance per kilometer of one-way distance between home and your workplace' },
  Kleinunternehmer: { en: 'small-business status under which you do not charge VAT and cannot reclaim input VAT' },
  Sonderausgaben: { en: 'private expenses the tax system favours, such as health insurance and pension contributions; separate from business expenses' },
  Vorsteuer: { en: 'input VAT, the VAT you pay on business purchases and can reclaim through your VAT return' },
};

export const glossaryId = (term: string) =>
  'term-' + term.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
