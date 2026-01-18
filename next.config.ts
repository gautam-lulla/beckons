import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
      {
        protocol: "https",
        hostname: "media.sphereos.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "backend-production-162b.up.railway.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
