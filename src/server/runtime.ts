import { getCloudflareContext } from "@opennextjs/cloudflare";
import { buildContext, type CloudflareEnv, type ServerContext } from "./context";

/**
 * Resolve the server context from the live Cloudflare environment. Kept separate from
 * `context.ts` so the pure `buildContext` (and its tests) do not import the Worker-only
 * `@opennextjs/cloudflare` module. Returns null when there is no request scope or the
 * backend is not configured, so the API routes respond 503.
 */
export function resolveServerContext(): ServerContext | null {
  try {
    return buildContext(getCloudflareContext().env as unknown as CloudflareEnv);
  } catch {
    return null;
  }
}
