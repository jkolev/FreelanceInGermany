import { describe, it, expect } from 'vitest';
import { tariff, incomeTaxFor, solidaritySurcharge, churchTax, publicInsuranceDeduction, estimatePrepayments } from './income-tax';

// Reference values from the published 2026 basic table (Grundtabelle) and splitting table (Splittingtabelle),
// which follow § 32a EStG 2026. Taxable income -> income tax in euros.
const basic: [number, number][] = [
  [12348, 0],
  [15000, 435],
  [30000, 4217],
  [40000, 7209],
  [45000, 8835],
  [50000, 10548],
  [60000, 14233],
  [70000, 18264],
  [100000, 30864],
];
const splitting: [number, number][] = [
  [30000, 870],
  [40000, 3140],
  [60000, 8434],
  [70000, 11340],
  [100000, 21096],
];

describe('tariff (§ 32a EStG 2026, basic table)', () => {
  for (const [income, tax] of basic) {
    it(`${income} € taxable income -> ${tax} €`, () => expect(tariff(income)).toBe(tax));
  }
  it('is zero for negative or invalid income', () => {
    expect(tariff(-500)).toBe(0);
    expect(tariff(0)).toBe(0);
  });
  it('uses the top rate above 277,825 €', () => {
    expect(tariff(300000)).toBe(Math.floor(0.45 * 300000 - 19470.38));
  });
});

describe('incomeTaxFor with joint filing (splitting table)', () => {
  for (const [income, tax] of splitting) {
    it(`${income} € joint taxable income -> ${tax} €`, () => expect(incomeTaxFor(income, true)).toBe(tax));
  }
});

describe('solidaritySurcharge (§§ 3, 4 SolZG, 2026)', () => {
  it('is zero up to the threshold', () => {
    expect(solidaritySurcharge(20350, false)).toBe(0);
    expect(solidaritySurcharge(40700, true)).toBe(0);
  });
  it('phases in above the threshold: 100,000 € single -> 1,251.16 €', () => {
    expect(solidaritySurcharge(30864, false)).toBe(1251.16);
  });
  it('is capped at 5.5 % of the tax for high incomes', () => {
    expect(solidaritySurcharge(100000, false)).toBe(5500);
  });
});

describe('churchTax', () => {
  it('applies 8 % or 9 % of the income tax', () => {
    expect(churchTax(10548, 9)).toBe(949.32);
    expect(churchTax(10548, 8)).toBe(843.84);
    expect(churchTax(10548, 0)).toBe(0);
  });
});

describe('publicInsuranceDeduction', () => {
  it('deducts health and care contributions for the year, 4 % less on health with sick pay', () => {
    const without = publicInsuranceDeduction(36000, false);
    const withSickPay = publicInsuranceDeduction(36000, true);
    // 3,000 € a month: health 507 € (16.9 %), care 126 € (4.2 %) -> 633 € x 12
    expect(without).toBe(7596);
    // with sick pay: health 525 € (17.5 %) x 0.96 = 504 €, care 126 € -> 630 € x 12
    expect(withSickPay).toBe(7560);
  });
});

describe('estimatePrepayments', () => {
  it('combines the parts and splits the total into four quarters', () => {
    const r = estimatePrepayments({ yearlyProfit: 50000, joint: false, churchTaxRate: 0, insuranceDeduction: 10000 });
    expect(r.taxableIncome).toBe(50000 - 10000 - 36);
    expect(r.incomeTax).toBe(tariff(39964));
    expect(r.solidaritySurcharge).toBe(0);
    expect(r.total).toBe(r.incomeTax);
    expect(r.quarterly).toBe(Math.round((r.total * 100) / 4) / 100);
  });
  it('doubles the flat allowance for joint filing', () => {
    const r = estimatePrepayments({ yearlyProfit: 60000, joint: true, churchTaxRate: 9, insuranceDeduction: 0 });
    expect(r.taxableIncome).toBe(60000 - 72);
    expect(r.churchTax).toBe(churchTax(r.incomeTax, 9));
  });
  it('returns zeros for no profit and never goes negative', () => {
    const r = estimatePrepayments({ yearlyProfit: 0, joint: false, churchTaxRate: 9, insuranceDeduction: 5000 });
    expect(r.taxableIncome).toBe(0);
    expect(r.total).toBe(0);
    expect(r.shareOfProfit).toBeNull();
  });
});
