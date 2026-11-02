import type { NextConfig } from "next";

const eve = process.env.EVE_UPSTREAM ?? "http://localhost:2000";

const nextConfig: NextConfig = {
  cacheComponents: true,
  async rewrites() {
    return [
      { source: "/eve/:path*", destination: `${eve}/eve/:path*` },
      { source: "/.well-known/workflow/:path*", destination: `${eve}/.well-known/workflow/:path*` },
    ];
  },
};

export default nextConfig;
