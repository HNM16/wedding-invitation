import { Blossom, DecorativeRing } from "@/components/ui/Decor";

/**
 * The ornament printed across the join between two sheets.
 *
 * It sits *on* the boundary rather than inside either section: the wrapper has
 * no height, so the motif overflows equally into the paper above and below and
 * the two stocks meet behind it. Purely decorative.
 */
export function Seam({
  motif = "rings",
}: {
  motif?: "rings" | "blossom" | "leaf";
}) {
  return (
    <div
      aria-hidden="true"
      className="relative z-10 flex h-0 items-center justify-center"
    >
      <span className="flex items-center gap-4 text-[var(--gold-line)] sm:gap-6">
        <span
          className="h-px w-10 sm:w-16"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent, currentColor)",
          }}
        />
        {motif === "rings" ? (
          <DecorativeRing className="h-5 w-8 text-[color:var(--gold-text)] sm:h-6 sm:w-10" />
        ) : null}
        {motif === "blossom" ? (
          <Blossom className="h-4 w-4 text-[color:var(--gold-text)] sm:h-5 sm:w-5" />
        ) : null}
        {motif === "leaf" ? (
          <svg
            viewBox="0 0 24 12"
            className="h-3 w-7 text-[color:var(--gold-text)] sm:h-4 sm:w-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
          >
            <path d="M12 6c-3-3.4-7-4.2-10.5-4C4 5 7.6 6.6 12 6Z" />
            <path d="M12 6c3-3.4 7-4.2 10.5-4C20 5 16.4 6.6 12 6Z" />
            <circle cx="12" cy="6" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        ) : null}
        <span
          className="h-px w-10 sm:w-16"
          style={{
            backgroundImage:
              "linear-gradient(90deg, currentColor, transparent)",
          }}
        />
      </span>
    </div>
  );
}

export default Seam;
