import { existsSync } from "node:fs";
import path from "node:path";
import wedding from "@/data/wedding";

/**
 * Which optional media the couple has actually added.
 *
 * Resolved on the server (at build time for this static page) rather than by
 * probing from the browser: a missing file then costs no request at all, and
 * the console stays free of 404s. Add `public/videos/wedding.mp4` or
 * `public/audio/wedding-song.mp3` and rebuild — the hero film and the music
 * control appear on their own.
 */
export function getMediaAvailability() {
  const inPublic = (file: string) =>
    existsSync(path.join(process.cwd(), "public", file.replace(/^\//, "")));

  return {
    video: inPublic(wedding.media.heroVideo),
    audio: inPublic(wedding.media.audio),
  };
}
