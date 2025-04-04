import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = { experiment: { serverComponentsExternalPackages: ['pdf-parse'], }, };

export default nextConfig;