// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with your real domain before the first deploy
  site: 'https://www.example.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [mdx(), sitemap()],
  // Inter is bundled from npm (@fontsource-variable/inter) and served from your own domain (GDPR-friendly)
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
          },
          {
            src: ['@fontsource-variable/inter/files/inter-latin-wght-italic.woff2'],
            weight: '100 900',
            style: 'italic',
          },
        ],
      },
    },
  ],
  // No code blocks on this site; Shiki's inline styles would conflict with the CSP
  markdown: { syntaxHighlight: false },
  // Content Security Policy: Astro hashes its own scripts and styles at build time
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        'frame-src https://challenges.cloudflare.com',
        "form-action 'self' https:",
        "base-uri 'self'",
        "object-src 'none'",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://challenges.cloudflare.com'],
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
