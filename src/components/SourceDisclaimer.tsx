import type { Messages } from "@/i18n/messages";

/**
 * The SIMAP source disclaimer (LEG-001). Rendered wherever SIMAP source data are reused,
 * in the UI and in the PDF export, and never removed or weakened. This is the single
 * canonical component for the disclaimer text; do not inline the text elsewhere.
 */
export function SourceDisclaimer({ messages }: { messages: Messages }) {
  return (
    <p
      className="rounded border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-muted)]"
      data-testid="source-disclaimer"
    >
      {messages.common.disclaimer}
    </p>
  );
}
