import { redirect } from 'next/navigation';

export default async function HealthRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/project/${id}/monitoring?tab=health`);
}
