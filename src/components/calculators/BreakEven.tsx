import { useInputs } from '@/store/useInputs';
import { setInput } from '@/store/inputs';
import { calculateBreakeven, fmtCurrency, fmtInt, fmtNumber } from '@/lib/derivations';
import NumberRow from '@/components/NumberRow';
import ResultCard from '@/components/ResultCard';
import { InputsCard, ResultsGrid, TierLabel } from '@/components/ui';

export default function BreakEven() {
  const i = useInputs();
  const r = calculateBreakeven(i);
  const profitable = r.marginPerBlock > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <InputsCard title="Inputs">
          <NumberRow
            label="Fixed costs per month"
            value={i.fixedCostsPerMonth}
            unit="$"
            step={100}
            onChange={(v) => setInput('fixedCostsPerMonth', v)}
          />
        </InputsCard>

        <div className="rounded-xl border border-dashed border-accent-300 bg-accent-50 px-4 py-3 text-sm dark:border-accent-700 dark:bg-accent-900/20">
          <span className="text-stone-600 dark:text-stone-300">
            Contribution margin chained in:{' '}
            <strong className="tabular-nums text-stone-900 dark:text-stone-100">
              {fmtCurrency(r.marginPerBlock)}/block
            </strong>
          </span>
          <a
            href="/calculators/profit-per-block"
            className="ml-2 font-medium text-accent-700 underline-offset-2 hover:underline dark:text-accent-400"
          >
            adjust →
          </a>
        </div>
      </div>

      <div>
        <TierLabel>Break-even point (per month)</TierLabel>
        {profitable ? (
          <ResultsGrid>
            <ResultCard
              label="Break-even blocks"
              value={fmtInt(r.breakevenBlocks)}
              sub="blocks / month"
              tone="accent"
              emphasis
            />
            <ResultCard
              label="Break-even pounds"
              value={`${fmtNumber(r.breakevenLbs)} lb`}
              sub="lbs / month"
              tone="accent"
            />
          </ResultsGrid>
        ) : (
          <ResultCard
            label="Break-even"
            value="∞"
            sub="margin per block is ≤ 0 — you cannot break even at this price/cost"
            tone="negative"
            emphasis
          />
        )}
      </div>
    </div>
  );
}
