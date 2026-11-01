/**
 * Cloudflare Worker in front of the static site.
 * Only /go/* and /api/* reach this code (see run_worker_first in wrangler.jsonc);
 * every other request is served straight from the built files in dist/.
 */
import { affiliateLinks } from '../src/data/links';

interface Env {
  ASSETS: Fetcher;
  /** Analytics Engine dataset for affiliate clicks (optional binding) */
  CLICKS?: AnalyticsEngineDataset;
  /** Rate limiter for the contact form (optional binding) */
  CONTACT_LIMITER?: RateLimit;
  /** Secrets, set with `npx wrangler secret put <NAME>` */
  TURNSTILE_SECRET?: string;
  BREVO_API_KEY?: string;
  /** Plain vars from wrangler.jsonc */
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  SITE_NAME?: string;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/go/')) return handleRedirect(url, request, env, ctx);
    if (url.pathname === '/api/contact') return handleContact(request, env);
    if (url.pathname.startsWith('/api/')) return json({ error: 'Not found.' }, 404);

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

/* ------------------------------------------------------------------ */
/* Affiliate redirects: /go/<slug>?from=<page>                         */
/* ------------------------------------------------------------------ */

function handleRedirect(url: URL, request: Request, env: Env, ctx: ExecutionContext): Response {
  const slug = url.pathname.slice('/go/'.length).replace(/\/$/, '');
  const link = affiliateLinks[slug];
  if (!link) return Response.redirect(new URL('/', url).toString(), 302);

  const from = (url.searchParams.get('from') ?? 'unknown').replace(/[^a-z0-9_-]/gi, '').slice(0, 100) || 'unknown';
  const target = new URL(link.url);
  if (link.subIdParam) target.searchParams.set(link.subIdParam, from);

  // Anonymous click record: no IP address, no cookies
  const country = (request.cf?.country as string | undefined) ?? 'XX';
  const ua = request.headers.get('user-agent') ?? '';
  const device = /mobile/i.test(ua) ? 'mobile' : 'desktop';
  const isBot = /bot|crawl|spider|slurp|preview/i.test(ua);
  if (env.CLICKS && !isBot) {
    ctx.waitUntil(
      Promise.resolve(
        env.CLICKS.writeDataPoint({ indexes: [slug], blobs: [slug, from, country, device], doubles: [1] }),
      ),
    );
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: target.toString(),
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Referrer-Policy': 'no-referrer-when-downgrade',
    },
  });
}

/* ------------------------------------------------------------------ */
/* Contact form: POST /api/contact                                     */
/* ------------------------------------------------------------------ */

async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  // Only accept posts from this site
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Forbidden.' }, 403);

  const ip = request.headers.get('cf-connecting-ip') ?? '';
  if (env.CONTACT_LIMITER) {
    const { success } = await env.CONTACT_LIMITER.limit({ key: ip || 'unknown' });
    if (!success) return json({ error: 'Too many messages. Please try again in a minute.' }, 429);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Invalid form data.' }, 400);
  }

  const field = (name: string) => String(form.get(name) ?? '').trim();
  const name = field('name');
  const email = field('email');
  const message = field('message');

  // Honeypot: pretend success so bots learn nothing
  if (field('website')) return json({ ok: true });

  if (!name || name.length > 100) return json({ error: 'Please enter your name.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)
    return json({ error: 'Please enter a valid email address.' }, 400);
  if (message.length < 10 || message.length > 5000)
    return json({ error: 'Please write a message between 10 and 5,000 characters.' }, 400);

  if (!env.TURNSTILE_SECRET || !env.BREVO_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    console.error('Contact form is not configured: missing secrets or vars.');
    return json({ error: 'The contact form is not available right now.' }, 503);
  }

  const human = await verifyTurnstile(field('cf-turnstile-response'), ip, env.TURNSTILE_SECRET);
  if (!human) return json({ error: 'Spam check failed. Please try again.' }, 400);

  const sent = await sendEmail(env, { name, email, message });
  if (!sent) return json({ error: 'Your message could not be sent.' }, 502);

  return json({ ok: true });
}

async function verifyTurnstile(token: string, ip: string, secret: string): Promise<boolean> {
  if (!token) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

/** Sends the message to your inbox through Brevo's transactional email API (EU-based). */
async function sendEmail(env: Env, msg: { name: string; email: string; message: string }): Promise<boolean> {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY!, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: env.CONTACT_FROM, name: env.SITE_NAME ?? 'Website' },
      to: [{ email: env.CONTACT_TO }],
      replyTo: { email: msg.email, name: msg.name },
      subject: `Contact form: ${msg.name}`.slice(0, 150),
      textContent: `From: ${msg.name} <${msg.email}>\n\n${msg.message}`,
    }),
  });
  if (!res.ok) console.error('Brevo error', res.status, await res.text());
  return res.ok;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
