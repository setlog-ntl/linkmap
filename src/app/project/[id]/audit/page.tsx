import { redirect } from 'next/navigation';

export default async function AuditRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/project/${id}/monitoring?tab=audit`);
}
