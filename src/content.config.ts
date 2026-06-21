// Content collections. The `guides` collection is the first file-based content
// in the project — calculators/species are hand-typed registries in src/lib.
// Guides are plain Markdown (no MDX): bodies are static prose, the interactive
// calculators stay in their own React islands.
//
// The calculator ↔ guide relation is declared ONLY here, in each guide's
// `relatedCalculators` frontmatter (calculator `id`s from src/lib/calculators.ts).
// The reverse lookup (calculator → guides) is computed at build time in
// src/lib/guides.ts, so the relation has exactly one source of truth — mirroring
// the philosophy of the `connectedTo` array in the calculator registry.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    /** Human-readable title; also the page <h1> and sidebar/card label. */
    title: z.string(),
    /** Short summary for cards and the SEO meta description. */
    description: z.string(),
    /** SEO <title>. */
    seoTitle: z.string(),
    /** ISO date (YYYY-MM-DD) the guide was first published. Feeds Article JSON-LD. */
    datePublished: z.string(),
    /** ISO date of the last substantive edit. Defaults to datePublished. */
    dateModified: z.string().optional(),
    /** Controls ordering on /guides and in the sidebar (ascending). */
    order: z.number(),
    /** Calculator `id`s this guide supports (from src/lib/calculators.ts). */
    relatedCalculators: z.array(z.string()).default([]),
    /** Optional primary category tag, matching the 4 calculator categories. */
    category: z.enum(['Biology', 'Operations', 'Economics', 'Finance']).optional(),
  }),
});

export const collections = { guides };
