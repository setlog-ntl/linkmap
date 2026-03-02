import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export interface VisitorByIp {
  ip: string;
  sessionCount: number;
  pageViews: number;
  firstSeen: string;
  lastSeen: string;
  topPaths: Array<{ path: string; count: number }>;
  userAgent: string | null;
}

export interface AdminVisitorStats {
  kpis: {
    totalSessions: number;
    todaySessions: number;
    weekSessions: number;
    totalPageViews: number;
    avgPagesPerSession: number;
    uniqueIps: number;
  };
  dailyTrend: Array<{ date: string; sessions: number; pageViews: number }>;
  topPages: Array<{ path: string; views: number }>;
  recentSessions: Array<{
    sessionId: string;
    firstPage: string;
    pageCount: number;
    firstSeen: string;
    lastSeen: string;
    userAgent: string | null;
    ip: string | null;
  }>;
  visitorsByIp: VisitorByIp[];
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const adminSupabase = createAdminClient();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const { data: logs, error } = await adminSupabase
    .from('visitor_logs')
    .select('session_id, page_path, user_agent, ip_address, created_at')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Visitor logs fetch error:', error);
    return serverError('방문자 로그 조회에 실패했습니다');
  }

  const allLogs = logs ?? [];

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);

  // 세션별 집계
  const sessionMap = new Map<string, {
    pages: string[];
    firstSeen: string;
    lastSeen: string;
    userAgent: string | null;
    ip: string | null;
  }>();

  for (const log of allLogs) {
    const existing = sessionMap.get(log.session_id);
    if (!existing) {
      sessionMap.set(log.session_id, {
        pages: [log.page_path],
        firstSeen: log.created_at,
        lastSeen: log.created_at,
        userAgent: log.user_agent ?? null,
        ip: log.ip_address ?? null,
      });
    } else {
      existing.pages.push(log.page_path);
      if (log.created_at > existing.lastSeen) existing.lastSeen = log.created_at;
    }
  }

  const totalSessions = sessionMap.size;
  const totalPageViews = allLogs.length;
  const avgPagesPerSession = totalSessions > 0
    ? Math.round((totalPageViews / totalSessions) * 10) / 10
    : 0;

  const todaySessions = Array.from(sessionMap.values()).filter(
    (s) => new Date(s.firstSeen) >= todayStart
  ).length;
  const weekSessions = Array.from(sessionMap.values()).filter(
    (s) => new Date(s.firstSeen) >= weekStart
  ).length;

  // 일별 트렌드 (30일)
  const dailySessionMap = new Map<string, Set<string>>();
  const dailyViewMap = new Map<string, number>();

  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailySessionMap.set(key, new Set());
    dailyViewMap.set(key, 0);
  }

  for (const log of allLogs) {
    const key = log.created_at.slice(0, 10);
    const sessionSet = dailySessionMap.get(key);
    if (sessionSet) {
      sessionSet.add(log.session_id);
      dailyViewMap.set(key, (dailyViewMap.get(key) ?? 0) + 1);
    }
  }

  const dailyTrend = Array.from(dailySessionMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, sessionSet]) => ({
      date,
      sessions: sessionSet.size,
      pageViews: dailyViewMap.get(date) ?? 0,
    }));

  // 상위 10개 페이지
  const pageCountMap = new Map<string, number>();
  for (const log of allLogs) {
    pageCountMap.set(log.page_path, (pageCountMap.get(log.page_path) ?? 0) + 1);
  }
  const topPages = Array.from(pageCountMap.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([path, views]) => ({ path, views }));

  // 최근 20 세션 (IP 포함)
  const recentSessions = Array.from(sessionMap.entries())
    .sort(([, a], [, b]) => new Date(b.firstSeen).getTime() - new Date(a.firstSeen).getTime())
    .slice(0, 20)
    .map(([sessionId, s]) => ({
      sessionId,
      firstPage: s.pages[0] ?? '/',
      pageCount: s.pages.length,
      firstSeen: s.firstSeen,
      lastSeen: s.lastSeen,
      userAgent: s.userAgent,
      ip: s.ip,
    }));

  // IP별 방문자 집계
  const ipMap = new Map<string, {
    sessions: Set<string>;
    pageViews: number;
    firstSeen: string;
    lastSeen: string;
    pathCounts: Map<string, number>;
    userAgent: string | null;
  }>();

  for (const log of allLogs) {
    const ip = log.ip_address ?? '(알 수 없음)';
    const existing = ipMap.get(ip);
    if (!existing) {
      const pathCounts = new Map<string, number>();
      pathCounts.set(log.page_path, 1);
      ipMap.set(ip, {
        sessions: new Set([log.session_id]),
        pageViews: 1,
        firstSeen: log.created_at,
        lastSeen: log.created_at,
        pathCounts,
        userAgent: log.user_agent ?? null,
      });
    } else {
      existing.sessions.add(log.session_id);
      existing.pageViews++;
      if (log.created_at > existing.lastSeen) existing.lastSeen = log.created_at;
      existing.pathCounts.set(
        log.page_path,
        (existing.pathCounts.get(log.page_path) ?? 0) + 1
      );
    }
  }

  const uniqueIps = ipMap.size;

  const visitorsByIp: VisitorByIp[] = Array.from(ipMap.entries())
    .sort(([, a], [, b]) => b.pageViews - a.pageViews)
    .slice(0, 100)
    .map(([ip, v]) => ({
      ip,
      sessionCount: v.sessions.size,
      pageViews: v.pageViews,
      firstSeen: v.firstSeen,
      lastSeen: v.lastSeen,
      topPaths: Array.from(v.pathCounts.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([path, count]) => ({ path, count })),
      userAgent: v.userAgent,
    }));

  await logAudit(user.id, {
    action: 'admin.visitors_stats_view',
    resourceType: 'admin',
  });

  const result: AdminVisitorStats = {
    kpis: {
      totalSessions,
      todaySessions,
      weekSessions,
      totalPageViews,
      avgPagesPerSession,
      uniqueIps,
    },
    dailyTrend,
    topPages,
    recentSessions,
    visitorsByIp,
  };

  return NextResponse.json(result);
}
