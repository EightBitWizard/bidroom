"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";

type State = "idle" | "sending" | "sent" | "invalid" | "rate-limited" | "error";

/**
 * Requests a magic-link sign-in. Posts to /api/auth/request-link and shows the outcome. The
 * email and session handling are server-side; this is only the form (no business logic).
 */
export function LoginForm({ locale, messages }: { locale: Locale; messages: Messages }) {
  const t = messages.auth;
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/auth/request-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (res.ok) setState("sent");
      else if (res.status === 400) setState("invalid");
      else if (res.status === 429) setState("rate-limited");
      else setState("error");
    } catch {
      setState("error");
    }
  }

  const message =
    state === "sent"
      ? t.linkSent
      : state === "invalid"
        ? t.invalidEmail
        : state === "rate-limited"
          ? t.rateLimited
          : state === "error"
            ? t.genericError
            : null;

  return (
    <section className="rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] p-6">
      <h1 className="text-2xl font-semibold">{t.loginTitle}</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{t.loginIntro}</p>
      <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
        <label className="text-xs font-medium text-[var(--color-muted)]">
          {t.emailLabel}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            data-testid="login-email"
            className="mt-1 w-full rounded border border-[var(--color-line)] px-2 py-1.5 text-sm text-[var(--color-ink)]"
          />
        </label>
        <button
          type="submit"
          disabled={state === "sending" || state === "sent"}
          data-testid="login-submit"
          className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-ink)] disabled:opacity-50"
        >
          {t.sendLink}
        </button>
      </form>
      {message ? (
        <p
          className={`mt-3 text-sm ${state === "sent" ? "text-[var(--color-ink)]" : "text-[var(--color-blocker)]"}`}
          data-testid="login-message"
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
