/**
 * The paper the invitation is printed on.
 *
 * A fixed stack of warm ivory washes, two slow pools of sunlight and a few dust
 * motes drifting through them. Everything is pure CSS on `transform`/`opacity`
 * only — no JavaScript runs per frame, nothing repaints on scroll, and the
 * whole layer is `pointer-events: none`, so it costs almost nothing on a phone.
 *
 * Mote positions are a fixed table (never random) so server and client markup
 * always match.
 */

const MOTES = [
  { left: "9%", top: "76%", size: 3, delay: 0, duration: 19, drift: "20px", peak: 0.32 },
  { left: "22%", top: "60%", size: 2, delay: 5, duration: 23, drift: "-16px", peak: 0.24 },
  { left: "35%", top: "86%", size: 2.5, delay: 9.5, duration: 21, drift: "24px", peak: 0.3 },
  { left: "48%", top: "68%", size: 2, delay: 3, duration: 26, drift: "-22px", peak: 0.2 },
  { left: "60%", top: "82%", size: 3, delay: 13, duration: 20, drift: "14px", peak: 0.28 },
  { left: "71%", top: "64%", size: 2, delay: 7, duration: 24, drift: "-18px", peak: 0.22 },
  { left: "83%", top: "78%", size: 2.5, delay: 16, duration: 22, drift: "22px", peak: 0.26 },
  { left: "93%", top: "70%", size: 2, delay: 4, duration: 27, drift: "-12px", peak: 0.18 },
];

export function Atmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Ground: ivory warming toward champagne at the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(115% 75% at 50% -8%, rgba(255,252,246,0.95) 0%, rgba(248,243,233,0) 62%)",
            "radial-gradient(85% 55% at 6% 104%, rgba(233,220,196,0.62) 0%, rgba(248,243,233,0) 64%)",
            "radial-gradient(80% 55% at 97% 40%, rgba(238,228,206,0.6) 0%, rgba(248,243,233,0) 60%)",
            "linear-gradient(180deg, #faf6ee 0%, #f8f3e9 36%, #f4ecdd 70%, #f8f3e9 100%)",
          ].join(","),
        }}
      />

      {/* Sunlight — warm, drifting slowly across the upper third */}
      <div
        className="absolute -left-[16%] -top-[20%] h-[75vh] w-[85vw] rounded-full blur-[110px] will-change-transform"
        style={{
          backgroundImage:
            "radial-gradient(closest-side, rgba(255,246,224,0.9), rgba(240,226,196,0.4) 55%, transparent 100%)",
          animation: "drift-a 34s ease-in-out infinite",
        }}
      />

      {/* Counter-drifting champagne wash near the lower right */}
      <div
        className="absolute -bottom-[24%] -right-[12%] h-[70vh] w-[75vw] rounded-full blur-[130px] will-change-transform"
        style={{
          backgroundImage:
            "radial-gradient(closest-side, rgba(226,206,168,0.5), rgba(216,191,140,0.22) 58%, transparent 100%)",
          animation: "drift-b 46s ease-in-out infinite",
        }}
      />

      {/* Dust in the light */}
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={
            {
              left: m.left,
              top: m.top,
              width: m.size,
              height: m.size,
              backgroundColor: "rgba(168,129,63,0.55)",
              boxShadow: "0 0 5px 1px rgba(216,191,140,0.45)",
              animation: `ember ${m.duration}s linear ${m.delay}s infinite`,
              "--ember-x": m.drift,
              "--ember-peak": m.peak,
              opacity: 0,
            } as React.CSSProperties
          }
        />
      ))}

      {/* The page edges settle very slightly, the way printed paper does */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(125% 92% at 50% 45%, transparent 55%, rgba(150,122,80,0.12) 100%)",
        }}
      />
    </div>
  );
}

export default Atmosphere;
