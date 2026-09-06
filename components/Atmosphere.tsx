import { SURFACE } from "@/lib/tones";

/**
 * The base sheet.
 *
 * Each section now paints its own paper tone (see `lib/tones.ts`), so this
 * layer is only what sits underneath them all: the base ivory plus two very
 * soft washes of warm light. It shows during overscroll and behind anything
 * translucent, and keeps the page from ever flashing white.
 */
export function Atmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: SURFACE.ivory.base }}
    >
      <div
        className="absolute -left-[16%] -top-[20%] h-[70vh] w-[80vw] rounded-full blur-[120px]"
        style={{
          backgroundImage:
            "radial-gradient(closest-side, rgba(255,250,236,0.9), rgba(240,226,196,0.35) 55%, transparent 100%)",
        }}
      />
      <div
        className="absolute -bottom-[22%] -right-[12%] h-[65vh] w-[70vw] rounded-full blur-[130px]"
        style={{
          backgroundImage:
            "radial-gradient(closest-side, rgba(226,206,168,0.45), transparent 100%)",
        }}
      />
    </div>
  );
}

export default Atmosphere;
