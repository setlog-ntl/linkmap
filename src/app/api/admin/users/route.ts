import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { getAuditMenuName } from '@/lib/constants/audit-menus';

/** 사용자당 "최근 사용 메뉴" 산출에 사용할 감사 로그 스캔 건수 */
const RECENT_ACTIVITY_SCAN = 200;

/** 사용자 행에 노출할 메뉴 개수 */
const TOP_MENU_COUNT = 3;

export interface AdminUserRow {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: string | null;
  plan: string;
  projectCount: number;
  deployCount: number;
  createdAt: string;
  lastSignInAt: string | null;
  /** 전체 감사 로그 건수 */
  activityCount: number;
  /** 마지막 활동 시각 */
  lastActiveAt: string | null;
  /** 최근 활동에서 많이 쓴 메뉴 (메뉴명 기준) */
  topMenus: Array<{ menu: string; count: number }>;
}

export interface AdminUserStats {
  kpis: {
    totalUsers: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    freeCount: number;
    proCount: number;
    teamCount: number;
  };
  registrationTrend: Array<{ date: string; count: number; cumulative: number }>;
  planDistribution: Array<{ plan: string; label: string; count: number }>;
  recentUsers: Array<{
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    provider: string | null;
    plan: string;
    projectCount: number;
    createdAt: string;
    lastSignInAt: string | null;
  }>;
  allUsers: AdminUserRow[];
  total: number;
  page: number;
  limit: number;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '20')));
  const search = searchParams.get('search')?.trim() ?? '';
  const sort = searchParams.get('sort') ?? 'created_at';

  const adminSupabase = createAdminClient();

  // 모든 프로필 조회 (created_at 포함, 관리자 제외)
  const { data: profiles, error: profilesError } = await adminSupabase
    .from('profiles')
    .select('id, email, name, created_at, is_admin')
    .eq('is_admin', false)
    .order('created_at', { ascending: true });

  if (profilesError) {
    console.error('Profiles fetch error:', profilesError);
    return serverError('사용자 조회에 실패했습니다');
  }

  // 구독 정보 조회
  const { data: subscriptions, error: subsError } = await adminSupabase
    .from('subscriptions')
    .select('user_id, plan');

  if (subsError) {
    console.error('Subscriptions fetch error:', subsError);
    return serverError('구독 정보 조회에 실패했습니다');
  }

  // 프로젝트 수 조회
  const { data: projects, error: projectsError } = await adminSupabase
    .from('projects')
    .select('user_id')
    .is('deleted_at', null);

  if (projectsError) {
    console.error('Projects fetch error:', projectsError);
    return serverError('프로젝트 조회에 실패했습니다');
  }

  // 배포 수 조회
  const { data: deploys } = await adminSupabase
    .from('homepage_deploys')
    .select('user_id');

  // auth.users에서 로그인 메타데이터 조회 (admin API)
  const { data: authUsersData } = await adminSupabase.auth.admin.listUsers({ perPage: 1000 });

  const allProfiles = profiles ?? [];
  const allSubscriptions = subscriptions ?? [];
  const allProjects = projects ?? [];
  const allDeploys = deploys ?? [];

  // auth.users 메타데이터 맵
  interface AuthMeta { lastSignInAt: string | null; provider: string | null; avatarUrl: string | null }
  const authMetaMap = new Map<string, AuthMeta>();
  if (authUsersData?.users) {
    for (const au of authUsersData.users) {
      authMetaMap.set(au.id, {
        lastSignInAt: au.last_sign_in_at ?? null,
        provider: (au.app_metadata?.provider as string) ?? null,
        avatarUrl: (au.user_metadata?.avatar_url as string) ?? null,
      });
    }
  }

  // user_id → plan 맵
  const planMap = new Map<string, string>();
  for (const sub of allSubscriptions) {
    planMap.set(sub.user_id, sub.plan);
  }

  // user_id → projectCount 맵
  const projectCountMap = new Map<string, number>();
  for (const proj of allProjects) {
    projectCountMap.set(proj.user_id, (projectCountMap.get(proj.user_id) ?? 0) + 1);
  }

  // user_id → deployCount 맵
  const deployCountMap = new Map<string, number>();
  for (const dep of allDeploys) {
    deployCountMap.set(dep.user_id, (deployCountMap.get(dep.user_id) ?? 0) + 1);
  }

  // 날짜 경계
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // KPI 계산
  const totalUsers = allProfiles.length;
  const newToday = allProfiles.filter((p) => new Date(p.created_at) >= todayStart).length;
  const newThisWeek = allProfiles.filter((p) => new Date(p.created_at) >= weekStart).length;
  const newThisMonth = allProfiles.filter((p) => new Date(p.created_at) >= monthStart).length;

  const planCounts = { free: 0, pro: 0, team: 0 };
  for (const profile of allProfiles) {
    const plan = planMap.get(profile.id) ?? 'free';
    if (plan === 'pro') planCounts.pro++;
    else if (plan === 'team') planCounts.team++;
    else planCounts.free++;
  }

  // 30일 가입 추이
  const days30Start = new Date(todayStart.getTime() - 29 * 24 * 60 * 60 * 1000);
  const dailyMap = new Map<string, number>();

  // 날짜별 카운트 초기화 (30일)
  for (let i = 0; i < 30; i++) {
    const d = new Date(days30Start.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, 0);
  }

  for (const profile of allProfiles) {
    const key = profile.created_at.slice(0, 10);
    if (dailyMap.has(key)) {
      dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
    }
  }

  // 30일 이전까지의 누적 사용자 수
  const beforeWindow = allProfiles.filter(
    (p) => new Date(p.created_at) < days30Start
  ).length;

  let cumulative = beforeWindow;
  const registrationTrend = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => {
      cumulative += count;
      return { date, count, cumulative };
    });

  // 플랜 분포
  const planLabels: Record<string, string> = { free: 'Free', pro: 'Pro', team: 'Team' };
  const planDistribution = Object.entries(planCounts).map(([plan, count]) => ({
    plan,
    label: planLabels[plan] ?? plan,
    count,
  }));

  // 최근 가입자 10명 (기존 호환)
  const recentProfiles = [...allProfiles]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const recentUsers = recentProfiles.map((p) => {
    const meta = authMetaMap.get(p.id);
    return {
      id: p.id,
      email: p.email,
      name: p.name,
      avatarUrl: meta?.avatarUrl ?? null,
      provider: meta?.provider ?? null,
      plan: planMap.get(p.id) ?? 'free',
      projectCount: projectCountMap.get(p.id) ?? 0,
      createdAt: p.created_at,
      lastSignInAt: meta?.lastSignInAt ?? null,
    };
  });

  // 전체 사용자 목록 (검색 + 정렬 + 페이지네이션)
  const lowerSearch = search.toLowerCase();
  const filteredProfiles = search
    ? allProfiles.filter(
        (p) =>
          p.email.toLowerCase().includes(lowerSearch) ||
          (p.name ?? '').toLowerCase().includes(lowerSearch)
      )
    : allProfiles;

  // 전체 사용자를 UserRow로 매핑
  const allUserRows: AdminUserRow[] = filteredProfiles.map((p) => {
    const meta = authMetaMap.get(p.id);
    return {
      id: p.id,
      email: p.email,
      name: p.name,
      avatarUrl: meta?.avatarUrl ?? null,
      provider: meta?.provider ?? null,
      plan: planMap.get(p.id) ?? 'free',
      projectCount: projectCountMap.get(p.id) ?? 0,
      deployCount: deployCountMap.get(p.id) ?? 0,
      createdAt: p.created_at,
      lastSignInAt: meta?.lastSignInAt ?? null,
      activityCount: 0,
      lastActiveAt: null,
      topMenus: [],
    };
  });

  // 정렬
  allUserRows.sort((a, b) => {
    switch (sort) {
      case 'last_sign_in':
        return (
          new Date(b.lastSignInAt ?? '1970-01-01').getTime() -
          new Date(a.lastSignInAt ?? '1970-01-01').getTime()
        );
      case 'project_count':
        return b.projectCount - a.projectCount;
      case 'deploy_count':
        return b.deployCount - a.deployCount;
      default: // created_at desc
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const total = allUserRows.length;
  const offset = (page - 1) * limit;
  const paginatedUsers = allUserRows.slice(offset, offset + limit);

  // 현재 페이지 사용자만 감사 로그를 읽어 "사용한 메뉴"를 집계한다.
  // 전체 사용자 로그를 한 번에 읽으면 목록 응답이 감사 테이블 크기에 끌려가므로
  // 페이지당 20건 × (user_id, created_at DESC) 인덱스 조회로 제한한다.
  await Promise.all(
    paginatedUsers.map(async (row) => {
      const { data: logs, count: totalCount, error: auditError } = await adminSupabase
        .from('audit_logs')
        .select('action, created_at', { count: 'exact' })
        .eq('user_id', row.id)
        .order('created_at', { ascending: false })
        .limit(RECENT_ACTIVITY_SCAN);

      if (auditError) {
        console.error('Audit logs fetch error:', auditError.message);
        return;
      }

      const recentLogs = logs ?? [];
      row.activityCount = totalCount ?? recentLogs.length;
      row.lastActiveAt = recentLogs[0]?.created_at ?? null;

      const menuCounts = new Map<string, number>();
      for (const log of recentLogs) {
        const menu = getAuditMenuName(log.action);
        menuCounts.set(menu, (menuCounts.get(menu) ?? 0) + 1);
      }

      row.topMenus = Array.from(menuCounts.entries())
        .map(([menu, menuCount]) => ({ menu, count: menuCount }))
        .sort((a, b) => b.count - a.count)
        .slice(0, TOP_MENU_COUNT);
    })
  );

  await logAudit(user.id, {
    action: 'admin.users_stats_view',
    resourceType: 'admin',
  });

  const result: AdminUserStats = {
    kpis: {
      totalUsers,
      newToday,
      newThisWeek,
      newThisMonth,
      freeCount: planCounts.free,
      proCount: planCounts.pro,
      teamCount: planCounts.team,
    },
    registrationTrend,
    planDistribution,
    recentUsers,
    allUsers: paginatedUsers,
    total,
    page,
    limit,
  };

  return NextResponse.json(result);
}
