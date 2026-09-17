import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@westwinds/ui", "@westwinds/data", "@westwinds/lib"],
};

export default nextConfig;
