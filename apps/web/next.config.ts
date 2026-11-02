import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  async rewrites() {
    return [
      { source: "/eve/:path*", destination: "http://localhost:2000/eve/:path*" },
      { source: "/.well-known/workflow/:path*", destination: "http://localhost:2000/.well-known/workflow/:path*" },
    ];
  },
};

export default nextConfig;