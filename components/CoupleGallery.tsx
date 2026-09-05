"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { useRef, type ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { Diamond, Flourish } from "@/components/ui/Ornaments";
import { MaskedLine, Reveal } from "@/components/ui/Reveal";
import wedding from "@/data/wedding";
import { useI18n } from "@/lib/i18n";
import { EASE_EDITORIAL, viewportOnce } from "@/lib/motion";

/**
 * An editorial spread rather than a gallery grid: three plates set on an
 * asymmetric 12-column field, each drifting at its own rate as the page moves,
 * with the couple's names set vertically down the gutter.
 */
export function CoupleGallery() {
  const { t } = useI18n();
  const [first, second, third] = wedding.media.gallery;

  return (
    <Section id="couple" labelledBy="couple-title" className="overflow-hidden">
      {/*
        Explicit rows on lg: with auto-placement the tall third plate slides
        into the free columns of the text row and lands on top of the copy.
        Row 1 is portrait + text, row 2 is the two lower plates, staggered by a
        top margin rather than a negative one so nothing can ever collide.
      */}
      <div className="grid grid-cols-12 gap-x-5 gap-y-16 sm:gap-x-6 lg:gap-x-8 lg:gap-y-20">
        {/* ── Plate I — the opening portrait ───────────────────────────── */}
        <div className="col-span-12 sm:col-span-9 sm:col-start-1 lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <Plate
            src={first.src}
            width={first.width}
            height={first.height}
            ratio="3 / 4"
            speed={-40}
            sizes="(min-width: 1024px) 38vw, (min-width: 640px) 70vw, 100vw"
            priority
          />
          <VerticalCaption label={t.couple.groom} name={wedding.couple.groom} />
        </div>

        {/* ── Text column ──────────────────────────────────────────────── */}
        <div className="col-span-12 sm:col-span-11 sm:col-start-2 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:flex lg:flex-col lg:justify-center lg:py-8">
          <Reveal duration={1.1}>
            <p className="eyebrow">{t.couple.eyebrow}</p>
          </Reveal>

          <MaskedLine className="mt-6" delay={0.1}>
            <h2
              id="couple-title"
              className="display gold-leaf inline-block pb-[0.12em] text-[clamp(2rem,6vw,3.5rem)] leading-[1.08]"
            >
              {t.couple.title}
            </h2>
          </MaskedLine>

          <Reveal delay={0.24} className="mt-8">
            <Flourish className="h-3 w-36 text-gold/50" />
          </Reveal>

          <Reveal delay={0.34} className="mt-8">
            <p className="measure text-[clamp(0.95rem,2.8vw,1.1rem)] font-light leading-[1.9] text-sand/85">
              {t.couple.quote}
            </p>
          </Reveal>

          <Reveal delay={0.46} className="mt-10">
            <dl className="flex items-center gap-8">
              <div>
                <dt className="eyebrow">{t.couple.groom}</dt>
                <dd className="display gold-leaf-fine mt-2 text-[clamp(1.3rem,4vw,1.8rem)]">
                  {wedding.couple.groom}
                </dd>
              </div>
              <Diamond className="h-2.5 w-2.5 shrink-0 text-gold/60" />
              <div>
                <dt className="eyebrow">{t.couple.bride}</dt>
                <dd className="display gold-leaf-fine mt-2 text-[clamp(1.3rem,4vw,1.8rem)]">
                  {wedding.couple.bride}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* ── Plate II — landscape, dropped low and left ────────────────── */}
        <div className="col-span-12 sm:col-span-9 sm:col-start-4 lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:mt-28">
          <Plate
            src={third.src}
            width={third.width}
            height={third.height}
            ratio="16 / 11"
            speed={34}
            sizes="(min-width: 1024px) 54vw, (min-width: 640px) 70vw, 100vw"
          />
        </div>

        {/* ── Plate III — the tall portrait, held high ──────────────────── */}
        <div className="col-span-12 sm:col-span-7 sm:col-start-1 lg:col-span-4 lg:col-start-9 lg:row-start-2">
          <Plate
            src={second.src}
            width={second.width}
            height={second.height}
            ratio="3 / 4"
            speed={-56}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 55vw, 100vw"
          />
          <VerticalCaption
            label={t.couple.bride}
            name={wedding.couple.bride}
            align="right"
          />
        </div>
      </div>
    </Section>
  );
}

/**
 * One photographic plate: a hairline frame, an image that settles from an
 * over-scaled state on first sight, and a slow parallax drift while scrolling.
 */
function Plate({
  src,
  width,
  height,
  ratio,
  speed,
  sizes,
  priority = false,
}: {
  src: string;
  width: number;
  height: number;
  ratio: string;
  /** Vertical travel in px across the viewport — negative rises. */
  speed: number;
  sizes: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <motion.div ref={ref} style={reduced ? { y: 0 } : { y }}>
      <motion.figure
        className="plate vignette relative overflow-hidden"
        style={{ aspectRatio: ratio }}
        initial={{ opacity: 0, scale: reduced ? 1 : 1.06 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1.8, ease: EASE_EDITORIAL }}
      >
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          priority={priority}
          sizes={sizes}
          className="h-full w-full object-cover"
        />
        {/* Warm grade so photography sits inside the palette */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage:
              "linear-gradient(200deg, rgba(194,160,92,0.22), transparent 55%, rgba(9,7,5,0.4))",
          }}
        />
      </motion.figure>
    </motion.div>
  );
}

/** A name set vertically beside its plate, the way a print caption runs. */
function VerticalCaption({
  label,
  name,
  align = "left",
}: {
  label: string;
  name: string;
  align?: "left" | "right";
}): ReactNode {
  return (
    <div
      className={`mt-5 flex items-center gap-4 ${align === "right" ? "justify-end" : ""}`}
    >
      <span className="hairline h-px w-10" />
      <p className="text-[0.6rem] uppercase tracking-[0.34em] text-mute">
        {label}
      </p>
      <p className="display gold-leaf-fine text-[1.05rem]">{name}</p>
    </div>
  );
}

export default CoupleGallery;
