// The calculator registry. Single source of truth for the sidebar, the
// dynamic router (`/calculators/[slug]`), category index pages, and per-page
// SEO. Adding the free/paid wall later = flip a `tier` flag here; nothing else
// needs to change because every surface reads from this list.

export type Category = 'Biology' | 'Operations' | 'Economics' | 'Finance';

export const CATEGORIES: { name: Category; slug: string; blurb: string }[] = [
  {
    name: 'Biology',
    slug: 'biology',
    blurb:
      'Yield, contamination and substrate fundamentals — the root of the model. Includes a yield calculator and a substrate weight calculator.',
  },
  {
    name: 'Operations',
    slug: 'operations',
    blurb:
      'Per-block cost and the physical capacity to produce at scale — a cost calculator and a block calculator in one.',
  },
  {
    name: 'Economics',
    slug: 'economics',
    blurb:
      'Turn yield and cost into revenue, margin and break-even — profit calculator, margin calculator and revenue calculator territory.',
  },
  {
    name: 'Finance',
    slug: 'finance',
    blurb:
      'Capital required to start and how fast it pays back — the business calculator and roi calculator section.',
  },
];

export type Tier = 'free' | 'pro';

export interface Calculator {
  id: string;
  /** Human-readable name; also the page <h1>. */
  title: string;
  /** Human-readable slug containing the search term. */
  slug: string;
  category: Category;
  tier: Tier;
  /** Short description for cards / sidebar tooltips. */
  description: string;
  /** SEO <title>. */
  seoTitle: string;
  /** SEO meta description, targeting the search phrase. */
  metaDescription: string;
  /** Server-rendered, crawlable explanatory paragraph (no JS required). */
  intro: string;
  /** The formula, shown as above-the-fold reference text. */
  formula: string;
  /** ids of calculators that share inputs with this one ("connected to"). */
  connectedTo: string[];
  /**
   * ids of calculators this one feeds *downstream* (directed edges in the
   * dependency diagram). Drives the flow-map arrows and the between-calculator
   * connectors. Distinct from `connectedTo`, which is undirected.
   */
  feeds: string[];
  /** True for optional/preparatory feeds (dashed edges), e.g. substrate moisture. */
  optional?: boolean;
}

export const CALCULATORS: Calculator[] = [
  // ── Biology ──────────────────────────────────────────────
  {
    id: 'biological-efficiency',
    title: 'Biological Efficiency & Yield',
    slug: 'biological-efficiency',
    category: 'Biology',
    tier: 'free',
    description: 'Convert biological efficiency and dry substrate weight into yield per block.',
    seoTitle: 'Mushroom Biological Efficiency Calculator — Yield per Block | Mycelocity',
    metaDescription:
      'Free mushroom biological efficiency calculator. Enter BE % and dry substrate weight to get fresh yield per block in grams and pounds, broken down by flush.',
    intro:
      'Biological efficiency (BE) is the ratio of fresh mushroom yield to the dry weight of the substrate, expressed as a percentage. This calculator converts your BE and dry substrate weight per block into the fresh yield you can expect, in grams and pounds, and splits it across each flush. As a mushroom yield calculator it doubles as a substrate weight calculator, since BE is only meaningful against an accurate dry weight. It is the root of the Mycelocity model — yield feeds revenue, margin, break-even and capacity downstream.',
    formula: 'yield_g = (BE / 100) × dryWeight  ·  yield_lb = yield_g / 453.592  ·  flush_i = yield_g × distribution_i',
    connectedTo: ['contamination-loss', 'profit-per-block', 'revenue-per-square-foot'],
    feeds: ['contamination-loss', 'profit-per-block', 'revenue-per-square-foot'],
  },
  {
    id: 'contamination-loss',
    title: 'Contamination Loss',
    slug: 'contamination-loss',
    category: 'Biology',
    tier: 'free',
    description: 'Estimate harvestable blocks and effective yield after contamination.',
    seoTitle: 'Mushroom Contamination Loss Calculator — Effective Yield | Mycelocity',
    metaDescription:
      'Calculate how many mushroom blocks survive contamination and your effective yield. Enter blocks started and contamination rate to see harvestable vs. wasted blocks.',
    intro:
      'Contamination is the single biggest source of lost yield for most growers. This calculator takes the number of blocks you started and your contamination rate and returns how many blocks remain harvestable, how many are wasted, and the effective yield once losses are applied. Use it as a quick mushroom rate calculator — and an estimate calculator for how much a bad batch actually costs you — alongside the per-block yield from the Biological Efficiency calculator.',
    formula: 'effective = started × (1 − rate/100)  ·  wasted = started − effective  ·  effectiveYield = effective × yield_per_block',
    connectedTo: ['biological-efficiency', 'profit-per-block'],
    feeds: ['profit-per-block', 'break-even', 'revenue-per-square-foot'],
  },
  {
    id: 'substrate-moisture',
    title: 'Substrate Moisture & Hydration',
    slug: 'substrate-moisture',
    category: 'Biology',
    tier: 'free',
    description: 'Measure substrate moisture content or compute water to add to hit a target.',
    seoTitle: 'Substrate Moisture Calculator — Mushroom Hydration | Mycelocity',
    metaDescription:
      'Free substrate moisture calculator for mushroom growers. Measure current moisture content from wet and dry weight, or compute exactly how much water to add to hit a target.',
    intro:
      'Substrate moisture content drives colonization speed and contamination risk. This calculator works two ways: measure the current moisture percentage from wet and dry weights, or specify a target moisture and get the exact amount of water to add. As a wet/dry weight calculator it also doubles as a moisture rate calculator for dialing in field capacity, which for most bulk substrates sits around 60–70%.',
    formula: 'moisture% = ((wet − dry) / wet) × 100  ·  targetWet = dry / (1 − targetMoisture/100)  ·  waterToAdd = targetWet − wet',
    connectedTo: ['biological-efficiency'],
    // Preparation tool, not a yield input — an optional/dashed feed in the diagram.
    feeds: [],
    optional: true,
  },

  // ── Operations ───────────────────────────────────────────
  {
    id: 'cogs-per-block',
    title: 'COGS per Block',
    slug: 'cogs-per-block',
    category: 'Operations',
    tier: 'free',
    description: 'Build up the cost of goods sold for a single block from its components.',
    seoTitle: 'Mushroom COGS per Block Calculator — Cost of Goods | Mycelocity',
    metaDescription:
      'Calculate the cost of goods sold per mushroom block: substrate, spawn, packaging and sterilization. Free COGS calculator and block calculator that feeds your margin and profit.',
    intro:
      'Cost of goods sold (COGS) per block is the all-in variable cost to produce one fruiting block: substrate, spawn, packaging, and the energy and labor of sterilization spread across a batch. This calculator builds COGS up from each component so you can see what is actually driving your cost — effectively a per-block cost calculator and price estimate calculator in one, itemizing the materials bill before you set a sale price — and it feeds directly into margin and profit.',
    formula: 'substrate = costPerKg × kgPerBlock × (1 + waste/100)  ·  spawn = (kgPerBlock / N) × spawnCostPerKg  ·  steril = batchEnergyLabor / blocksPerBatch  ·  COGS = substrate + spawn + packaging + steril',
    connectedTo: ['profit-per-block', 'break-even'],
    feeds: ['profit-per-block', 'break-even'],
  },
  {
    id: 'production-capacity',
    title: 'Capacity & Chambers Needed',
    slug: 'production-capacity',
    category: 'Operations',
    tier: 'free',
    description: 'Work out blocks per chamber, cycles per year and how many chambers you need.',
    seoTitle: 'Mushroom Production Capacity Calculator — Chambers Needed | Mycelocity',
    metaDescription:
      'Plan mushroom farm capacity: blocks per fruiting chamber, cycles per year, and the number of chambers needed to hit a target annual production.',
    intro:
      'Capacity planning answers a simple question: how many fruiting chambers do you need to hit your production target? This calculator computes blocks per chamber from shelf area and block footprint, cycles per year from your cycle length, and the number of chambers required for your target annual output — a block calculator and production-rate calculator for sizing a grow before you commit to it.',
    formula: 'blocksPerChamber = (shelfArea / blockFootprint) × shelves  ·  cyclesPerYear = 365 / cycleDays  ·  chambersNeeded = ceil(targetAnnual / (blocksPerChamber × cyclesPerYear))',
    connectedTo: ['revenue-per-square-foot', 'biological-efficiency'],
    feeds: ['revenue-per-square-foot'],
  },

  // ── Economics ────────────────────────────────────────────
  {
    id: 'profit-per-block',
    title: 'Profit per Block',
    slug: 'profit-per-block',
    category: 'Economics',
    tier: 'free',
    description: 'The showcase: yield → revenue → margin → break-even and monthly net, all chained.',
    seoTitle: 'Mushroom Farm Profit Calculator — Profit per Block | Mycelocity',
    metaDescription:
      'The connected mushroom farm profit calculator and business profit calculator. Change one input — BE, price or cost — and watch yield, revenue, margin, break-even and monthly net profit recompute live.',
    intro:
      'Profit per block ties the whole model together. It takes your species, biological efficiency and substrate weight to derive yield, multiplies by price for revenue, subtracts COGS for margin, then scales by your monthly volume against fixed costs for monthly net profit and break-even. As a business calculator for profit it doubles as a margin calculator and an income calculator — margin cost (COGS) is the number that decides whether monthly income is positive at all. Change any single input and every downstream result recomputes instantly — this is the connected hub in action.',
    formula: 'revenue = yield_lb × price  ·  margin = revenue − COGS  ·  monthlyNet = margin × blocks − fixed  ·  breakeven = ceil(fixed / margin)',
    connectedTo: ['biological-efficiency', 'cogs-per-block', 'break-even', 'payback-roi'],
    feeds: ['break-even', 'revenue-per-square-foot', 'payback-roi'],
  },
  {
    id: 'break-even',
    title: 'Break-even',
    slug: 'break-even',
    category: 'Economics',
    tier: 'free',
    description: 'How many blocks and pounds you must sell each month to cover fixed costs.',
    seoTitle: 'Mushroom Break-even Calculator — Blocks & Pounds | Mycelocity',
    metaDescription:
      'Find your mushroom farm break-even point in blocks and pounds per month. Enter fixed costs and contribution margin per block to see exactly what you must sell.',
    intro:
      'Your break-even point is the production volume at which contribution margin exactly covers fixed costs — below it you lose money, above it you profit. This calculator divides monthly fixed costs by the contribution margin per block to give the blocks, and then pounds, you must sell each month — the rate calculator every new mushroom business calculator should start with before scaling up. Margin is shared live from Profit per Block.',
    formula: 'breakevenBlocks = fixed / margin  ·  breakevenLbs = breakevenBlocks × yield_lb',
    connectedTo: ['profit-per-block', 'cogs-per-block'],
    feeds: [],
  },
  {
    id: 'revenue-per-square-foot',
    title: 'Revenue per Square Foot',
    slug: 'revenue-per-square-foot',
    category: 'Economics',
    tier: 'free',
    description: 'The vertical-farming KPI: annual revenue per square foot of fruiting space.',
    seoTitle: 'Revenue per Square Foot Calculator — Mushroom Farming | Mycelocity',
    metaDescription:
      'Calculate annual revenue per square foot of mushroom fruiting space — a business revenue calculator and the key vertical-farming KPI. Combines blocks per chamber, cycles, yield and price.',
    intro:
      'Revenue per square foot is the headline KPI of vertical farming: it tells you how hard your fruiting space is working. This calculator multiplies blocks per chamber, cycles per year, yield per block and price into annual revenue, then divides by the fruiting footprint — a revenue calculator and price calculator combined, since both feed straight into the per-square-foot number. It reuses capacity and yield from the rest of the hub.',
    formula: 'annualRevenue = blocksPerChamber × cyclesPerYear × yield_lb × price  ·  revPerSqFt = annualRevenue / footprint',
    connectedTo: ['production-capacity', 'biological-efficiency', 'profit-per-block'],
    feeds: [],
  },

  // ── Finance ──────────────────────────────────────────────
  {
    id: 'startup-cost',
    title: 'Startup Cost',
    slug: 'startup-cost',
    category: 'Finance',
    tier: 'free',
    description: 'Total startup capital from itemized equipment, inventory, deposit and build-out.',
    seoTitle: 'Mushroom Farm Startup Cost Calculator — Total Capital | Mycelocity',
    metaDescription:
      'Estimate the startup cost of a mushroom farm with this free business calculator. Itemize equipment, substrate and spawn inventory, facility deposit, licensing and build-out into total capital needed.',
    intro:
      'How much capital does it take to start a mushroom farm? This calculator itemizes the major startup line items — equipment, initial substrate and spawn inventory, facility deposit, licensing and build-out — into a single total with a category breakdown. It works as a free business calculator and startup cost estimate calculator before you commit any capital. That total feeds the payback and ROI calculator.',
    formula: 'total = equipment + inventory + facilityDeposit + licensing + buildOut',
    connectedTo: ['payback-roi'],
    feeds: ['payback-roi'],
  },
  {
    id: 'payback-roi',
    title: 'Payback & ROI',
    slug: 'payback-roi',
    category: 'Finance',
    tier: 'free',
    description: 'Payback period, annual ROI and cash-on-cash return on your startup capital.',
    seoTitle: 'Mushroom Farm Payback & ROI Calculator | Mycelocity',
    metaDescription:
      'Free ROI calculator and return calculator for a mushroom farm. Combines total startup capital with monthly net profit to show months to payback and annual return on investment.',
    intro:
      'Payback and ROI translate operating profit into an investment return. This calculator takes your total startup capital and monthly net profit to compute how many months it takes to recover your investment, your annual return on investment, and your cash-on-cash return. It is the business ROI calculator and income calculator in the suite — one of the roi tools growers use to decide whether the income justifies the capital. Both inputs flow in automatically from Startup Cost and Profit per Block.',
    formula: 'paybackMonths = capital / monthlyNet  ·  ROI% = (annualNet / capital) × 100  ·  annualNet = monthlyNet × 12',
    connectedTo: ['startup-cost', 'profit-per-block'],
    feeds: [],
  },
];

export function getCalculator(slug: string): Calculator | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function calculatorsByCategory(category: Category): Calculator[] {
  return CALCULATORS.filter((c) => c.category === category);
}

export function calculatorById(id: string): Calculator | undefined {
  return CALCULATORS.find((c) => c.id === id);
}
