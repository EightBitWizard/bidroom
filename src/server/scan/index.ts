/**
 * Malware scanning for uploaded documents (WP-012, R-SCAN-04). The scan is fail-closed: only an
 * explicit clean result allows the bytes to be stored. Production runs ClamAV in the parsing
 * Container (wiring deferred to provisioning); dev and tests use a stub that flags the EICAR
 * test signature. The real Container is required before any real customer document is processed
 * (docs/OPERATOR_TODO.md).
 */
export interface ScanResult {
  clean: boolean;
}

export interface Scanner {
  scan(bytes: ArrayBuffer): Promise<ScanResult>;
}

// The standard EICAR antivirus test string (not real malware). The stub flags it so the
// fail-closed gate is exercised end to end without shipping a real virus sample.
const EICAR_SIGNATURE = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";

export class StubScanner implements Scanner {
  async scan(bytes: ArrayBuffer): Promise<ScanResult> {
    const text = new TextDecoder().decode(bytes);
    return { clean: !text.includes(EICAR_SIGNATURE) };
  }
}

/** The minimal Container stub surface (a subset of the Cloudflare Container binding). */
export interface ContainerLike {
  fetch(request: Request): Promise<Response>;
}

/**
 * Scans by invoking the parsing Container. Fail-closed: a non-2xx response, a malformed body, or
 * anything other than an explicit `{ clean: true }` is treated as not clean. The Container image
 * and binding are provisioned later; until then the stub is used.
 */
export class ContainerScanner implements Scanner {
  constructor(private readonly container: ContainerLike) {}

  async scan(bytes: ArrayBuffer): Promise<ScanResult> {
    const res = await this.container.fetch(
      new Request("https://parser.internal/scan", { method: "POST", body: bytes }),
    );
    if (!res.ok) throw new Error("scan_unavailable");
    const data = (await res.json()) as { clean?: unknown };
    return { clean: data.clean === true };
  }
}
