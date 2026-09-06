"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { useEffect, useRef, useState } from "react";
import { Diamond, Flourish, Monogram } from "@/components/ui/Ornaments";
import { FloralOrnament } from "@/components/ui/Decor";
import { MaskedLine, Reveal } from "@/components/ui/Reveal";
import wedding from "@/data/wedding";
import { useI18n } from "@/lib/i18n";
import { surfaceVars, toneBand } from "@/lib/tones";
import { useMediaAvailability } from "@/lib/media";
import { useGate } from "@/lib/gate";

/**
 * The last frame — the film again, closing the invitation the way it opened.
 *
 * The same file as the hero, so nothing extra is downloaded, but it is held
 * paused until the section is actually on screen: a second video decoding
 * through the whole page is exactly the kind of thing that ruins a phone. The
 * photograph stands in whenever there is no film.
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
  const band = toneBand("closing");

  /* The film only runs while this section is in view. */
  const { video } = useMediaAvailability();
  const { opened } = useGate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const showFilm = opened && video && !reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el || !showFilm) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [showFilm]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (inView) {
      const attempt = el.play();
      if (attempt) attempt.catch(() => undefined);
    } else {
      el.pause();
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      aria-labelledby="closing-title"
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
      style={surfaceVars("closing")}
    >
      {/* The film, over the photograph that stands in for it */}
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
        {showFilm ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-[50%_40%] transition-opacity duration-[1400ms]"
            style={{ opacity: inView ? 1 : 0 }}
            src={wedding.media.heroVideo}
            poster={wedding.media.closingImage}
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
          />
        ) : null}
      </motion.div>

      {/* The photograph is lifted into the paper rather than sunk into black:
          an ivory scrim, a warm grade, then a champagne vignette. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 mix-blend-soft-light"
        style={{
          backgroundImage:
            "linear-gradient(170deg, rgba(255,247,228,0.9), rgba(233,220,196,0.3) 55%, rgba(150,122,80,0.4))",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(180deg, ${band.from} 0%, ${band.from}cc 14%, ${band.tone}b0 44%, ${band.tone}ee 80%, ${band.tone} 100%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(62% 46% at 50% 46%, rgba(253,249,240,0.85) 0%, rgba(253,249,240,0.2) 60%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(100% 74% at 50% 50%, transparent 40%, rgba(206,180,134,0.9) 100%)",
        }}
      />

      <FloralOrnament
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 hidden h-56 w-14 -translate-y-1/2 text-gold/35 sm:block"
      />
      <FloralOrnament
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 hidden h-56 w-14 -translate-y-1/2 -scale-x-100 text-gold/35 sm:block"
      />

      <div className="relative flex w-full max-w-2xl flex-col items-center px-6 py-28 text-center sm:px-10">
        <Reveal duration={1.4}>
          <Monogram className="h-14 w-14 text-gold/80" />
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

        <Reveal delay={0.35} className="mt-8 flex items-center gap-4 text-gold/80">
          <span className="hairline h-px w-12" />
          <Diamond className="h-2 w-2" />
          <span className="hairline h-px w-12" />
        </Reveal>

        <Reveal delay={0.45} className="mt-8">
          <p className="text-[clamp(0.85rem,3vw,1.05rem)] font-light uppercase tracking-[0.42em] text-ink">
            {wedding.date.short}
          </p>
        </Reveal>

        <Reveal delay={0.6} className="mt-12">
          <p className="display measure text-[clamp(1.15rem,3.8vw,1.6rem)] font-light italic leading-[1.6] text-ink">
            {t.closing.message}
          </p>
        </Reveal>

        <Reveal delay={0.75} className="mt-14">
          <Flourish className="h-3 w-48 text-gold/65" />
        </Reveal>

        <Reveal delay={0.85} className="mt-8">
          <p className="text-[0.65rem] font-light uppercase tracking-[0.3em] text-mute">
            {t.closing.thanks}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default ClosingSection;
