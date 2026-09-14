import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import ResourceAdminList from '@/components/admin/resource-admin-list';

export const dynamic = 'force-dynamic';

export default async function AdminResourcesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const admin = await isAdmin(user.id);
  if (!admin) {
    redirect('/dashboard');
  }

  return (
    <div className="container py-8 max-w-5xl">
      <ResourceAdminList />
    </div>
  );
}
