import type { ReactNode } from 'react';

/** White card that holds the input controls — "what you type". */
export function InputsCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-paper p-5 dark:border-stone-700 dark:bg-stone-900">
      {title && (
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
          {title}
        </h2>
      )}
      <div className="divide-y divide-stone-100 dark:divide-stone-800">{children}</div>
    </div>
  );
}

/** Label introducing a tier of results. */
export function TierLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
      {children}
    </h3>
  );
}

/**
 * Downward "feeds" arrow shown between result tiers to make the chaining
 * visible — e.g. "feeds revenue", "feeds the bottom line".
 */
export function FeedsArrow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-2" aria-hidden="true">
      <span className="h-4 w-px bg-accent-300 dark:bg-accent-700" />
      <span className="text-xs font-medium text-accent-600 dark:text-accent-400">↓ {label}</span>
      <span className="h-4 w-px bg-accent-300 dark:bg-accent-700" />
    </div>
  );
}

export function ResultsGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
}
