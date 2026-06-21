import { useInputs } from '@/store/useInputs';
import { setInput, applySpecies } from '@/store/inputs';
import { SPECIES } from '@/lib/species';
import SliderRow from '@/components/SliderRow';
import { InputsCard } from '@/components/ui';

/**
 * The root of the model — the diagram's "Species preset" node. This is the
 * SINGLE editable home for the four species-seeded values (BE, price, spawn
 * ratio, cycle days). Every calculator downstream reads them from the shared
 * store and shows them as read-only "fed in ↑" chips, so each value is entered
 * in exactly one place and changes ripple down the four layers.
 */
export default function GrowProfilePanel() {
  const i = useInputs();

  return (
    <InputsCard title="Species preset · the root of the model">
      <div className="py-2.5">
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">Species</label>
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
        <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
          Picking a species sets the four values below for every calculator on the page — override
          any of them here and the whole chain recomputes.
        </p>
      </div>

      <div className="grid gap-x-8 pt-1 sm:grid-cols-2">
        <SliderRow
          label="Biological efficiency"
          value={i.be}
          min={0}
          max={150}
          step={1}
          unit="%"
          onChange={(v) => setInput('be', v)}
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
        <SliderRow
          label="Spawn ratio (1:N)"
          value={i.spawnRatio}
          min={1}
          max={20}
          step={1}
          unit=":1"
          onChange={(v) => setInput('spawnRatio', v)}
        />
        <SliderRow
          label="Cycle length"
          value={i.cycleDays}
          min={14}
          max={120}
          step={1}
          unit="days"
          onChange={(v) => setInput('cycleDays', v)}
        />
      </div>
    </InputsCard>
  );
}
