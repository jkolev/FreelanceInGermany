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
  accountable: {
    merchant: 'Accountable',
    // Personal referral link (referral programme, not an affiliate network): no sub-ID parameter,
    // so per-article stats come from the Analytics Engine click data only.
    url: 'https://www.accountable.de/en/r/?ref=mzi1zmu',
  },
  norman: {
    merchant: 'Norman',
    // Affiliate link; tracking is in utm_campaign, so no separate sub-ID parameter
    url: 'https://norman.finance/?utm_source=affiliate&utm_campaign=e12ae9b7',
  },
  feather: {
    merchant: 'Feather',
    // TODO: once your application is approved, replace with your tracking link
    // and set subIdParam to the parameter their platform uses for sub-IDs
    url: 'https://feather-insurance.com/',
  },
};
