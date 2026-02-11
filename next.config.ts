import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   typescript: {
    // !! Ignore TS errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
