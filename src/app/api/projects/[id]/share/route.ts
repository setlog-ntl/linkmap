import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { toggleShareSchema } from '@/lib/validations/share';
import { unauthorizedError, notFoundError, validationError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { nanoid } from 'nanoid';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: project } = await supabase
    .from('projects')
    .select('id, share_token, is_map_shared, shared_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  return NextResponse.json({
    enabled: project.is_map_shared,
    shareToken: project.share_token,
    sharedAt: project.shared_at,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = toggleShareSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // 소유권 확인
  const { data: project } = await supabase
    .from('projects')
    .select('id, share_token, is_map_shared')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  const { enabled } = parsed.data;

  // 토큰이 없으면 새로 생성 (재활성화 시 기존 토큰 유지)
  const shareToken = project.share_token || nanoid(12);

  const { data: updated, error } = await supabase
    .from('projects')
    .update({
      is_map_shared: enabled,
      share_token: shareToken,
      shared_at: enabled ? new Date().toISOString() : project.is_map_shared ? undefined : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, share_token, is_map_shared, shared_at')
    .single();

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'project.share_toggle',
    resourceType: 'project',
    resourceId: id,
    details: { enabled, shareToken },
  });

  return NextResponse.json({
    enabled: updated.is_map_shared,
    shareToken: updated.share_token,
    sharedAt: updated.shared_at,
  });
}
