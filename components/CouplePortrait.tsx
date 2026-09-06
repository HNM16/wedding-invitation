"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Section } from "@/components/ui/Section";
import { Blossom, DecorativeRing, FloralOrnament, GoldDivider } from "@/components/ui/Decor";
import { MaskedLine, Reveal } from "@/components/ui/Reveal";
import wedding from "@/data/wedding";
import { useI18n } from "@/lib/i18n";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { EASE_EDITORIAL, viewportOnce } from "@/lib/motion";

/**
 * One photograph, treated the way a fine invitation treats its single portrait:
 * mounted on cream board inside a gold rule, with botanical sprigs in the
 * margins and the couple's names set beneath it.
 */
export function CouplePortrait() {
  const { t } = useI18n();
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const portrait = wedding.media.portrait;

  return (
    <Section
      id="couple"
      labelledBy="couple-title"
      className="overflow-hidden"
      light="left"
    >
      <div className="flex flex-col items-center">
        <Reveal duration={1.1}>
          <DecorativeRing className="h-7 w-11 text-gold/70" />
        </Reveal>

        <Reveal delay={0.1} className="mt-6">
          <p className="eyebrow">{t.couple.eyebrow}</p>
        </Reveal>

        <MaskedLine className="mt-5" delay={0.18}>
          <h2
            id="couple-title"
            className="display gold-leaf inline-block pb-[0.12em] text-[clamp(2.1rem,6.2vw,3.6rem)] leading-[1.08]"
          >
            {t.couple.title}
          </h2>
        </MaskedLine>

        {/* ── The plate ────────────────────────────────────────────────── */}
        <div ref={ref} className="relative mt-14 w-full max-w-[34rem] sm:mt-16">
          {/* Sprigs in the margins — desktop only, where there is room */}
          <FloralOrnament
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 top-10 hidden h-52 w-14 text-gold/40 lg:block"
          />
          <FloralOrnament
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 bottom-10 hidden h-52 w-14 -scale-x-100 text-gold/40 lg:block"
          />

          <motion.figure
            className="plate vignette relative overflow-hidden"
            style={{ aspectRatio: "4 / 5" }}
            initial={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.9, ease: EASE_EDITORIAL }}
          >
            <motion.div
              className="absolute inset-[-6%]"
              style={reduced ? { y: 0 } : { y: imageY }}
            >
              <Image
                src={portrait.src}
                alt=""
                fill
                sizes="(min-width: 640px) 34rem, 100vw"
                className="object-cover"
              />
            </motion.div>

            {/* Warm print grade so the photograph sits inside the palette */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mix-blend-soft-light"
              style={{
                backgroundImage:
                  "linear-gradient(200deg, rgba(255,244,220,0.5), transparent 55%, rgba(120,94,54,0.35))",
              }}
            />
            {/* Inner gold rule, printed on the photograph */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-3 border border-[rgba(255,247,228,0.35)] sm:inset-4"
            />
          </motion.figure>

          {/* Caption plate, overlapping the photograph's lower edge */}
          <Reveal delay={0.25} y={18}>
            <div className="relative z-10 mx-auto -mt-8 w-[min(20rem,82%)] bg-paper px-6 py-5 text-center shadow-[0_18px_40px_-30px_rgba(96,74,42,0.7)] sm:-mt-10 sm:py-6">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 border border-gold/28"
              />
              <p className="display gold-leaf-fine text-[clamp(1.25rem,4.6vw,1.7rem)]">
                {t.couplePhoto.caption}
              </p>
              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="hairline h-px w-8" />
                <Blossom className="h-3 w-3 text-gold/70" />
                <span className="hairline h-px w-8" />
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── The line beneath ─────────────────────────────────────────── */}
        <Reveal delay={0.2} className="mt-14 flex flex-col items-center sm:mt-16">
          <p className="measure display text-center text-[clamp(1.15rem,3.6vw,1.5rem)] font-light italic leading-[1.6] text-ink">
            {t.couple.quote}
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-10 flex items-center gap-8">
          <div className="text-right">
            <p className="eyebrow">{t.couple.groom}</p>
            <p className="display gold-leaf-fine mt-2 text-[clamp(1.3rem,4vw,1.8rem)]">
              {wedding.couple.groom}
            </p>
          </div>
          <DecorativeRing className="h-6 w-10 shrink-0 text-gold/70" />
          <div className="text-left">
            <p className="eyebrow">{t.couple.bride}</p>
            <p className="display gold-leaf-fine mt-2 text-[clamp(1.3rem,4vw,1.8rem)]">
              {wedding.couple.bride}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4} className="mt-14">
          <GoldDivider motif="leaf" width="min(16rem, 50vw)" />
        </Reveal>
      </div>
    </Section>
  );
}

export default CouplePortrait;
