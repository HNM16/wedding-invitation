"use client";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CornerBracket } from "@/components/ui/Ornaments";
import { Blossom, FloralOrnament, GoldDivider } from "@/components/ui/Decor";
import { VenueMap } from "@/components/VenueMap";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import wedding from "@/data/wedding";
import { useI18n } from "@/lib/i18n";

/**
 * The venue plate.
 *
 * The Maps link comes from `VENUE_MAPS_URL` in `data/wedding.ts` — the single
 * place it is defined. The rose behind the plate is a decorative ornament, not
 * a map: no geography is implied that has not been confirmed.
 */
export function Venue() {
  const { t, formatDate } = useI18n();
  const date = formatDate(wedding.date.day, wedding.date.month, wedding.date.year);

  const details = [
    { label: t.venue.addressLabel, value: t.venue.address },
    { label: t.venue.dateLabel, value: date },
    { label: t.venue.timeLabel, value: wedding.date.time },
  ];

  return (
    <Section id="venue" labelledBy="venue-title" light="right">
      <SectionHeading
        id="venue-title"
        eyebrow={t.venue.eyebrow}
        title={t.venue.title}
        crest="rings"
        motif="leaf"
      />

      <Reveal delay={0.2} className="mt-14 sm:mt-16">
        <div className="plate relative mx-auto max-w-4xl px-6 py-14 sm:px-12 sm:py-16 lg:px-16">
          {/* Botanical margins, printed faintly into the plate */}
          <FloralOrnament
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 hidden h-56 w-14 -translate-y-1/2 text-gold/25 sm:block"
          />
          <FloralOrnament
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 hidden h-56 w-14 -translate-y-1/2 -scale-x-100 text-gold/25 sm:block"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 text-gold/35"
          >
            <CornerBracket className="absolute left-0 top-0 h-6 w-6" />
            <CornerBracket className="absolute right-0 top-0 h-6 w-6 rotate-90" />
            <CornerBracket className="absolute bottom-0 right-0 h-6 w-6 rotate-180" />
            <CornerBracket className="absolute bottom-0 left-0 h-6 w-6 -rotate-90" />
          </div>

          <RevealGroup
            className="relative flex flex-col items-center text-center"
            staggerChildren={0.085}
          >
            <RevealItem>
              <Blossom className="h-4 w-4 text-gold/70" />
            </RevealItem>

            <RevealItem className="mt-5">
              <p className="eyebrow">{t.venue.placeLabel}</p>
            </RevealItem>

            <RevealItem className="mt-6">
              <p className="display gold-leaf text-[clamp(1.85rem,7vw,3.4rem)] leading-[1.1]">
                {wedding.venue.name}
              </p>
            </RevealItem>

            <RevealItem className="mt-4">
              <p className="text-[0.7rem] font-light uppercase tracking-[0.36em] text-ink-soft/85">
                {wedding.venue.subName}
              </p>
            </RevealItem>

            <RevealItem className="mt-10 w-full">
              <dl className="grid grid-cols-1 divide-y divide-gold/25 border-y border-gold/38 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {details.map((item) => (
                  <div key={item.label} className="px-2 py-7 sm:px-4">
                    <dt className="eyebrow">{item.label}</dt>
                    <dd className="mt-3 text-[clamp(0.9rem,2.8vw,1.05rem)] font-light text-ink">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </RevealItem>

            <RevealItem className="mt-11">
              <a
                href={wedding.venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                <span>{t.venue.mapButton}</span>
                <span aria-hidden="true" className="relative">
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3 fill-none stroke-current"
                    strokeWidth="1.2"
                  >
                    <path d="M6 2h8v8" strokeLinecap="round" />
                    <path d="M14 2 5 11" strokeLinecap="round" />
                    <path d="M12 9.5V14H2V4h4.5" strokeLinecap="round" />
                  </svg>
                </span>
              </a>
            </RevealItem>

            <RevealItem className="mt-5">
              <p className="text-[0.65rem] font-light tracking-[0.14em] text-mute">
                {t.venue.mapHint}
              </p>
            </RevealItem>

            <RevealItem className="mt-10">
              <GoldDivider motif="leaf" width="min(14rem, 44vw)" />
            </RevealItem>

            <RevealItem className="mt-8">
              <p className="measure display text-[clamp(1rem,3vw,1.25rem)] font-light italic leading-relaxed text-ink/85">
                {t.venue.note}
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </Reveal>

      {/* ── The map ──────────────────────────────────────────────────────── */}
      <Reveal delay={0.15} className="mx-auto mt-10 max-w-4xl sm:mt-14">
        <VenueMap />
      </Reveal>
    </Section>
  );
}

export default Venue;
