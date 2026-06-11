import sampleNotice from "./fixtures/sample-notice.json";

/**
 * SIMAP notice client (WP-011, ADR 0004). SIMAP exposes a public, read-only JSON API
 * (no auth); a single publication is GET /publications/v1/project/{projectId}/
 * publication-details/{publicationId}. We fetch one notice that the user pasted, store the
 * response verbatim (LEG-002), and extract a few display fields best-effort. External calls
 * are mocked with a recorded fixture in tests (the default); the exact id-extraction and
 * field mapping are refined against a real notice URL, and the contract test catches drift.
 */

const SIMAP_HOSTS = new Set(["simap.ch", "www.simap.ch"]);
const API_BASE = "https://www.simap.ch/api";
const FETCH_TIMEOUT_MS = 10_000;

export interface SimapNotice {
  projectId: string;
  publicationId: string;
  url: string;
  authority: string | null;
  title: string | null;
  procedureType: string | null;
  publicationDate: string | null;
  /** The verbatim API response JSON. Stored unmodified as the source of record (LEG-002). */
  raw: string;
}

export type SimapFetchResult =
  | { ok: true; notice: SimapNotice }
  | { ok: false; reason: "invalid-url" | "not-found" | "fetch-error" };

export interface SimapClient {
  fetchNotice(url: string): Promise<SimapFetchResult>;
}

export interface SimapNoticeRef {
  projectId: string;
  publicationId: string;
}

/**
 * Extract the SIMAP project and publication ids from a pasted notice URL, or null if the URL
 * is not a recognizable SIMAP notice (TND-002). Tolerant of several URL shapes (query params
 * or path segments); refined against a real notice URL during rollout.
 */
export function parseSimapUrl(raw: string): SimapNoticeRef | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!SIMAP_HOSTS.has(url.host.toLowerCase())) return null;

  const q = url.searchParams;
  const projectId =
    numeric(q.get("projectId")) ?? numeric(q.get("project")) ?? pathAfter(url, "project");
  const publicationId =
    numeric(q.get("publicationId")) ??
    numeric(q.get("publication")) ??
    numeric(q.get("pub")) ??
    pathAfter(url, "publication");
  if (projectId && publicationId) return { projectId, publicationId };

  // Fallback: the last two numeric path segments (e.g. /.../<projectId>/<publicationId>).
  const nums = url.pathname.split("/").filter((s) => /^\d+$/.test(s));
  if (nums.length >= 2) {
    return { projectId: nums[nums.length - 2]!, publicationId: nums[nums.length - 1]! };
  }
  return null;
}

function numeric(value: string | null): string | null {
  return value && /^\d+$/.test(value) ? value : null;
}

function pathAfter(url: URL, key: string): string | null {
  const parts = url.pathname.split("/");
  const i = parts.findIndex((p) => p.toLowerCase() === key);
  const next = i >= 0 ? parts[i + 1] : undefined;
  return next && /^\d+$/.test(next) ? next : null;
}

/** Read the first non-empty string at any of the dotted paths, or null. */
function pick(data: unknown, paths: string[]): string | null {
  for (const path of paths) {
    let cursor: unknown = data;
    for (const key of path.split(".")) {
      cursor =
        cursor && typeof cursor === "object" ? (cursor as Record<string, unknown>)[key] : undefined;
    }
    if (typeof cursor === "string" && cursor.trim()) return cursor.trim();
  }
  return null;
}

/** Map a raw SIMAP publication response into the display notice; `raw` stays verbatim. */
export function mapNotice(ref: SimapNoticeRef, url: string, data: unknown): SimapNotice {
  return {
    projectId: ref.projectId,
    publicationId: ref.publicationId,
    url,
    title: pick(data, ["projectTitle", "title", "description", "object"]),
    authority: pick(data, [
      "contractingAuthority.name",
      "purchaser.name",
      "authority.name",
      "authority",
    ]),
    procedureType: pick(data, ["procedureType", "procedure", "typeOfProcedure"]),
    publicationDate: pick(data, ["publicationDate", "datePublication", "publishedAt"]),
    raw: JSON.stringify(data),
  };
}

/** Live client: fetches the public SIMAP API. Used only when SIMAP_USE_FIXTURES is not set. */
export class HttpSimapClient implements SimapClient {
  async fetchNotice(url: string): Promise<SimapFetchResult> {
    const ref = parseSimapUrl(url);
    if (!ref) return { ok: false, reason: "invalid-url" };
    const endpoint = `${API_BASE}/publications/v1/project/${ref.projectId}/publication-details/${ref.publicationId}`;
    try {
      const res = await fetch(endpoint, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (res.status === 404) return { ok: false, reason: "not-found" };
      if (!res.ok) return { ok: false, reason: "fetch-error" };
      const data: unknown = await res.json();
      return { ok: true, notice: mapNotice(ref, url, data) };
    } catch {
      return { ok: false, reason: "fetch-error" };
    }
  }
}

/**
 * Fixture client: resolves notices from a recorded map keyed by `projectId:publicationId`.
 * The default fixture covers the sample notice used in tests and local development.
 */
export class FixtureSimapClient implements SimapClient {
  constructor(private readonly fixtures: Record<string, unknown> = DEFAULT_FIXTURES) {}

  async fetchNotice(url: string): Promise<SimapFetchResult> {
    const ref = parseSimapUrl(url);
    if (!ref) return { ok: false, reason: "invalid-url" };
    const data = this.fixtures[`${ref.projectId}:${ref.publicationId}`];
    if (data === undefined) return { ok: false, reason: "not-found" };
    return { ok: true, notice: mapNotice(ref, url, data) };
  }
}

export const DEFAULT_FIXTURES: Record<string, unknown> = {
  [`${sampleNotice.projectId}:${sampleNotice.publicationId}`]: sampleNotice,
};

/** The URL for the bundled sample notice, for tests and local development. */
export const SAMPLE_NOTICE_URL = `https://www.simap.ch/de/project/${sampleNotice.projectId}/publication/${sampleNotice.publicationId}`;
