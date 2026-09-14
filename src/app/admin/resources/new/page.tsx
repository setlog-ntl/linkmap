import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import ResourceEditor from '@/components/admin/resource-editor';

export const dynamic = 'force-dynamic';

export default async function AdminResourceNewPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
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

  // ?from=<id> 이면 그 자료를 템플릿으로 복제해서 시작한다
  const { from } = await searchParams;

  return (
    <div className="container py-8 max-w-5xl">
      <ResourceEditor templateId={from || undefined} />
    </div>
  );
}
