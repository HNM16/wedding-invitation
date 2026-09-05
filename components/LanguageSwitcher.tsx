"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { LANGUAGES, useI18n } from "@/lib/i18n";
import { EASE_EDITORIAL } from "@/lib/motion";

/**
 * TJ / RU / EN. Tajik is the default and always sits first.
 * The active language is marked by a gold lozenge that slides between the
 * options (shared layout animation), not by a colour swap alone.
 */
export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const reduced = useReducedMotionSafe();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 1.4, ease: EASE_EDITORIAL }}
      aria-label={t.common.languageSwitcher}
      className="fixed right-[max(1.25rem,env(safe-area-inset-right))] top-[max(1.25rem,env(safe-area-inset-top))] z-[95]"
    >
      <ul className="flex items-center gap-0.5 rounded-full border border-gold/35 bg-paper/75 p-1 shadow-[0_10px_26px_-20px_rgba(96,74,42,0.65)] backdrop-blur-md">
        {LANGUAGES.map((item) => {
          const active = item.code === lang;
          return (
            <li key={item.code}>
              <button
                type="button"
                onClick={() => setLang(item.code)}
                lang={item.htmlLang}
                aria-current={active ? "true" : undefined}
                title={item.name}
                className={`relative flex h-9 min-w-11 items-center justify-center rounded-full px-3 text-[0.6875rem] font-medium tracking-[0.2em] transition-colors duration-500 ${
                  active
                    ? "text-gold-deep"
                    : "text-mute hover:text-ink"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="lang-pill"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-gold/45"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, rgba(255,253,247,0.95), rgba(233,220,196,0.9))",
                    }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { duration: 0.7, ease: EASE_EDITORIAL }
                    }
                  />
                ) : null}
                <span className="relative">{item.short}</span>
                <span className="sr-only"> — {item.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}

export default LanguageSwitcher;
