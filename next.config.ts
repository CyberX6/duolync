import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/feed",
        permanent: false,
      },
    ];
  },
  webpack(config) {
    // Allow mp4 and other media assets to be imported as URLs
    config.module?.rules?.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name].[hash][ext]",
      },
    });

    return config;
  },
};

export default nextConfig;
