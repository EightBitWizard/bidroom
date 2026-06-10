import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;

// The Cloudflare dev integration (initOpenNextCloudflareForDev) is wired in WP-002 so
// `next dev` can mirror the Workers runtime once the D1, R2, and KV bindings exist.
