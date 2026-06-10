import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;

// Mirror the Cloudflare Workers runtime during `next dev` so the D1, R2, and KV bindings
// (declared in wrangler.jsonc) are available locally. No effect on the production build.
initOpenNextCloudflareForDev();
