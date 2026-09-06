import type { ReactNode } from "react";
import {
  blendGradient,
  surfaceOf,
  surfaceVars,
  type SectionId,
} from "@/lib/tones";

/**
 * Shared section shell — and the thing that makes a section look like a sheet
 * of stationery rather than a coloured band.
 *
 * Five layers, bottom to top:
 *   1. the blend into the sections above and below;
 *   2. the stock's own gradient — warm ivory, or foiled champagne;
 *   3. a metallic sheen, on the foiled stocks only;
 *   4. paper grain, multiplied in;
 *   5. a fine gold rule printed just inside the edges.
 *
 * It also sets the per-surface gold variables, because the gold that reads as
 * metal on ivory disappears on champagne. See `lib/tones.ts`.
 */
export function Section({
  id,
  children,
  className = "",
  innerClassName = "",
  labelledBy,
  light = "top",
  rule = true,
}: {
  id: SectionId;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  labelledBy?: string;
  /** Where the light falls, or `none` for an evenly lit sheet. */
  light?: "top" | "left" | "right" | "none";
  /** The hairline frame printed inside the edges. */
  rule?: boolean;
}) {
  const surface = surfaceOf(id);

  const pool = {
    top: "radial-gradient(64% 42% at 50% 3%, rgba(255,253,247,0.45) 0%, rgba(255,253,247,0) 62%)",
    left: "radial-gradient(50% 44% at 3% 20%, rgba(255,253,247,0.4) 0%, rgba(255,253,247,0) 58%)",
    right:
      "radial-gradient(50% 44% at 97% 16%, rgba(255,253,247,0.4) 0%, rgba(255,253,247,0) 58%)",
    none: null,
  }[light];

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative isolate w-full py-[clamp(5.5rem,13vh,10rem)] ${className}`}
      style={{ ...surfaceVars(id), backgroundImage: blendGradient(id) }}
    >
      {/* ② the stock itself, held clear of the blend at top and bottom */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: surface.gradient,
          maskImage:
            "linear-gradient(180deg, transparent 0%, #000 13%, #000 87%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, #000 13%, #000 87%, transparent 100%)",
        }}
      />

      {/* ③ foil */}
      {surface.sheen ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: surface.sheen,
            maskImage:
              "linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)",
          }}
        />
      ) : null}

      {/* ④ paper grain */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 mix-blend-multiply"
        style={{
          opacity: surface.grain,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />

      {/* ⑤ light */}
      {pool ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ backgroundImage: pool }}
        />
      ) : null}

      {/* the printed rule */}
      {rule ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[clamp(0.75rem,3vw,2.5rem)] inset-y-[clamp(2rem,5vh,3.5rem)] border"
          style={{ borderColor: surface.rule, opacity: 0.55 }}
        />
      ) : null}

      <div
        className={`relative mx-auto w-full max-w-[78rem] px-[max(1.5rem,env(safe-area-inset-left))] sm:px-8 lg:px-12 ${innerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}

export default Section;
