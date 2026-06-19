import { useInputs } from '@/store/useInputs';
import { setInput, applySpecies } from '@/store/inputs';
import { SPECIES } from '@/lib/species';
import { calculateYield, fmtNumber } from '@/lib/derivations';
import SliderRow from '@/components/SliderRow';
import ResultCard from '@/components/ResultCard';
import { InputsCard, ResultsGrid, TierLabel } from '@/components/ui';

export default function BiologicalEfficiency() {
  const i = useInputs();
  const r = calculateYield(i);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <InputsCard title="Inputs">
          <div className="py-2.5">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
              Species
            </label>
            <select
              value={i.speciesId}
              onChange={(e) => applySpecies(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-stone-300 bg-paper px-2 py-2 text-sm text-stone-900 focus:border-chanterelle-500 focus:outline-none focus:ring-1 focus:ring-chanterelle-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            >
              {SPECIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <SliderRow
            label="Biological efficiency"
            value={i.be}
            min={0}
            max={150}
            step={1}
            unit="%"
            onChange={(v) => setInput('be', v)}
            hint="Fresh yield as a percentage of dry substrate weight."
          />
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
