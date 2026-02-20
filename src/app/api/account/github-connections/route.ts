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

const postSchema = z.object({
  action: z.literal('disconnect'),
  id: z.string().uuid('유효하지 않은 ID'),
});

/**
 * GET /api/account/github-connections — List user's GitHub connections with linked project info
 * POST /api/account/github-connections — Disconnect all repos from a connection
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
  const githubConnections = (data || []).filter(
    (row) => (row.service as unknown as { slug: string })?.slug === 'github'
  ).map(({ service: _service, ...rest }) => rest);

  // Enrich with linked project info
  const adminClient = createAdminClient();
  const connectionIds = githubConnections.map((c) => c.id);

  let linkedReposMap: Record<string, { project_id: string; count: number }[]> = {};
  if (connectionIds.length > 0) {
    const { data: repos } = await adminClient
      .from('project_github_repos')
      .select('service_account_id, project_id')
      .in('service_account_id', connectionIds);

    if (repos) {
      // Group by service_account_id → project_id → count
      for (const repo of repos) {
        if (!linkedReposMap[repo.service_account_id]) {
          linkedReposMap[repo.service_account_id] = [];
        }
        const existing = linkedReposMap[repo.service_account_id].find(
          (p) => p.project_id === repo.project_id
        );
        if (existing) {
          existing.count++;
        } else {
          linkedReposMap[repo.service_account_id].push({
            project_id: repo.project_id,
            count: 1,
          });
        }
      }
    }
  }

  // Fetch project names for all unique project_ids
  const allProjectIds = [
    ...new Set(Object.values(linkedReposMap).flatMap((arr) => arr.map((p) => p.project_id))),
  ];
  let projectNameMap: Record<string, string> = {};
  if (allProjectIds.length > 0) {
    const { data: projects } = await adminClient
      .from('projects')
      .select('id, name')
      .in('id', allProjectIds);
    if (projects) {
      for (const p of projects) {
        projectNameMap[p.id] = p.name;
      }
    }
  }

  const connections = githubConnections.map((conn) => {
    const linked = linkedReposMap[conn.id] || [];
    const totalRepos = linked.reduce((sum, p) => sum + p.count, 0);
    return {
      ...conn,
      linked_projects: linked.map((p) => ({
        project_id: p.project_id,
        project_name: projectNameMap[p.project_id] || 'Unknown',
        repo_count: p.count,
      })),
      linked_repos_count: totalRepos,
    };
  });

  return NextResponse.json({ connections });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues.map((e) => e.message).join(', '), 400);
  }

  const { id } = parsed.data;

  // Verify ownership
  const { data: account } = await supabase
    .from('service_accounts')
    .select('id, oauth_metadata')
    .eq('id', id)
    .eq('user_id', user.id)
    .is('project_id', null)
    .single();

  if (!account) return apiError('연결을 찾을 수 없습니다', 404);

  const adminClient = createAdminClient();

  // Delete all project_github_repos linked to this service_account
  const { data: deletedRepos } = await adminClient
    .from('project_github_repos')
    .delete()
    .eq('service_account_id', id)
    .select('id');

  const unlinkedCount = deletedRepos?.length || 0;

  // Clear default_github_account_id if it points to this account
  await adminClient
    .from('projects')
    .update({ default_github_account_id: null })
    .eq('default_github_account_id', id)
    .eq('user_id', user.id);

  await logAudit(user.id, {
    action: 'github_connection.disconnect',
    resourceType: 'service_account',
    resourceId: id,
    details: {
      login: (account.oauth_metadata as Record<string, string>)?.login,
      unlinked_count: unlinkedCount,
    },
  });

  return NextResponse.json({ success: true, unlinked_count: unlinkedCount });
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
    return NextResponse.json(
      {
        error: '이 계정에 연결된 레포지토리가 있어 삭제할 수 없습니다. 먼저 레포 연결을 해제하세요.',
        code: 'LINKED_REPOS_EXIST',
        linked_repos_count: count,
      },
      { status: 409 }
    );
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
