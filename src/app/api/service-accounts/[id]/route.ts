import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // Verify ownership: user must own the service account or the project
  const { data: account } = await supabase
    .from('service_accounts')
    .select('id, project_id, service_id')
    .eq('id', id)
    .single();

  if (!account) return apiError('계정을 찾을 수 없습니다', 404);

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', account.project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return apiError('권한이 없습니다', 403);

  const { error } = await supabase
    .from('service_accounts')
    .delete()
    .eq('id', id);

  if (error) return apiError(error.message, 400);

  await logAudit(user.id, {
    action: 'service_account.disconnect',
    resourceType: 'service_account',
    resourceId: id,
    details: { project_id: account.project_id, service_id: account.service_id },
  });

  return NextResponse.json({ success: true });
}
