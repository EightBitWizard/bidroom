import { describe, expect, it } from "vitest";
import { ContainerScanner, type ContainerLike, StubScanner } from "./index";

const EICAR = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";

function bytes(s: string): ArrayBuffer {
  const u = new TextEncoder().encode(s);
  return u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength) as ArrayBuffer;
}

function container(handler: () => Response | Promise<Response>): ContainerLike {
  return { fetch: async () => handler() };
}

describe("StubScanner", () => {
  it("flags the EICAR signature, passes clean content", async () => {
    const s = new StubScanner();
    expect((await s.scan(bytes("clean tender"))).clean).toBe(true);
    expect((await s.scan(bytes(EICAR))).clean).toBe(false);
  });
});

describe("ContainerScanner (fail-closed)", () => {
  it("is clean only for an explicit { clean: true }", async () => {
    const s = new ContainerScanner(container(() => Response.json({ clean: true })));
    expect((await s.scan(bytes("x"))).clean).toBe(true);
  });

  it("treats { clean: false } as not clean", async () => {
    const s = new ContainerScanner(container(() => Response.json({ clean: false })));
    expect((await s.scan(bytes("x"))).clean).toBe(false);
  });

  it("treats a malformed body as not clean", async () => {
    const s = new ContainerScanner(container(() => Response.json({ other: 1 })));
    expect((await s.scan(bytes("x"))).clean).toBe(false);
  });

  it("throws on a non-2xx response (so the service fails closed)", async () => {
    const s = new ContainerScanner(container(() => new Response("", { status: 500 })));
    await expect(s.scan(bytes("x"))).rejects.toThrow();
  });
});
