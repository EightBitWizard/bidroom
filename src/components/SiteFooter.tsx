import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";

/**
 * The canonical site footer. Carries the no-advice note and the legal links; used on every
 * page so the trust surface is consistent (tech plan Section 15).
 */
export function SiteFooter({ locale, messages }: { locale: Locale; messages: Messages }) {
  return (
    <footer className="mt-12 border-t border-[var(--color-line)] pt-6 text-xs text-[var(--color-muted)]">
      <p>{messages.landing.notLegalAdvice}</p>
      <nav className="mt-2 flex gap-4">
        <a href={`/${locale}/privacy`} className="underline">
          {messages.footer.privacy}
        </a>
        <a href={`/${locale}/terms`} className="underline">
          {messages.footer.terms}
        </a>
        <a href={`/${locale}/security`} className="underline">
          {messages.footer.security}
        </a>
      </nav>
    </footer>
  );
}
