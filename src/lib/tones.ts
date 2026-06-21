// Layer colour vocabulary, shared by both .astro and .tsx surfaces so the flow
// map, the layer rails and the cross-layer chips all stay in sync.
//
// IMPORTANT: every Tailwind class is written out in full below. Tailwind's JIT
// only generates a utility if it sees the complete literal string in source, so
// these maps must never be built by string concatenation.

import type { Category } from '@/lib/calculators';

export type Tone = 'accent' | 'blewit' | 'chanterelle' | 'clay';

/** Diagram layer → palette tone (Biology green · Operations purple · Economics gold · Finance red). */
export const CATEGORY_TONE: Record<Category, Tone> = {
  Biology: 'accent',
  Operations: 'blewit',
  Economics: 'chanterelle',
  Finance: 'clay',
};

export function categoryTone(category: Category): Tone {
  return CATEGORY_TONE[category];
}

/** Pill / chip styling (links to a calculator), by tone. */
export const toneChip: Record<Tone, string> = {
  accent:
    'border-accent-200 bg-accent-50 text-accent-700 hover:bg-accent-100 dark:border-accent-800 dark:bg-accent-900/30 dark:text-accent-300 dark:hover:bg-accent-900/50',
  blewit:
    'border-blewit-200 bg-blewit-50 text-blewit-700 hover:bg-blewit-100 dark:border-blewit-800 dark:bg-blewit-900/30 dark:text-blewit-300 dark:hover:bg-blewit-900/50',
  chanterelle:
    'border-chanterelle-200 bg-chanterelle-50 text-chanterelle-700 hover:bg-chanterelle-100 dark:border-chanterelle-800 dark:bg-chanterelle-900/30 dark:text-chanterelle-300 dark:hover:bg-chanterelle-900/50',
  clay: 'border-clay-200 bg-clay-50 text-clay-700 hover:bg-clay-100 dark:border-clay-800 dark:bg-clay-900/30 dark:text-clay-300 dark:hover:bg-clay-900/50',
};

/** Left rail / section border, by tone. */
export const toneRail: Record<Tone, string> = {
  accent: 'border-accent-400 dark:border-accent-600',
  blewit: 'border-blewit-400 dark:border-blewit-600',
  chanterelle: 'border-chanterelle-400 dark:border-chanterelle-600',
  clay: 'border-clay-400 dark:border-clay-600',
};

/** Small uppercase layer badge, by tone. */
export const toneBadge: Record<Tone, string> = {
  accent: 'bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-200',
  blewit: 'bg-blewit-100 text-blewit-800 dark:bg-blewit-900/40 dark:text-blewit-200',
  chanterelle: 'bg-chanterelle-100 text-chanterelle-800 dark:bg-chanterelle-900/40 dark:text-chanterelle-200',
  clay: 'bg-clay-100 text-clay-800 dark:bg-clay-900/40 dark:text-clay-200',
};

/** Solid swatch dot (legend), by tone. */
export const toneDot: Record<Tone, string> = {
  accent: 'bg-accent-500',
  blewit: 'bg-blewit-500',
  chanterelle: 'bg-chanterelle-500',
  clay: 'bg-clay-500',
};
