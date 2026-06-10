import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SourceDisclaimer } from "@/components/SourceDisclaimer";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-[var(--color-accent)]">{messages.common.tagline}</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{messages.landing.heroTitle}</h1>
      <p className="mt-4 text-base text-[var(--color-muted)]">{messages.landing.heroSubtitle}</p>
      <div className="mt-6 flex items-center gap-4">
        <a
          href={`/${locale}/login`}
          className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-ink)]"
        >
          {messages.landing.ctaStart}
        </a>
      </div>
      <div className="mt-8">
        <SourceDisclaimer messages={messages} />
      </div>
      <SiteFooter locale={locale} messages={messages} />
    </main>
  );
}
