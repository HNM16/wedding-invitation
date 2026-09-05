"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { useCallback, useEffect } from "react";
import { CornerBracket, Flourish, Monogram } from "@/components/ui/Ornaments";
import wedding from "@/data/wedding";
import { useAudio } from "@/lib/audio";
import { useGate } from "@/lib/gate";
import { useI18n } from "@/lib/i18n";
import { useScrollLock } from "@/lib/scroll-lock";
import { EASE_EDITORIAL, EASE_VEIL } from "@/lib/motion";

/**
 * The sealed envelope.
 *
 * Beyond the theatre, this solves autoplay honestly: browsers only allow sound
 * after a gesture, so the music begins on the guest's own tap to open the
 * invitation rather than being forced past the browser's restrictions.
 *
 * The page content is fully rendered underneath (crawlable, and one tap away),
 * only scrolling is held while the veil is closed.
 */
export function OpeningVeil() {
  const { t, formatDate } = useI18n();
  const { available, play } = useAudio();
  const { opened, open } = useGate();
  const reduced = useReducedMotionSafe();

  useScrollLock(!opened);

  const handleOpen = useCallback(() => {
    open();
    if (available) play();
  }, [available, open, play]);

  /* Escape lifts the veil too, so the invitation is never a trap. */
  useEffect(() => {
    if (opened) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleOpen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleOpen, opened]);

  const date = formatDate(
    wedding.date.day,
    wedding.date.month,
    wedding.date.year,
  );

  return (
    <AnimatePresence>
      {!opened ? (
        <motion.div
          key="veil"
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-noir"
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.5 } }
              : { opacity: 0, transition: { duration: 1.1, delay: 0.65, ease: EASE_VEIL } }
          }
        >
          {/* Two panels part like a curtain */}
          {!reduced ? (
            <>
              <motion.span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1/2 bg-noir"
                exit={{ x: "-101%", transition: { duration: 1.5, ease: EASE_VEIL } }}
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #060403 0%, #0d0a07 100%)",
                }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute inset-y-0 right-0 w-1/2"
                exit={{ x: "101%", transition: { duration: 1.5, ease: EASE_VEIL } }}
                style={{
                  backgroundImage:
                    "linear-gradient(270deg, #060403 0%, #0d0a07 100%)",
                }}
              />
              {/* The seam glints as the curtain opens */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, transparent, rgba(194,160,92,0.2), transparent)",
                }}
                exit={{ opacity: 0, scaleY: 1.4, transition: { duration: 0.9 } }}
              />
            </>
          ) : null}

          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(70% 55% at 50% 45%, rgba(53,39,27,0.5), transparent 70%)",
            }}
          />

          {/* Frame */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-5 text-gold/30 sm:inset-8"
          >
            <CornerBracket className="absolute left-0 top-0 h-8 w-8" />
            <CornerBracket className="absolute right-0 top-0 h-8 w-8 rotate-90" />
            <CornerBracket className="absolute bottom-0 right-0 h-8 w-8 rotate-180" />
            <CornerBracket className="absolute bottom-0 left-0 h-8 w-8 -rotate-90" />
          </div>

          <motion.div
            className="relative z-10 flex w-full max-w-md flex-col items-center px-8 text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.25, ease: EASE_EDITORIAL }}
            exit={{
              opacity: 0,
              y: reduced ? 0 : -22,
              transition: { duration: 0.6, ease: EASE_EDITORIAL },
            }}
          >
            <Monogram className="h-16 w-16 text-gold/70" />

            <p className="eyebrow mt-8">{t.preloader.label}</p>

            <p className="display gold-leaf mt-5 text-[clamp(2.4rem,11vw,3.6rem)] leading-[1.05]">
              {wedding.couple.groom}
              <span className="gold-leaf-fine mx-2 italic opacity-80">
                {wedding.couple.connector}
              </span>
              {wedding.couple.bride}
            </p>
            <p className="sr-only">{t.preloader.subtitle}</p>

            <Flourish className="mt-6 h-3 w-40 text-gold/55" />

            <p className="mt-6 text-[0.72rem] font-light uppercase tracking-[0.3em] text-sand/75">
              {date}
            </p>

            <button
              type="button"
              onClick={handleOpen}
              className="btn-gold mt-11 w-full sm:w-auto"
            >
              <span>{t.preloader.open}</span>
            </button>

            {available ? (
              <p className="mt-5 text-[0.65rem] font-light tracking-[0.16em] text-mute">
                {t.preloader.hint}
              </p>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default OpeningVeil;
