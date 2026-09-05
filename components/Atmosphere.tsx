/**
 * The room the invitation sits in.
 *
 * A fixed stack of layered gradients, two slow light leaks and a handful of
 * gold embers. Everything is pure CSS on `transform`/`opacity` only — no
 * JavaScript runs per frame, nothing repaints on scroll, and the whole layer is
 * `pointer-events: none`, so it costs almost nothing on a phone.
 *
 * Ember positions are a fixed table (never random) so server and client markup
 * always match.
 */

const EMBERS = [
  { left: "8%", top: "78%", size: 2.5, delay: 0, duration: 17, drift: "18px", peak: 0.4 },
  { left: "21%", top: "62%", size: 1.5, delay: 4.5, duration: 21, drift: "-14px", peak: 0.32 },
  { left: "34%", top: "88%", size: 2, delay: 9, duration: 19, drift: "22px", peak: 0.45 },
  { left: "47%", top: "70%", size: 1.5, delay: 2.5, duration: 24, drift: "-20px", peak: 0.28 },
  { left: "58%", top: "84%", size: 2.5, delay: 12, duration: 18, drift: "12px", peak: 0.42 },
  { left: "69%", top: "66%", size: 1.5, delay: 6.5, duration: 22, drift: "-16px", peak: 0.3 },
  { left: "80%", top: "80%", size: 2, delay: 15, duration: 20, drift: "20px", peak: 0.38 },
  { left: "91%", top: "72%", size: 1.5, delay: 3.5, duration: 25, drift: "-11px", peak: 0.26 },
  { left: "14%", top: "40%", size: 1.5, delay: 11, duration: 26, drift: "16px", peak: 0.22 },
  { left: "63%", top: "38%", size: 2, delay: 18, duration: 23, drift: "-18px", peak: 0.24 },
];

export function Atmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Ground: warm black falling into espresso at the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(120% 80% at 50% -10%, rgba(53,39,27,0.55) 0%, rgba(13,10,7,0) 60%)",
            "radial-gradient(90% 60% at 8% 108%, rgba(36,26,18,0.6) 0%, rgba(9,7,5,0) 62%)",
            "radial-gradient(80% 55% at 96% 42%, rgba(45,33,22,0.42) 0%, rgba(9,7,5,0) 58%)",
            "linear-gradient(180deg, #0b0806 0%, #090705 38%, #0d0a07 68%, #090705 100%)",
          ].join(","),
        }}
      />

      {/* Light leak — warm gold, drifting slowly across the upper third */}
      <div
        className="absolute -left-[18%] -top-[22%] h-[75vh] w-[85vw] rounded-full blur-[110px] will-change-transform"
        style={{
          backgroundImage:
            "radial-gradient(closest-side, rgba(194,160,92,0.16), rgba(138,106,50,0.06) 55%, transparent 100%)",
          animation: "drift-a 34s ease-in-out infinite",
        }}
      />

      {/* Light leak — deeper amber, counter-drifting near the lower right */}
      <div
        className="absolute -bottom-[26%] -right-[14%] h-[70vh] w-[75vw] rounded-full blur-[130px] will-change-transform"
        style={{
          backgroundImage:
            "radial-gradient(closest-side, rgba(138,106,50,0.14), rgba(53,39,27,0.08) 58%, transparent 100%)",
          animation: "drift-b 46s ease-in-out infinite",
        }}
      />

      {/* Gold embers */}
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={
            {
              left: e.left,
              top: e.top,
              width: e.size,
              height: e.size,
              backgroundColor: "rgba(235,217,180,0.9)",
              boxShadow: "0 0 6px 1px rgba(194,160,92,0.5)",
              animation: `ember ${e.duration}s linear ${e.delay}s infinite`,
              "--ember-x": e.drift,
              "--ember-peak": e.peak,
              opacity: 0,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Cinematic letterboxing: the frame darkens toward top and bottom */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(4,3,2,0.55) 0%, transparent 18%, transparent 82%, rgba(4,3,2,0.6) 100%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(130% 90% at 50% 45%, transparent 42%, rgba(4,3,2,0.5) 100%)",
        }}
      />
    </div>
  );
}

export default Atmosphere;
