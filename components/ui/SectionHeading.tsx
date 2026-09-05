"use client";

import { Divider } from "@/components/ui/Ornaments";
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
}: {
  eyebrow: string;
  title: string;
  id?: string;
  align?: "center" | "left";
  className?: string;
  titleClassName?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col ${centered ? "items-center text-center" : "items-start text-left"} ${className}`}
    >
      <Reveal duration={1.1}>
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
        <Divider width={centered ? "min(18rem, 52vw)" : "9rem"} />
      </Reveal>
    </div>
  );
}

export default SectionHeading;
