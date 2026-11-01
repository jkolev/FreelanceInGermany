import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

/** Published articles, newest check first. Drafts show only in `astro dev`. */
export async function getArticles(filter?: (a: Article) => boolean): Promise<Article[]> {
  const all = await getCollection('articles', (a) => import.meta.env.DEV || !a.data.draft);
  return all
    .filter((a) => (filter ? filter(a) : true))
    .sort((a, b) => b.data.lastChecked.valueOf() - a.data.lastChecked.valueOf());
}

export const articleUrl = (a: Article) => `/${a.id}`;

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/** The page's public path without ".html" or a trailing slash (static builds report "/about.html") */
export const cleanPath = (pathname: string) => pathname.replace(/\.html$/, '').replace(/(.)\/$/, '$1').replace(/^\/index$/, '/');
