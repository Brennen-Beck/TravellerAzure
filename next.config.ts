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
  webpack(config, { isServer }) {
    if (!isServer) {
      // Enable caching for client-side builds
      config.cache = {
        type: 'filesystem', // This will cache the build files on disk
        buildDependencies: {
          config: [__filename], // Ensure that the cache is invalidated when the config changes
        },
      };
    }
    return config;
  },
};

export default nextConfig;
