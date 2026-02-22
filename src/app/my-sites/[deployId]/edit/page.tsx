import { redirect } from 'next/navigation';

export default async function EditSitePage({
  params,
}: {
  params: Promise<{ deployId: string }>;
}) {
  const { deployId } = await params;
  redirect(`/sites/${deployId}/edit`);
}
