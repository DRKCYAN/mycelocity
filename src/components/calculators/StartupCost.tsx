import { useInputs } from '@/store/useInputs';
import { setInput } from '@/store/inputs';
import { calculateStartup, fmtCurrency, fmtPct } from '@/lib/derivations';
import NumberRow from '@/components/NumberRow';
import ResultCard from '@/components/ResultCard';
import { InputsCard, ResultsGrid, TierLabel, FeedsArrow } from '@/components/ui';

export default function StartupCost() {
  const i = useInputs();
  const r = calculateStartup(i);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <InputsCard title="Startup line items">
          <NumberRow
            label="Equipment"
            value={i.equipmentCost}
            unit="$"
            step={250}
            onChange={(v) => setInput('equipmentCost', v)}
          />
          <NumberRow
            label="Substrate & spawn inventory"
            value={i.inventoryCost}
            unit="$"
            step={100}
            onChange={(v) => setInput('inventoryCost', v)}
          />
          <NumberRow
            label="Facility deposit"
            value={i.facilityDeposit}
            unit="$"
            step={250}
            onChange={(v) => setInput('facilityDeposit', v)}
          />
          <NumberRow
            label="Licensing"
            value={i.licensingCost}
            unit="$"
            step={100}
            onChange={(v) => setInput('licensingCost', v)}
          />
          <NumberRow
            label="Build-out"
            value={i.buildOutCost}
            unit="$"
            step={500}
            onChange={(v) => setInput('buildOutCost', v)}
          />
        </InputsCard>
      </div>

      <div>
        <TierLabel>Breakdown</TierLabel>
        <ResultsGrid>
          {r.breakdown.map((line) => (
            <ResultCard
              key={line.label}
              label={line.label}
              value={fmtCurrency(line.amount)}
              sub={r.total > 0 ? fmtPct((line.amount / r.total) * 100, 0) + ' of total' : undefined}
            />
          ))}
        </ResultsGrid>

        <FeedsArrow label="feeds payback & ROI" />

        <TierLabel>Total</TierLabel>
        <ResultCard
          label="Total startup capital"
          value={fmtCurrency(r.total)}
          tone="accent"
          emphasis
        />
      </div>
    </div>
  );
}
