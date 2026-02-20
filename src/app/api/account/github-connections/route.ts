import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const patchSchema = z.object({
  id: z.string().uuid('유효하지 않은 ID'),
  display_name: z.string().min(1, '이름은 필수입니다').max(100),
});

/**
 * GET /api/account/github-connections — List user's GitHub connections (no encrypted fields)
 * PATCH /api/account/github-connections — Rename a connection
 * DELETE /api/account/github-connections?id=xxx — Delete a connection
 */

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data, error } = await supabase
    .from('service_accounts')
    .select(`
      id, user_id, display_name, auth_method,
      oauth_provider_user_id, oauth_metadata, oauth_scopes,
      status, last_verified_at, error_message,
      created_at, updated_at,
      service:service_id(slug)
    `)
    .eq('user_id', user.id)
    .is('project_id', null)
    .eq('connection_type', 'oauth')
    .order('created_at', { ascending: false });

  if (error) return apiError(error.message, 500);

  // Filter to GitHub only (service.slug = 'github')
  const connections = (data || []).filter(
    (row) => (row.service as unknown as { slug: string })?.slug === 'github'
  ).map(({ service: _service, ...rest }) => rest);

  return NextResponse.json({ connections });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues.map((e) => e.message).join(', '), 400);
  }

  const { id, display_name } = parsed.data;

  // Verify ownership
  const { data: account } = await supabase
    .from('service_accounts')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .is('project_id', null)
    .single();

  if (!account) return apiError('연결을 찾을 수 없습니다', 404);

  const { error } = await supabase
    .from('service_accounts')
    .update({ display_name, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return apiError(error.message, 500);

  await logAudit(user.id, {
    action: 'github_connection.rename',
    resourceType: 'service_account',
    resourceId: id,
    details: { display_name },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return apiError('id가 필요합니다', 400);

  // Verify ownership
  const { data: account } = await supabase
    .from('service_accounts')
    .select('id, oauth_metadata')
    .eq('id', id)
    .eq('user_id', user.id)
    .is('project_id', null)
    .single();

  if (!account) return apiError('연결을 찾을 수 없습니다', 404);

  // Check if any project repos are linked via this service_account
  const adminClient = createAdminClient();
  const { count } = await adminClient
    .from('project_github_repos')
    .select('id', { count: 'exact', head: true })
    .eq('service_account_id', id);

  if (count && count > 0) {
    return apiError('이 계정에 연결된 레포지토리가 있어 삭제할 수 없습니다. 먼저 레포 연결을 해제하세요.', 409);
  }

  const { error } = await supabase
    .from('service_accounts')
    .delete()
    .eq('id', id);

  if (error) return apiError(error.message, 500);

  await logAudit(user.id, {
    action: 'github_connection.delete',
    resourceType: 'service_account',
    resourceId: id,
    details: {
      login: (account.oauth_metadata as Record<string, string>)?.login,
    },
  });

  return NextResponse.json({ success: true });
}
