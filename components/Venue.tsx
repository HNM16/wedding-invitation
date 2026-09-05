"use client";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CompassRose, CornerBracket, Diamond } from "@/components/ui/Ornaments";
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
    <Section id="venue" labelledBy="venue-title">
      <SectionHeading
        id="venue-title"
        eyebrow={t.venue.eyebrow}
        title={t.venue.title}
      />

      <Reveal delay={0.2} className="mt-14 sm:mt-16">
        <div className="plate relative mx-auto max-w-4xl px-6 py-14 sm:px-12 sm:py-16 lg:px-16">
          {/* Ornamental rose, sunk into the plate */}
          <CompassRose
            className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 text-gold/[0.07] sm:h-[32rem] sm:w-[32rem]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 text-gold/25"
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
              <p className="eyebrow">{t.venue.placeLabel}</p>
            </RevealItem>

            <RevealItem className="mt-6">
              <p className="display gold-leaf text-[clamp(1.85rem,7vw,3.4rem)] leading-[1.1]">
                {wedding.venue.name}
              </p>
            </RevealItem>

            <RevealItem className="mt-4">
              <p className="text-[0.7rem] font-light uppercase tracking-[0.36em] text-sand/70">
                {wedding.venue.subName}
              </p>
            </RevealItem>

            <RevealItem className="mt-10 w-full">
              <dl className="grid grid-cols-1 divide-y divide-gold/12 border-y border-gold/12 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {details.map((item) => (
                  <div key={item.label} className="px-2 py-7 sm:px-4">
                    <dt className="eyebrow">{item.label}</dt>
                    <dd className="mt-3 text-[clamp(0.9rem,2.8vw,1.05rem)] font-light text-ivory/90">
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

            <RevealItem className="mt-10 flex items-center gap-4 text-gold/60">
              <span className="hairline h-px w-8" />
              <Diamond className="h-2 w-2" />
              <span className="hairline h-px w-8" />
            </RevealItem>

            <RevealItem className="mt-8">
              <p className="measure display text-[clamp(1rem,3vw,1.25rem)] font-light italic leading-relaxed text-ivory/80">
                {t.venue.note}
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </Reveal>
    </Section>
  );
}

export default Venue;
