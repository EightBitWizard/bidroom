"use client";

import { useEffect, useState } from "react";
import { SourceDisclaimer } from "@/components/SourceDisclaimer";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";

interface DossierDetailData {
  dossier: { id: string; title: string; status: string };
  source: {
    title: string | null;
    authority: string | null;
    procedureType: string | null;
    publicationDate: string | null;
    simapUrl: string;
  };
}

type Load = "loading" | "ready" | "notfound";

/**
 * The dossier detail. Renders the official SIMAP fields unmodified under an "Official source"
 * heading with the required disclaimer (LEG-001/LEG-002), kept visually separate from the
 * "Bidroom analysis" section (ANA-004). The analysis itself arrives with the pipeline.
 */
export function DossierDetail({
  locale,
  messages,
  workspaceId,
  dossierId,
}: {
  locale: Locale;
  messages: Messages;
  workspaceId: string;
  dossierId: string;
}) {
  const t = messages.dossier;
  const [load, setLoad] = useState<Load>("loading");
  const [data, setData] = useState<DossierDetailData | null>(null);

  useEffect(() => {
    async function run() {
      try {
        const res = await fetch(`/api/workspaces/${workspaceId}/dossiers/${dossierId}`, {
          credentials: "same-origin",
        });
        if (!res.ok) return setLoad("notfound");
        setData((await res.json()) as DossierDetailData);
        setLoad("ready");
      } catch {
        setLoad("notfound");
      }
    }
    void run();
  }, [workspaceId, dossierId]);

  if (load === "loading") {
    return <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6" data-testid="dossier-loading" />;
  }

  const back = (
    <a
      href={`/${locale}/app/${workspaceId}`}
      className="text-sm text-[var(--color-accent)] underline"
    >
      {t.back}
    </a>
  );

  if (load === "notfound" || !data) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        {back}
        <p className="mt-4 text-sm text-[var(--color-muted)]">{t.notFound}</p>
      </main>
    );
  }

  const { source } = data;
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6" data-testid="dossier-detail">
      {back}
      <h1 className="mt-3 text-2xl font-semibold">{data.dossier.title}</h1>

      <section className="mt-8 rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          {t.officialSource}
        </h2>
        <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          <Field label={t.authority} value={source.authority} />
          <Field label={t.procedureType} value={source.procedureType} />
          <Field label={t.publicationDate} value={source.publicationDate} />
        </dl>
        <a
          href={source.simapUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm text-[var(--color-accent)] underline"
        >
          {t.viewOnSimap}
        </a>
        <div className="mt-4">
          <SourceDisclaimer messages={messages} />
        </div>
      </section>

      <DocumentsSection messages={messages} workspaceId={workspaceId} dossierId={dossierId} />

      <section className="mt-6 rounded-lg border border-dashed border-[var(--color-line)] p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
          {t.analysisHeading}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{t.analysisComing}</p>
      </section>
    </main>
  );
}

interface FileItem {
  id: string;
  filename: string;
  status: string;
  scanStatus: string;
}

function DocumentsSection({
  messages,
  workspaceId,
  dossierId,
}: {
  messages: Messages;
  workspaceId: string;
  dossierId: string;
}) {
  const t = messages.dossier;
  const base = `/api/workspaces/${workspaceId}/dossiers/${dossierId}/files`;
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selected, setSelected] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  async function reload() {
    const res = await fetch(base, { credentials: "same-origin" });
    if (res.ok) setFiles(((await res.json()) as { files: FileItem[] }).files);
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, dossierId]);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setUploading(true);
    setError(false);
    try {
      const form = new FormData();
      form.append("file", selected);
      const res = await fetch(base, { method: "POST", credentials: "same-origin", body: form });
      if (!res.ok) setError(true);
      setSelected(null);
      await reload();
    } catch {
      setError(true);
    } finally {
      setUploading(false);
    }
  }

  async function remove(fileId: string) {
    await fetch(`${base}/${fileId}`, { method: "DELETE", credentials: "same-origin" });
    await reload();
  }

  function statusLabel(status: string): string {
    if (status === "stored") return t.statusStored;
    if (status === "unsupported") return t.statusUnsupported;
    if (status === "too_large") return t.statusTooLarge;
    return t.statusFailed;
  }

  return (
    <section className="mt-6 rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {t.documents}
      </h2>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{t.uploadHint}</p>
      <form onSubmit={upload} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setSelected(e.target.files?.[0] ?? null)}
          data-testid="file-input"
          className="text-sm"
        />
        <button
          type="submit"
          disabled={!selected || uploading}
          data-testid="file-upload"
          className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-ink)] disabled:opacity-50"
        >
          {uploading ? t.uploading : t.upload}
        </button>
      </form>
      {error ? (
        <p className="mt-2 text-sm text-[var(--color-blocker)]" data-testid="file-upload-error">
          {t.uploadError}
        </p>
      ) : null}

      {files.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--color-muted)]" data-testid="no-files">
          {t.noFiles}
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-[var(--color-line)]">
          {files.map((f) => (
            <li key={f.id} className="flex items-center justify-between py-2 text-sm">
              <span>
                <span className="font-medium">{f.filename}</span>
                <span
                  className={`ml-2 text-xs ${f.status === "stored" ? "text-[var(--color-ok)]" : "text-[var(--color-uncertain)]"}`}
                >
                  {statusLabel(f.status)}
                </span>
              </span>
              <button
                onClick={() => remove(f.id)}
                data-testid="file-remove"
                className="text-xs text-[var(--color-muted)] underline"
              >
                {t.removeFile}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs text-[var(--color-muted)]">{label}</dt>
      <dd className="text-[var(--color-ink)]">{value ?? "-"}</dd>
    </div>
  );
}
