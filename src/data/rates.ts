/**
 * Public health insurance (GKV) values for self-employed members.
 * Update every January. Last checked: 2026-11-25 (values for 2026; 2027 preview in gkvNext).
 * Sources: `gkvSources` below. Check them when updating; the calculator page lists them too.
 */
export const gkvSources: { label: string; href: string }[] = [
  {
    label: 'Sozialversicherungs-Rechengrößen 2026 (TK)',
    href: 'https://www.tk.de/firmenkunden/service/fachthemen/fachthema-beitraege/sozialversicherungs-rechengroessen-2026-2203234',
  },
  {
    label: 'Rechengrößen 2026 (krankenkassen.de)',
    href: 'https://www.krankenkassen.de/gesetzliche-krankenkassen/system-gesetzliche-krankenversicherung/sozialversicherung-rechengroessen-beitragsbemessungsgrenze-versicherungspflichtgrenze/rechengroessen-2026/',
  },
  {
    label: 'Beitragstabelle 2026 für freiwillig Versicherte (hkk, example of an insurer table)',
    href: 'https://assets.hkk.de/fileadmin/dateien/allgemeines_uebergeordnet/beitragstabellen/aktuell/260108_hkk_beitragstabelle_freiwillig_versichert_2026.pdf',
  },
  {
    label: '§ 240 SGB V - Beitragspflichtige Einnahmen freiwilliger Mitglieder',
    href: 'https://www.gesetze-im-internet.de/sgb_5/__240.html',
  },
];

export interface GkvRates {
  year: number;
  lastChecked: string;
  /** Monthly reference value (Bezugsgröße) the minimum base is derived from */
  bezugsgroesse: number;
  /** Minimum monthly income contributions are based on (Mindestbemessungsgrundlage = Bezugsgröße / 3) */
  minBase: number;
  /** Maximum monthly income for health insurance (Beitragsbemessungsgrenze) */
  maxBase: number;
  /** Maximum monthly income for long-term care insurance. Equal to maxBase in 2026, may differ from 2027. */
  careMaxBase: number;
  /** General rate, includes sick pay from day 43 (Krankengeld) */
  generalRate: number;
  /** Reduced rate, no sick pay entitlement */
  reducedRate: number;
  /** Official average additional contribution (durchschnittlicher Zusatzbeitrag); each insurer sets its own */
  avgAdditionalRate: number;
  /** Average actually charged by insurers, as reported (informational only, not used in calculations) */
  reportedAvgChargedRate: number;
  /** Long-term care insurance (Pflegeversicherung) */
  careRate: number;
  /** Surcharge for childless members aged 23+ */
  careChildlessSurcharge: number;
  /** Age from which the childless surcharge applies */
  careChildlessMinAge: number;
  /** Discount per child from the 2nd to the 5th child (children under 25) */
  careDiscountPerChild: number;
  /** Number of children that earn a discount (2nd to 5th child = 4) */
  careMaxDiscountedChildren: number;
}

export const gkv: GkvRates = {
  year: 2026,
  lastChecked: '2026-11-25',
  bezugsgroesse: 3955,
  minBase: 1318.33,
  maxBase: 5812.5,
  careMaxBase: 5812.5,
  generalRate: 14.6,
  reducedRate: 14.0,
  avgAdditionalRate: 2.9,
  reportedAvgChargedRate: 3.13,
  careRate: 3.6,
  careChildlessSurcharge: 0.6,
  careChildlessMinAge: 23,
  careDiscountPerChild: 0.25,
  careMaxDiscountedChildren: 4,
};

/**
 * Values for 2027. Used only for the "What changes in 2027" section until the January switch.
 * Cap and Bezugsgröße: Sozialversicherungsrechengrößen-Verordnung 2027, approved by the Bundesrat on 20 Nov 2026
 * (BR-Drs. 576/26), in force from 1 Jan 2027.
 * Average additional rate: set by the health ministry on 30 Oct 2026 (2.9%, unchanged).
 * Long-term care changes for 2027 are still being decided, so they are left out on purpose.
 * Replace this block with a real GkvRates object once everything is final, then switch `gkv` to it in January.
 */
export const gkvNext = {
  year: 2027,
  status: 'set' as const,
  bezugsgroesse: 4130,
  minBase: 1376.67,
  maxBase: 6375,
  avgAdditionalRate: 2.9,
};
