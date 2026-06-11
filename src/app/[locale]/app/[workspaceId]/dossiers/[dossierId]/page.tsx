import { notFound } from "next/navigation";
import { DossierDetail } from "@/components/DossierDetail";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default async function DossierDetailPage({
  params,
}: {
  params: Promise<{ locale: string; workspaceId: string; dossierId: string }>;
}) {
  const { locale, workspaceId, dossierId } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  return (
    <DossierDetail
      locale={locale}
      messages={messages}
      workspaceId={workspaceId}
      dossierId={dossierId}
    />
  );
}
