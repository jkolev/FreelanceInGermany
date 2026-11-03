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
  'gesetzliche Krankenversicherung': { en: 'public (statutory) health insurance', href: '/health-insurance/public-vs-private' },
  'private Krankenversicherung': { en: 'private health insurance', href: '/health-insurance/public-vs-private' },
  Ausländerbehörde: { en: 'foreigners authority, the local office that issues residence permits' },
  hauptberuflich: { en: 'as your main occupation, rather than on the side' },
  Versicherungspflichtgrenze: { en: 'income limit above which employees may leave public health insurance' },
  Familienversicherung: { en: 'free public health cover for a member’s spouse and children with low own income' },
  Künstlersozialkasse: { en: 'artists’ social insurance fund; pays about half of the contributions for artists and publicists' },
  Zusatzbeitrag: { en: 'additional contribution rate each public insurer sets on top of the general rate', href: '/calculators/health-insurance-cost' },
  Pflegeversicherung: { en: 'long-term care insurance, compulsory alongside health insurance' },
  Mindestbemessungsgrundlage: { en: 'minimum monthly income that public contributions are calculated on', href: '/calculators/health-insurance-cost' },
  Beitragsbemessungsgrenze: { en: 'income ceiling above which no further contributions are charged', href: '/calculators/health-insurance-cost' },
  Einkommensteuerbescheid: { en: 'income tax assessment, the tax office’s final notice for a tax year' },
  Krankentagegeld: { en: 'daily sickness allowance, a private policy that replaces lost income during illness' },
  Gesundheitsprüfung: { en: 'health questions a private insurer asks before accepting you' },
  Basistarif: { en: 'private basic tariff with standard benefits that insurers must offer to certain people' },
  'freiwillig versichert': { en: 'voluntarily insured, the status of self-employed members of public health insurance' },
  Bezugsgröße: { en: 'reference value for social insurance, set each year; many limits are derived from it' },
  Wahlerklärung: { en: 'written declaration to your public insurer, for example to include sick pay' },
  Versicherungsvertreter: { en: 'insurance agent, who sells on behalf of one or more insurers (unlike a broker, who acts for you)' },
  Wahltarif:{ en:'optional extra tariff from a public insurer, for example for earlier sick pay' },
  Versicherungsberater:{ en: 'independent insurance adviser paid by fee, not by commission' },
};

export const glossaryId = (term: string) =>
  'term-' + term.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
