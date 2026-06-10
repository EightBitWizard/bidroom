"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";

interface WorkspaceItem {
  id: string;
  name: string;
  role: string;
}

type Load = "loading" | "ready" | "unauthorized" | "missing" | "error";

/**
 * The (empty) workspace home. Membership is enforced server-side: it lists the account's
 * workspaces (an authz-scoped endpoint) and shows the home only if this workspace is among
 * them, so a non-member sees "not found" rather than any workspace content.
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
  const [load, setLoad] = useState<Load>("loading");
  const [workspace, setWorkspace] = useState<WorkspaceItem | null>(null);

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
        setLoad("ready");
      } catch {
        setLoad("error");
      }
    }
    void run();
  }, [workspaceId]);

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
      <a href={`/${locale}/app`} className="text-sm text-[var(--color-accent)] underline">
        {messages.app.workspacesTitle}
      </a>
      <h1 className="mt-3 text-2xl font-semibold">{workspace?.name}</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">{t.homeTitle}</p>
      <p className="mt-6 text-sm text-[var(--color-muted)]">{t.emptyIntro}</p>
    </main>
  );
}
