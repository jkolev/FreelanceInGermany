import { incomeTax, type IncomeTaxRates } from '../data/income-tax';
import { calculateGkv } from './gkv';

/**
 * Income tax under § 32a (1) EStG for one person, in whole euros.
 * The taxable income is rounded down to a full euro first, and the result is rounded down to a full euro.
 */
export function tariff(taxableIncome: number, r: IncomeTaxRates = incomeTax): number {
  const x = Math.floor(Math.max(taxableIncome, 0));
  let tax: number;
  if (x <= r.zone1End) {
    tax = 0;
  } else if (x <= r.zone2End) {
    const y = (x - r.zone1End) / 10000;
    tax = (r.a2 * y + r.b2) * y;
  } else if (x <= r.zone3End) {
    const z = (x - r.zone2End) / 10000;
    tax = (r.a3 * z + r.b3) * z + r.c3;
  } else if (x <= r.zone4End) {
    tax = 0.42 * x - r.d4;
  } else {
    tax = 0.45 * x - r.d5;
  }
  // The tiny epsilon keeps float noise (e.g. 4216.9999999) from dropping a whole euro
  return Math.floor(tax + 1e-6);
}

/** Income tax for the year; joint filing uses splitting: twice the tax on half the joint income (§ 32a (5) EStG). */
export function incomeTaxFor(taxableIncome: number, joint: boolean, r: IncomeTaxRates = incomeTax): number {
  return joint ? 2 * tariff(taxableIncome / 2, r) : tariff(taxableIncome, r);
}

/**
 * Solidarity surcharge in euros (cents truncated): none up to the threshold, then the lower of
 * 5.5 % of the tax and 11.9 % of the amount above the threshold (§§ 3, 4 SolZG). Integer maths in cents.
 */
export function solidaritySurcharge(tax: number, joint: boolean, r: IncomeTaxRates = incomeTax): number {
  const threshold = r.soliThreshold * (joint ? 2 : 1);
  if (tax <= threshold) return 0;
  const fullCents = Math.floor(tax * r.soliRate * 100 + 1e-6);
  const phaseInCents = Math.floor((tax - threshold) * r.soliPhaseInRate * 100 + 1e-6);
  return Math.min(fullCents, phaseInCents) / 100;
}

/** Church tax: 8 % (Bavaria, Baden-Württemberg) or 9 % (other states) of the income tax, cents truncated. */
export function churchTax(tax: number, ratePercent: 0 | 8 | 9): number {
  return Math.floor(tax * ratePercent + 1e-6) / 100;
}

/**
 * Deductible public health and care insurance for a year (§ 10 (1) no. 3 EStG): basic health cover is deductible,
 * reduced by 4 % when the rate includes sick pay; care insurance in full. Uses the same maths as the health calculator.
 */
export function publicInsuranceDeduction(yearlyProfit: number, withSickPay: boolean, r: IncomeTaxRates = incomeTax): number {
  const gkv = calculateGkv({ monthlyIncome: Math.max(yearlyProfit, 0) / 12, withSickPay });
  const health = withSickPay ? gkv.health * (1 - r.sickPayDeductionCut) : gkv.health;
  return Math.floor((health + gkv.care) * 12);
}

export interface PrepaymentInput {
  /** Expected profit for the year (income minus business expenses) */
  yearlyProfit: number;
  /** Married or in a civil partnership and filing jointly; the partner's own income is not included */
  joint: boolean;
  churchTaxRate: 0 | 8 | 9;
  /** Deductible health and care insurance for the year, in euros */
  insuranceDeduction: number;
}

export interface PrepaymentEstimate {
  taxableIncome: number;
  incomeTax: number;
  solidaritySurcharge: number;
  churchTax: number;
  /** Income tax + solidarity surcharge + church tax for the year */
  total: number;
  /** One of the four quarterly prepayments, if the tax office sets them from this estimate */
  quarterly: number;
  /** Total as a percentage of the profit entered, null if the profit is 0 or less */
  shareOfProfit: number | null;
}

export function estimatePrepayments(input: PrepaymentInput, r: IncomeTaxRates = incomeTax): PrepaymentEstimate {
  const profit = Number.isFinite(input.yearlyProfit) ? Math.max(input.yearlyProfit, 0) : 0;
  const deduction = Number.isFinite(input.insuranceDeduction) ? Math.max(input.insuranceDeduction, 0) : 0;
  const allowance = r.specialExpensesAllowance * (input.joint ? 2 : 1);
  const taxableIncome = Math.max(Math.floor(profit - deduction - allowance), 0);

  const tax = incomeTaxFor(taxableIncome, input.joint, r);
  const soli = solidaritySurcharge(tax, input.joint, r);
  const church = churchTax(tax, input.churchTaxRate);
  const totalCents = Math.round((tax + soli + church) * 100);

  return {
    taxableIncome,
    incomeTax: tax,
    solidaritySurcharge: soli,
    churchTax: church,
    total: totalCents / 100,
    quarterly: Math.round(totalCents / 4) / 100,
    shareOfProfit: profit > 0 ? Math.round((totalCents / 100 / profit) * 1000) / 10 : null,
  };
}
