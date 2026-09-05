"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type GateValue = {
  /** True once the guest has opened the invitation. */
  opened: boolean;
  open: () => void;
};

const GateContext = createContext<GateValue | null>(null);

/**
 * Tracks whether the opening veil has been lifted, so the hero can hold its
 * entrance until the curtain is actually out of the way.
 */
export function GateProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const open = useCallback(() => setOpened(true), []);
  const value = useMemo(() => ({ opened, open }), [opened, open]);
  return <GateContext.Provider value={value}>{children}</GateContext.Provider>;
}

export function useGate(): GateValue {
  const ctx = useContext(GateContext);
  if (!ctx) throw new Error("useGate must be used inside <GateProvider>");
  return ctx;
}
