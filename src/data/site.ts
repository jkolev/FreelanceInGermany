import type { ImageMetadata } from 'astro';

/**
 * Your photo builds trust. Add it as src/assets/author.jpg, then replace `undefined` below with:
 *   (await import('../assets/author.jpg')).default
 */
const authorPhoto: ImageMetadata | undefined = undefined;

export const site = {
  name: 'Freelance in Germany',
  tagline: 'Freelancing in Germany, explained in plain English.',
  description:
    'Health insurance, taxes, registration and banking for freelancers in Germany: clear answers, honest comparisons and calculators.',
  author: {
    name: 'Julian Radkov',
    // Short bio shown under every article
    bio: 'Software engineer in Berlin with more than 20 years of experience, who has taken on freelance projects alongside employment. Every article is checked against the law and official sources.',
    url: '/about',
    photo: authorPhoto,
  },
  // TODO: newsletter provider form endpoint (e.g. Brevo or Buttondown)
  newsletterAction: '',
  // Cloudflare Turnstile site key for the contact form.
  // TODO: replace this public TEST key (always passes) with your real site key.
  turnstileSiteKey: '1x00000000000000000000AA',
};

export type HubId = 'health-insurance' | 'start' | 'taxes' | 'insurance' | 'banking';

export interface Hub {
  id: HubId;
  title: string;
  short: string;
  description: string;
  /** Two or three sentences shown under the hub heading: what matters here and what the guides cover */
  intro?: string;
  icon: 'heart' | 'arrow' | 'doc' | 'shield' | 'card';
}

export const hubs: Hub[] = [
  {
    id: 'health-insurance',
    title: 'Health insurance',
    short: 'Health insurance',
    description: 'Public or private, costs, family cover, sick pay',
    intro:
      'Health insurance is compulsory in Germany, and as a freelancer you choose it and pay for it yourself. The big decision is public or private: it shapes your costs for decades and is hard to reverse. These guides explain who can join which system, what it costs, and how to cover sick pay.',
    icon: 'heart',
  },
  {
    id: 'start',
    title: 'Getting started',
    short: 'Getting started',
    description: 'Freiberufler or Gewerbe, tax number, visa',
    intro:
      'Starting as a freelancer in Germany means a few registrations in the right order: your address, the tax office and, for some work, the trade office. Whether you count as a Freiberufler or a trade business decides which. These guides take you from the first form to your tax number.',
    icon: 'arrow',
  },
  {
    id: 'taxes',
    title: 'Taxes and VAT',
    short: 'Taxes',
    description: 'Invoices, VAT returns, prepayments, deductions',
    intro:
      'As a freelancer you handle your own taxes: income tax on your profit, VAT on your invoices unless you use the small business exemption, and trade tax if you run a trade. These guides explain what to charge, what to file and when, and what you can deduct.',
    icon: 'doc',
  },
  {
    id: 'insurance',
    title: 'Insurance and pension',
    short: 'Insurance',
    description: 'Liability, disability, retirement options',
    icon: 'shield',
  },
  {
    id: 'banking',
    title: 'Money and banking',
    short: 'Banking',
    description: 'Business accounts, international payments',
    icon: 'card',
  },
];

export const hubIds = hubs.map((h) => h.id) as [HubId, ...HubId[]];

export function getHub(id: string): Hub | undefined {
  return hubs.find((h) => h.id === id);
}
