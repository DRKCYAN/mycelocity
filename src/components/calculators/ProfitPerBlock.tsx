import { useInputs } from '@/store/useInputs';
import { setInput } from '@/store/inputs';
import { calculateProfit, fmtCurrency, fmtNumber, fmtInt } from '@/lib/derivations';
import NumberRow from '@/components/NumberRow';
import ResultCard from '@/components/ResultCard';
import { InputsCard, ResultsGrid, TierLabel, FeedsArrow, FedIn } from '@/components/ui';

/**
 * THE showcase calculator. It owns only the monthly volume + overhead; every
 * upstream value (BE, price, yield, COGS) flows in from its single source and
 * is shown as a "fed in ↑" chip. Change anything upstream and the three tiers
 * recompute, pulsing as the ripple arrives.
 */
export default function ProfitPerBlock() {
  const i = useInputs();
  const r = calculateProfit(i);
  const netTone = r.monthlyNet < 0 ? 'negative' : 'positive';

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Inputs this calculator owns + fed-in upstream values ───────── */}
      <div className="space-y-4">
        <InputsCard title="Monthly volume & overhead">
          <NumberRow
            label="Blocks per month"
            value={i.blocksPerMonth}
            step={10}
            onChange={(v) => setInput('blocksPerMonth', v)}
          />
          <NumberRow
            label="Fixed costs per month"
            value={i.fixedCostsPerMonth}
            unit="$"
            step={100}
            onChange={(v) => setInput('fixedCostsPerMonth', v)}
          />
        </InputsCard>

        <FedIn
          from="Grow profile"
          href="#grow-profile"
          items={[
            { label: 'Biological efficiency', value: `${fmtNumber(i.be, 0)}%` },
            { label: 'Price', value: `${fmtCurrency(i.pricePerLb)}/lb` },
          ]}
        />

        <FedIn
          from="COGS per block"
          href="#cogs-per-block"
          items={[{ label: 'COGS / block', value: fmtCurrency(r.cogsPerBlock) }]}
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

      {/* ── Results: three chained tiers (gray cards) ───── */}
      <div>
        <TierLabel>Tier 1 · Biology</TierLabel>
        <ResultsGrid>
          <ResultCard
            label="Yield per block"
            value={`${fmtNumber(r.yieldG, 0)} g`}
            sub={`${fmtNumber(r.yieldLb)} lb`}
            tone="accent"
          />
          <ResultCard label="Price" value={`${fmtCurrency(i.pricePerLb)}`} sub="per pound" />
        </ResultsGrid>

        <FeedsArrow label="feeds revenue" />

        <TierLabel>Tier 2 · Per block economics</TierLabel>
        <ResultsGrid>
          <ResultCard label="Revenue / block" value={fmtCurrency(r.revenuePerBlock)} />
          <ResultCard
            label="Margin / block"
            value={fmtCurrency(r.marginPerBlock)}
            sub={`per healthy block · after ${fmtCurrency(r.cogsPerBlock)} COGS`}
            tone={r.marginPerBlock < 0 ? 'negative' : 'positive'}
          />
        </ResultsGrid>

        <FeedsArrow label="feeds the bottom line" />

        <TierLabel>Tier 3 · Monthly outcome</TierLabel>
        <ResultsGrid>
          <ResultCard
            label="Break-even"
            value={Number.isFinite(r.breakevenBlocks) ? fmtInt(r.breakevenBlocks) : '∞'}
            sub="blocks to start / month"
          />
          <ResultCard
            label="Monthly net profit"
            value={fmtCurrency(r.monthlyNet)}
            sub={
              r.monthlyNet < 0
                ? 'operating at a loss'
                : `after fixed costs · ${fmtNumber(i.contaminationRate, 0)}% contamination`
            }
            tone={netTone}
            emphasis
          />
        </ResultsGrid>
      </div>
    </div>
  );
}
