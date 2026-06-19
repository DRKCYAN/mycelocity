import { map } from 'nanostores';
import { SPECIES, getSpecies } from '@/lib/species';

/**
 * The canonical "grow profile": the single shared set of RAW USER INPUTS.
 *
 * THE GOLDEN RULE: this store holds inputs only. Every result is *derived*
 * live from these inputs via pure functions in `src/lib/derivations.ts`.
 * Never write a computed result back into this store — that is the bug that
 * breaks automatic chaining.
 *
 * Because this set is shared across every calculator, a value entered on one
 * calculator (price, BE, substrate weight, …) is reflected on all others.
 */
export interface GrowProfile {
  // ── Biology ──────────────────────────────────────────────
  /** Selected species preset id (see species.ts). */
  speciesId: string;
  /** Biological efficiency, percent. Preset-filled, user-overridable. */
  be: number;
  /** Dry substrate weight per block, grams. Root input of the yield chain. */
  dryWeight: number;
  /** Flush yield distribution (fractions, should sum to ~1). */
  flushDistribution: number[];
  /** Blocks started in a run (for contamination loss). */
  blocksStarted: number;
  /** Contamination rate, percent. */
  contaminationRate: number;

  // ── Substrate moisture ───────────────────────────────────
  /** 'measure' = compute moisture from wet+dry; 'target' = water to add. */
  moistureMode: 'measure' | 'target';
  /** Measured wet substrate weight, grams. */
  moistureWetWeight: number;
  /** Measured dry substrate weight, grams. */
  moistureDryWeight: number;
  /** Target moisture content, percent. */
  targetMoisture: number;

  // ── Operations: COGS per block ───────────────────────────
  substrateCostPerKg: number;
  kgPerBlock: number;
  /** Substrate waste, percent. */
  substrateWastePct: number;
  spawnCostPerKg: number;
  /** Spawn ratio denominator N, as in 1:N. */
  spawnRatio: number;
  packagingPerBlock: number;
  /** Combined energy + labor cost per sterilization batch, USD. */
  batchEnergyLabor: number;
  blocksPerBatch: number;

  // ── Operations: capacity & chambers ──────────────────────
  /** Usable shelf area per chamber, square feet. */
  shelfAreaPerChamber: number;
  /** Footprint of one block, square feet. */
  blockFootprint: number;
  /** Number of shelves per chamber. */
  shelves: number;
  /** Target annual production, blocks. */
  targetAnnualProduction: number;
  /** Full cycle length (colonization + fruiting + turnaround), days. */
  cycleDays: number;

  // ── Economics ────────────────────────────────────────────
  /** Fresh market price, USD per pound. */
  pricePerLb: number;
  blocksPerMonth: number;
  fixedCostsPerMonth: number;
  /** Fruiting footprint for revenue-per-sq-ft, square feet. */
  fruitingFootprint: number;

  // ── Finance: startup line items ──────────────────────────
  equipmentCost: number;
  inventoryCost: number;
  facilityDeposit: number;
  licensingCost: number;
  buildOutCost: number;
}

const oyster = SPECIES[0];

/** Sensible starting profile (Oyster preset + reasonable operational defaults). */
export const DEFAULT_INPUTS: GrowProfile = {
  speciesId: oyster.id,
  be: oyster.be,
  dryWeight: 1000,
  flushDistribution: [0.5, 0.3, 0.2],
  blocksStarted: 100,
  contaminationRate: 8,

  moistureMode: 'measure',
  moistureWetWeight: 2500,
  moistureDryWeight: 1000,
  targetMoisture: 65,

  substrateCostPerKg: 0.4,
  kgPerBlock: 2.5,
  substrateWastePct: 5,
  spawnCostPerKg: 4,
  spawnRatio: oyster.spawnRatio,
  packagingPerBlock: 0.35,
  batchEnergyLabor: 60,
  blocksPerBatch: 50,

  shelfAreaPerChamber: 120,
  blockFootprint: 0.5,
  shelves: 4,
  targetAnnualProduction: 20000,
  cycleDays: oyster.cycleDays,

  pricePerLb: oyster.pricePerLb,
  blocksPerMonth: 400,
  fixedCostsPerMonth: 3000,
  fruitingFootprint: 200,

  equipmentCost: 12000,
  inventoryCost: 1500,
  facilityDeposit: 4000,
  licensingCost: 800,
  buildOutCost: 9000,
};

/** The single shared store instance. */
export const $inputs = map<GrowProfile>({ ...DEFAULT_INPUTS });

/** Set one input field. Typed so callers cannot stuff arbitrary keys. */
export function setInput<K extends keyof GrowProfile>(key: K, value: GrowProfile[K]) {
  $inputs.setKey(key, value);
}

/**
 * Apply a species preset: sets BE, price, spawn ratio and cycle days globally.
 * Other inputs are left untouched (they are not species-specific defaults).
 */
export function applySpecies(speciesId: string) {
  const preset = getSpecies(speciesId);
  if (!preset) return;
  $inputs.set({
    ...$inputs.get(),
    speciesId: preset.id,
    be: preset.be,
    pricePerLb: preset.pricePerLb,
    spawnRatio: preset.spawnRatio,
    cycleDays: preset.cycleDays,
  });
}

/** Reset every input back to the default grow profile. */
export function resetInputs() {
  $inputs.set({ ...DEFAULT_INPUTS });
}

// ─── Future-proofing seams (premium features bolt on here later) ──────────────
// DO NOT implement persistence / URL encoding in v1. These are intentional
// no-op stubs so saving profiles and shareable URLs slot in without a rewrite.

/** STUB: later serializes the input object for save / shareable-URL features. */
export function serializeInputs(): string {
  const json = JSON.stringify($inputs.get());
  // eslint-disable-next-line no-console
  console.debug('[serializeInputs stub] would persist:', json);
  return json;
}

/** STUB: later hydrates the store from a saved profile or shared URL. */
export function loadInputs(_serialized?: string): void {
  // eslint-disable-next-line no-console
  console.debug('[loadInputs stub] no-op in v1; refresh resetting inputs is expected.');
}
