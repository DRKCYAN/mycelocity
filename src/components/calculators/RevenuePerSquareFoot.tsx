import { useInputs } from '@/store/useInputs';
import { setInput } from '@/store/inputs';
import { calculateRevenuePerSqFt, survivalRate, fmtCurrency, fmtInt, fmtNumber } from '@/lib/derivations';
import NumberRow from '@/components/NumberRow';
import ResultCard from '@/components/ResultCard';
import { InputsCard, TierLabel, FeedsArrow, FedIn } from '@/components/ui';

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
        </InputsCard>

        <FedIn
          from="Grow profile"
          href="#grow-profile"
          items={[{ label: 'Price', value: `${fmtCurrency(i.pricePerLb)}/lb` }]}
        />

        <FedIn
          from="Capacity & chambers"
          href="#production-capacity"
          items={[
            { label: 'Blocks / chamber', value: fmtInt(r.blocksPerChamber) },
            { label: 'Cycles / year', value: fmtNumber(r.cyclesPerYear) },
            { label: 'Yield / block', value: `${fmtNumber(r.yieldLb)} lb` },
          ]}
        />

        <FedIn
          from="Contamination loss"
          href="#contamination-loss"
          items={[
            { label: 'Contamination', value: `${fmtNumber(i.contaminationRate, 0)}%` },
            { label: 'Harvest survival', value: `${fmtNumber(survivalRate(i) * 100, 0)}%` },
          ]}
        />
      </div>

      <div>
        <TierLabel>Annual output</TierLabel>
        <ResultCard
          label="Annual revenue"
          value={fmtCurrency(r.annualRevenue)}
          sub="per chamber · after contamination"
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
