/**
 * Object storage for uploaded documents (WP-012). The bytes live in R2 (`jurisdiction=eu`,
 * ADR 0002); this interface keeps the service testable. Production wraps the `env.DOCS` R2
 * binding; tests use an in-memory map.
 */
export interface Storage {
  put(key: string, bytes: ArrayBuffer): Promise<void>;
  get(key: string): Promise<ArrayBuffer | null>;
  delete(key: string): Promise<void>;
}

export class MemoryStorage implements Storage {
  private readonly objects = new Map<string, ArrayBuffer>();

  async put(key: string, bytes: ArrayBuffer): Promise<void> {
    this.objects.set(key, bytes);
  }

  async get(key: string): Promise<ArrayBuffer | null> {
    return this.objects.get(key) ?? null;
  }

  async delete(key: string): Promise<void> {
    this.objects.delete(key);
  }

  /** Test helper: whether an object exists. */
  has(key: string): boolean {
    return this.objects.has(key);
  }
}

/** The minimal R2 bucket surface used here (a subset of the Cloudflare R2 binding). */
export interface R2Like {
  put(key: string, value: ArrayBuffer): Promise<unknown>;
  get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer> } | null>;
  delete(key: string): Promise<void>;
}

export class R2Storage implements Storage {
  constructor(private readonly bucket: R2Like) {}

  async put(key: string, bytes: ArrayBuffer): Promise<void> {
    await this.bucket.put(key, bytes);
  }

  async get(key: string): Promise<ArrayBuffer | null> {
    const object = await this.bucket.get(key);
    return object ? await object.arrayBuffer() : null;
  }

  async delete(key: string): Promise<void> {
    await this.bucket.delete(key);
  }
}

/** The R2 object key for a dossier file: workspace/dossier/file (tenant-prefixed). */
export function storageKey(workspaceId: string, dossierId: string, fileId: string): string {
  return `${workspaceId}/${dossierId}/${fileId}`;
}
