import { notFound } from "next/navigation";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default async function AppPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  return <WorkspaceShell locale={locale} messages={messages} />;
}
