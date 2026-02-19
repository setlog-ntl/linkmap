import { redirect } from 'next/navigation';

export default async function ServicesRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/project/${id}/integrations?tab=services`);
}
