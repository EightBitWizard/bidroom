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

type Load = "loading" | "ready" | "unauthorized" | "error";

/**
 * The authenticated workspace shell: lists the account's workspaces and creates new ones. The
 * session cookie is sent automatically; data and authorization are enforced server-side by
 * /api/workspaces. No business logic lives here.
 */
export function WorkspaceShell({ locale, messages }: { locale: Locale; messages: Messages }) {
  const t = messages.app;
  const router = useRouter();
  const [load, setLoad] = useState<Load>("loading");
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(false);

  async function refresh() {
    try {
      const res = await fetch("/api/workspaces", { credentials: "same-origin" });
      if (res.status === 401) return setLoad("unauthorized");
      if (!res.ok) return setLoad("error");
      const data = (await res.json()) as { workspaces: WorkspaceItem[] };
      setWorkspaces(data.workspaces);
      setLoad("ready");
    } catch {
      setLoad("error");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(false);
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        setCreateError(true);
        return;
      }
      const data = (await res.json()) as { id: string };
      router.push(`/${locale}/app/${data.id}`);
    } catch {
      setCreateError(true);
    } finally {
      setCreating(false);
    }
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    router.push(`/${locale}/login`);
  }

  if (load === "loading") {
    return <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6" data-testid="app-loading" />;
  }

  if (load === "unauthorized") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="text-sm text-[var(--color-muted)]">{messages.auth.loginIntro}</p>
        <a
          href={`/${locale}/login`}
          className="mt-4 inline-block rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-ink)]"
        >
          {messages.common.signIn}
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t.workspacesTitle}</h1>
        <button
          onClick={signOut}
          data-testid="sign-out"
          className="text-sm text-[var(--color-muted)] underline"
        >
          {messages.common.signOut}
        </button>
      </div>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{t.workspacesIntro}</p>

      {workspaces.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--color-muted)]" data-testid="no-workspaces">
          {t.noWorkspaces}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-[var(--color-line)] rounded-lg border border-[var(--color-line)]">
          {workspaces.map((w) => (
            <li key={w.id} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium">{w.name}</span>
              <a
                href={`/${locale}/app/${w.id}`}
                data-testid="open-workspace"
                className="text-sm text-[var(--color-accent)] underline"
              >
                {t.open}
              </a>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={create} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-xs font-medium text-[var(--color-muted)]">
          {t.workspaceNameLabel}
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.workspaceNamePlaceholder}
            data-testid="workspace-name"
            className="mt-1 w-full rounded border border-[var(--color-line)] px-2 py-1.5 text-sm text-[var(--color-ink)]"
          />
        </label>
        <button
          type="submit"
          disabled={creating}
          data-testid="create-workspace"
          className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-ink)] disabled:opacity-50"
        >
          {t.createWorkspace}
        </button>
      </form>
      {createError ? (
        <p className="mt-3 text-sm text-[var(--color-blocker)]" data-testid="create-error">
          {t.createError}
        </p>
      ) : null}
    </main>
  );
}
