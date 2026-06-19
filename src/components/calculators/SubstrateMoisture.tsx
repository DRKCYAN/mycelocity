import { useInputs } from '@/store/useInputs';
import { setInput } from '@/store/inputs';
import { calculateMoisture, fmtNumber, fmtPct } from '@/lib/derivations';
import SliderRow from '@/components/SliderRow';
import NumberRow from '@/components/NumberRow';
import ResultCard from '@/components/ResultCard';
import { InputsCard, ResultsGrid, TierLabel } from '@/components/ui';

export default function SubstrateMoisture() {
  const i = useInputs();
  const r = calculateMoisture(i);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        {/* Mode toggle */}
        <div className="inline-flex rounded-lg border border-stone-200 bg-paper p-1 text-sm dark:border-stone-700 dark:bg-stone-900">
          {(['measure', 'target'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setInput('moistureMode', mode)}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                i.moistureMode === mode
                  ? 'bg-chanterelle-400 text-stone-900'
                  : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
              }`}
            >
              {mode === 'measure' ? 'Measure moisture' : 'Hit a target'}
            </button>
          ))}
        </div>

        <InputsCard title="Inputs">
          <NumberRow
            label="Wet weight"
            value={i.moistureWetWeight}
            unit="g"
            step={50}
            onChange={(v) => setInput('moistureWetWeight', v)}
          />
          <NumberRow
            label="Dry weight"
            value={i.moistureDryWeight}
            unit="g"
            step={50}
            onChange={(v) => setInput('moistureDryWeight', v)}
          />
          {i.moistureMode === 'target' && (
            <SliderRow
              label="Target moisture"
              value={i.targetMoisture}
              min={0}
              max={95}
              step={1}
              unit="%"
              onChange={(v) => setInput('targetMoisture', v)}
              hint="Field capacity for most bulk substrates is 60–70%."
            />
          )}
        </InputsCard>
      </div>

      <div>
        <TierLabel>{i.moistureMode === 'measure' ? 'Current moisture' : 'Hydration plan'}</TierLabel>
        <ResultsGrid>
          <ResultCard
            label="Current moisture"
            value={fmtPct(r.currentMoisturePct)}
            tone="accent"
            emphasis
          />
          {i.moistureMode === 'target' && (
            <>
              <ResultCard
                label="Target wet weight"
                value={`${fmtNumber(r.targetWetWeight, 0)} g`}
              />
              <ResultCard
                label="Water to add"
                value={`${fmtNumber(r.waterToAdd, 0)} g`}
                sub={r.waterToAdd < 0 ? 'substrate is too wet — dry it out' : 'to reach target'}
                tone={r.waterToAdd < 0 ? 'negative' : 'positive'}
              />
            </>
          )}
        </ResultsGrid>
      </div>
    </div>
  );
}
