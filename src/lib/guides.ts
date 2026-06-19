// Query helpers for the `guides` content collection. Mirrors the exported-
// function style of calculators.ts so pages never call `astro:content` directly,
// keeping the single-source-of-truth pattern consistent across content types.
//
// The calculator → guides reverse lookup lives here (guidesForCalculator), so
// the calculator/guide relation is authored in exactly one place: each guide's
// `relatedCalculators` frontmatter.

import { getCollection, type CollectionEntry } from 'astro:content';

export type Guide = CollectionEntry<'guides'>;

/** All guides, sorted by their `order` frontmatter (ascending). */
export async function getGuides(): Promise<Guide[]> {
  const guides = await getCollection('guides');
  return guides.sort((a, b) => a.data.order - b.data.order);
}

/** A single guide by slug (the Markdown filename without extension). */
export async function getGuide(slug: string): Promise<Guide | undefined> {
  const guides = await getCollection('guides');
  return guides.find((g) => g.id === slug);
}

/** Guides that list `calcId` in their `relatedCalculators`, ordered. */
export async function guidesForCalculator(calcId: string): Promise<Guide[]> {
  const guides = await getGuides();
  return guides.filter((g) => g.data.relatedCalculators.includes(calcId));
}
