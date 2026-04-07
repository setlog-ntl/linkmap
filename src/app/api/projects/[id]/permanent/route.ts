import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, serverError } from '@/lib/api/errors';
import { requireMfa } from '@/lib/api/mfa-guard';
import { logAudit } from '@/lib/audit';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const mfaResponse = await requireMfa(supabase);
  if (mfaResponse) return mfaResponse;

  const { data: existing } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', id)
    .eq('user_id', user.id)
    .not('deleted_at', 'is', null)
    .single();

  if (!existing) return notFoundError('프로젝트');

  // 배포 먼저 물리 삭제
  await supabase
    .from('homepage_deploys')
    .delete()
    .eq('project_id', id)
    .eq('user_id', user.id);

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'project.permanently_delete',
    resourceType: 'project',
    resourceId: id,
    details: { name: existing.name },
  });

  return NextResponse.json({ success: true });
}
