/**
 * Small printed decorations — the details a physical invitation carries in its
 * margins. All are inline SVG line-work in `currentColor`, sized in `em` or by
 * a `className`, so they inherit the gold of whatever they sit beside.
 *
 * They are accents, never sections: keep them small and sparse.
 */

/** Two interlocking wedding bands, drawn as thin engraving. */
export function DecorativeRing({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 40"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
    >
      <ellipse cx="25" cy="23" rx="13" ry="13.5" />
      <ellipse cx="25" cy="23" rx="10" ry="10.5" opacity="0.45" />
      <ellipse cx="39" cy="23" rx="13" ry="13.5" />
      <ellipse cx="39" cy="23" rx="10" ry="10.5" opacity="0.45" />
      {/* the little stone on the left band */}
      <path d="M25 9.5 27.6 6 25 2.6 22.4 6Z" />
      <path d="M22.4 6h5.2" opacity="0.6" />
    </svg>
  );
}

/** A sprig of botanical line-work. Mirror it with `scale-x-[-1]`. */
export function FloralOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 96"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.85"
      strokeLinecap="round"
    >
      <path d="M24 94C24 70 24 46 24 6" opacity="0.75" />
      {[0, 1, 2, 3].map((i) => {
        const y = 76 - i * 17;
        const s = 1 - i * 0.14;
        return (
          <g key={i}>
            <path
              d={`M24 ${y}c-${13 * s} -1 -${17 * s} -${7 * s} -${18 * s} -${13 * s} ${9 * s} -1 ${15 * s} ${3 * s} ${18 * s} ${13 * s}Z`}
            />
            <path
              d={`M24 ${y - 6}c${13 * s} -1 ${17 * s} -${7 * s} ${18 * s} -${13 * s} -${9 * s} -1 -${15 * s} ${3 * s} -${18 * s} ${13 * s}Z`}
            />
          </g>
        );
      })}
      {/* bud */}
      <path d="M24 10c-3.4-2.4-3.4-7.6 0-10 3.4 2.4 3.4 7.6 0 10Z" />
      <circle cx="24" cy="3.4" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A single small blossom, for setting between blocks of type. */
export function Blossom({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.85"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={i}
          cx="16"
          cy="9"
          rx="4.1"
          ry="6.6"
          transform={`rotate(${i * 72} 16 16)`}
        />
      ))}
      <circle cx="16" cy="16" r="1.9" fill="currentColor" stroke="none" opacity="0.8" />
    </svg>
  );
}

/**
 * The standard rule between blocks: a hairline, a centre motif, a hairline.
 * `motif` picks what sits in the middle.
 */
export function GoldDivider({
  className = "",
  width = "min(20rem, 60vw)",
  motif = "diamond",
}: {
  className?: string;
  width?: string;
  motif?: "diamond" | "blossom" | "rings" | "leaf";
}) {
  return (
    <div
      className={`flex items-center justify-center gap-4 text-gold/70 ${className}`}
      style={{ width }}
      aria-hidden="true"
    >
      <span className="hairline h-px flex-1" />
      {motif === "diamond" ? (
        <svg
          viewBox="0 0 12 12"
          className="h-2.5 w-2.5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          <path d="M6 0.6 11.4 6 6 11.4 0.6 6Z" />
          <circle cx="6" cy="6" r="1.15" fill="currentColor" stroke="none" />
        </svg>
      ) : null}
      {motif === "blossom" ? <Blossom className="h-4 w-4 shrink-0" /> : null}
      {motif === "rings" ? <DecorativeRing className="h-4 w-6 shrink-0" /> : null}
      {motif === "leaf" ? (
        <svg
          viewBox="0 0 24 12"
          className="h-3 w-6 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
        >
          <path d="M12 6c-3-3.4-7-4.2-10.5-4C4 5 7.6 6.6 12 6Z" />
          <path d="M12 6c3-3.4 7-4.2 10.5-4C20 5 16.4 6.6 12 6Z" />
          <circle cx="12" cy="6" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      ) : null}
      <span className="hairline h-px flex-1" />
    </div>
  );
}

/** A pair of laurel sprigs that can bracket a heading or a photograph. */
export function LaurelPair({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex items-center justify-center gap-5 ${className}`}>
      <FloralOrnament
        aria-hidden="true"
        className="h-14 w-6 shrink-0 -scale-x-100 text-gold/45 sm:h-20 sm:w-8"
      />
      {children}
      <FloralOrnament className="h-14 w-6 shrink-0 text-gold/45 sm:h-20 sm:w-8" />
    </div>
  );
}
