import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { hubIds } from './data/site';

const articles = defineCollection({
  // Files live in src/content/articles/<hub>/<slug>.mdx → URL /<hub>/<slug>
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    hub: z.enum(hubIds),
    type: z.enum(['pillar', 'cluster', 'comparison', 'tool']).default('cluster'),
    lastChecked: z.coerce.date(),
    published: z.coerce.date(),
    readingMinutes: z.number().int().positive().optional(),
    hasAffiliateLinks: z.boolean().default(false),
    sources: z
      .array(z.object({ title: z.string(), url: z.url() }))
      .min(1, 'Every article lists at least one source.'),
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
