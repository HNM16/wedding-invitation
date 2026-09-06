import { openSync, readSync, closeSync, existsSync } from "node:fs";
import path from "node:path";
import wedding from "./data/wedding";
import type { NextConfig } from "next";

/**
 * The real media type of the music file, read from its first bytes.
 *
 * Music exported from a phone or an editor is very often AAC inside an MP4
 * container even when it is named `.mp3`. Chrome sniffs and plays it anyway;
 * iOS Safari trusts the `Content-Type` and refuses — and most guests will open
 * this on a phone. So the type is sniffed at build time and sent correctly,
 * whatever the file happens to be called.
 *
 * Returns `null` when there is nothing to correct, and the header is skipped.
 */
function sniffAudioType(publicPath: string): string | null {
  const file = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
  if (!existsSync(file)) return null;

  const head = Buffer.alloc(12);
  const fd = openSync(file, "r");
  try {
    readSync(fd, head, 0, 12, 0);
  } finally {
    closeSync(fd);
  }

  if (head.subarray(4, 8).toString("latin1") === "ftyp") return "audio/mp4";
  if (head.subarray(0, 4).toString("latin1") === "OggS") return "audio/ogg";
  if (head.subarray(0, 4).toString("latin1") === "fLaC") return "audio/flac";
  if (head.subarray(0, 4).toString("latin1") === "RIFF") return "audio/wav";
  if (
    head.subarray(0, 3).toString("latin1") === "ID3" ||
    (head[0] === 0xff && (head[1] & 0xe0) === 0xe0)
  ) {
    return "audio/mpeg";
  }
  return null;
}

const audioType = sniffAudioType(wedding.media.audio);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 414, 640, 768, 1024, 1280, 1536, 1920, 2560],
  },
  async headers() {
    if (!audioType) return [];
    return [
      {
        source: wedding.media.audio,
        headers: [
          { key: "Content-Type", value: audioType },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
