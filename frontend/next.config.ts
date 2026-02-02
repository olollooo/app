import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
   // Turbopack の設定
  turbopack: {}
};

export default nextConfig;
