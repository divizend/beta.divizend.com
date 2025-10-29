import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "divizend.com",
      },
    ],
  },
};

export default nextConfig;
