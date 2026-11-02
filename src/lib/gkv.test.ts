import { describe, it, expect } from 'vitest';
import { calculateGkv, careRatePercent, type GkvInput } from './gkv';
import { buildGkvPage } from './gkv-page';

// Reference values for 2026 with the average additional rate of 2.9 percent.
// Expected results: [health, care, total] in euros per month.
const cases: [string, GkvInput, [number, number, number]][] = [
  ['minimum base, no sick pay, one child', { monthlyIncome: 0, withSickPay: false, children: 1 }, [222.8, 47.46, 270.26]],
  ['minimum base, no sick pay, childless', { monthlyIncome: 0, withSickPay: false }, [222.8, 55.37, 278.17]],
  ['minimum base, sick pay, one child', { monthlyIncome: 0, withSickPay: true, children: 1 }, [230.71, 47.46, 278.17]],
  ['3,000 profit, no sick pay, one child', { monthlyIncome: 3000, withSickPay: false, children: 1 }, [507, 108, 615]],
  ['3,000 profit, no sick pay, childless', { monthlyIncome: 3000, withSickPay: false }, [507, 126, 633]],
  ['3,000 profit, no sick pay, two children', { monthlyIncome: 3000, withSickPay: false, children: 2 }, [507, 100.5, 607.5]],
  ['above the cap, no sick pay, one child', { monthlyIncome: 9000, withSickPay: false, children: 1 }, [982.31, 209.25, 1191.56]],
  ['above the cap, no sick pay, childless (244.13 per hkk table)', { monthlyIncome: 9000, withSickPay: false }, [982.31, 244.13, 1226.44]],
  ['above the cap, sick pay, childless', { monthlyIncome: 9000, withSickPay: true }, [1017.19, 244.13, 1261.32]],
];

describe('calculateGkv (2026 reference cases)', () => {
  for (const [name, input, [health, care, total]] of cases) {
    it(name, () => {
      const r = calculateGkv(input);
      expect([r.health, r.care, r.total]).toEqual([health, care, total]);
    });
  }

  it('flags minimum and maximum', () => {
    expect(calculateGkv({ monthlyIncome: 900, withSickPay: false }).belowMinimum).toBe(true);
    expect(calculateGkv({ monthlyIncome: 9000, withSickPay: false }).aboveMaximum).toBe(true);
    expect(calculateGkv({ monthlyIncome: 3000, withSickPay: false }).belowMinimum).toBe(false);
  });

  it('treats negative and invalid income as zero', () => {
    expect(calculateGkv({ monthlyIncome: -50, withSickPay: false }).total).toBe(278.17);
    expect(calculateGkv({ monthlyIncome: Number.NaN, withSickPay: false }).total).toBe(278.17);
  });

  it('returns the share of the actual income, and null for zero income', () => {
    expect(calculateGkv({ monthlyIncome: 900, withSickPay: false, children: 1 }).shareOfIncome).toBe(30.03);
    expect(calculateGkv({ monthlyIncome: 0, withSickPay: false }).shareOfIncome).toBeNull();
  });

  it('uses a custom additional rate', () => {
    const r = calculateGkv({ monthlyIncome: 3000, withSickPay: false, additionalRate: 2.59 });
    expect(r.health).toBe(497.7); // 3,000 x 16.59 percent
  });

  it('falls back to the average for an invalid additional rate, and clamps negatives to zero', () => {
    const avg = calculateGkv({ monthlyIncome: 3000, withSickPay: false });
    expect(calculateGkv({ monthlyIncome: 3000, withSickPay: false, additionalRate: Number.NaN })).toEqual(avg);
    expect(calculateGkv({ monthlyIncome: 3000, withSickPay: false, additionalRate: -1 }).health).toBe(420); // 3,000 x 14.0 percent
  });
});

describe('careRatePercent', () => {
  it('applies the childless surcharge from age 23 only', () => {
    expect(careRatePercent(0, true)).toBe(4.2);
    expect(careRatePercent(0, false)).toBe(3.6);
  });

  it('discounts each child from the second to the fifth', () => {
    expect(careRatePercent(1, true)).toBe(3.6);
    expect(careRatePercent(2, true)).toBe(3.35);
    expect(careRatePercent(3, true)).toBe(3.1);
    expect(careRatePercent(4, true)).toBe(2.85);
    expect(careRatePercent(5, true)).toBe(2.6);
    expect(careRatePercent(8, true)).toBe(2.6);
  });
});

describe('buildGkvPage (content guard)', () => {
  const page = buildGkvPage();

  it('builds the example table and care table', () => {
    expect(page.examples).toHaveLength(5);
    expect(page.careRows).toHaveLength(7);
  });

  it('never renders NaN or undefined into the FAQ', () => {
    for (const item of page.faq) {
      expect(item.q).not.toMatch(/NaN|undefined/);
      expect(item.a).not.toMatch(/NaN|undefined/);
    }
  });

  it('keeps title and description within search result limits', () => {
    expect(page.title.length).not.toBeGreaterThan(60);
    expect(page.description.length).not.toBeGreaterThan(160);
  });
});