/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PAPER TONES
 * ─────────────────────────────────────────────────────────────────────────────
 *  The invitation is not printed on one sheet. Each section sits on its own
 *  paper tone — ivory, cream, champagne, beige — and every band blends into the
 *  two beside it, so the page reads as one continuous invitation rather than a
 *  stack of coloured blocks.
 *
 *  The order below is the single source of truth: change a tone here and both
 *  the section and its two seams follow. `app/page.tsx` renders sections in
 *  exactly this order.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const TONE = {
  /** The base sheet — warmest white on the page. */
  ivory: "#faf6ee",
  /** A half-step down: panels and quieter passages. */
  cream: "#f5ecdc",
  /** Champagne — where gold has the most to react against. */
  champagne: "#eee0c4",
  /** The deepest paper, kept for photography and the closing frame. */
  beige: "#e5d3b3",
} as const;

export type ToneName = keyof typeof TONE;

/** Section order and the tone each one is printed on. */
export const SECTION_TONES = [
  { id: "hero", tone: "ivory" },
  { id: "countdown", tone: "champagne" },
  { id: "invitation", tone: "ivory" },
  { id: "couple", tone: "beige" },
  { id: "venue", tone: "cream" },
  { id: "timeline", tone: "champagne" },
  { id: "rsvp", tone: "ivory" },
  { id: "closing", tone: "beige" },
] as const satisfies readonly { id: string; tone: ToneName }[];

export type SectionId = (typeof SECTION_TONES)[number]["id"];

export type ToneBand = {
  /** The section's own tone. */
  tone: string;
  /** The tone it rises out of. */
  from: string;
  /** The tone it settles into. */
  to: string;
};

/**
 * The three tones a section needs: its own, and its neighbours' on each side.
 * The first and last sections blend into themselves, so the page opens and
 * closes on a flat tone rather than a seam.
 */
export function toneBand(id: SectionId): ToneBand {
  const index = SECTION_TONES.findIndex((s) => s.id === id);
  const at = (i: number) =>
    TONE[SECTION_TONES[Math.min(Math.max(i, 0), SECTION_TONES.length - 1)].tone];

  return {
    tone: at(index),
    from: at(index - 1),
    to: at(index + 1),
  };
}

/**
 * A vertical wash that starts in the previous section's tone, holds this
 * section's tone through the middle, and arrives at the next one — so the
 * change of paper happens across a long, soft band and never on a hard line.
 */
export function toneGradient(id: SectionId): string {
  const { from, tone, to } = toneBand(id);
  return `linear-gradient(180deg, ${from} 0%, ${tone} 16%, ${tone} 84%, ${to} 100%)`;
}
