"use client";

import { REDUCED_MOTION, useMediaQuerySafe } from "@/lib/client-env";

/**
 * `prefers-reduced-motion`, read in a way that survives hydration.
 *
 * Framer Motion's own `useReducedMotion` already knows the answer on the very
 * first client render while the server rendered markup for the full-motion
 * branch — which React reports as a hydration mismatch. Reading through
 * `useSyncExternalStore` (see `lib/client-env.ts`) makes React use the server
 * snapshot (`false`) while hydrating and switch to the real preference
 * immediately afterwards.
 */
export function useReducedMotionSafe(): boolean {
  return useMediaQuerySafe(REDUCED_MOTION);
}
