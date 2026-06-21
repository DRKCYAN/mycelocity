import { useInputs } from '@/store/useInputs';
import { setInput } from '@/store/inputs';
import { calculateYield, fmtNumber } from '@/lib/derivations';
import SliderRow from '@/components/SliderRow';
import ResultCard from '@/components/ResultCard';
import { InputsCard, ResultsGrid, TierLabel, FedIn } from '@/components/ui';

export default function BiologicalEfficiency() {
  const i = useInputs();
  const r = calculateYield(i);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <InputsCard title="Inputs">
          <SliderRow
            label="Dry substrate weight / block"
            value={i.dryWeight}
            min={100}
            max={5000}
            step={50}
            unit="g"
            onChange={(v) => setInput('dryWeight', v)}
          />
        </InputsCard>

        {/* BE is seeded by the species preset and edited once, at the root. */}
        <FedIn
          from="Grow profile"
          href="#grow-profile"
          items={[{ label: 'Biological efficiency', value: `${fmtNumber(i.be, 0)}%` }]}
        />
      </div>

      <div>
        <TierLabel>Yield per block</TierLabel>
        <ResultsGrid>
          <ResultCard label="Yield" value={`${fmtNumber(r.yieldG, 0)} g`} tone="accent" emphasis />
          <ResultCard label="Yield (lb)" value={`${fmtNumber(r.yieldLb)} lb`} tone="accent" />
        </ResultsGrid>

        <div className="mt-4">
          <TierLabel>Per-flush yield</TierLabel>
          <ResultsGrid>
            {r.perFlushG.map((g, idx) => (
              <ResultCard
                key={idx}
                label={`Flush ${idx + 1}`}
                value={`${fmtNumber(g, 0)} g`}
                sub={`${fmtNumber(i.flushDistribution[idx] * 100, 0)}% of total`}
              />
            ))}
          </ResultsGrid>
        </div>
      </div>
    </div>
  );
}
