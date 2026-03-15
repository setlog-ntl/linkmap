import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

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
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

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

  // auth.users에서 로그인 메타데이터 조회 (admin API)
  const { data: authUsersData } = await adminSupabase.auth.admin.listUsers({ perPage: 1000 });

  const allProfiles = profiles ?? [];
  const allSubscriptions = subscriptions ?? [];
  const allProjects = projects ?? [];

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

  // 최근 가입자 10명
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
  };

  return NextResponse.json(result);
}
