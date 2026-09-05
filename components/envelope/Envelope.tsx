"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { WaxSeal } from "@/components/envelope/WaxSeal";
import { Blossom, FloralOrnament } from "@/components/ui/Decor";
import wedding from "@/data/wedding";
import { useAudio } from "@/lib/audio";
import { useGate } from "@/lib/gate";
import { useI18n } from "@/lib/i18n";
import { useScrollLock } from "@/lib/scroll-lock";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { EASE_EDITORIAL, EASE_VEIL } from "@/lib/motion";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE SEALED INVITATION
 * ─────────────────────────────────────────────────────────────────────────────
 *  The first thing a guest sees: a sealed envelope lying on warm paper. Tapping
 *  it plays one continuous sequence — the seal breaks, the flap folds back, the
 *  card rises out, the card grows to fill the screen, and the page underneath
 *  is revealed with the hero film already running.
 *
 *  The tap is also the gesture the browser requires before audio may start, so
 *  the music begins here rather than fighting an autoplay policy.
 *
 *  The envelope is built from stacked paper panels inside a single `preserve-3d`
 *  context, so the flap genuinely rotates behind the envelope rather than
 *  disappearing under a z-index.
 * ─────────────────────────────────────────────────────────────────────────────
 */

type Phase = "sealed" | "breaking" | "opening" | "rising" | "expanding" | "done";

/** Seal diameter. Sized against the smallest phone first. */
const SEAL = 78;
const SEAL_LG = 92;

const CARD_PAPER =
  "linear-gradient(170deg, #fffdf8 0%, #fbf5e9 58%, #f6eedd 100%)";

/** Cumulative timings, in ms, from the tap. */
const BEAT = {
  breaking: 560,
  opening: 920,
  rising: 840,
  expanding: 1040,
  /** How long the ivory sheet takes to dissolve into the page beneath. */
  reveal: 900,
} as const;

/** The printed face of the enclosure card — shared by the card and the sheet
 *  so the hand-over between them is seamless. */
function CardFace({
  note,
  date,
  dim = false,
}: {
  note: string;
  date: string;
  dim?: boolean;
}) {
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center gap-2.5 px-5 text-center transition-opacity duration-500"
      style={{ opacity: dim ? 0.9 : 1 }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 rounded-[2px] border border-gold/25"
      />
      <p className="text-[0.52rem] uppercase tracking-[0.36em] text-mute">
        {note}
      </p>
      <p className="display gold-leaf text-[clamp(1.5rem,7.5vw,2.15rem)] leading-tight">
        {wedding.couple.groom}
        <span className="gold-leaf-fine mx-1.5 italic">
          {wedding.couple.connector}
        </span>
        {wedding.couple.bride}
      </p>
      <span className="hairline h-px w-16" />
      <p className="text-[0.56rem] uppercase tracking-[0.26em] text-ink-soft/80">
        {date}
      </p>
    </div>
  );
}

export function Envelope() {
  const { t, formatDate } = useI18n();
  const { available, play } = useAudio();
  const { showEnvelope, open } = useGate();
  const reduced = useReducedMotionSafe();

  const [phase, setPhase] = useState<Phase>("sealed");
  const [gone, setGone] = useState(false);
  /** Measured at expansion time so the card grows to exactly cover the screen. */
  const [target, setTarget] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  /** Viewport size frozen alongside the card rect, so the two agree. */
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  /** The seal grows with the envelope once there is room for it. */
  const [seal, setSeal] = useState(SEAL);

  const cardRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useScrollLock(!gone);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const sync = () => setSeal(mql.matches ? SEAL_LG : SEAL);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(
    () => () => {
      for (const id of timers.current) window.clearTimeout(id);
    },
    [],
  );

  const start = useCallback(() => {
    if (phase !== "sealed") return;

    /* The gesture that unlocks audio. Do this first, synchronously. */
    if (available) play();

    if (reduced) {
      setPhase("done");
      open();
      later(() => setGone(true), 700);
      return;
    }

    setPhase("breaking");
    later(() => setPhase("opening"), BEAT.breaking);
    later(() => setPhase("rising"), BEAT.breaking + BEAT.opening * 0.72);
    later(
      () => {
        /* Freeze the card's on-screen rectangle, then let it grow from exactly
           there to exactly the viewport — a true expansion, not a scale that
           would smear the type. */
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
          setTarget({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          });
          setViewport({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
        setPhase("expanding");
      },
      BEAT.breaking + BEAT.opening * 0.72 + BEAT.rising * 0.82,
    );
    const settled =
      BEAT.breaking + BEAT.opening * 0.72 + BEAT.rising * 0.82 + BEAT.expanding;

    /* The page is revealed while the sheet is still settling, so the hero has
       already begun its own entrance by the time the paper dissolves. */
    later(() => {
      setPhase("done");
      open();
    }, settled - 180);
    later(() => setGone(true), settled + BEAT.reveal);
  }, [available, later, open, phase, play, reduced]);

  /* Escape is an escape hatch, never a trap. */
  useEffect(() => {
    if (gone) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "sealed") start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gone, phase, start]);

  if (!showEnvelope || gone) return null;

  const broken = phase !== "sealed";
  const flapOpen =
    phase === "opening" || phase === "rising" || phase === "expanding" || phase === "done";
  const rising = phase === "rising" || phase === "expanding" || phase === "done";
  const expanding = phase === "expanding" || phase === "done";

  const date = formatDate(wedding.date.day, wedding.date.month, wedding.date.year);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden px-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "done" ? 0 : 1 }}
        transition={{
          duration: phase === "done" ? BEAT.reveal / 1000 : 0.7,
          ease: phase === "done" ? EASE_VEIL : EASE_EDITORIAL,
        }}
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 50% 12%, #fbf6ec 0%, #f2e8d6 46%, #e6d8bf 100%)",
        }}
      >
        {/* The scene fades away once the card has taken over the screen */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: phase === "done" ? 0 : 1 }}
          transition={{ duration: 0.9, ease: EASE_VEIL }}
          style={{
            backgroundImage:
              "radial-gradient(75% 55% at 50% 42%, rgba(255,252,244,0.9), rgba(230,216,191,0) 72%)",
          }}
        />

        <motion.div
          className="relative flex w-full max-w-[25rem] flex-col items-center lg:max-w-[30rem]"
          initial={{ opacity: 0, y: 26, scale: 0.97 }}
          animate={{
            opacity: 1,
            y: rising ? 22 : 0,
            scale: 1,
          }}
          transition={{
            opacity: { duration: 1.1, ease: EASE_EDITORIAL },
            scale: { duration: 1.1, ease: EASE_EDITORIAL },
            y: { duration: 0.9, ease: EASE_EDITORIAL },
          }}
        >
          {/* ── Addressee ───────────────────────────────────────────────── */}
          <motion.div
            className="mb-8 flex flex-col items-center text-center sm:mb-10"
            animate={{ opacity: broken ? 0 : 1, y: broken ? -10 : 0 }}
            transition={{ duration: 0.55, ease: EASE_EDITORIAL }}
          >
            <Blossom className="h-4 w-4 text-gold/60" />
            <p className="mt-4 text-[0.62rem] uppercase tracking-[0.38em] text-mute">
              {t.envelope.addressee}
            </p>
          </motion.div>

          {/* ── The envelope ────────────────────────────────────────────── */}
          <div
            className="relative w-full"
            style={{ perspective: "1500px", perspectiveOrigin: "50% 22%" }}
          >
            {/* Sprigs flanking the envelope, only where there is room beside it */}
            <FloralOrnament
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 top-1/2 hidden h-44 w-12 -translate-y-1/2 text-gold/30 xl:block"
            />
            <FloralOrnament
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 top-1/2 hidden h-44 w-12 -translate-y-1/2 -scale-x-100 text-gold/30 xl:block"
            />

            <motion.button
              type="button"
              onClick={start}
              disabled={broken}
              aria-label={t.envelope.open}
              className="relative block w-full cursor-pointer rounded-[3px] focus-visible:outline-offset-8 disabled:cursor-default"
              style={{
                aspectRatio: "1.52 / 1",
                transformStyle: "preserve-3d",
              }}
              animate={{
                rotateX: broken ? 8 : 2,
                y: rising ? 14 : 0,
              }}
              whileHover={phase === "sealed" ? { rotateX: 5, scale: 1.012 } : undefined}
              whileTap={phase === "sealed" ? { scale: 0.988 } : undefined}
              transition={{ duration: 0.9, ease: EASE_EDITORIAL }}
            >
              {/* Shadow the envelope casts on the paper beneath it */}
              <motion.span
                aria-hidden="true"
                className="absolute -bottom-5 left-1/2 h-8 w-[86%] -translate-x-1/2 rounded-[50%] blur-xl"
                style={{ backgroundColor: "rgba(120,94,54,0.35)" }}
                animate={{ opacity: rising ? 0.45 : 0.32, scaleX: rising ? 1.05 : 1 }}
                transition={{ duration: 0.9 }}
              />

              {/* ① Back of the envelope */}
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-[3px]"
                style={{
                  transform: "translateZ(0px)",
                  backgroundImage:
                    "linear-gradient(168deg, #f6efe1 0%, #efe5d2 52%, #e7dac2 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.75), 0 22px 45px -26px rgba(96,74,42,0.55)",
                }}
              />

              {/* ② The card, sitting inside — it rises out from behind ③,
                     then hands over to the full-screen sheet below. */}
              <motion.div
                ref={cardRef}
                className="absolute left-1/2 rounded-[3px]"
                style={{
                  bottom: "5%",
                  width: "90%",
                  height: "86%",
                  x: "-50%",
                  zIndex: 1,
                  backgroundImage: CARD_PAPER,
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.9) inset, 0 24px 40px -26px rgba(96,74,42,0.6)",
                }}
                initial={false}
                animate={{
                  y: rising ? "-82%" : "0%",
                  opacity: expanding ? 0 : 1,
                }}
                transition={{
                  y: { duration: BEAT.rising / 1000, ease: EASE_EDITORIAL },
                  opacity: { duration: 0.01 },
                }}
              >
                <CardFace note={t.envelope.note} date={date} dim={!rising} />
              </motion.div>

              {/* ③ Front of the envelope, with its folded side and bottom panels */}
              <span
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden rounded-[3px]"
                style={{ transform: "translateZ(2px)" }}
              >
                <span
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(166deg, #fdf8ee 0%, #f7eeda 46%, #f0e4cb 100%)",
                  }}
                />
                {/* left fold */}
                <span
                  className="absolute inset-0"
                  style={{
                    clipPath: "polygon(0 0, 50% 62%, 0 100%)",
                    backgroundImage:
                      "linear-gradient(100deg, rgba(214,190,150,0.42), rgba(214,190,150,0.06))",
                  }}
                />
                {/* right fold */}
                <span
                  className="absolute inset-0"
                  style={{
                    clipPath: "polygon(100% 0, 100% 100%, 50% 62%)",
                    backgroundImage:
                      "linear-gradient(260deg, rgba(214,190,150,0.42), rgba(214,190,150,0.06))",
                  }}
                />
                {/* bottom panel, lifted very slightly off the sides */}
                <span
                  className="absolute inset-0"
                  style={{
                    clipPath: "polygon(0 100%, 50% 61%, 100% 100%)",
                    backgroundImage:
                      "linear-gradient(180deg, #fbf4e6 0%, #f4e9d2 100%)",
                    boxShadow: "0 -1px 0 rgba(255,255,255,0.7)",
                  }}
                />
                {/* fold creases */}
                <span
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom right, transparent calc(50% - 0.5px), rgba(176,141,79,0.28) 50%, transparent calc(50% + 0.5px))",
                    clipPath: "polygon(0 0, 52% 64%, 0 100%)",
                  }}
                />
                {/* gold rule just inside the edge */}
                <span className="absolute inset-[6px] rounded-[2px] border border-gold/22" />
                {/* paper sheen */}
                <span
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(112deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0.28) 72%, rgba(255,255,255,0) 100%)",
                  }}
                />
              </span>

              {/* ④ The flap — folds back over the top edge */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 origin-top"
                style={{
                  height: "64%",
                  transformStyle: "preserve-3d",
                  transform: "translateZ(3px)",
                }}
                animate={{ rotateX: flapOpen ? -172 : 0 }}
                transition={{ duration: BEAT.opening / 1000, ease: [0.3, 0.9, 0.3, 1] }}
              >
                {/* outer face */}
                <span
                  className="absolute inset-0"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    backfaceVisibility: "hidden",
                    backgroundImage:
                      "linear-gradient(178deg, #fffaf1 0%, #f8f0dd 58%, #efe2c8 100%)",
                    filter: "drop-shadow(0 3px 4px rgba(120,94,54,0.22))",
                  }}
                />
                {/* shading toward the point, plus the crease that makes the
                    flap read as a separate sheet lying over the front */}
                <span
                  className="absolute inset-0"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    backfaceVisibility: "hidden",
                    backgroundImage:
                      "linear-gradient(180deg, rgba(176,141,79,0) 42%, rgba(176,141,79,0.22) 100%)",
                  }}
                />
                <span
                  className="absolute inset-0"
                  style={{
                    clipPath:
                      "polygon(0 0, 1.6px 0, 51.1% 100%, 48.9% 100%, 100% 0, 100% 0, 100% 1.4px, 50% 100%, 0 1.4px)",
                    backfaceVisibility: "hidden",
                    backgroundColor: "rgba(150,118,62,0.34)",
                  }}
                />
                {/* inner face, seen once the flap folds back */}
                <span
                  className="absolute inset-0"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    transform: "rotateX(180deg)",
                    backfaceVisibility: "hidden",
                    backgroundImage:
                      "linear-gradient(0deg, #f3e8d2 0%, #ece0c6 70%, #e5d6b8 100%)",
                  }}
                />

              </motion.span>

            </motion.button>

            {/* ⑤ The seal, struck across the point of the flap.
                   It sits outside the envelope's `preserve-3d` stack on
                   purpose. Inside it, an element with no translateZ sorts
                   behind the front panel and vanishes; SVG gradients and
                   filters are unreliable there too. It never needs to rotate
                   with the flap, because it breaks before the flap moves. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 flex justify-center"
              style={{ top: "64%", transform: "translateY(-50%)", zIndex: 5 }}
            >
              <span
                className="relative block"
                style={{ width: seal, height: seal }}
              >
                <motion.span
                  className="absolute inset-0 origin-right"
                  animate={
                    broken
                      ? { x: -30, y: 18, rotate: -28, opacity: 0 }
                      : { x: 0, y: 0, rotate: 0, opacity: 1 }
                  }
                  transition={{ duration: 0.8, ease: [0.3, 0.7, 0.4, 1] }}
                >
                  <WaxSeal half="left" size={seal} />
                </motion.span>
                <motion.span
                  className="absolute inset-0 origin-left"
                  animate={
                    broken
                      ? { x: 30, y: 20, rotate: 26, opacity: 0 }
                      : { x: 0, y: 0, rotate: 0, opacity: 1 }
                  }
                  transition={{ duration: 0.8, ease: [0.3, 0.7, 0.4, 1] }}
                >
                  <WaxSeal half="right" size={seal} />
                </motion.span>

                {/* the crack of light along the break */}
                <motion.span
                  className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, transparent, rgba(255,250,232,0.95), transparent)",
                  }}
                  initial={{ opacity: 0, scaleY: 0.4 }}
                  animate={
                    broken
                      ? { opacity: [0, 1, 0], scaleY: [0.4, 1.3, 1.5] }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 0.5, times: [0, 0.35, 1] }}
                />
              </span>
            </span>
          </div>

          {/* ── Invitation to open ──────────────────────────────────────── */}
          <motion.div
            className="mt-10 flex flex-col items-center sm:mt-12"
            animate={{ opacity: broken ? 0 : 1, y: broken ? 12 : 0 }}
            transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
          >
            <button
              type="button"
              onClick={start}
              disabled={broken}
              className="group flex flex-col items-center gap-3 px-6 py-2"
            >
              <span className="display gold-leaf-fine text-[clamp(1.05rem,4.5vw,1.35rem)] tracking-[0.16em]">
                {t.envelope.open}
              </span>
              <motion.span
                aria-hidden="true"
                className="text-gold/70"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg
                  viewBox="0 0 16 22"
                  className="h-5 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                >
                  <path d="M8 1v18" />
                  <path d="M2.5 13.5 8 20l5.5-6.5" />
                </svg>
              </motion.span>
            </button>
            <p className="mt-1 text-[0.6rem] tracking-[0.14em] text-mute">
              {t.envelope.hint}
            </p>
          </motion.div>
        </motion.div>

        {/* ⑥ The card, now free of the envelope, growing to fill the screen.
               It is mounted here rather than inside the envelope because the
               envelope is transformed, and a transformed ancestor becomes the
               containing block even for `position: fixed`. */}
        {target && viewport.width > 0 ? (
          <motion.div
            aria-hidden="true"
            className="absolute z-[70] overflow-hidden"
            initial={{
              top: target.top,
              left: target.left,
              width: target.width,
              height: target.height,
              borderRadius: 3,
            }}
            animate={{
              top: 0,
              left: 0,
              width: viewport.width,
              height: viewport.height,
              borderRadius: 0,
            }}
            transition={{ duration: BEAT.expanding / 1000, ease: EASE_VEIL }}
            style={{
              backgroundImage: CARD_PAPER,
              boxShadow: "0 26px 60px -30px rgba(96,74,42,0.45)",
            }}
          >
            <motion.div
              className="h-full w-full"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.34, ease: EASE_EDITORIAL }}
            >
              <CardFace note={t.envelope.note} date={date} />
            </motion.div>
          </motion.div>
        ) : null}
      </motion.div>
    </>
  );
}

export default Envelope;
