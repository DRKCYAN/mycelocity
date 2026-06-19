import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $inputs, DEFAULT_INPUTS, type GrowProfile } from '@/store/inputs';

/**
 * React binding for the shared input store.
 *
 * Why not use `useStore($inputs)` directly? Each island is server-rendered with
 * the DEFAULT profile, but the client store may already hold values carried
 * over from a previous page (the store persists across in-session navigation).
 * Reading the live store on the very first client render would then disagree
 * with the server markup and trigger a hydration mismatch.
 *
 * So we render DEFAULT_INPUTS on the first client render (matching the server),
 * then switch to the live store immediately after mount. The result: no
 * hydration warnings, and shared values still flow in a tick later.
 */
export function useInputs(): GrowProfile {
  const live = useStore($inputs);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated ? live : DEFAULT_INPUTS;
}
