import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Local dev only: avoids broken root-owned `.next` from `sudo npm run dev`.
  // Vercel and production builds must use the default `.next` output directory.
  ...(isDev ? { distDir: ".next-dev" } : {}),
};

export default nextConfig;
