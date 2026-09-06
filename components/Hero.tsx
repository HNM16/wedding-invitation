"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { useEffect, useRef, useState } from "react";
import { DecorativeRing } from "@/components/ui/Decor";
import wedding from "@/data/wedding";
import { useGate } from "@/lib/gate";
import { useHeroVideo } from "@/lib/hero-video";
import { useI18n } from "@/lib/i18n";
import { toneBand } from "@/lib/tones";
import { EASE_EDITORIAL } from "@/lib/motion";

/**
 * Fullscreen cinematic opening.
 *
 * Media strategy: the poster image is always painted first (it is the LCP
 * element and ships with `priority`), and the film fades in on top once it can
 * actually play. `useHeroVideo` decides whether to play one at all and which
 * cut to use — see the reasons there. Every "no" simply leaves the still
 * photograph, never a black rectangle or a broken player.
 */
export function Hero() {
  const { t, formatDate } = useI18n();
  const { opened } = useGate();
  const reduced = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { src: videoSrc } = useHeroVideo();
  const [videoReady, setVideoReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);

  /* Some mobile browsers need an explicit play() even with the autoplay
     attribute; a refusal is fine — the poster stays. */
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoSrc) return;
    const attempt = el.play();
    if (attempt) attempt.catch(() => undefined);
  }, [videoSrc]);

  const date = formatDate(wedding.date.day, wedding.date.month, wedding.date.year);
  const show = opened;
  /* The hero settles into whatever tone the next section is printed on, so the
     film joins the paper instead of stopping at an edge. */
  const band = toneBand("hero");

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden"
    >
      {/* ── Media ─────────────────────────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={reduced ? { y: 0, scale: 1 } : { y: mediaY, scale: mediaScale }}
      >
        <div
          className="absolute inset-0"
          style={
            reduced
              ? undefined
              : { animation: "ken-burns 34s ease-in-out infinite alternate" }
          }
        >
          <Image
            src={wedding.media.heroPoster}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />

          {videoSrc ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover object-[50%_35%] transition-opacity duration-[1600ms]"
              style={{ opacity: videoReady ? 1 : 0 }}
              key={videoSrc}
              src={videoSrc}
              poster={wedding.media.heroPoster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              disablePictureInPicture
              onCanPlay={() => setVideoReady(true)}
              onError={() => setVideoReady(false)}
            />
          ) : null}
        </div>
      </motion.div>

      {/* ── Grade & overlays ─────────────────────────────────────────────
             The film is warmed and lifted rather than darkened: the invitation
             is printed on ivory, so the hero has to stay light. A soft pool of
             paper sits behind the type so the names read regardless of what the
             footage happens to be doing underneath. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 mix-blend-soft-light"
        style={{
          backgroundImage:
            "linear-gradient(165deg, rgba(255,246,224,0.85) 0%, rgba(255,250,238,0.35) 48%, rgba(214,190,150,0.4) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(180deg, ${band.tone}f2 0%, ${band.tone}57 22%, ${band.tone}6b 56%, ${band.to}f7 88%, ${band.to} 100%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(58% 46% at 50% 46%, rgba(253,249,240,0.78) 0%, rgba(253,249,240,0.28) 55%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(112% 82% at 50% 44%, transparent 42%, rgba(232,216,188,0.8) 100%)",
        }}
      />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <motion.div
        className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-6 pb-28 pt-24 text-center sm:px-10"
        style={
          reduced ? { y: 0, opacity: 1 } : { y: contentY, opacity: contentOpacity }
        }
      >
        {/* Wedding phrase, flanked by hairlines */}
        <motion.div
          className="flex w-full max-w-md items-center justify-center gap-4 px-2"
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.6, delay: 0.55, ease: EASE_EDITORIAL }}
        >
          <span className="hairline h-px w-8 shrink-0 sm:w-14" />
          <p className="eyebrow whitespace-normal">{t.hero.eyebrow}</p>
          <span className="hairline h-px w-8 shrink-0 sm:w-14" />
        </motion.div>

        {/* Names */}
        <h1
          aria-label={`${wedding.couple.groom} ${wedding.couple.connector} ${wedding.couple.bride} — ${t.hero.invitationOf}`}
          className="mt-8 flex flex-col items-center sm:mt-10"
        >
          <NameLine show={show} delay={0.75}>
            {wedding.couple.groom}
          </NameLine>

          <motion.span
            aria-hidden="true"
            className="my-1 flex items-center gap-5 sm:my-2 sm:gap-7"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.4, delay: 1.05, ease: EASE_EDITORIAL }}
          >
            <span className="hairline h-px w-10 sm:w-20" />
            <span className="display gold-leaf-fine text-[clamp(1.25rem,4vw,2.1rem)] italic leading-none">
              {wedding.couple.connector}
            </span>
            <span className="hairline h-px w-10 sm:w-20" />
          </motion.span>

          <NameLine show={show} delay={0.95}>
            {wedding.couple.bride}
          </NameLine>
        </h1>

        {/* Date & place */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:mt-12"
          initial={{ opacity: 0, y: 18 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 1.5, delay: 1.35, ease: EASE_EDITORIAL }}
        >
          <div className="flex items-center gap-3 text-gold/80">
            <span className="hairline h-px w-10" />
            <DecorativeRing className="h-4 w-7" />
            <span className="hairline h-px w-10" />
          </div>

          <p className="text-[clamp(0.7rem,2.6vw,0.85rem)] font-light uppercase tracking-[0.34em] text-ink">
            {date}
          </p>

          <p className="text-[0.6875rem] font-light uppercase tracking-[0.26em] text-ink-soft">
            {t.hero.location}
          </p>
        </motion.div>
      </motion.div>

      {/* ── Scroll cue ────────────────────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[max(1.75rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-3"
        style={reduced ? { opacity: 1 } : { opacity: cueOpacity }}
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.4, delay: 1.9, ease: EASE_EDITORIAL }}
      >
        <span className="text-[0.6rem] font-light uppercase tracking-[0.4em] text-ink-soft/80">
          {t.hero.scroll}
        </span>
        <span className="relative h-12 w-px overflow-hidden bg-gold/10">
          <span
            className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-transparent via-gold-deep to-transparent"
            style={{ animation: "scroll-cue 2.8s ease-in-out infinite" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

/** One name, sliding up from behind a mask once the veil is lifted. */
function NameLine({
  children,
  show,
  delay,
}: {
  children: string;
  show: boolean;
  delay: number;
}) {
  const reduced = useReducedMotionSafe();

  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="display gold-leaf block text-[clamp(3rem,14.5vw,9.5rem)] leading-[0.98] tracking-[0.02em]"
        initial={reduced ? { opacity: 0, y: 0 } : { opacity: 1, y: "108%" }}
        animate={
          show
            ? { opacity: 1, y: 0 }
            : reduced
              ? { opacity: 0, y: 0 }
              : { opacity: 1, y: "108%" }
        }
        transition={{ duration: 1.7, delay, ease: EASE_EDITORIAL }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default Hero;
