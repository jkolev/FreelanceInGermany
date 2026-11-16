/**
 * Income tax values for the prepayment estimator. Update every January, together with rates.ts.
 * Last checked: 2026-11-16 (values for 2026).
 *
 * Sources (check these when updating):
 *  - Tariff: § 32a (1) EStG, https://www.gesetze-im-internet.de/estg/__32a.html
 *  - Solidarity surcharge: §§ 3, 4 SolZG 1995, https://www.gesetze-im-internet.de/solzg_1995/
 *  - Flat allowance for other special expenses: § 10c EStG, https://www.gesetze-im-internet.de/estg/__10c.html
 *  - Test values: published 2026 basic and splitting tables (see src/lib/income-tax.test.ts)
 */
export interface IncomeTaxRates {
  year: number;
  lastChecked: string;
  /** Basic tax-free allowance (Grundfreibetrag): zone 1 ends here */
  zone1End: number;
  /** Zone 2: (a2 · y + b2) · y, with y = (zvE − zone1End) / 10,000 */
  zone2End: number;
  a2: number;
  b2: number;
  /** Zone 3: (a3 · z + b3) · z + c3, with z = (zvE − zone2End) / 10,000 */
  zone3End: number;
  a3: number;
  b3: number;
  c3: number;
  /** Zone 4: 0.42 · x − d4 */
  zone4End: number;
  d4: number;
  /** Zone 5: 0.45 · x − d5 */
  d5: number;
  /** Solidarity surcharge: no surcharge up to this income tax (single); doubled for joint filing */
  soliThreshold: number;
  /** Full rate (5.5 %) and the phase-in rate above the threshold (11.9 %) */
  soliRate: number;
  soliPhaseInRate: number;
  /** Flat allowance for other special expenses (Sonderausgaben-Pauschbetrag), single; doubled for joint filing */
  specialExpensesAllowance: number;
  /** Share of public health insurance contributions not deductible when they include sick pay (§ 10 (1) no. 3 EStG) */
  sickPayDeductionCut: number;
}

export const incomeTax2026: IncomeTaxRates = {
  year: 2026,
  lastChecked: '2026-11-16',
  zone1End: 12348,
  zone2End: 17799,
  a2: 914.51,
  b2: 1400,
  zone3End: 69878,
  a3: 173.1,
  b3: 2397,
  c3: 1034.87,
  zone4End: 277825,
  d4: 11135.63,
  d5: 19470.38,
  soliThreshold: 20350,
  soliRate: 0.055,
  soliPhaseInRate: 0.119,
  specialExpensesAllowance: 36,
  sickPayDeductionCut: 0.04,
};

/** The rates the site currently uses */
export const incomeTax = incomeTax2026;
