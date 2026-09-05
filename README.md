# Sino & Sayora — Wedding Invitation

A premium digital wedding invitation for **Sino & Sayora**
19 September 2026 · 17:30 · Yakassaroy Grand Hall (Plof Centre), Dushanbe.

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
| `VENUE_MAPS_URL` | Replace with the exact Google Maps place link (Maps → the venue → Share → Copy link). The shipped value is a name-based Maps search, which resolves but is less precise. |
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
| `public/videos/wedding.mp4` | Hero plays the poster still instead. Nothing breaks, no request is made. |
| `public/audio/wedding-song.mp3` | The floating music control does not render at all. |
| `public/images/couple-1..3.jpg`, `hero-poster.jpg`, `closing.jpg`, `og-image.jpg` | Elegant placeholders ship in the repo and are already in place — overwrite them at the same paths. |
| `public/fonts/Solitude.woff2` | The site sets in Cormorant Garamond — see *Typography*. |

Media presence is resolved **on the server** (`lib/media.server.ts`), so a
missing file costs no browser request and logs nothing in the console. Adding a
file takes effect on the next build.

Regenerate the placeholder plates any time with:

```bash
node scripts/generate-placeholders.mjs
```

---

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
- The opening veil can be dismissed with `Escape`; the page content is in the
  DOM underneath it and remains crawlable.

---

## Structure

```
app/            layout (fonts, metadata, icons), page, global stylesheet
components/     Hero, Countdown, InvitationMessage, CoupleGallery, Venue,
                Timeline, RSVP, ClosingSection, OpeningVeil, MusicPlayer,
                LanguageSwitcher, Atmosphere, ui/ (Section, Reveal, Ornaments)
data/           wedding.ts (configuration) · translations.ts (all copy)
lib/            i18n, audio, gate, media, countdown, motion, reduced-motion
public/         images · videos · audio · fonts
scripts/        generate-placeholders.mjs
```
