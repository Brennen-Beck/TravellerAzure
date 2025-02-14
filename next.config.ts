import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ⬅️ Reduce dependencies during deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Your image domains or settings here (if applicable)
  },
  cache: {
    enabled: true, // Enabling cache for the build
  },
 
};

export default nextConfig;
