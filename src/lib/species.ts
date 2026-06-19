// Species preset table. Reasonable defaults — fully user-overridable.
// Selecting a species sets BE, price, and spawn ratio globally in the store.

export interface SpeciesPreset {
  id: string;
  name: string;
  /** Biological efficiency, percent. */
  be: number;
  /** Fresh market price, USD per pound. */
  pricePerLb: number;
  /** Spawn ratio denominator N, as in 1:N. */
  spawnRatio: number;
  /** Full cycle length: colonization + fruiting + turnaround, in days. */
  cycleDays: number;
}

export const SPECIES: SpeciesPreset[] = [
  { id: 'oyster', name: 'Oyster', be: 85, pricePerLb: 8, spawnRatio: 5, cycleDays: 28 },
  { id: 'lions-mane', name: "Lion's mane", be: 60, pricePerLb: 20, spawnRatio: 5, cycleDays: 42 },
  { id: 'shiitake', name: 'Shiitake', be: 70, pricePerLb: 14, spawnRatio: 8, cycleDays: 70 },
  { id: 'king-oyster', name: 'King oyster', be: 65, pricePerLb: 16, spawnRatio: 5, cycleDays: 35 },
];

export function getSpecies(id: string): SpeciesPreset | undefined {
  return SPECIES.find((s) => s.id === id);
}
