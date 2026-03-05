import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export interface AdminUsageStats {
  kpis: {
    totalProjects: number;
    newProjectsThisMonth: number;
    totalServiceConnections: number;
    serviceConnectionSuccessRate: number;
    totalEnvVars: number;
    secretRatio: number;
    totalDeploys: number;
    deploySuccessRate: number;
  };
  topServices: Array<{ slug: string; name: string; category: string; count: number }>;
  categoryDistribution: Array<{ category: string; count: number }>;
  dailyTrend: Array<{
    date: string;
    projects: number;
    serviceConnections: number;
    envVars: number;
    deploys: number;
  }>;
  activity: {
    avgServicesPerProject: number;
    avgEnvVarsPerProject: number;
    activeTokenRatio: number;
    aiRequests: number;
    aiTotalTokens: number;
  };
  featureRequestsByStatus: Array<{ status: string; count: number }>;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const adminSupabase = createAdminClient();

  try {
    // 관리자 ID 목록 조회 (통계에서 제외)
    const { data: adminProfiles } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('is_admin', true);
    const adminIds = new Set((adminProfiles ?? []).map((p) => p.id));

    // 병렬 조회
    const [
      projectsRes,
      projectServicesRes,
      servicesRes,
      envVarsRes,
      deploysRes,
      tokensRes,
      aiLogsRes,
      featureRequestsRes,
    ] = await Promise.all([
      adminSupabase
        .from('projects')
        .select('id, user_id, created_at')
        .is('deleted_at', null),
      adminSupabase
        .from('project_services')
        .select('id, project_id, service_id, status, created_at'),
      adminSupabase
        .from('services')
        .select('id, slug, name, category')
        .eq('is_custom', false),
      adminSupabase
        .from('environment_variables')
        .select('id, project_id, is_secret, created_at')
        .is('deleted_at', null),
      adminSupabase
        .from('homepage_deploys')
        .select('id, deploy_status, created_at'),
      adminSupabase
        .from('api_tokens')
        .select('id, last_used_at'),
      adminSupabase
        .from('ai_usage_logs')
        .select('id, total_tokens'),
      adminSupabase
        .from('feature_requests')
        .select('id, status'),
    ]);

    if (projectsRes.error) throw projectsRes.error;
    if (projectServicesRes.error) throw projectServicesRes.error;
    if (servicesRes.error) throw servicesRes.error;
    if (envVarsRes.error) throw envVarsRes.error;
    if (deploysRes.error) throw deploysRes.error;
    if (tokensRes.error) throw tokensRes.error;
    if (aiLogsRes.error) throw aiLogsRes.error;
    if (featureRequestsRes.error) throw featureRequestsRes.error;

    // 관리자 소유 프로젝트 제외
    const projects = (projectsRes.data ?? []).filter((p) => !adminIds.has(p.user_id));
    const adminProjectIds = new Set(
      (projectsRes.data ?? []).filter((p) => adminIds.has(p.user_id)).map((p) => p.id)
    );
    const projectServices = (projectServicesRes.data ?? []).filter(
      (ps) => !adminProjectIds.has(ps.project_id)
    );
    const services = servicesRes.data ?? [];
    const envVars = (envVarsRes.data ?? []).filter(
      (e) => !adminProjectIds.has(e.project_id)
    );
    const deploys = deploysRes.data ?? [];
    const tokens = tokensRes.data ?? [];
    const aiLogs = aiLogsRes.data ?? [];
    const featureRequests = featureRequestsRes.data ?? [];

    // ─── KPI 계산 ───
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalProjects = projects.length;
    const newProjectsThisMonth = projects.filter(
      (p) => new Date(p.created_at) >= monthStart
    ).length;

    const totalServiceConnections = projectServices.length;
    const connectedCount = projectServices.filter(
      (ps) => ps.status === 'connected'
    ).length;
    const serviceConnectionSuccessRate =
      totalServiceConnections > 0
        ? Math.round((connectedCount / totalServiceConnections) * 100)
        : 0;

    const totalEnvVars = envVars.length;
    const secretCount = envVars.filter((e) => e.is_secret).length;
    const secretRatio =
      totalEnvVars > 0 ? Math.round((secretCount / totalEnvVars) * 100) : 0;

    const totalDeploys = deploys.length;
    const successDeploys = deploys.filter(
      (d) => d.deploy_status === 'ready'
    ).length;
    const deploySuccessRate =
      totalDeploys > 0
        ? Math.round((successDeploys / totalDeploys) * 100)
        : 0;

    // ─── TOP 10 서비스 ───
    const serviceCountMap = new Map<string, number>();
    for (const ps of projectServices) {
      serviceCountMap.set(
        ps.service_id,
        (serviceCountMap.get(ps.service_id) ?? 0) + 1
      );
    }

    const serviceMap = new Map(services.map((s) => [s.id, s]));
    const topServices = Array.from(serviceCountMap.entries())
      .map(([serviceId, count]) => {
        const svc = serviceMap.get(serviceId);
        return svc
          ? { slug: svc.slug, name: svc.name, category: svc.category, count }
          : null;
      })
      .filter((v): v is NonNullable<typeof v> => v !== null)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // ─── 카테고리 분포 ───
    const categoryCountMap = new Map<string, number>();
    for (const ps of projectServices) {
      const svc = serviceMap.get(ps.service_id);
      if (svc) {
        categoryCountMap.set(
          svc.category,
          (categoryCountMap.get(svc.category) ?? 0) + 1
        );
      }
    }
    const categoryDistribution = Array.from(categoryCountMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // ─── 30일 추이 ───
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const days30Start = new Date(todayStart.getTime() - 29 * 24 * 60 * 60 * 1000);

    const trendMap = new Map<
      string,
      { projects: number; serviceConnections: number; envVars: number; deploys: number }
    >();

    for (let i = 0; i < 30; i++) {
      const d = new Date(days30Start.getTime() + i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      trendMap.set(key, { projects: 0, serviceConnections: 0, envVars: 0, deploys: 0 });
    }

    const addToTrend = (
      items: Array<{ created_at: string }>,
      field: 'projects' | 'serviceConnections' | 'envVars' | 'deploys'
    ) => {
      for (const item of items) {
        const key = item.created_at.slice(0, 10);
        const entry = trendMap.get(key);
        if (entry) {
          entry[field]++;
        }
      }
    };

    addToTrend(projects, 'projects');
    addToTrend(projectServices, 'serviceConnections');
    addToTrend(envVars, 'envVars');
    addToTrend(deploys, 'deploys');

    const dailyTrend = Array.from(trendMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }));

    // ─── 활성도 ───
    const projectIds = new Set(projects.map((p) => p.id));
    const servicesPerProject = new Map<string, number>();
    for (const ps of projectServices) {
      if (projectIds.has(ps.project_id)) {
        servicesPerProject.set(
          ps.project_id,
          (servicesPerProject.get(ps.project_id) ?? 0) + 1
        );
      }
    }
    const envVarsPerProject = new Map<string, number>();
    for (const ev of envVars) {
      if (projectIds.has(ev.project_id)) {
        envVarsPerProject.set(
          ev.project_id,
          (envVarsPerProject.get(ev.project_id) ?? 0) + 1
        );
      }
    }

    const avgServicesPerProject =
      totalProjects > 0
        ? Math.round(
            (Array.from(servicesPerProject.values()).reduce((a, b) => a + b, 0) /
              totalProjects) *
              10
          ) / 10
        : 0;

    const avgEnvVarsPerProject =
      totalProjects > 0
        ? Math.round(
            (Array.from(envVarsPerProject.values()).reduce((a, b) => a + b, 0) /
              totalProjects) *
              10
          ) / 10
        : 0;

    const totalTokens = tokens.length;
    const activeTokens = tokens.filter((t) => t.last_used_at !== null).length;
    const activeTokenRatio =
      totalTokens > 0 ? Math.round((activeTokens / totalTokens) * 100) : 0;

    const aiRequests = aiLogs.length;
    const aiTotalTokens = aiLogs.reduce(
      (sum, log) => sum + (log.total_tokens ?? 0),
      0
    );

    // ─── 기능 요청 상태별 ───
    const statusCountMap = new Map<string, number>();
    for (const fr of featureRequests) {
      statusCountMap.set(fr.status, (statusCountMap.get(fr.status) ?? 0) + 1);
    }
    const featureRequestsByStatus = Array.from(statusCountMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    await logAudit(user.id, {
      action: 'admin.usage_stats_view',
      resourceType: 'admin',
    });

    const result: AdminUsageStats = {
      kpis: {
        totalProjects,
        newProjectsThisMonth,
        totalServiceConnections,
        serviceConnectionSuccessRate,
        totalEnvVars,
        secretRatio,
        totalDeploys,
        deploySuccessRate,
      },
      topServices,
      categoryDistribution,
      dailyTrend,
      activity: {
        avgServicesPerProject,
        avgEnvVarsPerProject,
        activeTokenRatio,
        aiRequests,
        aiTotalTokens,
      },
      featureRequestsByStatus,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Usage stats error:', error);
    return serverError('기능 사용 통계 조회에 실패했습니다');
  }
}
