"use client";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Flourish } from "@/components/ui/Ornaments";
import { LaurelPair } from "@/components/ui/Decor";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";

/**
 * The invitation itself: an editorial page of type, set on a quiet ground with
 * a soft pool of gold light behind it.
 */
export function InvitationMessage() {
  const { t } = useI18n();
  const [lead, ...rest] = t.invitation.paragraphs;

  return (
    <Section id="invitation" labelledBy="invitation-title" light="top">
      {/* Pool of light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[38rem] w-[min(58rem,120vw)] -translate-x-1/2 -translate-y-1/2 blur-[90px]"
        style={{
          backgroundImage:
            "radial-gradient(closest-side, rgba(138,106,50,0.16), transparent 72%)",
        }}
      />

      <SectionHeading
        id="invitation-title"
        eyebrow={t.invitation.eyebrow}
        title={t.invitation.title}
        crest="blossom"
        motif="leaf"
      />

      <RevealGroup
        className="relative mx-auto mt-14 flex max-w-2xl flex-col items-center text-center sm:mt-16"
        delayChildren={0.15}
        staggerChildren={0.16}
      >
        {/* Side rules — a printed page held between two hairlines */}
        <span
          aria-hidden="true"
          className="hairline-v absolute -left-6 top-4 hidden h-[calc(100%-2rem)] lg:block"
        />
        <span
          aria-hidden="true"
          className="hairline-v absolute -right-6 top-4 hidden h-[calc(100%-2rem)] lg:block"
        />

        <RevealItem>
          <p className="display measure text-[clamp(1.35rem,4.4vw,2rem)] font-light leading-[1.5] text-ink">
            {lead}
          </p>
        </RevealItem>

        {rest.map((paragraph, i) => (
          <RevealItem key={i} className="mt-7 first-of-type:mt-9">
            <p className="measure text-[clamp(0.9rem,2.7vw,1.0625rem)] font-light leading-[1.95] text-ink-soft">
              {paragraph}
            </p>
          </RevealItem>
        ))}

        <RevealItem className="mt-12">
          <Flourish className="h-3 w-40 text-gold/65" />
        </RevealItem>

        <RevealItem className="mt-7">
          <LaurelPair>
            <p className="display gold-leaf-fine text-[clamp(1.05rem,3.2vw,1.4rem)] italic">
              {t.invitation.signature}
            </p>
          </LaurelPair>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}

export default InvitationMessage;
