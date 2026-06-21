import type { GrowProfile } from '@/store/inputs';

/**
 * Pure derivation functions. Each takes an inputs object and returns outputs.
 *
 * RULES:
 *  - Pure: same inputs → same outputs, no side effects, no store reads.
 *  - Inputs passed in as an argument (never read the store here) so scenario
 *    mode can later call these with a different inputs object.
 *  - Compose freely: derived values may depend on other derived values.
 */

export const GRAMS_PER_LB = 453.592;

/** Subset of inputs every derivation can rely on. */
type In = GrowProfile;

/** Share of started blocks that survive contamination (0–1). */
export function survivalRate(i: In): number {
  return Math.max(0, 1 - i.contaminationRate / 100);
}

// ── 1. Biological Efficiency & Yield ───────────────────────────────
export interface YieldResult {
  yieldG: number;
  yieldLb: number;
  perFlushG: number[];
}

export function calculateYield(i: In): YieldResult {
  const yieldG = (i.be / 100) * i.dryWeight;
  const yieldLb = yieldG / GRAMS_PER_LB;
  const perFlushG = i.flushDistribution.map((frac) => yieldG * frac);
  return { yieldG, yieldLb, perFlushG };
}

// ── 2. Contamination Loss ──────────────────────────────────────────
export interface ContaminationResult {
  effectiveBlocks: number;
  wastedBlocks: number;
  effectiveYieldLb: number;
}

export function calculateContamination(i: In): ContaminationResult {
  const effectiveBlocks = i.blocksStarted * (1 - i.contaminationRate / 100);
  const wastedBlocks = i.blocksStarted - effectiveBlocks;
  const { yieldLb } = calculateYield(i);
  return {
    effectiveBlocks,
    wastedBlocks,
    effectiveYieldLb: effectiveBlocks * yieldLb,
  };
}

// ── 3. Substrate Moisture & Hydration ──────────────────────────────
export interface MoistureResult {
  currentMoisturePct: number;
  /** Target wet weight to reach the desired moisture, grams. */
  targetWetWeight: number;
  /** Water to add (grams). May be negative if substrate is too wet. */
  waterToAdd: number;
}

export function calculateMoisture(i: In): MoistureResult {
  const { moistureWetWeight: wet, moistureDryWeight: dry, targetMoisture } = i;
  const currentMoisturePct = wet > 0 ? ((wet - dry) / wet) * 100 : 0;
  const targetWetWeight = targetMoisture < 100 ? dry / (1 - targetMoisture / 100) : Infinity;
  const waterToAdd = targetWetWeight - wet;
  return { currentMoisturePct, targetWetWeight, waterToAdd };
}

// ── 4. COGS per Block ──────────────────────────────────────────────
export interface CogsResult {
  substrate: number;
  spawn: number;
  packaging: number;
  sterilization: number;
  total: number;
}

export function calculateCOGS(i: In): CogsResult {
  const substrate = i.substrateCostPerKg * i.kgPerBlock * (1 + i.substrateWastePct / 100);
  const spawn = i.spawnRatio > 0 ? (i.kgPerBlock / i.spawnRatio) * i.spawnCostPerKg : 0;
  const packaging = i.packagingPerBlock;
  const sterilization = i.blocksPerBatch > 0 ? i.batchEnergyLabor / i.blocksPerBatch : 0;
  return {
    substrate,
    spawn,
    packaging,
    sterilization,
    total: substrate + spawn + packaging + sterilization,
  };
}

// ── 5. Capacity & Chambers Needed ──────────────────────────────────
export interface CapacityResult {
  blocksPerChamber: number;
  cyclesPerYear: number;
  chambersNeeded: number;
}

export function calculateCapacity(i: In): CapacityResult {
  const blocksPerChamber =
    i.blockFootprint > 0 ? (i.shelfAreaPerChamber / i.blockFootprint) * i.shelves : 0;
  const cyclesPerYear = i.cycleDays > 0 ? 365 / i.cycleDays : 0;
  const perChamberPerYear = blocksPerChamber * cyclesPerYear;
  const chambersNeeded =
    perChamberPerYear > 0 ? Math.ceil(i.targetAnnualProduction / perChamberPerYear) : 0;
  return {
    blocksPerChamber: Math.floor(blocksPerChamber),
    cyclesPerYear,
    chambersNeeded,
  };
}

// ── 6. Profit per Block (the showcase chain) ───────────────────────
export interface ProfitResult {
  yieldG: number;
  yieldLb: number;
  cogsPerBlock: number;
  revenuePerBlock: number;
  /** Clean unit economics of a *successful* block: revenue − COGS. */
  marginPerBlock: number;
  /** Share of started blocks that survive contamination (0–1). */
  survival: number;
  /** Margin per block *started*: survival × revenue − full COGS. Drives totals. */
  effectiveMarginPerBlock: number;
  monthlyNet: number;
  /** Blocks to *start* per month to cover fixed costs. Infinity if effective margin ≤ 0. */
  breakevenBlocks: number;
}

export function calculateProfit(i: In): ProfitResult {
  const { yieldG, yieldLb } = calculateYield(i);
  const cogsPerBlock = calculateCOGS(i).total;
  const revenuePerBlock = yieldLb * i.pricePerLb;
  // Clean unit economics of a *successful* block — a stable pricing reference.
  const marginPerBlock = revenuePerBlock - cogsPerBlock;
  // Contamination hits the totals: contaminated blocks earn no revenue but still
  // cost full COGS, so the margin per block *started* is haircut by survival.
  const survival = survivalRate(i);
  const effectiveMarginPerBlock = survival * revenuePerBlock - cogsPerBlock;
  const monthlyNet = effectiveMarginPerBlock * i.blocksPerMonth - i.fixedCostsPerMonth;
  const breakevenBlocks =
    effectiveMarginPerBlock > 0
      ? Math.ceil(i.fixedCostsPerMonth / effectiveMarginPerBlock)
      : Infinity;
  return {
    yieldG,
    yieldLb,
    cogsPerBlock,
    revenuePerBlock,
    marginPerBlock,
    survival,
    effectiveMarginPerBlock,
    monthlyNet,
    breakevenBlocks,
  };
}

// ── 7. Break-even ──────────────────────────────────────────────────
export interface BreakevenResult {
  /** Clean contribution margin of a successful block. */
  marginPerBlock: number;
  /** Margin per block started, after contamination. Drives viability. */
  effectiveMarginPerBlock: number;
  survival: number;
  breakevenBlocks: number;
  breakevenLbs: number;
}

export function calculateBreakeven(i: In): BreakevenResult {
  const { marginPerBlock, effectiveMarginPerBlock, survival, yieldLb } = calculateProfit(i);
  // Blocks you must *start* per month for post-contamination revenue to cover fixed costs.
  const breakevenBlocks =
    effectiveMarginPerBlock > 0 ? i.fixedCostsPerMonth / effectiveMarginPerBlock : Infinity;
  return {
    marginPerBlock,
    effectiveMarginPerBlock,
    survival,
    breakevenBlocks,
    // Pounds actually sold at break-even = only the surviving blocks yield.
    breakevenLbs: survival * breakevenBlocks * yieldLb,
  };
}

// ── 8. Revenue per Square Foot ─────────────────────────────────────
export interface RevenuePerSqFtResult {
  blocksPerChamber: number;
  cyclesPerYear: number;
  yieldLb: number;
  annualRevenue: number;
  revPerSqFt: number;
}

export function calculateRevenuePerSqFt(i: In): RevenuePerSqFtResult {
  const { blocksPerChamber, cyclesPerYear } = calculateCapacity(i);
  const { yieldLb } = calculateYield(i);
  // Only harvestable blocks generate revenue, so haircut by the survival rate.
  const annualRevenue =
    survivalRate(i) * blocksPerChamber * cyclesPerYear * yieldLb * i.pricePerLb;
  const revPerSqFt = i.fruitingFootprint > 0 ? annualRevenue / i.fruitingFootprint : 0;
  return { blocksPerChamber, cyclesPerYear, yieldLb, annualRevenue, revPerSqFt };
}

// ── 9. Startup Cost ────────────────────────────────────────────────
export interface StartupResult {
  breakdown: { label: string; amount: number }[];
  total: number;
}

export function calculateStartup(i: In): StartupResult {
  const breakdown = [
    { label: 'Equipment', amount: i.equipmentCost },
    { label: 'Substrate & spawn inventory', amount: i.inventoryCost },
    { label: 'Facility deposit', amount: i.facilityDeposit },
    { label: 'Licensing', amount: i.licensingCost },
    { label: 'Build-out', amount: i.buildOutCost },
  ];
  const total = breakdown.reduce((sum, line) => sum + line.amount, 0);
  return { breakdown, total };
}

// ── 10. Payback & ROI ──────────────────────────────────────────────
export interface PaybackResult {
  totalCapital: number;
  monthlyNet: number;
  annualNet: number;
  /** Months to recover capital. Infinity if not profitable. */
  paybackMonths: number;
  /** Return on investment, percent per year. */
  roiPct: number;
  /** Cash-on-cash return (same basis, expressed as a multiple). */
  cashOnCash: number;
}

export function calculatePayback(i: In): PaybackResult {
  const totalCapital = calculateStartup(i).total;
  const monthlyNet = calculateProfit(i).monthlyNet;
  const annualNet = monthlyNet * 12;
  const paybackMonths = monthlyNet > 0 ? totalCapital / monthlyNet : Infinity;
  const roiPct = totalCapital > 0 ? (annualNet / totalCapital) * 100 : 0;
  const cashOnCash = totalCapital > 0 ? annualNet / totalCapital : 0;
  return { totalCapital, monthlyNet, annualNet, paybackMonths, roiPct, cashOnCash };
}

// ─── Formatting helpers (presentation only) ───────────────────────────────────
const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export function fmtCurrency(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return currencyFmt.format(n);
}

export function fmtNumber(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return '∞';
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtInt(n: number): string {
  if (!Number.isFinite(n)) return '∞';
  return Math.round(n).toLocaleString('en-US');
}

export function fmtPct(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return '—';
  return `${fmtNumber(n, decimals)}%`;
}
