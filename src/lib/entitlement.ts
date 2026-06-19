import type { Tier } from '@/lib/calculators';

/**
 * Single choke-point for feature gating. In v1 EVERYTHING is unlocked.
 *
 * The free/paid wall bolts on later by changing only this hook — do not scatter
 * tier checks through the components. Calculator pages ask `canAccess(tier)`
 * and gate UI on the result; today it is always `true`.
 */
export interface Entitlement {
  tier: 'free' | 'pro';
  isPro: boolean;
  /** Whether the current user can access a calculator of the given tier. */
  canAccess: (required: Tier) => boolean;
}

export function useEntitlement(): Entitlement {
  // v1: always free + unlocked. Later: read auth/subscription state here.
  return {
    tier: 'free',
    isPro: false,
    canAccess: () => true,
  };
}
