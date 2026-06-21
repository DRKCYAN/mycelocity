import { useInputs } from '@/store/useInputs';
import { calculateBreakeven, fmtCurrency, fmtInt, fmtNumber } from '@/lib/derivations';
import ResultCard from '@/components/ResultCard';
import { ResultsGrid, TierLabel, FedIn } from '@/components/ui';

/**
 * Break-even is a pure downstream view. Contribution margin and fixed costs flow
 * in from Profit per block; contamination flows in from Contamination loss. A
 * block must clear its COGS *after* contamination losses to break even, so the
 * viability gate uses the effective (contamination-adjusted) margin.
 */
export default function BreakEven() {
  const i = useInputs();
  const r = calculateBreakeven(i);
  const viable = r.effectiveMarginPerBlock > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <FedIn
          from="Profit per block"
          href="#profit-per-block"
          items={[
            {
              label: 'Contribution margin / block',
              value: fmtCurrency(r.marginPerBlock),
              tone: r.marginPerBlock > 0 ? 'positive' : 'negative',
            },
            { label: 'Fixed costs / month', value: fmtCurrency(i.fixedCostsPerMonth) },
          ]}
        />

        <FedIn
          from="Contamination loss"
          href="#contamination-loss"
          items={[
            { label: 'Contamination', value: `${fmtNumber(i.contaminationRate, 0)}%` },
            { label: 'Harvest survival', value: `${fmtNumber(r.survival * 100, 0)}%` },
          ]}
        />
      </div>

      <div>
        <TierLabel>Break-even point (per month)</TierLabel>
        {viable ? (
          <ResultsGrid>
            <ResultCard
              label="Break-even blocks"
              value={fmtInt(r.breakevenBlocks)}
              sub="blocks to start / month"
              tone="accent"
              emphasis
            />
            <ResultCard
              label="Break-even pounds"
              value={`${fmtNumber(r.breakevenLbs)} lb`}
              sub="lbs sold / month"
              tone="accent"
            />
          </ResultsGrid>
        ) : (
          <ResultCard
            label="Break-even"
            value="∞"
            sub="after contamination, a started block doesn't clear its COGS — you cannot break even at this price, cost or contamination rate"
            tone="negative"
            emphasis
          />
        )}
      </div>
    </div>
  );
}
