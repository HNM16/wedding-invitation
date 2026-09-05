"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "sino-sayora:opened";

/* ───────────────────────────────────────────────────────────────────────────
   "Has this guest already opened the envelope?" is stored for the session, so
   the ceremony plays once rather than on every reload. Read through
   useSyncExternalStore: React uses the server snapshot (false) while hydrating
   and the real answer immediately after, which keeps hydration silent.
   ─────────────────────────────────────────────────────────────────────────── */

let alreadyOpened: boolean | null = null;
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): boolean {
  if (alreadyOpened === null) alreadyOpened = read();
  return alreadyOpened;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Records the opening for the next page load only.
 *
 * Deliberately does not touch the in-memory snapshot or notify subscribers:
 * flipping `showEnvelope` mid-ceremony would unmount the envelope the instant
 * the reveal began, cutting the card's expansion short. Within this page load
 * the envelope owns its own exit.
 */
function remember() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private mode — the envelope simply plays again next time */
  }
}

/**
 * Clears the "already opened" flag and reloads, so the envelope ceremony can be
 * replayed. Exposed on `window` for development, and triggered automatically by
 * a `#replay` hash so the sequence can be demoed from a plain link.
 */
function reset() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  alreadyOpened = false;
  window.location.hash = "";
  window.location.reload();
}

type GateValue = {
  /** True once the invitation has been revealed and the page is interactive. */
  opened: boolean;
  /** True when the envelope ceremony should be shown at all. */
  showEnvelope: boolean;
  /** Called by the envelope when the reveal finishes. */
  open: () => void;
};

const GateContext = createContext<GateValue | null>(null);

export function GateProvider({ children }: { children: ReactNode }) {
  const seenBefore = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [openedNow, setOpenedNow] = useState(false);

  const open = useCallback(() => {
    setOpenedNow(true);
    remember();
  }, []);

  /* Two ways to replay the ceremony while working on it: put `#replay` in the
     URL, or call `__resetInvitation()` from the console. The hash is also
     watched, because adding it to the address bar of a page that is already
     open is a same-document navigation and would otherwise do nothing. */
  useEffect(() => {
    const w = window as Window & { __resetInvitation?: () => void };
    w.__resetInvitation = reset;

    const check = () => {
      if (window.location.hash === "#replay") reset();
    };
    check();
    window.addEventListener("hashchange", check);

    return () => {
      window.removeEventListener("hashchange", check);
      delete w.__resetInvitation;
    };
  }, []);

  const value = useMemo<GateValue>(
    () => ({
      opened: openedNow || seenBefore,
      showEnvelope: !seenBefore,
      open,
    }),
    [openedNow, seenBefore, open],
  );

  return <GateContext.Provider value={value}>{children}</GateContext.Provider>;
}

export function useGate(): GateValue {
  const ctx = useContext(GateContext);
  if (!ctx) throw new Error("useGate must be used inside <GateProvider>");
  return ctx;
}

export { reset as resetInvitation };
