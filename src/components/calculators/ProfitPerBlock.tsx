import { useInputs } from '@/store/useInputs';
import { setInput, applySpecies } from '@/store/inputs';
import { SPECIES } from '@/lib/species';
import { calculateProfit, fmtCurrency, fmtNumber, fmtInt } from '@/lib/derivations';
import SliderRow from '@/components/SliderRow';
import NumberRow from '@/components/NumberRow';
import ResultCard from '@/components/ResultCard';
import { InputsCard, ResultsGrid, TierLabel, FeedsArrow } from '@/components/ui';

/**
 * THE showcase calculator. Reads raw inputs from the shared store, derives the
 * full chain live, and renders results in three tiers with downward "feeds"
 * arrows. COGS flows in from the COGS-per-block inputs — change anything and
 * everything downstream recomputes.
 */
export default function ProfitPerBlock() {
  const i = useInputs();
  const r = calculateProfit(i);
  const netTone = r.monthlyNet < 0 ? 'negative' : 'positive';

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Inputs (white card) ─────────────────────────── */}
      <div className="space-y-4">
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
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              Sets BE, price &amp; spawn ratio globally — overridable below.
            </p>
          </div>

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
            label="Dry substrate weight / block"
            value={i.dryWeight}
            min={100}
            max={5000}
            step={50}
            unit="g"
            onChange={(v) => setInput('dryWeight', v)}
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
          <NumberRow
            label="Blocks per month"
            value={i.blocksPerMonth}
            step={10}
            onChange={(v) => setInput('blocksPerMonth', v)}
          />
          <NumberRow
            label="Fixed costs per month"
            value={i.fixedCostsPerMonth}
            unit="$"
            step={100}
            onChange={(v) => setInput('fixedCostsPerMonth', v)}
          />
        </InputsCard>

        {/* COGS chained in from the COGS-per-block calculator. */}
        <div className="rounded-xl border border-dashed border-accent-300 bg-accent-50 px-4 py-3 text-sm dark:border-accent-700 dark:bg-accent-900/20">
          <span className="text-stone-600 dark:text-stone-300">
            COGS chained in:{' '}
            <strong className="tabular-nums text-stone-900 dark:text-stone-100">
              {fmtCurrency(r.cogsPerBlock)}/block
            </strong>
          </span>
          <a
            href="/calculators/cogs-per-block"
            className="ml-2 font-medium text-accent-700 underline-offset-2 hover:underline dark:text-accent-400"
          >
            adjust →
          </a>
        </div>
      </div>

      {/* ── Results: three chained tiers (gray cards) ───── */}
      <div>
        <TierLabel>Tier 1 · Biology</TierLabel>
        <ResultsGrid>
          <ResultCard
            label="Yield per block"
            value={`${fmtNumber(r.yieldG, 0)} g`}
            sub={`${fmtNumber(r.yieldLb)} lb`}
            tone="accent"
          />
          <ResultCard
            label="Price"
            value={`${fmtCurrency(i.pricePerLb)}`}
            sub="per pound"
          />
        </ResultsGrid>

        <FeedsArrow label="feeds revenue" />

        <TierLabel>Tier 2 · Per block economics</TierLabel>
        <ResultsGrid>
          <ResultCard label="Revenue / block" value={fmtCurrency(r.revenuePerBlock)} />
          <ResultCard
            label="Margin / block"
            value={fmtCurrency(r.marginPerBlock)}
            sub={`after ${fmtCurrency(r.cogsPerBlock)} COGS`}
            tone={r.marginPerBlock < 0 ? 'negative' : 'positive'}
          />
        </ResultsGrid>

        <FeedsArrow label="feeds the bottom line" />

        <TierLabel>Tier 3 · Monthly outcome</TierLabel>
        <ResultsGrid>
          <ResultCard
            label="Break-even"
            value={Number.isFinite(r.breakevenBlocks) ? fmtInt(r.breakevenBlocks) : '∞'}
            sub="blocks / month"
          />
          <ResultCard
            label="Monthly net profit"
            value={fmtCurrency(r.monthlyNet)}
            sub={r.monthlyNet < 0 ? 'operating at a loss' : 'after fixed costs'}
            tone={netTone}
            emphasis
          />
        </ResultsGrid>
      </div>
    </div>
  );
}
