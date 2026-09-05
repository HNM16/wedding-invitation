"use client";

import { useEffect, useState } from "react";
import wedding from "@/data/wedding";
import { useI18n } from "@/lib/i18n";

/**
 * The map.
 *
 * Driven by `VENUE_MAP_EMBED_URL` in `data/wedding.ts` — the one place the
 * location is defined — using the key-less Maps embed, so the invitation needs
 * no API key or billing account to deploy.
 *
 * Reachability is probed before the frame is mounted. An iframe fires `load`
 * even when the request was blocked — it loads the browser's own grey error
 * page — so `onLoad` cannot tell success from failure, while a `no-cors` fetch
 * can. Where Google is unreachable (a corporate network, a filtered
 * connection), the guest gets the drawn plate and the "Open in Maps" button
 * above it rather than a broken frame.
 */
export function VenueMap() {
  const { t } = useI18n();
  const [state, setState] = useState<"checking" | "ready" | "unavailable">(
    "checking",
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    fetch(wedding.venue.mapEmbedUrl, {
      mode: "no-cors",
      signal: controller.signal,
    })
      .then(() => {
        if (!cancelled) setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("unavailable");
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return (
    <div className="plate relative overflow-hidden">
      {/* Drawn fallback: visible until (and unless) the embed paints over it */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(160deg, #f6efe1 0%, #efe5d2 55%, #e9dcc4 100%)",
        }}
      >
        <svg
          viewBox="0 0 200 120"
          className="h-full w-full opacity-[0.35]"
          fill="none"
          stroke="#a8813f"
          strokeWidth="0.4"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 15} x2="200" y2={i * 15} opacity="0.5" />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 15} y1="0" x2={i * 15} y2="120" opacity="0.5" />
          ))}
          <path d="M0 74h84l14-22h102" strokeWidth="1.1" />
          <path d="M62 0v52l36 22v46" strokeWidth="0.9" opacity="0.8" />
          <circle cx="98" cy="52" r="5" strokeWidth="1.2" />
          <circle cx="98" cy="52" r="1.6" fill="#a8813f" stroke="none" />
        </svg>
      </div>

      {state === "ready" ? (
        <iframe
          src={wedding.venue.mapEmbedUrl}
          title={t.venue.mapLabel}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="relative block h-[16rem] w-full border-0 sm:h-[20rem] lg:h-[24rem]"
          style={{ filter: "saturate(0.72) sepia(0.16) contrast(0.96)" }}
        />
      ) : (
        <div className="relative flex h-[16rem] w-full items-end justify-center px-8 pb-7 text-center sm:h-[20rem] lg:h-[24rem]">
          <p
            className="text-[0.72rem] font-light leading-relaxed text-ink-soft"
            style={{ opacity: state === "unavailable" ? 1 : 0 }}
          >
            {t.venue.mapUnavailable}
          </p>
        </div>
      )}

      {/* A warm wash so the map belongs to the palette rather than fighting it */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{ backgroundColor: "rgba(233,220,196,0.28)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(214,190,150,0.5) 100%)",
        }}
      />
    </div>
  );
}

export default VenueMap;
