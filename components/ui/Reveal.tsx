"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { useRef, type ElementType, type ReactNode } from "react";
import { EASE_EDITORIAL, viewportOnce } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds of delay before the reveal starts. */
  delay?: number;
  /** Distance travelled, in px. */
  y?: number;
  duration?: number;
  as?: ElementType;
};

/** Fade-and-rise on first entry into the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  duration = 1.25,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotionSafe();
  const MotionTag = motion[as as "div"];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration, delay, ease: EASE_EDITORIAL }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * A line of type sliding up from behind a mask — the reveal used for headings.
 *
 * The trigger is deliberately attached to the outer wrapper rather than the
 * moving element: an IntersectionObserver intersects against ancestor clip
 * rects, so an element parked below an `overflow: hidden` mask reports zero
 * visibility and would never come into view on its own.
 */
export function MaskedLine({
  children,
  className = "",
  textClassName = "",
  delay = 0,
  duration = 1.3,
}: {
  children: ReactNode;
  className?: string;
  textClassName?: string;
  delay?: number;
  duration?: number;
}) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewportOnce);

  /* One DOM shape for both branches: reduced motion fades the line in place
     instead of sliding it, and every animated property is always declared so
     nothing can be left over when the preference resolves after hydration. */
  const hidden = reduced ? { opacity: 0, y: 0 } : { opacity: 1, y: "112%" };
  const shown = { opacity: 1, y: 0 };

  return (
    <div
      ref={ref}
      className={`${reduced ? "" : "overflow-hidden"} ${className}`}
    >
      <motion.div
        className={textClassName}
        initial={hidden}
        animate={inView ? shown : hidden}
        transition={
          reduced
            ? { duration: 0.6, delay }
            : { duration, delay, ease: EASE_EDITORIAL }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Wraps children in a stagger container; pair with <RevealItem>. */
export function RevealGroup({
  children,
  className,
  delayChildren = 0,
  staggerChildren = 0.12,
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}) {
  const variants: Variants = {
    hidden: {},
    show: { transition: { delayChildren, staggerChildren } },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotionSafe();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: EASE_EDITORIAL },
    },
  };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
