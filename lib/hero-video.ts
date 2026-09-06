"use client";

import wedding from "@/data/wedding";
import { useGate } from "@/lib/gate";
import { useMediaAvailability } from "@/lib/media";
import { useReducedMotionSafe } from "@/lib/reduced-motion";

/**
 * The hero film's source, or `null` when no film should play.
 *
 * Three conditions, in order of importance:
 *
 *  · the invitation must be open. Nothing of the site exists behind the sealed
 *    envelope, so the video is not mounted, not fetched and not decoded until
 *    the guest has opened it;
 *  · the file has to be there;
 *  · `prefers-reduced-motion` is honoured — a looping background film is
 *    exactly what that preference asks us not to run.
 *
 * The poster is painted in every case, so a `null` here leaves a still frame
 * rather than an empty rectangle.
 */
export function useHeroVideo(): { src: string | null } {
  const { video } = useMediaAvailability();
  const { opened } = useGate();
  const reduced = useReducedMotionSafe();

  if (!opened || !video || reduced) return { src: null };
  return { src: wedding.media.heroVideo };
}
