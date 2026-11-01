export interface Calculator {
  title: string;
  description: string;
  topic: string;
  /** Leave empty until the calculator page exists */
  href?: string;
}

export const calculators: Calculator[] = [
  {
    title: 'Public health insurance: what will you pay?',
    description: 'Your monthly contribution as a self-employed member, based on this year’s rates.',
    topic: 'Health insurance',
    href: '/calculators/health-insurance-cost',
  },
  {
    title: 'What’s left after tax and insurance?',
    description: 'From your yearly profit to your real monthly income, step by step.',
    topic: 'Taxes',
  },
  {
    title: 'Freiberufler or Gewerbe?',
    description: 'Answer a few questions to see which registration likely applies to you.',
    topic: 'Getting started',
  },
];
