"use client";

import { useId } from "react";

/**
 * The wax seal.
 *
 * Drawn rather than imaged: an irregular poured-wax edge, a pressed inner ring
 * and the couple's initials struck into the middle, lit from the upper left so
 * it reads as a raised object on paper rather than a flat circle.
 *
 * `half` renders one side only, clipped down the middle — the two halves are
 * what break apart when the guest opens the invitation.
 *
 * Two implementation notes worth keeping:
 *  · gradient ids are per-instance, because two seals sharing an id makes the
 *    second resolve against the first;
 *  · the shadow is a CSS `drop-shadow`, not an SVG `<filter>` — a filter
 *    reference inside a `preserve-3d` subtree renders nothing at all in
 *    Chrome, which is subtle and total.
 */
export function WaxSeal({
  size = 96,
  half,
  className = "",
}: {
  size?: number;
  half?: "left" | "right";
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");

  const clip =
    half === "left"
      ? "inset(0 50% 0 0)"
      : half === "right"
        ? "inset(0 0 0 50%)"
        : undefined;

  return (
    <span
      className={`pointer-events-none block ${className}`}
      style={{
        width: size,
        height: size,
        clipPath: clip,
        filter: "drop-shadow(0 3px 4px rgba(74,56,34,0.35))",
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}-face`} cx="0.36" cy="0.3" r="0.85">
            <stop offset="0%" stopColor="#e8cf98" />
            <stop offset="38%" stopColor="#c9a35c" />
            <stop offset="72%" stopColor="#a1783a" />
            <stop offset="100%" stopColor="#785526" />
          </radialGradient>
          <radialGradient id={`${uid}-rim`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="80%" stopColor="rgba(120,85,38,0)" />
            <stop offset="100%" stopColor="rgba(88,60,24,0.6)" />
          </radialGradient>
          <linearGradient id={`${uid}-gloss`} x1="0.18" y1="0" x2="0.72" y2="1">
            <stop offset="0%" stopColor="rgba(255,248,228,0.72)" />
            <stop offset="42%" stopColor="rgba(255,248,228,0.06)" />
            <stop offset="100%" stopColor="rgba(255,248,228,0)" />
          </linearGradient>
        </defs>

        {/* Poured wax: a circle with a deliberately uneven edge */}
        <path
          fill={`url(#${uid}-face)`}
          d="M50 4.5c7.6 0 11.4 3.4 17.4 5.6 6.4 2.3 12.1 1.2 15.9 6.4 3.7 5 1.4 10.5 3.3 16.8 1.9 6.2 6 9.7 6 16.7 0 7-4.3 10.7-6.1 16.8-1.8 6-.2 11.9-4.1 16.7-3.9 4.8-9.6 3.9-15.6 6.1C60.7 92 57 96 50 96s-11-3.9-17-6.3c-6-2.3-11.6-1.4-15.4-6.2-3.8-4.8-2.2-10.7-4-16.8C11.8 60.6 7.4 57 7.4 50s4.2-10.6 6.1-16.8c1.9-6.2-.3-11.8 3.4-16.8 3.8-5.1 9.4-4 15.8-6.3C38.7 7.9 42.4 4.5 50 4.5Z"
        />

        {/* Edge darkening where the wax thins out */}
        <circle cx="50" cy="50" r="45" fill={`url(#${uid}-rim)`} />

        {/* Pressed rings */}
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="none"
          stroke="rgba(74,52,20,0.45)"
          strokeWidth="1.2"
        />
        <circle
          cx="50"
          cy="50"
          r="33.2"
          fill="none"
          stroke="rgba(255,240,205,0.38)"
          strokeWidth="0.9"
        />

        {/* Struck initials: a dark strike with a lit edge above it */}
        <text
          x="50"
          y="59.5"
          textAnchor="middle"
          fill="rgba(66,45,16,0.82)"
          style={{ fontFamily: "var(--font-display)", fontSize: "25px" }}
        >
          S&#8202;&amp;&#8202;S
        </text>
        <text
          x="50"
          y="58.7"
          textAnchor="middle"
          fill="rgba(255,243,214,0.45)"
          style={{ fontFamily: "var(--font-display)", fontSize: "25px" }}
        >
          S&#8202;&amp;&#8202;S
        </text>

        {/* Light from the upper left */}
        <circle cx="50" cy="50" r="45.5" fill={`url(#${uid}-gloss)`} />
      </svg>
    </span>
  );
}

export default WaxSeal;
