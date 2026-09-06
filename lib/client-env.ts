"use client";

import { useSyncExternalStore } from "react";

/**
 * Client-environment questions — screen width, motion preference, whether the
 * connection is metered — read in a way that survives hydration.
 *
 * All of them go through `useSyncExternalStore`: React uses the server
 * snapshot while hydrating and the real answer immediately afterwards, so the
 * markup never disagrees with itself and nothing is set from inside an effect.
 */

function subscribeMedia(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };
}

/** Matches a media query. Renders as `false` on the server. */
export function useMediaQuerySafe(query: string): boolean {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
