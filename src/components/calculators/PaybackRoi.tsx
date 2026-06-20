import { useInputs } from '@/store/useInputs';
import { calculatePayback, fmtCurrency, fmtNumber, fmtPct } from '@/lib/derivations';
import ResultCard from '@/components/ResultCard';
import { ResultsGrid, TierLabel } from '@/components/ui';

/**
 * Payback & ROI is almost entirely a chained calculator: total capital flows
 * in from Startup Cost and monthly net profit from Profit per Block. Adjust
 * those upstream and this recomputes — the connected hub end-to-end.
 */
export default function PaybackRoi() {
  const i = useInputs();
  const r = calculatePayback(i);
  const profitable = r.monthlyNet > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-xl border border-dashed border-accent-300 bg-accent-50 px-4 py-4 text-sm dark:border-accent-700 dark:bg-accent-900/20">
          <p className="font-medium text-stone-700 dark:text-stone-200">
            Both inputs are chained in from the hub
          </p>
          <ul className="mt-2 space-y-1.5">
            <li className="flex items-center justify-between gap-3">
              <span className="text-stone-600 dark:text-stone-300">Total startup capital</span>
              <span className="tabular-nums font-semibold text-stone-900 dark:text-stone-100">
                {fmtCurrency(r.totalCapital)}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-stone-600 dark:text-stone-300">Monthly net profit</span>
              <span
                className={`tabular-nums font-semibold ${
                  profitable ? 'text-accent-600 dark:text-accent-400' : 'text-clay-500 dark:text-clay-300'
                }`}
              >
                {fmtCurrency(r.monthlyNet)}
              </span>
            </li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="#startup-cost"
              className="font-medium text-accent-700 underline-offset-2 hover:underline dark:text-accent-400"
            >
              Edit capital →
            </a>
            <a
              href="#profit-per-block"
              className="font-medium text-accent-700 underline-offset-2 hover:underline dark:text-accent-400"
            >
              Edit profit →
            </a>
          </div>
        </div>
      </div>

      <div>
        <TierLabel>Return</TierLabel>
        {profitable ? (
          <ResultsGrid>
            <ResultCard
              label="Payback period"
              value={`${fmtNumber(r.paybackMonths, 1)} mo`}
              sub={`≈ ${fmtNumber(r.paybackMonths / 12, 1)} years`}
              tone="accent"
              emphasis
            />
            <ResultCard label="Annual ROI" value={fmtPct(r.roiPct)} tone="positive" />
            <ResultCard
              label="Cash-on-cash"
              value={`${fmtNumber(r.cashOnCash)}×`}
              sub="annual net / capital"
            />
            <ResultCard label="Annual net cash flow" value={fmtCurrency(r.annualNet)} />
          </ResultsGrid>
        ) : (
          <ResultCard
            label="Payback period"
            value="∞"
            sub="not profitable at current inputs — adjust profit upstream"
            tone="negative"
            emphasis
          />
        )}
      </div>
    </div>
  );
}
