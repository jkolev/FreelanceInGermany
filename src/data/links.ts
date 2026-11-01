/**
 * Affiliate links, used by the /go/<slug> redirect in worker/index.ts.
 * Articles link to /go/<slug>?from=<article-id>; the worker logs the click
 * and adds the article as a sub-ID so network reports show which page earned.
 *
 * TODO: replace the placeholder URLs with your real tracking links once approved.
 */
export interface AffiliateLink {
  /** Real destination (your tracking link from the network) */
  url: string;
  /** Query parameter the network uses for sub-IDs, if any */
  subIdParam?: string;
  /** Shown in your own notes only */
  merchant: string;
}

export const affiliateLinks: Record<string, AffiliateLink> = {
  'provider-a': {
    merchant: '[Provider A]',
    url: 'https://example.com/?ref=YOUR_ID',
    subIdParam: 'subid',
  },
  'provider-b': {
    merchant: '[Provider B]',
    url: 'https://example.org/?ref=YOUR_ID',
    subIdParam: 'subid',
  },
};
