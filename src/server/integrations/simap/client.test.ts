import { describe, expect, it } from "vitest";
import { FixtureSimapClient, mapNotice, parseSimapUrl, SAMPLE_NOTICE_URL } from "./client";
import sampleNotice from "./fixtures/sample-notice.json";

describe("parseSimapUrl", () => {
  it("extracts ids from path segments", () => {
    expect(parseSimapUrl("https://www.simap.ch/de/project/289123/publication/1456789")).toEqual({
      projectId: "289123",
      publicationId: "1456789",
    });
  });

  it("extracts ids from query params", () => {
    expect(
      parseSimapUrl("https://www.simap.ch/notice?projectId=289123&publicationId=1456789"),
    ).toEqual({ projectId: "289123", publicationId: "1456789" });
  });

  it("rejects non-SIMAP hosts (TND-002)", () => {
    expect(parseSimapUrl("https://evil.example/project/1/publication/2")).toBeNull();
    expect(parseSimapUrl("https://ted.europa.eu/x/289123/1456789")).toBeNull();
  });

  it("rejects malformed or id-less URLs", () => {
    expect(parseSimapUrl("not a url")).toBeNull();
    expect(parseSimapUrl("https://www.simap.ch/")).toBeNull();
  });
});

describe("mapNotice", () => {
  it("maps the recorded fixture to display fields and keeps raw verbatim", () => {
    const notice = mapNotice(
      { projectId: "289123", publicationId: "1456789" },
      SAMPLE_NOTICE_URL,
      sampleNotice,
    );
    expect(notice.title).toBe("Beschaffung von Cloud-Infrastruktur und Betriebsleistungen");
    expect(notice.authority).toBe("Bundesamt fuer Informatik und Telekommunikation BIT");
    expect(notice.procedureType).toBe("OPEN");
    expect(notice.publicationDate).toBe("2026-05-20");
    // raw is the verbatim JSON of the source, unmodified (LEG-002).
    expect(JSON.parse(notice.raw)).toEqual(sampleNotice);
  });

  it("tolerates missing fields (best-effort display, raw still stored)", () => {
    const notice = mapNotice({ projectId: "1", publicationId: "2" }, "https://www.simap.ch/x", {
      unexpected: true,
    });
    expect(notice.title).toBeNull();
    expect(notice.authority).toBeNull();
    expect(notice.raw).toBe('{"unexpected":true}');
  });
});

describe("FixtureSimapClient", () => {
  it("returns the sample notice for its URL", async () => {
    const client = new FixtureSimapClient();
    const result = await client.fetchNotice(SAMPLE_NOTICE_URL);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.notice.projectId).toBe("289123");
  });

  it("reports invalid-url and not-found distinctly", async () => {
    const client = new FixtureSimapClient();
    expect(await client.fetchNotice("https://evil.example/1/2")).toEqual({
      ok: false,
      reason: "invalid-url",
    });
    expect(await client.fetchNotice("https://www.simap.ch/project/999/publication/999")).toEqual({
      ok: false,
      reason: "not-found",
    });
  });
});
