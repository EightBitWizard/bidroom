import { describe, expect, it } from "vitest";
import { isSameOriginRequest } from "./http";

function req(headers: Record<string, string>): Request {
  return new Request("https://app.bidroom.example/api/x", { method: "POST", headers });
}

describe("isSameOriginRequest", () => {
  it("passes when no Origin and no Sec-Fetch-Site are present (non-browser clients)", () => {
    expect(isSameOriginRequest(req({}))).toBe(true);
  });

  it("passes a same-host Origin", () => {
    expect(isSameOriginRequest(req({ origin: "https://app.bidroom.example" }))).toBe(true);
  });

  it("rejects a cross-host Origin", () => {
    expect(isSameOriginRequest(req({ origin: "https://evil.example" }))).toBe(false);
  });

  it("rejects a malformed Origin", () => {
    expect(isSameOriginRequest(req({ origin: "not a url" }))).toBe(false);
  });

  it("passes same-origin and none Sec-Fetch-Site, rejects cross-site", () => {
    expect(isSameOriginRequest(req({ "sec-fetch-site": "same-origin" }))).toBe(true);
    expect(isSameOriginRequest(req({ "sec-fetch-site": "none" }))).toBe(true);
    expect(isSameOriginRequest(req({ "sec-fetch-site": "cross-site" }))).toBe(false);
    expect(isSameOriginRequest(req({ "sec-fetch-site": "same-site" }))).toBe(false);
  });
});
