import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export interface AdminUserDetailProject {
  id: string;
  name: string;
  description: string | null;
  linkUrl: string | null;
  createdAt: string;
  serviceCount: number;
  services: Array<{ name: string; slug: string; category: string }>;
}

export interface AdminUserDetailDeploy {
  id: string;
  siteName: string | null;
  pagesUrl: string | null;
  forkedRepoUrl: string | null;
  deployStatus: string;
  templateName: string | null;
  createdAt: string;
}

export interface AdminUserDetailActivitySummary {
  action: string;
  count: number;
  lastUsedAt: string;
}

export interface AdminUserDetailRecentActivity {
  action: string;
  resourceType: string;
  resourceId: string | null;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface AdminUserDetail {
  user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    provider: string | null;
    plan: string;
    createdAt: string;
    lastSignInAt: string | null;
  };
  projects: AdminUserDetailProject[];
  deploys: AdminUserDetailDeploy[];
  activitySummary: AdminUserDetailActivitySummary[];
  recentActivities: AdminUserDetailRecentActivity[];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const { userId } = await params;
  const adminSupabase = createAdminClient();

  // 1. 프로필 조회
  const { data: profile, error: profileError } = await adminSupabase
    .from('profiles')
    .select('id, email, name, created_at')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return apiError('사용자를 찾을 수 없습니다', 404);
  }

  // 병렬 조회
  const [
    subsResult,
    projectsResult,
    deploysResult,
    auditSummaryResult,
    recentAuditResult,
    authUserResult,
  ] = await Promise.all([
    // 2. 구독 정보
    adminSupabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', userId)
      .single(),

    // 3. 프로젝트 + 서비스
    adminSupabase
      .from('projects')
      .select(`
        id, name, description, link_url, created_at,
        project_services(
          id,
          service:services(name, slug, category)
        )
      `)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false }),

    // 4. 배포 목록
    adminSupabase
      .from('homepage_deploys')
      .select(`
        id, site_name, pages_url, forked_repo_url, deploy_status, created_at,
        template:homepage_templates(name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),

    // 5. 활동 요약 (action별 집계) — RPC 대신 직접 조회 후 JS 집계
    adminSupabase
      .from('audit_logs')
      .select('action, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),

    // 6. 최근 활동 50건
    adminSupabase
      .from('audit_logs')
      .select('action, resource_type, resource_id, details, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50),

    // 7. auth.users 메타데이터
    adminSupabase.auth.admin.getUserById(userId),
  ]);

  // auth 메타데이터
  const authUser = authUserResult.data?.user;
  const plan = subsResult.data?.plan ?? 'free';

  // 프로젝트 매핑
  interface ProjectServiceRow {
    id: string;
    service: { name: string; slug: string; category: string } | null;
  }
  interface ProjectRow {
    id: string;
    name: string;
    description: string | null;
    link_url: string | null;
    created_at: string;
    project_services: ProjectServiceRow[];
  }

  const projects: AdminUserDetailProject[] = ((projectsResult.data ?? []) as unknown as ProjectRow[]).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    linkUrl: p.link_url,
    createdAt: p.created_at,
    serviceCount: p.project_services?.length ?? 0,
    services: (p.project_services ?? [])
      .filter((ps) => ps.service)
      .map((ps) => ({
        name: ps.service!.name,
        slug: ps.service!.slug,
        category: ps.service!.category,
      })),
  }));

  // 배포 매핑
  interface DeployRow {
    id: string;
    site_name: string | null;
    pages_url: string | null;
    forked_repo_url: string | null;
    deploy_status: string;
    created_at: string;
    template: { name: string } | null;
  }

  const deploys: AdminUserDetailDeploy[] = ((deploysResult.data ?? []) as unknown as DeployRow[]).map((d) => ({
    id: d.id,
    siteName: d.site_name,
    pagesUrl: d.pages_url,
    forkedRepoUrl: d.forked_repo_url,
    deployStatus: d.deploy_status,
    templateName: d.template?.name ?? null,
    createdAt: d.created_at,
  }));

  // 활동 요약 집계
  const summaryMap = new Map<string, { count: number; lastUsedAt: string }>();
  for (const log of (auditSummaryResult.data ?? [])) {
    const existing = summaryMap.get(log.action);
    if (existing) {
      existing.count++;
    } else {
      summaryMap.set(log.action, { count: 1, lastUsedAt: log.created_at });
    }
  }

  const activitySummary: AdminUserDetailActivitySummary[] = Array.from(summaryMap.entries())
    .map(([action, { count, lastUsedAt }]) => ({ action, count, lastUsedAt }))
    .sort((a, b) => b.count - a.count);

  // 최근 활동
  const recentActivities: AdminUserDetailRecentActivity[] = (recentAuditResult.data ?? []).map((log) => ({
    action: log.action,
    resourceType: log.resource_type,
    resourceId: log.resource_id,
    details: (log.details as Record<string, unknown>) ?? {},
    createdAt: log.created_at,
  }));

  await logAudit(user.id, {
    action: 'admin.user_detail_view',
    resourceType: 'admin',
    resourceId: userId,
  });

  const result: AdminUserDetail = {
    user: {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatarUrl: (authUser?.user_metadata?.avatar_url as string) ?? null,
      provider: (authUser?.app_metadata?.provider as string) ?? null,
      plan,
      createdAt: profile.created_at,
      lastSignInAt: authUser?.last_sign_in_at ?? null,
    },
    projects,
    deploys,
    activitySummary,
    recentActivities,
  };

  return NextResponse.json(result);
}
