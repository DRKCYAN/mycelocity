import { useEffect, useRef, useState, type ReactNode } from 'react';

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

export type FedInTone = 'default' | 'positive' | 'negative';

const fedInValueTone: Record<FedInTone, string> = {
  default: 'text-stone-900 dark:text-stone-100',
  positive: 'text-accent-600 dark:text-accent-400',
  negative: 'text-clay-500 dark:text-clay-300',
};

export interface FedInItem {
  label: string;
  /** Already formatted for display. */
  value: string;
  tone?: FedInTone;
}

/**
 * A read-only "fed in from upstream" chip. This is the visual counterpart of the
 * single-source rule: a value lives in exactly one calculator, and every place
 * downstream that consumes it shows it here with a jump link back to its source.
 * Pulses when a fed value changes so the ripple is visible as it arrives.
 */
export function FedIn({
  from,
  href,
  items,
}: {
  /** Human name of the source calculator, e.g. "Grow profile". */
  from: string;
  /** Anchor of the source, e.g. "#grow-profile". */
  href: string;
  items: FedInItem[];
}) {
  const signature = items.map((it) => it.value).join('|');
  const [pulse, setPulse] = useState(false);
  const prev = useRef(signature);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      prev.current = signature;
      return;
    }
    if (prev.current !== signature) {
      prev.current = signature;
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [signature]);

  return (
    <div
      className={`rounded-xl border border-dashed border-accent-300 bg-accent-50 px-4 py-3 text-sm dark:border-accent-700 dark:bg-accent-900/20 ${
        pulse ? 'result-pulse' : ''
      }`}
    >
      <a
        href={href}
        className="inline-flex items-center font-medium text-accent-700 underline-offset-2 hover:underline dark:text-accent-400"
      >
        Fed in from {from} ↑
      </a>
      <ul className="mt-2 space-y-1">
        {items.map((it) => (
          <li key={it.label} className="flex items-center justify-between gap-3">
            <span className="text-stone-600 dark:text-stone-300">{it.label}</span>
            <span className={`tabular-nums font-semibold ${fedInValueTone[it.tone ?? 'default']}`}>
              {it.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
