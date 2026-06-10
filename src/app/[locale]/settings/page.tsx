import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold">{messages.settings.title}</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{messages.settings.intro}</p>
      <SiteFooter locale={locale} messages={messages} />
    </main>
  );
}
