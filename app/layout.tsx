import type { Metadata, Viewport } from "next";
import { Commissioner, Cormorant_Garamond } from "next/font/google";
import { Atmosphere } from "@/components/Atmosphere";
import { Chrome } from "@/components/Chrome";
import { Providers } from "@/components/Providers";
import wedding, { SITE_URL } from "@/data/wedding";
import { translations } from "@/data/translations";
import { getMediaAvailability } from "@/lib/media.server";
import "./globals.css";

/**
 * Editorial serif — the stand-in for Solitude until the licensed files are
 * added (see the note at the top of `app/globals.css`). Cormorant Garamond is
 * one of the few editorial serifs on Google Fonts that actually draws the
 * Tajik letters ғ ӣ қ ӯ ҳ ҷ rather than only declaring the subset.
 */
const cormorant = Cormorant_Garamond({
  /* Only the subsets this invitation actually sets: Latin for the couple's
     names and the venue, Cyrillic + Cyrillic-Ext for Tajik and Russian. */
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

/**
 * Body and UI: a quiet humanist sans that holds up at small sizes and under
 * wide tracking.
 *
 * Chosen for coverage as much as for looks — many otherwise-elegant faces
 * (Manrope, Playfair Display among them) ship a "cyrillic-ext" subset that is
 * still missing the Tajik letters ғ ӣ қ ӯ ҳ ҷ, which then drop to a system
 * fallback mid-word. Commissioner draws all of them.
 */
const commissioner = Commissioner({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-commissioner",
  display: "swap",
});

const meta = translations.tj.meta;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sino & Sayora — Wedding Invitation",
    template: "%s | Sino & Sayora",
  },
  description: meta.description,
  applicationName: "Sino & Sayora",
  keywords: [
    "Sino Sayora",
    "тӯй",
    "даъватнома",
    "свадьба",
    "wedding invitation",
    "Dushanbe",
    "Yakassaroy Grand Hall",
  ],
  authors: [{ name: "Sino & Sayora" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Sino & Sayora",
    title: "Sino & Sayora — 19.09.2026",
    description: meta.description,
    locale: "tg_TJ",
    alternateLocale: ["ru_RU", "en_US"],
    images: [
      {
        url: wedding.media.ogImage,
        width: 1200,
        height: 630,
        alt: "Sino & Sayora — 19 September 2026, Dushanbe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sino & Sayora — 19.09.2026",
    description: meta.description,
    images: [wedding.media.ogImage],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: wedding.site.themeColor,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const media = getMediaAvailability();

  return (
    /* Tajik is the default language; the switcher updates this at runtime. */
    <html lang="tg" className={`${cormorant.variable} ${commissioner.variable}`}>
      <body className="grain relative min-h-screen antialiased">
        <Providers media={media}>
          <Atmosphere />
          {children}
          <Chrome />
        </Providers>
      </body>
    </html>
  );
}
