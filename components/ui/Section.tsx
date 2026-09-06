import type { ReactNode } from "react";
import { toneGradient, type SectionId } from "@/lib/tones";

/**
 * Shared section shell.
 *
 * Beyond the editorial rhythm (generous vertical air, safe-area-aware gutters)
 * it paints the section's paper tone, blended into the tones above and below —
 * see `lib/tones.ts`, where the order and the tones are declared once.
 *
 * `light` places a soft pool of warm light inside the band, so each section is
 * lit a little differently instead of being a flat fill.
 */
export function Section({
  id,
  children,
  className = "",
  innerClassName = "",
  labelledBy,
  light = "top",
}: {
  id: SectionId;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  labelledBy?: string;
  /** Where the light falls, or `none` for an evenly lit sheet. */
  light?: "top" | "left" | "right" | "none";
}) {
  /* Kept deliberately faint: a stronger pool washes the paper tone back
     toward ivory and the section stops reading as its own sheet. */
  const pool = {
    top: "radial-gradient(66% 44% at 50% 4%, rgba(255,253,247,0.5) 0%, rgba(255,253,247,0) 62%)",
    left: "radial-gradient(52% 46% at 4% 22%, rgba(255,253,247,0.46) 0%, rgba(255,253,247,0) 58%)",
    right:
      "radial-gradient(52% 46% at 96% 18%, rgba(255,253,247,0.46) 0%, rgba(255,253,247,0) 58%)",
    none: null,
  }[light];

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative w-full py-[clamp(5.5rem,13vh,10rem)] ${className}`}
      style={{ backgroundImage: toneGradient(id) }}
    >
      {pool ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: pool }}
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
