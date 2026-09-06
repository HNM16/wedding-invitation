"use client";

import { createContext, useContext } from "react";

export type MediaAvailability = {
  /** `public/videos/wedding-hero.mp4` is present. */
  video: boolean;
  /** `public/videos/wedding-hero-mobile.mp4` is present. */
  videoMobile: boolean;
  /** `public/audio/wedding-music.mp3` is present. */
  audio: boolean;
};

export const MediaContext = createContext<MediaAvailability>({
  video: false,
  videoMobile: false,
  audio: false,
});

export function useMediaAvailability(): MediaAvailability {
  return useContext(MediaContext);
}
