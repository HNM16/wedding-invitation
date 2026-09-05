"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import wedding from "@/data/wedding";
import { useGate } from "@/lib/gate";

/**
 * Two quiet print devices layered over the page:
 *
 *  · a hairline that fills with gold as the guest reads down the invitation
 *  · vertical margin type on very wide screens, the way a printed spread carries
 *    the date and the couple's names in the gutters
 *
 * Both are decorative, non-interactive, and cost one transform each.
 */
export function EdgeDetails() {
  const { opened } = useGate();
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Reading thread */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-px origin-left"
        style={{
          scaleX: reduced ? 0 : scaleX,
          opacity: opened ? 0.55 : 0,
          transition: "opacity 1.2s ease",
          backgroundImage:
            "linear-gradient(90deg, rgba(138,106,50,0.2), rgba(216,190,134,0.95), rgba(138,106,50,0.2))",
        }}
      />

      {/* Margin type — only where there is genuinely room for it */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden w-16 select-none flex-col items-center justify-center gap-7 xl:flex"
        style={{ opacity: opened ? 1 : 0, transition: "opacity 1.6s ease 0.8s" }}
      >
        <span className="hairline-v h-20" />
        <span className="text-[0.6rem] uppercase tracking-[0.42em] text-mute/70 [writing-mode:vertical-rl]">
          {wedding.date.short}
        </span>
        <span className="hairline-v h-20" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 right-0 z-30 hidden w-16 select-none flex-col items-center justify-center gap-7 xl:flex"
        style={{ opacity: opened ? 1 : 0, transition: "opacity 1.6s ease 0.8s" }}
      >
        <span className="hairline-v h-20" />
        <span className="text-[0.6rem] uppercase tracking-[0.42em] text-mute/70 [writing-mode:vertical-rl] rotate-180">
          {wedding.venue.city} · {wedding.venue.country}
        </span>
        <span className="hairline-v h-20" />
      </div>
    </>
  );
}

export default EdgeDetails;
