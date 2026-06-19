import { useInputs } from '@/store/useInputs';
import { setInput } from '@/store/inputs';
import { calculateCOGS, fmtCurrency } from '@/lib/derivations';
import SliderRow from '@/components/SliderRow';
import NumberRow from '@/components/NumberRow';
import ResultCard from '@/components/ResultCard';
import { InputsCard, ResultsGrid, TierLabel, FeedsArrow } from '@/components/ui';

export default function CogsPerBlock() {
  const i = useInputs();
  const r = calculateCOGS(i);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <InputsCard title="Substrate & spawn">
          <NumberRow
            label="Substrate cost"
            value={i.substrateCostPerKg}
            unit="$/kg"
            step={0.05}
            onChange={(v) => setInput('substrateCostPerKg', v)}
          />
          <SliderRow
            label="Substrate per block"
            value={i.kgPerBlock}
            min={0.5}
            max={10}
            step={0.1}
            unit="kg"
            onChange={(v) => setInput('kgPerBlock', v)}
          />
          <SliderRow
            label="Substrate waste"
            value={i.substrateWastePct}
            min={0}
            max={50}
            step={1}
            unit="%"
            onChange={(v) => setInput('substrateWastePct', v)}
          />
          <NumberRow
            label="Spawn cost"
            value={i.spawnCostPerKg}
            unit="$/kg"
            step={0.5}
            onChange={(v) => setInput('spawnCostPerKg', v)}
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
        </InputsCard>

        <InputsCard title="Packaging & batch">
          <NumberRow
            label="Packaging / block"
            value={i.packagingPerBlock}
            unit="$"
            step={0.05}
            onChange={(v) => setInput('packagingPerBlock', v)}
          />
          <NumberRow
            label="Energy + labor / batch"
            value={i.batchEnergyLabor}
            unit="$"
            step={5}
            onChange={(v) => setInput('batchEnergyLabor', v)}
          />
          <NumberRow
            label="Blocks per batch"
            value={i.blocksPerBatch}
            step={5}
            onChange={(v) => setInput('blocksPerBatch', v)}
          />
        </InputsCard>
      </div>

      <div>
        <TierLabel>Cost components</TierLabel>
        <ResultsGrid>
          <ResultCard label="Substrate" value={fmtCurrency(r.substrate)} />
          <ResultCard label="Spawn" value={fmtCurrency(r.spawn)} />
          <ResultCard label="Packaging" value={fmtCurrency(r.packaging)} />
          <ResultCard label="Sterilization" value={fmtCurrency(r.sterilization)} />
        </ResultsGrid>

        <FeedsArrow label="feeds margin & profit" />

        <TierLabel>Total</TierLabel>
        <ResultCard
          label="COGS per block"
          value={fmtCurrency(r.total)}
          sub="all-in variable cost"
          tone="accent"
          emphasis
        />
      </div>
    </div>
  );
}
