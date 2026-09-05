"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { useRef } from "react";
import { Diamond, Flourish, Monogram } from "@/components/ui/Ornaments";
import { MaskedLine, Reveal } from "@/components/ui/Reveal";
import wedding from "@/data/wedding";
import { useI18n } from "@/lib/i18n";

/**
 * The last frame: a full-bleed photograph sunk almost to black, the names in
 * gold, the date, and a closing line. The page ends on an ornament rather than
 * a footer bar.
 */
export function ClosingSection() {
  const { t } = useI18n();
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <section
      ref={ref}
      aria-labelledby="closing-title"
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
    >
      {/* Photograph */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={reduced ? { y: 0, scale: 1 } : { y, scale }}
      >
        <Image
          src={wedding.media.closingImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_40%]"
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(9,7,5,0.96) 0%, rgba(9,7,5,0.7) 30%, rgba(9,7,5,0.78) 70%, rgba(6,4,3,0.98) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(95% 70% at 50% 50%, transparent 30%, rgba(4,3,2,0.72) 100%)",
        }}
      />

      <div className="relative flex w-full max-w-2xl flex-col items-center px-6 py-28 text-center sm:px-10">
        <Reveal duration={1.4}>
          <Monogram className="h-14 w-14 text-gold/60" />
        </Reveal>

        <MaskedLine className="mt-10" delay={0.15} duration={1.5}>
          <h2
            id="closing-title"
            className="display gold-leaf inline-block pb-[0.08em] text-[clamp(2.4rem,12vw,6rem)] leading-[1.02]"
          >
            {wedding.couple.groom}
            <span className="gold-leaf-fine mx-3 italic opacity-80 sm:mx-5">
              {wedding.couple.connector}
            </span>
            {wedding.couple.bride}
          </h2>
        </MaskedLine>

        <Reveal delay={0.35} className="mt-8 flex items-center gap-4 text-gold/70">
          <span className="hairline h-px w-12" />
          <Diamond className="h-2 w-2" />
          <span className="hairline h-px w-12" />
        </Reveal>

        <Reveal delay={0.45} className="mt-8">
          <p className="text-[clamp(0.85rem,3vw,1.05rem)] font-light uppercase tracking-[0.42em] text-ivory/90">
            {wedding.date.short}
          </p>
        </Reveal>

        <Reveal delay={0.6} className="mt-12">
          <p className="display measure text-[clamp(1.15rem,3.8vw,1.6rem)] font-light italic leading-[1.6] text-ivory/85">
            {t.closing.message}
          </p>
        </Reveal>

        <Reveal delay={0.75} className="mt-14">
          <Flourish className="h-3 w-48 text-gold/45" />
        </Reveal>

        <Reveal delay={0.85} className="mt-8">
          <p className="text-[0.65rem] font-light uppercase tracking-[0.3em] text-sand/60">
            {t.closing.thanks}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default ClosingSection;
