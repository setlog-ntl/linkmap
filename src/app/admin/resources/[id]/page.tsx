import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import ResourceEditor from '@/components/admin/resource-editor';

export const dynamic = 'force-dynamic';

export default async function AdminResourceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const admin = await isAdmin(user.id);
  if (!admin) {
    redirect('/dashboard');
  }

  const { id } = await params;

  return (
    <div className="container py-8 max-w-5xl">
      <ResourceEditor resourceId={id} />
    </div>
  );
}
