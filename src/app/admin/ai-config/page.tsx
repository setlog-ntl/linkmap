import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import AiAdminConsole from '@/components/admin/ai-admin-console';

export const dynamic = 'force-dynamic';

export default async function AdminAiConfigPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const admin = await isAdmin(supabase, user.id);
  if (!admin) {
    redirect('/dashboard');
  }

  return (
    <div className="container py-8 max-w-6xl">
      <AiAdminConsole />
    </div>
  );
}
