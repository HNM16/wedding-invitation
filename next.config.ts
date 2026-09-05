import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 414, 640, 768, 1024, 1280, 1536, 1920, 2560],
  },
};

export default nextConfig;
