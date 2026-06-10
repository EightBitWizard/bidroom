import { notFound } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { SiteFooter } from "@/components/SiteFooter";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <LoginForm locale={locale} messages={messages} />
      <SiteFooter locale={locale} messages={messages} />
    </main>
  );
}
