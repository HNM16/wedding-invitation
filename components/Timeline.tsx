"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { useRef } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Diamond } from "@/components/ui/Ornaments";
import { Reveal } from "@/components/ui/Reveal";
import wedding from "@/data/wedding";
import { useI18n } from "@/lib/i18n";
import { EASE_EDITORIAL, viewportOnce } from "@/lib/motion";

/**
 * The evening, set as a vertical editorial timeline.
 *
 * Event times come from `wedding.timeline` in `data/wedding.ts`; the titles and
 * descriptions for each id are translated in `data/translations.ts`. Only the
 * arrival time is confirmed — the rest are marked as placeholders in the data
 * file and the section carries an honest note to that effect.
 */
export function Timeline() {
  const { t } = useI18n();
  const reduced = useReducedMotionSafe();
  const trackRef = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 78%", "end 62%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    restDelta: 0.001,
  });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <Section id="timeline" labelledBy="timeline-title">
      <SectionHeading
        id="timeline-title"
        eyebrow={t.timeline.eyebrow}
        title={t.timeline.title}
        crest="blossom"
        motif="blossom"
      />

      <ol
        ref={trackRef}
        className="relative mx-auto mt-16 max-w-4xl sm:mt-20"
      >
        {/* The track: a dim rail with a gold thread that fills on scroll */}
        <span
          aria-hidden="true"
          className="absolute left-[0.4375rem] top-2 h-[calc(100%-1rem)] w-px bg-gold/10 lg:left-1/2 lg:-translate-x-1/2"
        />
        <motion.span
          aria-hidden="true"
          className="absolute left-[0.4375rem] top-2 h-[calc(100%-1rem)] w-px origin-top lg:left-1/2 lg:-translate-x-1/2"
          style={{
            scaleY: reduced ? 1 : scaleY,
            backgroundImage:
              "linear-gradient(180deg, rgba(194,160,92,0.15), rgba(216,190,134,0.85), rgba(194,160,92,0.15))",
          }}
        />

        {wedding.timeline.map((event, index) => {
          const copy = t.timeline.events[event.id as keyof typeof t.timeline.events];
          const left = index % 2 === 0;

          return (
            <li
              key={event.id}
              className="relative pb-14 pl-9 last:pb-0 lg:pl-0"
            >
              {/* Marker */}
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-1 flex h-3.5 w-3.5 items-center justify-center text-gold lg:left-1/2 lg:-translate-x-1/2"
                initial={{ opacity: 0, scale: reduced ? 1 : 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.9, ease: EASE_EDITORIAL }}
              >
                <span className="absolute inset-0 rounded-full bg-paper" />
                <Diamond className="relative h-3.5 w-3.5" />
              </motion.span>

              <div
                className={`lg:grid lg:grid-cols-2 lg:gap-16 ${
                  left ? "" : "lg:[&>*:first-child]:col-start-2"
                }`}
              >
                <motion.div
                  className={`${left ? "lg:pr-4 lg:text-right" : "lg:pl-4 lg:text-left"}`}
                  initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 1.25, ease: EASE_EDITORIAL }}
                >
                  <p className="display gold-leaf text-[clamp(1.65rem,5.5vw,2.6rem)] leading-none lining-nums tabular-nums">
                    {event.time}
                  </p>

                  <h3 className="display mt-4 text-[clamp(1.1rem,3.4vw,1.45rem)] font-light tracking-wide text-ink">
                    {copy.title}
                  </h3>

                  <p className="mt-3 max-w-sm text-[0.9rem] font-light leading-[1.85] text-ink-soft/90 lg:max-w-none">
                    {copy.description}
                  </p>

                  {!event.confirmed ? (
                    <span className="sr-only">{t.timeline.note}</span>
                  ) : null}
                </motion.div>
              </div>
            </li>
          );
        })}
      </ol>

      <Reveal delay={0.2} className="mt-14 flex flex-col items-center gap-4 text-center">
        <span className="hairline h-px w-24" />
        <p className="max-w-md text-[0.7rem] font-light leading-relaxed tracking-[0.08em] text-mute">
          {t.timeline.note}
        </p>
      </Reveal>
    </Section>
  );
}

export default Timeline;
