import { useEffect, useRef, useState, type ReactNode } from 'react';

export type ResultTone = 'default' | 'positive' | 'negative' | 'accent';

interface ResultCardProps {
  label: string;
  /** Primary value, already formatted for display. */
  value: string;
  /** Secondary value or unit shown beneath, e.g. "in pounds". */
  sub?: string;
  tone?: ResultTone;
  /** Larger treatment for headline numbers (e.g. monthly net). */
  emphasis?: boolean;
  children?: ReactNode;
}

const toneClasses: Record<ResultTone, string> = {
  default: 'text-stone-900 dark:text-stone-100',
  positive: 'text-accent-600 dark:text-accent-400',
  negative: 'text-clay-500 dark:text-clay-300',
  accent: 'text-accent-700 dark:text-accent-300',
};

/**
 * A muted/gray "result" card — visually distinct from the white input cards so
 * users learn what they type vs. what the app derives. Briefly pulses when its
 * value recomputes.
 */
export default function ResultCard({
  label,
  value,
  sub,
  tone = 'default',
  emphasis = false,
  children,
}: ResultCardProps) {
  const [pulse, setPulse] = useState(false);
  const prev = useRef(value);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      prev.current = value;
      return;
    }
    if (prev.current !== value) {
      prev.current = value;
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div
      className={`rounded-xl border border-stone-200 bg-stone-100 p-4 dark:border-stone-700 dark:bg-stone-800/60 ${
        pulse ? 'result-pulse' : ''
      }`}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {label}
      </div>
      <div
        className={`mt-1 font-semibold tabular-nums ${emphasis ? 'text-3xl' : 'text-2xl'} ${toneClasses[tone]}`}
      >
        {value}
      </div>
      {sub && <div className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{sub}</div>}
      {children}
    </div>
  );
}
