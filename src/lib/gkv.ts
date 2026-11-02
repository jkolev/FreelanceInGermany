import { gkv, type GkvRates } from '../data/rates';

export interface GkvInput {
  /** Monthly income subject to contributions: profit plus other income such as rent or capital gains. */
  monthlyIncome: number;
  /** true = general rate (sick pay from day 43), false = reduced rate (no sick pay). */
  withSickPay: boolean;
  /** Individual additional contribution of the insurer, in percent. Defaults to the official average. */
  additionalRate?: number;
  /** Number of children under 25 (0 = none). */
  children?: number;
  /** The childless surcharge applies from age 23. Defaults to true. */
  age23OrOlder?: boolean;
}

export interface GkvResult {
  /** Income the health insurance contribution is based on, after minimum and maximum */
  healthBase: number;
  /** Income the long-term care contribution is based on, after minimum and maximum */
  careBase: number;
  belowMinimum: boolean;
  aboveMaximum: boolean;
  /** Health insurance rate in percent, incl. additional rate */
  healthRate: number;
  /** Long-term care rate in percent */
  careRate: number;
  /** Euros per month */
  health: number;
  care: number;
  total: number;
  /** Euros per year (12 x monthly total) */
  yearly: number;
  /** Total as a percentage of the actual income entered, null if income is 0 */
  shareOfIncome: number | null;
}

// All money maths runs on integers (cents, basis points) to avoid float errors like 244.12 vs 244.13.
const toCents = (euros: number) => Math.round(euros * 100);
const toBp = (percent: number) => Math.round(percent * 100); // 1 basis point = 0.01 %
/** Contribution in cents, rounded half up. */
const part = (baseCents: number, bp: number) => Math.floor((baseCents * bp + 5000) / 10000);
const round2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function careRatePercent(
  children: number,
  age23OrOlder: boolean,
  rates: GkvRates = gkv,
): number {
  if (children <= 0) {
    return rates.careRate + (age23OrOlder ? rates.careChildlessSurcharge : 0);
  }
  const discounted = Math.min(children - 1, rates.careMaxDiscountedChildren);
  return rates.careRate - discounted * rates.careDiscountPerChild;
}

export function calculateGkv(input: GkvInput, rates: GkvRates = gkv): GkvResult {
  const income = Number.isFinite(input.monthlyIncome) ? Math.max(input.monthlyIncome, 0) : 0;
  // A missing, empty (NaN) or negative rate falls back to the official average / zero instead of poisoning every result
  const additional =
    input.additionalRate !== undefined && Number.isFinite(input.additionalRate)
      ? Math.max(input.additionalRate, 0)
      : rates.avgAdditionalRate;
  const children = Math.max(Math.floor(input.children ?? 0), 0);

  const healthBaseCents = toCents(clamp(income, rates.minBase, rates.maxBase));
  const careBaseCents = toCents(clamp(income, rates.minBase, rates.careMaxBase));

  const healthRate = (input.withSickPay ? rates.generalRate : rates.reducedRate) + additional;
  const careRate = careRatePercent(children, input.age23OrOlder ?? true, rates);

  const healthCents = part(healthBaseCents, toBp(healthRate));
  const careCents = part(careBaseCents, toBp(careRate));
  const totalCents = healthCents + careCents;

  return {
    healthBase: healthBaseCents / 100,
    careBase: careBaseCents / 100,
    belowMinimum: income < rates.minBase,
    aboveMaximum: income > rates.maxBase,
    healthRate: round2(healthRate),
    careRate: round2(careRate),
    health: healthCents / 100,
    care: careCents / 100,
    total: totalCents / 100,
    yearly: (totalCents * 12) / 100,
    shareOfIncome: income > 0 ? round2((totalCents / 100 / income) * 100) : null,
  };
}
