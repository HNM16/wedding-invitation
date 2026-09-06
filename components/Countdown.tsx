"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { useEffect, useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Blossom, DecorativeRing } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import wedding from "@/data/wedding";
import { getTimeLeft, pad, type TimeLeft } from "@/lib/countdown";
import { useI18n } from "@/lib/i18n";
import { EASE_EDITORIAL } from "@/lib/motion";

/**
 * Countdown to 19 September 2026, 17:30 Asia/Dushanbe.
 *
 * The target is an absolute instant, so the remaining time is the same for a
 * guest anywhere in the world. Values are only rendered after mount (the server
 * has no "now"), which also keeps hydration silent.
 */
export function Countdown() {
  const { t } = useI18n();
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setTime(getTimeLeft());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const finished = time?.finished ?? false;

  const units = [
    { key: "days", label: t.countdown.units.days, value: time?.days ?? 0 },
    { key: "hours", label: t.countdown.units.hours, value: time?.hours ?? 0 },
    { key: "minutes", label: t.countdown.units.minutes, value: time?.minutes ?? 0 },
    { key: "seconds", label: t.countdown.units.seconds, value: time?.seconds ?? 0 },
  ];

  return (
    <Section id="countdown" labelledBy="countdown-title" light="top">
      <SectionHeading
        id="countdown-title"
        eyebrow={t.countdown.eyebrow}
        title={finished ? t.countdown.finishedTitle : t.countdown.title}
        motif="diamond"
      />

      <Reveal delay={0.2} className="mt-14 sm:mt-16">
        {finished ? (
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <DecorativeRing className="h-8 w-12 text-gold/80" />
            <p className="display mt-8 text-[clamp(1.1rem,3.4vw,1.5rem)] font-light leading-relaxed text-ink">
              {t.countdown.finishedText}
            </p>
          </div>
        ) : (
          <div className="relative mx-auto max-w-3xl">
            {/* Hairline plate */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[-1rem] inset-y-[-2rem] border-y border-gold/38 sm:inset-x-[-2rem]"
            />

            <ol
              className="relative grid grid-cols-4"
              aria-label={`${t.countdown.eyebrow}: ${time ? `${time.days} ${t.countdown.units.days}` : ""}`}
            >
              {units.map((unit, i) => (
                <li
                  key={unit.key}
                  className={`relative flex flex-col items-center px-1 ${
                    i > 0 ? "border-l border-gold/38" : ""
                  }`}
                >
                  <span
                    className="display block text-[clamp(2rem,10vw,4.5rem)] leading-none lining-nums tabular-nums"
                    style={{ opacity: time ? 1 : 0, transition: "opacity .8s" }}
                  >
                    <RollingNumber value={unit.value} />
                  </span>

                  <span className="eyebrow mt-4 text-[0.5rem] sm:mt-5 sm:text-[0.625rem]">
                    {unit.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Reveal>

      {!finished ? (
        <Reveal delay={0.4} className="mt-16 flex items-center justify-center gap-4 sm:mt-20">
          <span className="hairline h-px w-10" />
          <p className="text-[0.65rem] font-light uppercase tracking-[0.3em] text-ink-soft/85">
            {wedding.date.short}
          </p>
          <Blossom className="h-3.5 w-3.5 text-gold/80" />
          <p className="text-[0.65rem] font-light uppercase tracking-[0.3em] text-ink-soft/85">
            {wedding.date.time}
          </p>
          <span className="hairline h-px w-10" />
        </Reveal>
      ) : null}
    </Section>
  );
}

/**
 * Swaps the digits with a short vertical slide whenever the value changes.
 * Only the unit that actually changed re-animates, so the seconds column is the
 * only thing moving most of the time.
 */
function RollingNumber({ value }: { value: number }) {
  const reduced = useReducedMotionSafe();
  const text = pad(value);

  if (reduced) return <span className="gold-leaf">{text}</span>;

  return (
    <span className="relative inline-flex justify-center overflow-hidden">
      {/* Reserves the width so the column never jitters between values. */}
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={text}
          className="gold-leaf absolute inset-0 flex items-center justify-center"
          initial={{ y: "58%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-58%", opacity: 0 }}
          transition={{ duration: 0.62, ease: EASE_EDITORIAL }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default Countdown;
