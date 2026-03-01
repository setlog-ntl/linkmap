import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: existing } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', id)
    .eq('user_id', user.id)
    .not('deleted_at', 'is', null)
    .single();

  if (!existing) return notFoundError('프로젝트');

  const { error } = await supabase
    .from('projects')
    .update({ deleted_at: null })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'project.restore',
    resourceType: 'project',
    resourceId: id,
    details: { name: existing.name },
  });

  return NextResponse.json({ success: true });
}
