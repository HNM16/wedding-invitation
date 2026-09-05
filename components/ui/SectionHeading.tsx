"use client";

import { Blossom, DecorativeRing, GoldDivider } from "@/components/ui/Decor";
import { MaskedLine, Reveal } from "@/components/ui/Reveal";

/**
 * eyebrow → display title → divider. Used by every section so the vertical
 * rhythm and hierarchy stay identical across the page.
 */
export function SectionHeading({
  eyebrow,
  title,
  id,
  align = "center",
  className = "",
  titleClassName = "",
  crest,
  motif = "diamond",
}: {
  eyebrow: string;
  title: string;
  id?: string;
  align?: "center" | "left";
  className?: string;
  titleClassName?: string;
  /** A small decoration printed above the label. */
  crest?: "blossom" | "rings";
  /** What sits in the middle of the rule beneath. */
  motif?: "diamond" | "blossom" | "rings" | "leaf";
}) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col ${centered ? "items-center text-center" : "items-start text-left"} ${className}`}
    >
      {crest ? (
        <Reveal duration={1.1} className="mb-6">
          {crest === "blossom" ? (
            <Blossom className="h-4 w-4 text-gold/70" />
          ) : (
            <DecorativeRing className="h-6 w-10 text-gold/70" />
          )}
        </Reveal>
      ) : null}

      <Reveal duration={1.1} delay={crest ? 0.06 : 0}>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>

      {/* The gold gradient is clipped to the text of the element that owns it,
          so it has to sit on the heading itself, never on a wrapper. */}
      <MaskedLine className="mt-6" delay={0.12}>
        <h2
          id={id}
          className={`display gold-leaf inline-block pb-[0.12em] text-[clamp(2.1rem,6.2vw,3.9rem)] leading-[1.08] ${titleClassName}`}
        >
          {title}
        </h2>
      </MaskedLine>

      <Reveal delay={0.3} y={14} className={centered ? "mt-8" : "mt-8 self-start"}>
        <GoldDivider motif={motif} width={centered ? "min(18rem, 52vw)" : "9rem"} />
      </Reveal>
    </div>
  );
}

export default SectionHeading;
