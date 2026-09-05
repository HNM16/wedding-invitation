/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WEDDING CONFIGURATION — Sino & Sayora
 * ─────────────────────────────────────────────────────────────────────────────
 *  This is the single source of truth for every wedding detail, media path and
 *  external link used on the site. Edit values here only — nothing below is
 *  hardcoded inside components.
 *
 *  All human-readable copy (in Tajik / Russian / English) lives in
 *  `data/translations.ts`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** IANA time zone of the wedding venue. Dushanbe is UTC+5 all year (no DST). */
export const WEDDING_TIME_ZONE = "Asia/Dushanbe";

/**
 * The single instant the countdown targets.
 * The `+05:00` offset pins it to Dushanbe local time, so the countdown is
 * identical for a guest in Dushanbe, Moscow, London or New York.
 *
 * 19 September 2026, 17:30 (Asia/Dushanbe)
 */
export const WEDDING_DATE_ISO = "2026-09-19T17:30:00+05:00";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MAP — the single place the venue location is defined
 * ─────────────────────────────────────────────────────────────────────────────
 *  The map is driven by a search query rather than invented coordinates, so
 *  Google resolves the real place itself.
 *
 *  Note the spelling: the hall is indexed by Google and local directories as
 *  "Yakkasaroy" (double k) on Rahimi St / Markazi Osh — Markazi Osh being the
 *  plov centre. The invitation displays the couple's own spelling
 *  ("Yakassaroy"); only the lookup below uses the indexed one, because that is
 *  what actually resolves.
 *
 *  ▸ EDIT ME (optional, but recommended before sending):
 *    Set `VENUE_COORDINATES` to the venue's exact latitude/longitude and the
 *    embedded map will drop a precise pin there instead of relying on the
 *    search. Get them from Google Maps: right-click the venue → the first item
 *    in the menu is "lat, lng" → click to copy.
 */
export const VENUE_MAPS_QUERY = "Yakkasaroy Grand Hall, Rahimi St, Dushanbe";

export type Coordinates = { lat: number; lng: number };

/** ▸ EDIT ME: `{ lat: 38.5xxxx, lng: 68.7xxxx }` once confirmed. */
export const VENUE_COORDINATES: Coordinates | null = null;

/** Link opened by the "Open in Maps" button — resolves in any Maps app. */
function buildMapsUrl(at: Coordinates | null) {
  const query = at ? `${at.lat},${at.lng}` : VENUE_MAPS_QUERY;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Embedded map source. This form of the Maps embed needs no API key and no
 * billing account, which keeps the invitation deployable anywhere.
 */
function buildMapEmbedUrl(at: Coordinates | null) {
  const query = at ? `${at.lat},${at.lng}` : VENUE_MAPS_QUERY;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${at ? 16 : 15}&output=embed`;
}

export const VENUE_MAPS_URL = buildMapsUrl(VENUE_COORDINATES);
export const VENUE_MAP_EMBED_URL = buildMapEmbedUrl(VENUE_COORDINATES);

/** Public site URL, used for canonical + Open Graph metadata. */
export const SITE_URL = "https://sino-sayora.wedding";

export const wedding = {
  couple: {
    /** Latin spellings used for the display typography. */
    groom: "Sino",
    bride: "Sayora",
    /** Ampersand glyph rendered between the two names. */
    connector: "&",
  },

  date: {
    iso: WEDDING_DATE_ISO,
    timeZone: WEDDING_TIME_ZONE,
    /** Pre-formatted display strings (kept literal so they never shift). */
    day: "19",
    month: "09",
    year: "2026",
    short: "19.09.2026",
    time: "17:30",
  },

  venue: {
    name: "Yakassaroy Grand Hall",
    subName: "Plof Centre",
    city: "Dushanbe",
    country: "Tajikistan",
    mapsUrl: VENUE_MAPS_URL,
    mapEmbedUrl: VENUE_MAP_EMBED_URL,
  },

  /**
   * ─────────────────────────────────────────────────────────────────────────
   *  TIMELINE — ▸ PLACEHOLDER TIMES, EDIT BEFORE SENDING TO GUESTS
   * ─────────────────────────────────────────────────────────────────────────
   *  Only the arrival time (17:30) is confirmed. Every following time is a
   *  reasonable placeholder. Change `time` here; the titles and descriptions
   *  for each `id` are translated in `data/translations.ts` → timeline.events.
   *
   *  To add an event: add an entry here, then add the same `id` to all three
   *  languages in translations.ts (TypeScript will flag anything missing).
   */
  timeline: [
    { id: "arrival", time: "17:30", confirmed: true },
    { id: "ceremony", time: "18:00", confirmed: false },
    { id: "celebration", time: "19:00", confirmed: false },
    { id: "dinner", time: "20:00", confirmed: false },
    { id: "firstDance", time: "21:30", confirmed: false },
    { id: "farewell", time: "23:00", confirmed: false },
  ],

  /**
   * ─────────────────────────────────────────────────────────────────────────
   *  MEDIA
   * ─────────────────────────────────────────────────────────────────────────
   *  Every path below is optional at runtime: if a file is missing, the site
   *  degrades gracefully (the hero falls back to its poster image, the music
   *  control hides itself) instead of showing a broken element.
   *
   *  ▸ Drop the couple's real files at these exact paths:
   *      public/videos/wedding.mp4                  — hero film (muted, looping)
   *      public/audio/clarity-roie-shpigler.mp3     — "Clarity", Roie Shpigler
   *      public/images/couple.jpg                   — the portrait
   */
  /** Shown quietly beside the music control. */
  music: {
    title: "Clarity",
    artist: "Roie Shpigler",
  },

  media: {
    heroVideo: "/videos/wedding.mp4",
    heroPoster: "/images/hero-poster.jpg",
    closingImage: "/images/closing.jpg",
    audio: "/audio/clarity-roie-shpigler.mp3",
    /** The single editorial portrait of the couple. */
    portrait: { src: "/images/couple.jpg", width: 1400, height: 1750 },
    ogImage: "/images/og-image.jpg",
  },

  rsvp: {
    /**
     * ▸ EDIT ME: set to an API route or form endpoint (e.g. "/api/rsvp",
     *   a Google Apps Script URL, or a Formspree endpoint) to start collecting
     *   answers. While this is `null` the form validates and confirms locally
     *   and tells the guest, honestly, that replies are not being stored yet.
     */
    endpoint: null as string | null,
    /** Upper bound for the "number of guests" stepper. */
    maxGuests: 10,
    /** ▸ PLACEHOLDER: RSVP deadline shown under the form. */
    deadline: { day: "01", month: "09", year: "2026" },
  },

  site: {
    url: SITE_URL,
    /** Browser theme colour (matches the ivory paper ground). */
    themeColor: "#F7F1E6",
  },
} as const;

export type TimelineEventId = (typeof wedding.timeline)[number]["id"];

/** The countdown target as a `Date`. Same instant for every visitor, anywhere. */
export const WEDDING_DATE = new Date(WEDDING_DATE_ISO);

export default wedding;
