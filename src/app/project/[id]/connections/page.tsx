import { redirect } from 'next/navigation';

export default async function ConnectionsRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/project/${id}/integrations?tab=connections`);
}
