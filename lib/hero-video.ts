"use client";

import wedding from "@/data/wedding";
import { useMediaQuerySafe, usePrefersFrugalData } from "@/lib/client-env";
import { useMediaAvailability } from "@/lib/media";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

/**
 * Decides whether the hero film should play at all, and which cut to use.
 *
 * The poster is always painted, so every "no" here simply leaves a still
 * photograph rather than an empty frame:
 *
 *  · no file → nothing to play;
 *  · reduced motion → a looping film is exactly what that preference asks us
 *    not to run;
 *  · Save-Data, or a 2g/3g connection → a guest on a metered phone should not
 *    be made to download a background video;
 *  · a narrow screen with `wedding-hero-mobile.mp4` present → the smaller cut.
 */
export function useHeroVideo(): { src: string | null } {
  const { video, videoMobile } = useMediaAvailability();
  const reduced = useReducedMotionSafe();
  const frugal = usePrefersFrugalData();
  const narrow = useMediaQuerySafe("(max-width: 767px)");

  if (!video || reduced || frugal) return { src: null };

  return {
    src:
      narrow && videoMobile
        ? wedding.media.heroVideoMobile
        : wedding.media.heroVideo,
  };
}
