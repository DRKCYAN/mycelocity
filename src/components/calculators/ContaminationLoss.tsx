import { useInputs } from '@/store/useInputs';
import { setInput } from '@/store/inputs';
import { calculateContamination, fmtInt, fmtNumber } from '@/lib/derivations';
import SliderRow from '@/components/SliderRow';
import NumberRow from '@/components/NumberRow';
import ResultCard from '@/components/ResultCard';
import { InputsCard, ResultsGrid, TierLabel } from '@/components/ui';

export default function ContaminationLoss() {
  const i = useInputs();
  const r = calculateContamination(i);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <InputsCard title="Inputs">
          <NumberRow
            label="Blocks started"
            value={i.blocksStarted}
            step={10}
            onChange={(v) => setInput('blocksStarted', v)}
          />
          <SliderRow
            label="Contamination rate"
            value={i.contaminationRate}
            min={0}
            max={100}
            step={0.5}
            unit="%"
            onChange={(v) => setInput('contaminationRate', v)}
            hint="Shares yield per block from the Biological Efficiency calculator."
          />
        </InputsCard>
      </div>

      <div>
        <TierLabel>After contamination</TierLabel>
        <ResultsGrid>
          <ResultCard
            label="Harvestable blocks"
            value={fmtInt(r.effectiveBlocks)}
            tone="positive"
          />
          <ResultCard label="Wasted blocks" value={fmtInt(r.wastedBlocks)} tone="negative" />
          <ResultCard
            label="Effective yield"
            value={`${fmtNumber(r.effectiveYieldLb)} lb`}
            sub="across all harvestable blocks"
            tone="accent"
            emphasis
          />
        </ResultsGrid>
      </div>
    </div>
  );
}
