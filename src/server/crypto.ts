/**
 * Server-side crypto primitives for magic-link tokens and signed session cookies.
 * Uses the Web Crypto API only (crypto.getRandomValues, crypto.subtle), so the same
 * code runs on Cloudflare Workers and under the Node test runner. No secrets are logged.
 * Ported from moola's reviewed implementation (ADR 0003); the crypto core is unchanged.
 */

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

const encoder = new TextEncoder();

// The Web Crypto types want an ArrayBuffer-backed view; encoded bytes qualify at
// runtime, so assert the union type to satisfy the (over-strict) lib signature.
const buf = (bytes: Uint8Array): BufferSource => bytes as BufferSource;

/** A cryptographically-random, URL-safe token (default 32 bytes). */
export function randomToken(byteLength = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

/** SHA-256 of a string as lowercase hex. Used to store only token hashes, never the token. */
export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buf(encoder.encode(input)));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** HMAC-SHA256 of a message with a secret, as lowercase hex. */
export async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, buf(encoder.encode(message)));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time string comparison (equal length assumed for hex digests). */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    buf(encoder.encode(secret)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export interface SessionPayload {
  /** Account id. */
  sub: string;
  /** Expiry, epoch seconds. */
  exp: number;
  /**
   * The account's session version at issue time. A session is only valid while it matches
   * the stored version; bumping the version revokes all outstanding sessions (ADR 0003).
   */
  ver: number;
}

/**
 * Sign a session payload into a compact `base64url(json).base64url(hmac)` token. The
 * HMAC is over the encoded payload with the server session secret.
 */
export async function signSession(payload: SessionPayload, secret: string): Promise<string> {
  const body = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, buf(encoder.encode(body)));
  return `${body}.${bytesToBase64Url(new Uint8Array(sig))}`;
}

/**
 * Verify a session token: checks the HMAC (constant-time via subtle.verify) and the
 * expiry. Returns the payload, or null if the signature is invalid, the token is
 * malformed, or it has expired. `nowSeconds` is injectable for deterministic tests.
 */
export async function verifySession(
  token: string,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): Promise<SessionPayload | null> {
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const key = await hmacKey(secret);
  let valid = false;
  try {
    valid = await crypto.subtle.verify(
      "HMAC",
      key,
      buf(base64UrlToBytes(sig)),
      buf(encoder.encode(body)),
    );
  } catch {
    return null;
  }
  if (!valid) return null;
  let payload: SessionPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(body))) as SessionPayload;
  } catch {
    return null;
  }
  if (
    typeof payload.sub !== "string" ||
    typeof payload.exp !== "number" ||
    typeof payload.ver !== "number"
  ) {
    return null;
  }
  if (!Number.isInteger(payload.ver)) return null;
  // Reject non-finite/non-integer expiries: a forged `1e400` parses to Infinity, passes
  // the typeof check, and would read as never-expiring. Guard the path even though only
  // the in-repo signer issues tokens today.
  if (!Number.isInteger(payload.exp)) return null;
  if (payload.exp <= nowSeconds) return null;
  return payload;
}
