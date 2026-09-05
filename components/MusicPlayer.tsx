"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { useAudio } from "@/lib/audio";
import { useI18n } from "@/lib/i18n";
import { EASE_EDITORIAL } from "@/lib/motion";

const BARS = [0, 0.22, 0.44, 0.16];

/**
 * Floating music control — bottom-left so it never sits under the language
 * switcher or over a section's headline, and clear of the RSVP submit button.
 * Renders nothing at all when no music file has been added.
 */
export function MusicPlayer() {
  const { available, playing, toggle } = useAudio();
  const { t } = useI18n();
  const reduced = useReducedMotionSafe();

  if (!available) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 1.4, ease: EASE_EDITORIAL }}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-[max(1.25rem,env(safe-area-inset-left))] z-50"
    >
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? t.music.pause : t.music.play}
        className="group relative flex items-center justify-center rounded-full border border-gold/25 bg-noir/55 backdrop-blur-md transition-colors duration-700 hover:border-gold/55"
        style={{ height: "3.25rem", width: "3.25rem" }}
      >
        {/* Slow halo while the music plays */}
        {playing && !reduced ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-gold/40"
            style={{ animation: "pulse-ring 3.4s ease-out infinite" }}
          />
        ) : null}

        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(closest-side, rgba(194,160,92,0.18), transparent 70%)",
          }}
        />

        {playing ? (
          <span
            aria-hidden="true"
            className="relative flex h-4 items-end gap-[3px]"
          >
            {BARS.map((delay, i) => (
              <span
                key={i}
                className="w-[2px] origin-bottom rounded-full bg-champagne/90"
                style={{
                  height: "100%",
                  animation: reduced
                    ? undefined
                    : `eq-bar ${1.1 + i * 0.13}s ease-in-out ${delay}s infinite`,
                  transform: reduced ? "scaleY(0.7)" : undefined,
                }}
              />
            ))}
          </span>
        ) : (
          <svg
            viewBox="0 0 14 16"
            aria-hidden="true"
            className="relative ml-[2px] h-4 w-4 fill-champagne/85"
          >
            <path d="M1 1.4c0-.8.9-1.3 1.6-.9l10 5.6c.7.4.7 1.4 0 1.8l-10 5.6c-.7.4-1.6-.1-1.6-.9V1.4Z" />
          </svg>
        )}
      </button>
    </motion.div>
  );
}

export default MusicPlayer;
