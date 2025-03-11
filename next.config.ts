import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'frontend-take-home.fetch.com',
        protocol: 'https',
      },
    ],
  },
};

export default nextConfig;
