# Sino & Sayora — Wedding Invitation

A premium digital wedding invitation for **Sino & Sayora**
19 September 2026 · 17:30 · Yakassaroy Grand Hall (Plof Centre), Dushanbe.

It opens as a sealed envelope on ivory paper. The guest taps it, the wax seal
breaks, the flap folds back, the card rises out and grows to fill the screen,
and the invitation itself is revealed with the music already playing.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Framer Motion.
Mobile-first, three languages, no runtime dependencies beyond those four.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

---

## The three things you will actually want to edit

### 1. `data/wedding.ts` — every wedding detail

Names, the countdown instant, the venue, the Maps link, the timeline, the media
paths and the RSVP settings. Nothing in this file is duplicated inside a
component.

Two values are marked **▸ EDIT ME**:

| Value | What to do |
| --- | --- |
| `VENUE_COORDINATES` | `null`. Set it to `{ lat, lng }` and both the embedded map and the "Open in Maps" button pin the venue exactly. Get the numbers from Google Maps: right-click the venue → the first menu item is `lat, lng` → click to copy. Until then the map resolves the venue by name (`VENUE_MAPS_QUERY`), which works but is less precise. |
| `wedding.rsvp.endpoint` | `null` today. Point it at an API route or form endpoint to start collecting replies — see *RSVP* below. |

The **timeline times are placeholders** apart from the 17:30 arrival, which is
the only confirmed one. They are flagged in the file (`confirmed: false`) and
the site shows a note telling guests the times may still shift. Change the
`time` values before sending the invitation out.

### 2. `data/translations.ts` — every visible word

Tajik (`tj`) is the source dictionary and the default language on first visit;
Russian and English are typed against it, so a missing or misspelled key is a
build error rather than a blank space on the page.

### 3. `public/` — the couple's media

| Drop the file at | What it does if missing |
| --- | --- |
| `public/videos/wedding-video.mp4` | Hero shows the poster still instead. Nothing breaks, nothing is requested. |
| `public/audio/music.mp3` | The music control does not render and the envelope opens silently. |
| `public/images/couple.jpg`, `hero-poster.jpg`, `closing.jpg`, `og-image.jpg` | Elegant placeholders ship in the repo and are already in place — overwrite them at the same paths. |
| `public/fonts/Solitude.woff2` | The site sets in Cormorant Garamond — see *Typography*. |

Media presence is resolved **on the server** (`lib/media.server.ts`), so a
missing file costs no browser request and logs nothing in the console. Adding a
file takes effect on the next build.

Regenerate the placeholder plates any time with:

```bash
node scripts/generate-placeholders.mjs
```

---

## The opening ceremony

`components/envelope/` holds the sealed envelope. The sequence is a small state
machine — `sealed → breaking → opening → rising → expanding → done` — and the
beats are all in one `BEAT` table at the top of `Envelope.tsx`, so the pacing
can be retuned in one place. It settles in about 3.5 seconds.

Three things worth knowing before editing it:

- The envelope is stacked paper panels inside a single `preserve-3d` context,
  so the flap genuinely rotates behind the envelope rather than being hidden
  by a z-index. Anything that must paint *over* the envelope has to live
  outside that context — inside it, an element with no `translateZ` sorts
  behind the front panel, and SVG gradients and filters are dropped entirely.
  That is why the wax seal is a sibling of the envelope, not a child of the flap.
- The card grows by animating a real rectangle from its measured position to
  the viewport, not by scaling, so the type never smears. The growing sheet is
  mounted at the scene root because a transformed ancestor becomes the
  containing block even for `position: fixed`.
- The tap is what lets the browser start audio, so the music begins there
  rather than fighting an autoplay policy.

**Replaying it.** The ceremony plays once per session (`sessionStorage`). To see
it again, load the page with `#replay` in the URL, or call
`__resetInvitation()` from the browser console.

Under `prefers-reduced-motion` the whole sequence collapses into a short fade —
the tap is still required, so the music still starts.

## Music and the film

Both are the couple's own files, at exactly these paths:

```
public/videos/wedding-video.mp4
public/audio/music.mp3
```

**The music starts on the tap that opens the envelope.** That gesture is what
lets a browser begin audio at all, so it is the one the invitation uses — there
is no second click, and no "press play to start" step. The floating control
takes over afterwards for pause and resume.

**The film is the hero section**, not a video inside a card: a full-bleed layer
at `position: absolute; inset: 0; object-fit: cover`, with the couple's names
set over a warm scrim above it. It is used a second time behind the closing
frame, from the same file, held paused until that section is actually on screen
— a second video decoding through the whole page is what ruins a phone.

Neither is touched while the envelope is still sealed: no `<video>` is mounted,
nothing is fetched, nothing is decoded. `lib/hero-video.ts` holds that rule,
along with the one exception — `prefers-reduced-motion`, where a looping
background film is exactly what the preference asks us not to run and the
poster stands in.

## Typography

The display face is **Solitude — Elegant Editorial Font** by rautanstudio. It is
a commercial licence, so the files are not in this repository. To switch it on:

1. Put the licensed web files at `public/fonts/Solitude.woff2` (and `.woff`).
2. Uncomment the `@font-face` block at the top of `app/globals.css`.

Nothing else changes — `"Solitude"` already sits first in the display stack, and
an undeclared family is simply skipped by the browser, so no request is made
while the files are absent.

Until then the site sets in **Cormorant Garamond** (display) and
**Commissioner** (body). Both were chosen for coverage as much as for looks:
Tajik needs ғ ӣ қ ӯ ҳ ҷ, and several otherwise-elegant Google faces — Manrope
and Playfair Display among them — ship a `cyrillic-ext` subset that does not
actually draw those letters, so they drop to a system fallback mid-word.

---

## Palette and paper tones

The invitation is printed on warm paper, not staged in the dark — and not on
one sheet. Each section has its own tone, and every band blends into the two
beside it, so the page reads as one continuous invitation rather than a stack
of coloured blocks.

`lib/tones.ts` is the single source of truth: it holds the four papers and the
order the sections are printed in.

| Section | Tone | |
| --- | --- | --- |
| hero | ivory | the film settles into the countdown's champagne |
| countdown | champagne | where gold has the most to react against |
| invitation | ivory | back to the base sheet for the longest read |
| couple | beige | the deepest paper, behind the photograph |
| venue | cream | |
| timeline | champagne | |
| rsvp | ivory | so the white form plate lifts off it |
| closing | beige | |

`Section` reads its band from that table and paints
`prev → own → next` as one long vertical wash, so a change of paper happens
across the whole section and never on a hard line. Reordering sections in
`app/page.tsx` means reordering the table too — they must agree.

Two things worth knowing before editing:

- `light` on `<Section>` places a soft pool of warm light (top / left / right)
  so each sheet is lit differently. Keep it faint: a stronger pool washes the
  paper back toward ivory and the section stops reading as its own tone.
- `.plate` is deliberately lighter than *every* paper in the family rather than
  a fixed cream, so a raised card lifts off ivory and beige alike.

Gold is used only for headings, numbers, ornaments and borders; body copy is
warm brown ink so it stays readable. One thing to watch: `.gold-leaf` is a
gradient clipped to the glyphs, and on a light ground the pale highlights that
read as metal on black simply vanish. The gradient keeps a narrow bright band
between deeper stops for that reason — lightening it overall makes the text
disappear rather than shine.

## Languages

`TJ / RU / EN`, Tajik by default. The choice is kept in `localStorage` and
applied to `<html lang>` on every change. The switcher renders Tajik first and
never mixes languages within a render.

---

## Countdown

The target is stored as one absolute instant:

```ts
WEDDING_DATE_ISO = "2026-09-19T17:30:00+05:00"   // Asia/Dushanbe, no DST
```

Because the offset is pinned, a guest in Dushanbe, Moscow or New York sees the
same number of days remaining. Values render only after mount (the server has
no "now"), which also keeps hydration silent. When the date passes, the section
replaces the digits with a wedding-day message rather than counting negative.

---

## RSVP

The form validates name, phone and attendance in the active language, moves
focus to the first invalid field, exposes errors through `role="alert"` +
`aria-describedby`, and only asks for a guest count when the answer is yes.

While `wedding.rsvp.endpoint` is `null`, **nothing is stored** — the form says
so plainly, both under the heading and in the confirmation panel, instead of
implying a reply was recorded. Set the endpoint and the same submit handler
POSTs this JSON to it:

```jsonc
{
  "name": "…",
  "phone": "…",
  "attendance": "yes" | "no",
  "guests": 2,              // 0 when not attending
  "message": "…",
  "submittedAt": "2026-09-01T12:00:00.000Z"
}
```

A non-2xx response surfaces the localized failure message and keeps the guest's
answers in the form.

---

## Motion & accessibility

- Every animation is opacity/transform only; the ambient background is pure CSS
  and never repaints on scroll.
- `prefers-reduced-motion` is honoured everywhere. It is read through
  `useSyncExternalStore` (`lib/reduced-motion.ts`) rather than at first paint,
  so the preference cannot cause a hydration mismatch.
- Reveals are triggered on the unclipped wrapper, never on the element parked
  behind an `overflow: hidden` mask — an IntersectionObserver intersects against
  ancestor clip rects and would otherwise never fire.
- Skip link, labelled sections, focus-visible gold ring, 44px+ tap targets,
  16px form fields (so iOS does not zoom on focus).
- The envelope can be opened with `Escape` as well as a tap, so it is never a
  trap; the page content sits in the DOM underneath it and stays crawlable.

---

## The map

`components/VenueMap.tsx` embeds the key-less Google Maps frame built from
`data/wedding.ts`, so no API key or billing account is needed to deploy.

Reachability is probed with a `no-cors` fetch before the frame is mounted: an
iframe fires `load` even when the request was blocked (it loads the browser's
own error page), so `onLoad` cannot tell success from failure. Where Google is
unreachable — a filtered network, a corporate connection — the guest gets a
drawn plate and the "Open in Maps" button instead of a grey broken frame.

## Structure

```
app/            layout (fonts, metadata, icons), page, global stylesheet
components/     Hero, Countdown, InvitationMessage, CouplePortrait, Venue,
                VenueMap, Timeline, RSVP, ClosingSection, MusicPlayer,
                LanguageSwitcher, EdgeDetails, Atmosphere
components/envelope/  Envelope (the opening ceremony) · WaxSeal
components/ui/  Section, SectionHeading, Reveal, Ornaments,
                Decor (DecorativeRing, FloralOrnament, Blossom, GoldDivider)
data/           wedding.ts (configuration) · translations.ts (all copy)
lib/            i18n, audio, gate, media, countdown, motion, reduced-motion
public/         images · videos · audio · fonts
scripts/        generate-placeholders.mjs
```
