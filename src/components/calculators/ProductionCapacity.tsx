import { useInputs } from '@/store/useInputs';
import { setInput } from '@/store/inputs';
import { calculateCapacity, fmtInt, fmtNumber } from '@/lib/derivations';
import SliderRow from '@/components/SliderRow';
import NumberRow from '@/components/NumberRow';
import ResultCard from '@/components/ResultCard';
import { InputsCard, ResultsGrid, TierLabel, FeedsArrow, FedIn } from '@/components/ui';

export default function ProductionCapacity() {
  const i = useInputs();
  const r = calculateCapacity(i);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <InputsCard title="Chamber layout">
          <NumberRow
            label="Shelf area / chamber"
            value={i.shelfAreaPerChamber}
            unit="ft²"
            step={5}
            onChange={(v) => setInput('shelfAreaPerChamber', v)}
          />
          <SliderRow
            label="Block footprint"
            value={i.blockFootprint}
            min={0.1}
            max={3}
            step={0.05}
            unit="ft²"
            onChange={(v) => setInput('blockFootprint', v)}
          />
          <SliderRow
            label="Shelves"
            value={i.shelves}
            min={1}
            max={12}
            step={1}
            onChange={(v) => setInput('shelves', v)}
          />
        </InputsCard>

        <InputsCard title="Production target">
          <NumberRow
            label="Target annual production"
            value={i.targetAnnualProduction}
            unit="blocks"
            step={500}
            onChange={(v) => setInput('targetAnnualProduction', v)}
          />
        </InputsCard>

        {/* Cycle length is seeded by the species preset and edited once, at the root. */}
        <FedIn
          from="Grow profile"
          href="#grow-profile"
          items={[{ label: 'Cycle length', value: `${i.cycleDays} days` }]}
        />
      </div>

      <div>
        <TierLabel>Per-chamber throughput</TierLabel>
        <ResultsGrid>
          <ResultCard label="Blocks per chamber" value={fmtInt(r.blocksPerChamber)} tone="accent" />
          <ResultCard label="Cycles per year" value={fmtNumber(r.cyclesPerYear)} />
        </ResultsGrid>

        <FeedsArrow label="feeds chambers needed" />

        <TierLabel>To hit your target</TierLabel>
        <ResultCard
          label="Chambers needed"
          value={fmtInt(r.chambersNeeded)}
          sub={`for ${fmtInt(i.targetAnnualProduction)} blocks / year`}
          tone="accent"
          emphasis
        />
      </div>
    </div>
  );
}
