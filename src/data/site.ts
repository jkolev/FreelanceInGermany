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
    name: 'Julian',
    // TODO: short bio shown under every article
    bio: 'Short bio: who you are, why you built this site, and how articles are checked.',
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
  icon: 'heart' | 'arrow' | 'doc' | 'shield' | 'card';
}

export const hubs: Hub[] = [
  {
    id: 'health-insurance',
    title: 'Health insurance',
    short: 'Health insurance',
    description: 'Public or private, costs, family cover, sick pay',
    icon: 'heart',
  },
  {
    id: 'start',
    title: 'Getting started',
    short: 'Getting started',
    description: 'Freiberufler or Gewerbe, tax number, visa',
    icon: 'arrow',
  },
  {
    id: 'taxes',
    title: 'Taxes and VAT',
    short: 'Taxes',
    description: 'Invoices, VAT returns, prepayments, deductions',
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
