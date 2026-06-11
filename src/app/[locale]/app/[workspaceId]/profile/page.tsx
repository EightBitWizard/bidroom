import { notFound } from "next/navigation";
import { ProfileForm } from "@/components/ProfileForm";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string; workspaceId: string }>;
}) {
  const { locale, workspaceId } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  return <ProfileForm locale={locale} messages={messages} workspaceId={workspaceId} />;
}
