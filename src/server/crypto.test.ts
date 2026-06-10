import { describe, expect, it } from "vitest";
import {
  randomToken,
  sha256Hex,
  signSession,
  timingSafeEqual,
  verifySession,
  type SessionPayload,
} from "./crypto";

const SECRET = "x".repeat(40);
const NOW = 1_780_000_000; // fixed epoch seconds

describe("crypto", () => {
  it("generates URL-safe random tokens of distinct values", () => {
    const a = randomToken();
    const b = randomToken();
    expect(a).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(a).not.toBe(b);
  });

  it("hashes deterministically", async () => {
    expect(await sha256Hex("token")).toBe(await sha256Hex("token"));
    expect(await sha256Hex("a")).not.toBe(await sha256Hex("b"));
  });

  it("compares in constant time by value", () => {
    expect(timingSafeEqual("abc", "abc")).toBe(true);
    expect(timingSafeEqual("abc", "abd")).toBe(false);
    expect(timingSafeEqual("abc", "abcd")).toBe(false);
  });

  it("signs and verifies a session round-trip", async () => {
    const payload: SessionPayload = { sub: "acc-1", exp: NOW + 3600, ver: 1 };
    const token = await signSession(payload, SECRET);
    expect(await verifySession(token, SECRET, NOW)).toEqual(payload);
  });

  it("rejects a tampered payload", async () => {
    const token = await signSession({ sub: "acc-1", exp: NOW + 3600, ver: 1 }, SECRET);
    const [body, sig] = token.split(".");
    const forged = `${body}x.${sig}`;
    expect(await verifySession(forged, SECRET, NOW)).toBeNull();
  });

  it("rejects a wrong secret", async () => {
    const token = await signSession({ sub: "acc-1", exp: NOW + 3600, ver: 1 }, SECRET);
    expect(await verifySession(token, "y".repeat(40), NOW)).toBeNull();
  });

  it("rejects an expired session", async () => {
    const token = await signSession({ sub: "acc-1", exp: NOW - 1, ver: 1 }, SECRET);
    expect(await verifySession(token, SECRET, NOW)).toBeNull();
  });

  it("rejects a forged non-integer (Infinity) expiry", async () => {
    // Hand-craft a payload with exp = 1e400 (Infinity) and a valid signature, to confirm the
    // integer guard rejects a never-expiring token even from a valid signer.
    const body = btoa(JSON.stringify({ sub: "acc-1", exp: 1e400, ver: 1 }))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
    const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuf)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(await verifySession(`${body}.${sig}`, SECRET, NOW)).toBeNull();
  });

  it("rejects a malformed token", async () => {
    expect(await verifySession("no-dot", SECRET, NOW)).toBeNull();
    expect(await verifySession(".onlyfront", SECRET, NOW)).toBeNull();
  });
});
