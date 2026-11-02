import { gkv, gkvNext } from '../data/rates';
import { calculateGkv, careRatePercent } from './gkv';

/** English number formats used on the page, e.g. 1,318.33 */
export const fmt = (n: number) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtInt = (n: number) => Math.round(n).toLocaleString('en-GB');
export const pct = (n: number) => n.toLocaleString('en-GB', { maximumFractionDigits: 2 });
/** One fixed decimal, for rates like 14.0 and 14.6 */
export const pct1 = (n: number) => n.toFixed(1);
const round2 = (n: number) => Math.round(n * 100) / 100;

/** Monthly profit used for the worked example and the "at a profit of …" comparisons */
export const EXAMPLE_INCOME = 3000;
/** Monthly profit below the minimum base, used for the "low profit, high share" example */
export const LOW_INCOME = 900;

export function buildGkvPage() {
  const year = gkv.year;
  const avg = gkv.avgAdditionalRate;

  // Settings used in the example table: childless, at least careChildlessMinAge, average additional rate.
  const row = (income: number) => {
    const noSickPay = calculateGkv({ monthlyIncome: income, withSickPay: false });
    const withSickPay = calculateGkv({ monthlyIncome: income, withSickPay: true });
    return { income, noSickPay, withSickPay };
  };
  const examples = [
    ...[LOW_INCOME, 1500, EXAMPLE_INCOME, 4500].map((income) => ({ label: `${fmtInt(income)} euros`, ...row(income) })),
    { label: `${fmt(gkv.maxBase)} euros or more`, ...row(gkv.maxBase) },
  ];

  const lowestTypical = calculateGkv({ monthlyIncome: 0, withSickPay: false, children: 1 });
  const lowestChildless = calculateGkv({ monthlyIncome: 0, withSickPay: false });
  const highest = calculateGkv({ monthlyIncome: gkv.maxBase, withSickPay: true });
  const worked = calculateGkv({ monthlyIncome: EXAMPLE_INCOME, withSickPay: false });
  const workedWithChild = calculateGkv({ monthlyIncome: EXAMPLE_INCOME, withSickPay: false, children: 1 });
  const childCareSaving = round2(worked.care - workedWithChild.care);
  const low = calculateGkv({ monthlyIncome: LOW_INCOME, withSickPay: false });
  const childlessCareRate = careRatePercent(0, true);

  const sickPayDiff = round2(
    calculateGkv({ monthlyIncome: EXAMPLE_INCOME, withSickPay: true }).health - worked.health,
  );
  const tenthPointAtExample = round2(
    calculateGkv({ monthlyIncome: EXAMPLE_INCOME, withSickPay: false, additionalRate: avg + 0.1 }).health -
      worked.health,
  );
  const tenthPointAtCap = round2(
    calculateGkv({ monthlyIncome: gkv.maxBase, withSickPay: false, additionalRate: avg + 0.1 }).health -
      calculateGkv({ monthlyIncome: gkv.maxBase, withSickPay: false }).health,
  );

  const careRows = [
    { label: `No children, under ${gkv.careChildlessMinAge}`, rate: careRatePercent(0, false) },
    { label: `No children, ${gkv.careChildlessMinAge} or older`, rate: childlessCareRate },
    { label: '1 child', rate: careRatePercent(1, true) },
    { label: '2 children', rate: careRatePercent(2, true) },
    { label: '3 children', rate: careRatePercent(3, true) },
    { label: '4 children', rate: careRatePercent(4, true) },
    { label: '5 or more children', rate: careRatePercent(5, true) },
  ];

  // 2027 preview (planned values only)
  const capNext = calculateGkv(
    { monthlyIncome: gkvNext.maxBase, withSickPay: false },
    { ...gkv, maxBase: gkvNext.maxBase },
  ).health;
  const capNow = calculateGkv({ monthlyIncome: gkv.maxBase, withSickPay: false }).health;
  const minNext = calculateGkv(
    { monthlyIncome: 0, withSickPay: false },
    { ...gkv, minBase: gkvNext.minBase },
  ).health;
  const minNow = lowestChildless.health;
  const next = {
    year: gkvNext.year,
    maxBase: gkvNext.maxBase,
    minBase: gkvNext.minBase,
    bezugsgroesse: gkvNext.bezugsgroesse,
    avgAdditionalRate: gkvNext.avgAdditionalRate,
    healthAtCapIncrease: round2(capNext - capNow),
    healthAtMinIncrease: round2(minNext - minNow),
  };

  const title = `Freelancer health insurance calculator, Germany (${year})`;
  const description = `Estimate your monthly public health and long-term care insurance cost as a freelancer in Germany. ${year} rates, minimum, maximum and sick pay option.`;

  const faq = [
    {
      q: `How much does public health insurance cost for freelancers in Germany in ${year}?`,
      a: `In ${year}, a self-employed member typically pays between about ${fmt(lowestTypical.total)} euros and ${fmt(highest.total)} euros per month for health and long-term care insurance combined. The exact amount depends on profit, the sick pay option, children, and the additional rate of the insurer. The minimum applies to a profit of up to ${fmt(gkv.minBase)} euros per month, the maximum from ${fmt(gkv.maxBase)} euros. These figures use the average additional rate of ${pct1(avg)} percent.`,
    },
    {
      q: 'Do freelancers pay half of the health insurance like employees?',
      a: 'No. Employees share the contribution with their employer, but self-employed members pay the full contribution themselves because there is no employer share. Artists and publicists insured through the Künstlersozialkasse are an exception.',
    },
    {
      q: 'Is the health insurance contribution based on revenue or profit?',
      a: 'It is based on profit (Gewinn), not revenue. Your insurer first sets a provisional contribution from your last tax assessment and settles it retroactively once the assessment for the contribution year arrives. That can lead to refunds or back payments, so keep a reserve. Other income such as rent or capital gains counts as well.',
    },
    {
      q: 'What is the minimum health insurance contribution for self-employed people?',
      a: `In ${year}, contributions are calculated on at least ${fmt(gkv.minBase)} euros per month, even if your profit is lower. At the average additional rate that is ${fmt(lowestTypical.total)} euros per month without sick pay and with one child, or ${fmt(lowestChildless.total)} euros if you are ${gkv.careChildlessMinAge} or older without children.`,
    },
    {
      q: 'What is the Zusatzbeitrag and where do I find mine?',
      a: `The Zusatzbeitrag is an additional rate that every public insurer sets itself, on top of the general rate of ${pct1(gkv.generalRate)} percent. The official average for ${year} is ${pct1(avg)} percent, but insurers reportedly charge about ${pct1(gkv.reportedAvgChargedRate)} percent on average. Look up the rate of your insurer on its website and enter it in the calculator.`,
    },
    {
      q: 'Should I choose sick pay (Krankengeld) as a freelancer?',
      a: `With the general rate of ${pct1(gkv.generalRate)} percent plus Zusatzbeitrag, you have a statutory claim to sick pay from the 43rd day of illness. The reduced rate of ${pct1(gkv.reducedRate)} percent has no such claim and is cheaper by ${pct1(gkv.generalRate - gkv.reducedRate)} percentage points, which is ${fmt(sickPayDiff)} euros per month at a profit of ${fmtInt(EXAMPLE_INCOME)} euros. Without sick pay, think about how you would cover lost income during a long illness. Some insurers also offer optional tariffs with other start dates.`,
    },
    {
      q: 'Can I deduct my health insurance contributions from my taxes?',
      a: 'Yes, but not as business expenses. Health and long-term care contributions are special expenses (Sonderausgaben) that you enter separately in your tax return. They do not reduce the profit in your Anlage EÜR, so they also do not reduce your contribution base.',
    },
    {
      q: 'Is public or private health insurance cheaper for freelancers?',
      a: 'It depends on your income, age, health, and family situation. Public contributions follow your profit, while private premiums depend on your age, your health at entry, and the cover you choose. Our guide on public vs. private health insurance compares both.',
    },
  ];

  return {
    year,
    title,
    description,
    examples,
    careRows,
    faq,
    next,
    worked,
    childCareSaving,
    childlessCareRate,
    exampleIncome: EXAMPLE_INCOME,
    lowIncome: LOW_INCOME,
    low,
    lowestTypical,
    lowestChildless,
    highest,
    sickPayDiff,
    tenthPointAtExample,
    tenthPointAtCap,
    lastCheckedLabel: new Date(gkv.lastChecked).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }),
  };
}
