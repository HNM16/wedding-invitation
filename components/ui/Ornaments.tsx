/**
 * Hand-drawn gold ornaments. All are inline SVG (no icon dependency), sized in
 * `em` so they scale with the surrounding type, and use `currentColor` so the
 * gold gradient utilities can tint them.
 */

export function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
    >
      <path d="M6 0.6 11.4 6 6 11.4 0.6 6Z" />
      <circle cx="6" cy="6" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** hairline — diamond — hairline. The default section divider. */
export function Divider({
  className = "",
  width = "min(22rem, 62vw)",
}: {
  className?: string;
  width?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-4 text-gold/70 ${className}`}
      style={{ width }}
      aria-hidden="true"
    >
      <span className="hairline h-px flex-1" />
      <Diamond className="h-2.5 w-2.5 shrink-0" />
      <span className="hairline h-px flex-1" />
    </div>
  );
}

/** A slimmer flourish for use inside cards and above signatures. */
export function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 12"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeLinecap="round"
    >
      <path d="M2 6h34" opacity="0.65" />
      <path d="M84 6h34" opacity="0.65" />
      <path d="M44 6c4-4 8-4 12 0s8 4 12 0" />
      <path d="M44 6c4 4 8 4 12 0s8-4 12 0" opacity="0.55" />
      <circle cx="60" cy="6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** The S & S monogram, framed in a thin gold lozenge. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
    >
      <circle cx="48" cy="48" r="46" opacity="0.35" />
      <path d="M48 6 90 48 48 90 6 48Z" opacity="0.55" />
      <text
        x="48"
        y="57"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "26px",
          letterSpacing: "0.04em",
        }}
      >
        S&amp;S
      </text>
    </svg>
  );
}

/** Decorative compass rose for the venue plate — ornament, not a real map. */
export function CompassRose({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.7"
    >
      <circle cx="100" cy="100" r="92" opacity="0.28" />
      <circle cx="100" cy="100" r="74" opacity="0.4" />
      <circle cx="100" cy="100" r="30" opacity="0.5" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * Math.PI) / 12;
        const inner = i % 6 === 0 ? 62 : 70;
        return (
          <line
            key={i}
            x1={100 + Math.sin(angle) * inner}
            y1={100 - Math.cos(angle) * inner}
            x2={100 + Math.sin(angle) * 74}
            y2={100 - Math.cos(angle) * 74}
            opacity={i % 6 === 0 ? 0.7 : 0.3}
          />
        );
      })}
      <path d="M100 20 112 100 100 180 88 100Z" opacity="0.6" />
      <path d="M20 100 100 88 180 100 100 112Z" opacity="0.35" />
      <circle cx="100" cy="100" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Corner brackets used to frame the opening veil. */
export function CornerBracket({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
    >
      <path d="M0 18V4a4 4 0 0 1 4-4h14" />
      <path d="M0 30V10" opacity="0.4" />
      <path d="M30 0H10" opacity="0.4" />
    </svg>
  );
}
