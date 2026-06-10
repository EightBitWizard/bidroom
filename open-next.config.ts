import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// OpenNext configuration for deploying the Next.js app to Cloudflare Workers (ADR 0002).
// The dossier pipeline runs in a separate Worker (wrangler.pipeline.jsonc); this config is
// for the web tier only.
export default defineCloudflareConfig({});
