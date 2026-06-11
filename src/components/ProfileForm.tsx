"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";

interface ProfileData {
  capabilityTags: string[];
  regions: string[];
  languages: string[];
  certifications: string[];
  exclusions: string[];
}

type State = "loading" | "ready";

const EMPTY: ProfileData = {
  capabilityTags: [],
  regions: [],
  languages: [],
  certifications: [],
  exclusions: [],
};

function toList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * The company-profile form (WP-010). Fields are comma-separated lists. Data and authorization
 * are enforced server-side by /api/workspaces/:id/profile; no business logic here.
 */
export function ProfileForm({
  locale,
  messages,
  workspaceId,
}: {
  locale: Locale;
  messages: Messages;
  workspaceId: string;
}) {
  const t = messages.profile;
  const [state, setState] = useState<State>("loading");
  const [fields, setFields] = useState<Record<keyof ProfileData, string>>({
    capabilityTags: "",
    regions: "",
    languages: "",
    certifications: "",
    exclusions: "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function run() {
      try {
        const res = await fetch(`/api/workspaces/${workspaceId}/profile`, {
          credentials: "same-origin",
        });
        const data = res.ok ? ((await res.json()) as { profile: ProfileData | null }) : null;
        const p = data?.profile ?? EMPTY;
        setFields({
          capabilityTags: p.capabilityTags.join(", "),
          regions: p.regions.join(", "),
          languages: p.languages.join(", "),
          certifications: p.certifications.join(", "),
          exclusions: p.exclusions.join(", "),
        });
      } catch {
        // Keep the empty form; the user can still save.
      } finally {
        setState("ready");
      }
    }
    void run();
  }, [workspaceId]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setError(false);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/profile`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          capabilityTags: toList(fields.capabilityTags),
          regions: toList(fields.regions),
          languages: toList(fields.languages),
          certifications: toList(fields.certifications),
          exclusions: toList(fields.exclusions),
        }),
      });
      if (res.ok) setSaved(true);
      else setError(true);
    } catch {
      setError(true);
    }
  }

  if (state === "loading") {
    return <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6" data-testid="profile-loading" />;
  }

  const labels: Array<[keyof ProfileData, string]> = [
    ["capabilityTags", t.capabilityTags],
    ["regions", t.regions],
    ["languages", t.languages],
    ["certifications", t.certifications],
    ["exclusions", t.exclusions],
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6" data-testid="profile-form">
      <a
        href={`/${locale}/app/${workspaceId}`}
        className="text-sm text-[var(--color-accent)] underline"
      >
        {t.back}
      </a>
      <h1 className="mt-3 text-2xl font-semibold">{t.title}</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{t.intro}</p>
      <form onSubmit={save} className="mt-6 flex flex-col gap-4">
        {labels.map(([key, label]) => (
          <label key={key} className="text-xs font-medium text-[var(--color-muted)]">
            {label}
            <input
              value={fields[key]}
              onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
              data-testid={`profile-${key}`}
              className="mt-1 w-full rounded border border-[var(--color-line)] px-2 py-1.5 text-sm text-[var(--color-ink)]"
            />
          </label>
        ))}
        <button
          type="submit"
          data-testid="profile-save"
          className="self-start rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-ink)]"
        >
          {t.save}
        </button>
      </form>
      {saved ? (
        <p className="mt-3 text-sm text-[var(--color-ok)]" data-testid="profile-saved">
          {t.saved}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm text-[var(--color-blocker)]" data-testid="profile-error">
          {t.error}
        </p>
      ) : null}
    </main>
  );
}
