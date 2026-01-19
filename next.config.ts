import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-21daddc5e64940d8bfac214df111cd0c.r2.dev",
        pathname: "/**",
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
