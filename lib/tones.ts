/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SURFACES — the papers the invitation is printed on
 * ─────────────────────────────────────────────────────────────────────────────
 *  The page is not one sheet. It alternates between two families:
 *
 *    · LUXURY WHITE — warm ivory stock, lit from above, with a fine gold rule.
 *      Never plain white: there is always a warm gradient, paper grain and a
 *      hairline frame in it.
 *
 *    · CHAMPAGNE GOLD — a deeper, foiled stock with a metallic sheen swept
 *      across it. Never yellow: the sweep stays inside the champagne/antique
 *      range and gets its "metal" from the contrast between its stops.
 *
 *  Plus two half-steps, cream and beige, so the rhythm has somewhere to rest.
 *
 *  `SECTION_SURFACES` below is the single source of truth for both the order
 *  and the surface of every section; `app/page.tsx` renders them in exactly
 *  this order. Each section blends into the two beside it, so the change of
 *  paper happens across a long band and never on a hard line.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type SurfaceName = "ivory" | "cream" | "champagne" | "beige";

export type Surface = {
  /** The flat tone used for blending into the neighbouring sections. */
  base: string;
  /** The character of the sheet itself, painted over the blend. */
  gradient: string;
  /** A metallic sweep. Only the foiled stocks carry one. */
  sheen: string | null;
  /** Paper grain strength on this stock. */
  grain: number;
  /** The hairline rule printed just inside the edges. */
  rule: string;
  /**
   * Gold has to be re-mixed for the ground it sits on: the pale highlights
   * that read as metal on ivory disappear entirely on champagne. These feed
   * `.gold-leaf` and the small gold type — see `app/globals.css`.
   */
  leaf: [string, string, string, string, string];
  goldText: string;
  goldLine: string;
};

export const SURFACE: Record<SurfaceName, Surface> = {
  /* ── LUXURY WHITE ─────────────────────────────────────────────────────── */
  ivory: {
    base: "#fbf8f1",
    gradient:
      "linear-gradient(178deg, #fefdf9 0%, #fbf8f1 34%, #f7f1e5 74%, #f3ebda 100%)",
    sheen: null,
    grain: 0.05,
    rule: "rgba(168,129,63,0.28)",
    leaf: ["#6d5124", "#96742f", "#c9ab6d", "#a8813f", "#7a5b28"],
    goldText: "#8a6a32",
    goldLine: "rgba(168,129,63,0.5)",
  },

  /* ── A half-step down, for photography ────────────────────────────────── */
  cream: {
    base: "#f3e9d6",
    gradient:
      "linear-gradient(176deg, #f8f0e1 0%, #f3e9d6 40%, #efe3c9 78%, #ebdcbe 100%)",
    sheen: null,
    grain: 0.055,
    rule: "rgba(154,117,52,0.3)",
    leaf: ["#63491f", "#8a6a2a", "#bb9a58", "#9a7739", "#6d5124"],
    goldText: "#7d5f2c",
    goldLine: "rgba(154,117,52,0.5)",
  },

  /* ── CHAMPAGNE GOLD — the foiled stock ────────────────────────────────── */
  champagne: {
    base: "#e6d2a8",
    gradient:
      "linear-gradient(174deg, #f0e1c0 0%, #e8d5ad 30%, #dfc899 62%, #e4d0a4 100%)",
    /* Two soft bands of light crossing the sheet: this is what makes it read
       as foil rather than a flat beige fill. */
    sheen:
      "linear-gradient(102deg, rgba(255,251,238,0) 8%, rgba(255,251,238,0.62) 26%, rgba(255,251,238,0) 44%, rgba(176,138,64,0.16) 62%, rgba(255,249,232,0.42) 82%, rgba(255,251,238,0) 96%)",
    grain: 0.07,
    rule: "rgba(122,90,38,0.42)",
    leaf: ["#4e3812", "#6f521d", "#9d7c3c", "#6b4f1c", "#4e3812"],
    goldText: "#63491c",
    goldLine: "rgba(112,82,34,0.55)",
  },

  /* ── WARM BEIGE, lightly foiled ───────────────────────────────────────── */
  beige: {
    base: "#eddec2",
    gradient:
      "linear-gradient(176deg, #f3e8d3 0%, #eddec2 36%, #e7d5b1 76%, #ebdbbb 100%)",
    /* Kept low: a bright sheen band on a warm stock reads as a white wash and
       the sheet stops looking like beige at all. */
    sheen:
      "linear-gradient(100deg, rgba(255,252,242,0) 16%, rgba(255,252,242,0.2) 34%, rgba(255,252,242,0) 54%, rgba(176,138,64,0.12) 72%, rgba(255,250,236,0.16) 86%, rgba(255,252,242,0) 96%)",
    grain: 0.06,
    rule: "rgba(133,99,42,0.38)",
    leaf: ["#563e15", "#785926", "#a98745", "#775923", "#563e15"],
    goldText: "#6b501f",
    goldLine: "rgba(122,90,38,0.5)",
  },
};

/**
 * Section order and the stock each one is printed on.
 *
 *   video → white → gold → cream → gold → white → beige → video
 */
export const SECTION_SURFACES = [
  { id: "hero", surface: "ivory" },
  { id: "countdown", surface: "ivory" },
  { id: "invitation", surface: "champagne" },
  { id: "couple", surface: "cream" },
  { id: "venue", surface: "champagne" },
  { id: "timeline", surface: "ivory" },
  { id: "rsvp", surface: "beige" },
  { id: "closing", surface: "champagne" },
] as const satisfies readonly { id: string; surface: SurfaceName }[];

export type SectionId = (typeof SECTION_SURFACES)[number]["id"];

export function surfaceOf(id: SectionId): Surface {
  const entry = SECTION_SURFACES.find((s) => s.id === id);
  return SURFACE[entry ? entry.surface : "ivory"];
}

/** The base tones of this section and its two neighbours. */
export function toneBand(id: SectionId): {
  tone: string;
  from: string;
  to: string;
} {
  const index = SECTION_SURFACES.findIndex((s) => s.id === id);
  const at = (i: number) =>
    SURFACE[
      SECTION_SURFACES[Math.min(Math.max(i, 0), SECTION_SURFACES.length - 1)]
        .surface
    ].base;

  return { tone: at(index), from: at(index - 1), to: at(index + 1) };
}

/**
 * The blend underneath a section: it rises out of the previous stock and
 * settles into the next, so two different papers meet across a soft band.
 */
export function blendGradient(id: SectionId): string {
  const { from, tone, to } = toneBand(id);
  return `linear-gradient(180deg, ${from} 0%, ${tone} 13%, ${tone} 87%, ${to} 100%)`;
}

/** The per-surface CSS variables that re-mix gold for this ground. */
export function surfaceVars(id: SectionId): React.CSSProperties {
  const s = surfaceOf(id);
  return {
    "--leaf-1": s.leaf[0],
    "--leaf-2": s.leaf[1],
    "--leaf-3": s.leaf[2],
    "--leaf-4": s.leaf[3],
    "--leaf-5": s.leaf[4],
    "--gold-text": s.goldText,
    "--gold-line": s.goldLine,
  } as React.CSSProperties;
}
