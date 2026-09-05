import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion language: slow, weighted, editorial. Everything eases out of a
 * long curve rather than springing, which is what separates a luxury title
 * sequence from a template's bounce.
 */
export const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;
export const EASE_VEIL = [0.22, 0.61, 0.36, 1] as const;

export const slow: Transition = { duration: 1.3, ease: EASE_EDITORIAL };
export const slower: Transition = { duration: 1.8, ease: EASE_EDITORIAL };

/** Standard viewport trigger — reveals once, slightly before the edge. */
export const viewportOnce = {
  once: true,
  amount: 0.28,
  margin: "0px 0px -60px 0px",
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: slow },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: slower },
};

/** Parent that releases its children one after another. */
export function stagger(delayChildren = 0, staggerChildren = 0.11): Variants {
  return {
    hidden: {},
    show: { transition: { delayChildren, staggerChildren } },
  };
}

/** A line of type sliding out from behind a mask. */
export const maskLine: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1.25, ease: EASE_EDITORIAL } },
};

/** Photography settling from an over-scaled, dimmed state. */
export const plateReveal: Variants = {
  hidden: { opacity: 0, scale: 1.09 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.9, ease: EASE_EDITORIAL },
  },
};
