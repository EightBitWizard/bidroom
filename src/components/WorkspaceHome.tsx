"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";

interface WorkspaceItem {
  id: string;
  name: string;
  role: string;
}

interface DossierItem {
  id: string;
  title: string;
  status: string;
}

type Load = "loading" | "ready" | "unauthorized" | "missing" | "error";

/**
 * The workspace home: the SIMAP intake form and the dossier list. Membership is enforced
 * server-side (the workspace list and the dossier list are authz-scoped endpoints), so a
 * non-member sees "not found" rather than any content.
 */
export function WorkspaceHome({
  locale,
  messages,
  workspaceId,
}: {
  locale: Locale;
  messages: Messages;
  workspaceId: string;
}) {
  const t = messages.workspace;
  const router = useRouter();
  const [load, setLoad] = useState<Load>("loading");
  const [workspace, setWorkspace] = useState<WorkspaceItem | null>(null);
  const [dossiers, setDossiers] = useState<DossierItem[]>([]);
  const [url, setUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [intakeError, setIntakeError] = useState<string | null>(null);

  async function loadDossiers() {
    const res = await fetch(`/api/workspaces/${workspaceId}/dossiers`, {
      credentials: "same-origin",
    });
    if (res.ok) {
      const data = (await res.json()) as { dossiers: DossierItem[] };
      setDossiers(data.dossiers);
    }
  }

  useEffect(() => {
    async function run() {
      try {
        const res = await fetch("/api/workspaces", { credentials: "same-origin" });
        if (res.status === 401) return setLoad("unauthorized");
        if (!res.ok) return setLoad("error");
        const data = (await res.json()) as { workspaces: WorkspaceItem[] };
        const found = data.workspaces.find((w) => w.id === workspaceId);
        if (!found) return setLoad("missing");
        setWorkspace(found);
        await loadDossiers();
        setLoad("ready");
      } catch {
        setLoad("error");
      }
    }
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  async function createDossier(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setIntakeError(null);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/dossiers`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        const data = (await res.json()) as { id: string };
        router.push(`/${locale}/app/${workspaceId}/dossiers/${data.id}`);
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setIntakeError(data.error === "invalid-url" ? t.intakeInvalidUrl : t.intakeFetchError);
    } catch {
      setIntakeError(t.intakeFetchError);
    } finally {
      setCreating(false);
    }
  }

  if (load === "loading") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6" data-testid="workspace-loading" />
    );
  }
  if (load === "unauthorized" || load === "missing" || load === "error") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <a href={`/${locale}/app`} className="text-sm text-[var(--color-accent)] underline">
          {messages.app.workspacesTitle}
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6" data-testid="workspace-home">
      <div className="flex items-center justify-between">
        <a href={`/${locale}/app`} className="text-sm text-[var(--color-accent)] underline">
          {messages.app.workspacesTitle}
        </a>
        <a
          href={`/${locale}/app/${workspaceId}/profile`}
          data-testid="profile-link"
          className="text-sm text-[var(--color-muted)] underline"
        >
          {t.companyProfile}
        </a>
      </div>
      <h1 className="mt-3 text-2xl font-semibold">{workspace?.name}</h1>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-[var(--color-muted)]">{t.newDossier}</h2>
        <form
          onSubmit={createDossier}
          className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end"
        >
          <label className="flex-1 text-xs font-medium text-[var(--color-muted)]">
            {t.simapUrlLabel}
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t.simapUrlPlaceholder}
              data-testid="dossier-url"
              className="mt-1 w-full rounded border border-[var(--color-line)] px-2 py-1.5 text-sm text-[var(--color-ink)]"
            />
          </label>
          <button
            type="submit"
            disabled={creating}
            data-testid="create-dossier"
            className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-ink)] disabled:opacity-50"
          >
            {t.createDossier}
          </button>
        </form>
        {intakeError ? (
          <p className="mt-2 text-sm text-[var(--color-blocker)]" data-testid="intake-error">
            {intakeError}
          </p>
        ) : null}
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-[var(--color-muted)]">{t.dossiers}</h2>
        {dossiers.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-muted)]" data-testid="no-dossiers">
            {t.noDossiers}
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-[var(--color-line)] rounded-lg border border-[var(--color-line)]">
            {dossiers.map((d) => (
              <li key={d.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium">{d.title}</span>
                <a
                  href={`/${locale}/app/${workspaceId}/dossiers/${d.id}`}
                  data-testid="open-dossier"
                  className="text-sm text-[var(--color-accent)] underline"
                >
                  {t.openDossier}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
