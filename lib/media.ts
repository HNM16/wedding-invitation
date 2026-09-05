"use client";

import { createContext, useContext } from "react";

export type MediaAvailability = {
  /** `public/videos/wedding.mp4` is present. */
  video: boolean;
  /** `public/audio/wedding-song.mp3` is present. */
  audio: boolean;
};

export const MediaContext = createContext<MediaAvailability>({
  video: false,
  audio: false,
});

export function useMediaAvailability(): MediaAvailability {
  return useContext(MediaContext);
}
