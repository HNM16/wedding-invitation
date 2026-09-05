"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  translations,
  type Language,
  type Translation,
} from "@/data/translations";

const STORAGE_KEY = "sino-sayora:lang";

function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((l) => l.code === value);
}

/* ───────────────────────────────────────────────────────────────────────────
   The chosen language is a tiny external store rather than component state.
   React renders the server snapshot (always Tajik, the default) during
   hydration and then swaps to the stored preference — so a returning guest
   keeps their language without a hydration mismatch or a flash of state set
   from inside an effect.
   ─────────────────────────────────────────────────────────────────────────── */

let current: Language | null = null;
const listeners = new Set<() => void>();

function readStored(): Language {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
    /* private mode / storage disabled — fall back to the default */
  }
  return DEFAULT_LANGUAGE;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): Language {
  if (current === null) current = readStored();
  return current;
}

function getServerSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

function writeLanguage(next: Language) {
  if (current === next) return;
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  for (const listener of listeners) listener();
}

type I18nValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translation;
  /** Formats a date with the active language's month names and template. */
  formatDate: (
    day: string | number,
    month: string | number,
    year: string | number,
  ) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setLang = useCallback((next: Language) => writeLanguage(next), []);

  /* Keep the document language in step for screen readers and hyphenation. */
  useEffect(() => {
    const entry = LANGUAGES.find((l) => l.code === lang);
    if (entry) document.documentElement.lang = entry.htmlLang;
  }, [lang]);

  const value = useMemo<I18nValue>(() => {
    const t = translations[lang];
    return {
      lang,
      setLang,
      t,
      formatDate: (day, month, year) => {
        const monthName = t.common.months[Number(month) - 1] ?? String(month);
        return t.common.dateFormat
          .replace("{d}", String(Number(day)))
          .replace("{m}", monthName)
          .replace("{y}", String(year));
      },
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export { LANGUAGES, type Language };
