import type { ChangeEvent } from 'react';

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Short unit shown after the number input, e.g. "g", "%", "$". */
  unit?: string;
  onChange: (value: number) => void;
  /** Optional helper line under the label. */
  hint?: string;
}

/**
 * A labeled slider paired with a number input. Both edit the same value and
 * update live (no submit button). Lives inside a white "inputs" card.
 */
export default function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  hint,
}: SliderRowProps) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value === '' ? 0 : Number(e.target.value);
    if (!Number.isNaN(next)) onChange(next);
  };

  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={Number.isFinite(value) ? value : ''}
            min={min}
            max={max}
            step={step}
            onChange={handle}
            className="w-24 rounded-md border border-stone-300 bg-paper px-2 py-1 text-right text-sm tabular-nums text-stone-900 focus:border-chanterelle-500 focus:outline-none focus:ring-1 focus:ring-chanterelle-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          />
          {unit && (
            <span className="w-8 text-xs text-stone-500 dark:text-stone-400">{unit}</span>
          )}
        </div>
      </div>
      {hint && <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{hint}</p>}
      <input
        type="range"
        value={Number.isFinite(value) ? Math.min(Math.max(value, min), max) : min}
        min={min}
        max={max}
        step={step}
        onChange={handle}
        className="mt-2 w-full"
        aria-label={label}
      />
    </div>
  );
}
