import type { ChangeEvent } from 'react';

interface NumberRowProps {
  label: string;
  value: number;
  unit?: string;
  step?: number;
  min?: number;
  onChange: (value: number) => void;
  hint?: string;
}

/**
 * A labeled number input (no slider) for values without a natural range —
 * dollar amounts, large counts. Lives inside a white "inputs" card.
 */
export default function NumberRow({
  label,
  value,
  unit,
  step = 1,
  min = 0,
  onChange,
  hint,
}: NumberRowProps) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value === '' ? 0 : Number(e.target.value);
    if (!Number.isNaN(next)) onChange(next);
  };

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div>
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          {label}
        </label>
        {hint && <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{hint}</p>}
      </div>
      <div className="flex items-center gap-1.5">
        {unit === '$' && <span className="text-sm text-stone-500 dark:text-stone-400">$</span>}
        <input
          type="number"
          value={Number.isFinite(value) ? value : ''}
          min={min}
          step={step}
          onChange={handle}
          className="w-28 rounded-md border border-stone-300 bg-paper px-2 py-1 text-right text-sm tabular-nums text-stone-900 focus:border-chanterelle-500 focus:outline-none focus:ring-1 focus:ring-chanterelle-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        />
        {unit && unit !== '$' && (
          <span className="w-8 text-xs text-stone-500 dark:text-stone-400">{unit}</span>
        )}
      </div>
    </div>
  );
}
