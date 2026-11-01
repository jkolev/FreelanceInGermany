/**
 * Public health insurance (GKV) values for self-employed members.
 * Update every January. Last checked: 2026-11-01 (values for 2026).
 * Sources:
 *  - https://www.tk.de/techniker/leistungen-und-mitgliedschaft/versicherung/versichert-als-selbststaendige/beitragssaetze-und-beitraege/hoehe-mindest-und-hoechstbeitraege-fuer-selbststaendige-2007380
 *  - https://www.krankenkassen.de/gesetzliche-krankenkassen/system-gesetzliche-krankenversicherung/sozialversicherung-rechengroessen-beitragsbemessungsgrenze-versicherungspflichtgrenze/rechengroessen-2026/
 */
export const gkv = {
  year: 2026,
  lastChecked: '2026-11-01',
  /** Minimum monthly income contributions are based on (Mindestbemessungsgrundlage) */
  minBase: 1318.33,
  /** Maximum monthly income contributions are based on (Beitragsbemessungsgrenze) */
  maxBase: 5812.5,
  /** General rate, includes sick pay from day 43 (Krankengeld) */
  generalRate: 14.6,
  /** Reduced rate, no sick pay entitlement */
  reducedRate: 14.0,
  /** Average additional contribution (durchschnittlicher Zusatzbeitrag); each insurer sets its own */
  avgAdditionalRate: 2.9,
  /** Long-term care insurance (Pflegeversicherung) */
  careRate: 3.6,
  /** Surcharge for childless members aged 23+ */
  careChildlessSurcharge: 0.6,
  /** Discount per child from the 2nd to the 5th child (children under 25) */
  careDiscountPerChild: 0.25,
};
