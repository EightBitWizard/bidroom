# 0005 - Document storage and the fail-closed scan boundary

- Status: accepted
- Date: 2026-06-11

## Context

WP-012 lets a user attach the tender documents to a dossier. Uploaded files carry personal data and
commercial strategy (Class A), and they are attacker-controlled input that later reaches parsers, so
a malware-scan boundary is a P0 control (ADR 0003, R-SCAN-04). The bytes are stored in R2
(`jurisdiction=eu`, ADR 0002). The ClamAV Container and live R2 are not provisioned yet, so the
design must let the upload logic and the security gate be built and tested now behind interfaces.

## Decisions

1. Two interfaces, dependency-injected so the service is unit-tested without infrastructure:
   - `Storage` (`put`/`get`/`delete`): `R2Storage` wraps the `env.DOCS` R2 binding in production;
     `MemoryStorage` in tests and local development.
   - `Scanner` (`scan(bytes) -> { clean }`): `ContainerScanner` invokes the parsing Container
     (`getContainer(env.PARSER, id).fetch(...)`; wiring deferred to provisioning); `StubScanner`
     flags the EICAR test signature in dev and tests.
2. The scan is fail-closed (R-SCAN-04). A file is registered with `status=failed` and is promoted to
   `stored` only after an explicit clean scan. A dirty result, a scanner error, or a non-`{clean:true}`
   Container response leaves the file `failed` and the bytes are never written to R2. Type and size
   are checked from the bytes (magic-byte sniff, not the client mime): only PDF and DOCX are accepted
   (TND-004); oversize (50 MB cap) and unsupported types are registered with an explicit status and
   stored nothing (TND-005).
3. Upload is direct-through-Worker for now (the Worker scans the bytes before storing), which keeps
   the scan-before-store gate simple. Presigned-URL uploads (offloading bandwidth for large files)
   and constraining the Container's outbound network are deferred optimizations, noted for the
   provisioning step.
4. No application-layer encryption at rest in MVP; R2 encryption plus `jurisdiction=eu` apply. This
   is the trade-off recorded in ADR 0003 (R-DOCSTORE-03) with its revisit trigger; object keys are
   tenant-prefixed (`workspace/dossier/file`).

## Consequences

- The upload flow, the registry, and the fail-closed gate are testable now: the EICAR signature is
  blocked and unstored, a scanner error fails closed, and oversize/unsupported files are flagged but
  not stored. The real ClamAV Container is required before any real customer document is processed
  and is an operator item (`docs/OPERATOR_TODO.md`); the `StubScanner` only flags EICAR, so it is a
  dev/test aid, not production malware protection.
- Because `Scanner` and `Storage` are interfaces, provisioning the Container and binding R2 is a
  configuration change, not a code change; the service and its tests are unchanged.
