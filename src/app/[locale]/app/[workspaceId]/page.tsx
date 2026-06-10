import { notFound } from "next/navigation";
import { WorkspaceHome } from "@/components/WorkspaceHome";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default async function WorkspaceHomePage({
  params,
}: {
  params: Promise<{ locale: string; workspaceId: string }>;
}) {
  const { locale, workspaceId } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  return <WorkspaceHome locale={locale} messages={messages} workspaceId={workspaceId} />;
}
