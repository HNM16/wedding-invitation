/**
 * Generates the placeholder photography shipped in /public/images.
 *
 * These exist so the invitation looks finished before the couple's real photos
 * arrive — each one is a warm, dark plate carrying the monogram and the file
 * name it should be replaced with. Drop real JPGs over them at the same paths
 * and nothing else needs to change.
 *
 *   node scripts/generate-placeholders.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = new URL("../public/images/", import.meta.url).pathname;

const plates = [
  { file: "hero-poster.jpg", w: 1920, h: 1080, caption: "hero-poster.jpg", glow: [0.42, 0.3], bleed: true },
  { file: "couple.jpg", w: 1400, h: 1750, caption: "couple.jpg", glow: [0.5, 0.34] },
  { file: "closing.jpg", w: 1920, h: 1200, caption: "closing.jpg", glow: [0.5, 0.28], bleed: true },
  { file: "og-image.jpg", w: 1200, h: 630, caption: null, glow: [0.5, 0.38], og: true },
];

function svg({ w, h, caption, glow, og, bleed }) {
  const min = Math.min(w, h);
  const inset = Math.round(min * 0.045);
  const mono = Math.round(min * 0.055);
  const label = Math.round(min * 0.016);
  const title = Math.round(min * 0.075);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stop-color="#fbf6ec"/>
      <stop offset="48%" stop-color="#f2e8d6"/>
      <stop offset="100%" stop-color="#e6d8bf"/>
    </linearGradient>
    <radialGradient id="glow" cx="${glow[0]}" cy="${glow[1]}" r="0.72">
      <stop offset="0%" stop-color="#fffdf6" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="#f6ecd6" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#e6d8bf" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.86" cy="0.86" r="0.6">
      <stop offset="0%" stop-color="#dcc6a0" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#e6d8bf" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.46" r="0.78">
      <stop offset="42%" stop-color="#8a6a32" stop-opacity="0"/>
      <stop offset="100%" stop-color="#8a6a32" stop-opacity="0.22"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0.3">
      <stop offset="0%" stop-color="#7d5f2c"/>
      <stop offset="35%" stop-color="#c2a065"/>
      <stop offset="65%" stop-color="#a8813f"/>
      <stop offset="100%" stop-color="#7d5f2c"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#ground)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <rect width="${w}" height="${h}" fill="url(#glow2)"/>
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.05" style="mix-blend-mode:multiply"/>
  <rect width="${w}" height="${h}" fill="url(#vignette)"/>

  <rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${h - inset * 2}"
        fill="none" stroke="#a8813f" stroke-opacity="0.35" stroke-width="1"/>

  <g transform="translate(${w / 2}, ${bleed ? h - min * 0.075 : h / 2})" text-anchor="middle">
    ${
      bleed
        ? /* Full-bleed plates sit behind headline type, so the marker stays a
             quiet line along the bottom edge instead of a centred monogram. */
          `<text font-family="'DejaVu Sans', sans-serif" font-size="${label * 0.95}" fill="#a1957f" letter-spacing="${label * 0.3}">PLACEHOLDER  ·  ${caption}</text>`
        : og
        ? `<text y="${-title * 0.15}" font-family="Georgia, 'DejaVu Serif', serif" font-size="${title}" fill="url(#gold)" letter-spacing="4">Sino &amp; Sayora</text>
    <text y="${title * 0.95}" font-family="Georgia, 'DejaVu Serif', serif" font-size="${label * 1.9}" fill="#5b4c3f" letter-spacing="10">19 . 09 . 2026</text>
    <text y="${title * 1.75}" font-family="'DejaVu Sans', sans-serif" font-size="${label * 1.2}" fill="#8a7a68" letter-spacing="6">DUSHANBE  ·  TAJIKISTAN</text>`
        : `<path d="M0,${-mono} L${mono},0 L0,${mono} L${-mono},0 Z" fill="none" stroke="url(#gold)" stroke-opacity="0.65" stroke-width="1.2"/>
    <text y="${mono * 0.28}" font-family="Georgia, 'DejaVu Serif', serif" font-size="${mono * 0.78}" fill="url(#gold)" letter-spacing="2">S&amp;S</text>
    <text y="${mono * 2.6}" font-family="'DejaVu Sans', sans-serif" font-size="${label}" fill="#8a7a68" letter-spacing="${label * 0.34}">PLACEHOLDER</text>
    <text y="${mono * 2.6 + label * 2.2}" font-family="'DejaVu Sans', sans-serif" font-size="${label * 0.92}" fill="#a1957f" letter-spacing="${label * 0.18}">${caption}</text>`
    }
  </g>
</svg>`;
}

await mkdir(OUT, { recursive: true });

for (const plate of plates) {
  const buffer = Buffer.from(svg(plate));
  await sharp(buffer, { density: 144 })
    .resize(plate.w, plate.h, { fit: "fill" })
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(OUT + plate.file);
  console.log("wrote", plate.file);
}

/* Apple touch icon — the monogram on the deep ground. */
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7d5f2c"/>
      <stop offset="45%" stop-color="#c2a065"/>
      <stop offset="100%" stop-color="#8a6a32"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" fill="#f8f3e9"/>
  <path d="M90 24 156 90 90 156 24 90 Z" fill="none" stroke="url(#g)" stroke-opacity="0.55" stroke-width="1.5"/>
  <circle cx="90" cy="90" r="72" fill="none" stroke="url(#g)" stroke-opacity="0.3" stroke-width="1"/>
  <text x="90" y="105" text-anchor="middle" font-family="Georgia, 'DejaVu Serif', serif" font-size="52" fill="url(#g)" letter-spacing="2">S&amp;S</text>
</svg>`;

await sharp(Buffer.from(icon), { density: 288 })
  .resize(180, 180)
  .png()
  .toFile(new URL("../app/apple-icon.png", import.meta.url).pathname);
console.log("wrote app/apple-icon.png");
