import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ⬅️ Reduce dependencies during deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;
