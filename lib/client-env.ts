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

type Connection = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

function connection(): Connection | undefined {
  return (navigator as Navigator & { connection?: Connection }).connection;
}

function subscribeConnection(callback: () => void) {
  const c = connection();
  c?.addEventListener?.("change", callback);
  return () => c?.removeEventListener?.("change", callback);
}

function readFrugal() {
  const c = connection();
  if (!c) return false;
  if (c.saveData === true) return true;
  return /^(slow-2g|2g|3g)$/.test(c.effectiveType ?? "");
}

/**
 * True when the guest has asked to save data, or is on a slow connection.
 *
 * The server snapshot is `true` on purpose: the page renders as if data were
 * precious, and only opts into the background film once the client confirms it
 * is welcome.
 */
export function usePrefersFrugalData(): boolean {
  return useSyncExternalStore(subscribeConnection, readFrugal, () => true);
}
