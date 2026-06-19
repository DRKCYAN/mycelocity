import { useInputs } from '@/store/useInputs';
import { setInput } from '@/store/inputs';
import { calculateRevenuePerSqFt, fmtCurrency, fmtInt, fmtNumber } from '@/lib/derivations';
import NumberRow from '@/components/NumberRow';
import SliderRow from '@/components/SliderRow';
import ResultCard from '@/components/ResultCard';
import { InputsCard, ResultsGrid, TierLabel, FeedsArrow } from '@/components/ui';

export default function RevenuePerSquareFoot() {
  const i = useInputs();
  const r = calculateRevenuePerSqFt(i);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <InputsCard title="Inputs">
          <NumberRow
            label="Fruiting footprint"
            value={i.fruitingFootprint}
            unit="ft²"
            step={10}
            onChange={(v) => setInput('fruitingFootprint', v)}
          />
          <SliderRow
            label="Price"
            value={i.pricePerLb}
            min={1}
            max={40}
            step={0.5}
            unit="$/lb"
            onChange={(v) => setInput('pricePerLb', v)}
          />
        </InputsCard>

        <div className="rounded-xl border border-dashed border-accent-300 bg-accent-50 px-4 py-3 text-sm dark:border-accent-700 dark:bg-accent-900/20">
          <p className="text-stone-600 dark:text-stone-300">Chained in from the hub:</p>
          <ul className="mt-1 space-y-0.5 tabular-nums text-stone-900 dark:text-stone-100">
            <li>{fmtInt(r.blocksPerChamber)} blocks / chamber</li>
            <li>{fmtNumber(r.cyclesPerYear)} cycles / year</li>
            <li>{fmtNumber(r.yieldLb)} lb / block</li>
          </ul>
        </div>
      </div>

      <div>
        <TierLabel>Annual output</TierLabel>
        <ResultCard
          label="Annual revenue"
          value={fmtCurrency(r.annualRevenue)}
          sub="per chamber"
        />

        <FeedsArrow label="feeds the vertical-farming KPI" />

        <TierLabel>The KPI</TierLabel>
        <ResultCard
          label="Revenue per square foot"
          value={fmtCurrency(r.revPerSqFt)}
          sub="per ft² of fruiting space, per year"
          tone="accent"
          emphasis
        />
      </div>
    </div>
  );
}
