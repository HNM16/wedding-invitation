"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * `prefers-reduced-motion`, read in a way that survives hydration.
 *
 * Framer Motion's own `useReducedMotion` already knows the answer on the very
 * first client render while the server rendered markup for the full-motion
 * branch — which React reports as a hydration mismatch. Reading through
 * `useSyncExternalStore` makes React use the server snapshot (`false`) while
 * hydrating and switch to the real preference immediately afterwards.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
