import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use a user-owned build dir (avoids broken root-owned `.next` from `sudo npm run dev`)
  distDir: ".next-dev",
};

export default nextConfig;
