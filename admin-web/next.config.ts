import type { NextConfig } from "next";

const backend =
  process.env.BACKEND_URL?.trim() || process.env.API_URL?.trim() || "http://127.0.0.1:4000";

const backendBase = backend.replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendBase}/api/:path*`,
      },
      {
        source: "/public/:path*",
        destination: `${backendBase}/public/:path*`,
      },
    ];
  },
};

export default nextConfig;
