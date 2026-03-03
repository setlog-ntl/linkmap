export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { DemoDashboardView } from '@/components/demo/demo-dashboard-view';
import type { DashboardLayer, DashboardResponse, ServiceCardData, LayerData, DashboardMetrics } from '@/types';
import type { UserConnection, HealthCheckStatus } from '@/types';

const DEMO_USER_EMAIL = 'vcdemo@linkmap.site';

/** 데모 프로젝트 서비스 간 현실적인 연결 관계를 생성합니다 */
function buildDemoConnections(projectId: string, cards: ServiceCardData[]): UserConnection[] {
  const now = new Date().toISOString();
  const connections: UserConnection[] = [];
  let seq = 1;

  const byLayer = (layer: string) => cards.filter((c) => c.dashboardLayer === layer);
  const byCat = (cat: string) => cards.find((c) => c.category === cat);

  const frontends = byLayer('frontend');
  const backends = byLayer('backend');

  const dbSvc = byCat('database');
  const authSvc = byCat('auth');
  const paymentSvc = byCat('payment');
  const emailSvc = byCat('email');
  const storageSvc = byCat('storage');

  type ConnType = UserConnection['connection_type'];

  const add = (
    srcId: string,
    tgtId: string,
    type: ConnType,
    label: string,
  ) => {
    connections.push({
      id: `demo-conn-${seq++}`,
      project_id: projectId,
      source_service_id: srcId,
      target_service_id: tgtId,
      connection_type: type,
      connection_status: 'active',
      environment: 'production',
      label,
      description: null,
      last_verified_at: now,
      metadata: {},
      created_by: 'demo',
      created_at: now,
      updated_at: now,
    });
  };

  // Frontend → Backend 연결
  for (const fe of frontends) {
    for (const be of backends.slice(0, 2)) {
      add(fe.serviceId, be.serviceId, 'api_call', 'API 호출');
    }
  }
  // Backend → DB
  if (backends.length > 0 && dbSvc) {
    add(backends[0].serviceId, dbSvc.serviceId, 'data_transfer', '데이터 저장');
  }
  // Backend → Auth
  if (backends.length > 0 && authSvc) {
    add(backends[0].serviceId, authSvc.serviceId, 'auth_provider', '인증');
  }
  // Backend → Payment
  if (backends.length > 0 && paymentSvc) {
    add(backends[0].serviceId, paymentSvc.serviceId, 'uses', '결제 처리');
  }
  // Backend → Email
  if (backends.length > 0 && emailSvc) {
    add(backends[0].serviceId, emailSvc.serviceId, 'uses', '이메일 발송');
  }
  // Backend → Storage
  if (backends.length > 0 && storageSvc) {
    add(backends[0].serviceId, storageSvc.serviceId, 'uses', '파일 저장');
  }

  return connections;
}

const LAYER_ORDER: DashboardLayer[] = ['frontend', 'backend', 'devtools'];
const LAYER_LABELS: Record<DashboardLayer, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  devtools: 'DevTools',
};

export default async function DemoProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const admin = createAdminClient();

    const { data: demoProfile } = await admin
      .from('profiles')
      .select('id')
      .eq('email', DEMO_USER_EMAIL)
      .single();

    if (!demoProfile) redirect('/demo');

    const [projectResult, servicesResult, envResult, connectionsResult, overridesResult, costTiersResult] = await Promise.all([
      admin
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', demoProfile.id)
        .is('deleted_at', null)
        .single(),
      admin
        .from('project_services')
        .select('id, status, service:services(id, name, slug, category, website_url, dashboard_layer, dashboard_subcategory, required_env_vars)')
        .eq('project_id', id)
        .order('created_at'),
      admin
        .from('environment_variables')
        .select('service_id')
        .eq('project_id', id),
      admin
        .from('user_connections')
        .select('*')
        .eq('project_id', id)
        .order('created_at'),
      admin
        .from('project_service_overrides')
        .select('service_id, dashboard_layer, dashboard_subcategory')
        .eq('project_id', id),
      admin
        .from('project_services')
        .select('id, cost_tier_id, custom_cost_monthly, cost_tier:service_cost_tiers(tier_name, price_monthly)')
        .eq('project_id', id),
    ]);

    if (!projectResult.data) redirect('/demo');

    const project = projectResult.data;

    interface PSRow {
      id: string;
      status: string;
      service: {
        id: string;
        name: string;
        slug: string;
        category: string;
        website_url: string | null;
        dashboard_layer: string | null;
        dashboard_subcategory: string | null;
        required_env_vars: Array<{ name: string; public: boolean; description: string }>;
      };
    }
    const projectServices = (servicesResult.data as unknown as PSRow[]) ?? [];
    const envVars = envResult.data ?? [];

    // 서비스별 환경변수 카운트
    const envCountByService = new Map<string, number>();
    for (const ev of envVars) {
      if (ev.service_id) {
        envCountByService.set(ev.service_id, (envCountByService.get(ev.service_id) ?? 0) + 1);
      }
    }

    // 레이어 오버라이드 조회
    interface OverrideRow { service_id: string; dashboard_layer: string | null; dashboard_subcategory: string | null }
    const overrides = new Map<string, OverrideRow>();
    for (const o of (overridesResult.data ?? []) as unknown as OverrideRow[]) {
      overrides.set(o.service_id, o);
    }

    // ServiceCardData 구성
    const cards: ServiceCardData[] = projectServices.map((ps) => {
      const svc = ps.service;
      const ovr = overrides.get(svc.id);
      const envTotal = svc.required_env_vars?.length ?? 0;
      const envFilled = envCountByService.get(svc.id) ?? 0;
      return {
        projectServiceId: ps.id,
        serviceId: svc.id,
        name: svc.name,
        slug: svc.slug,
        category: svc.category as ServiceCardData['category'],
        status: ps.status as ServiceCardData['status'],
        dashboardLayer: (ovr?.dashboard_layer ?? svc.dashboard_layer ?? 'backend') as DashboardLayer,
        dashboardSubcategory: ovr?.dashboard_subcategory ?? svc.dashboard_subcategory ?? svc.category,
        envTotal,
        envFilled: Math.min(envFilled, envTotal),
        websiteUrl: svc.website_url,
      };
    });

    // 레이어 그룹핑
    const layerMap = new Map<DashboardLayer, ServiceCardData[]>();
    for (const layer of LAYER_ORDER) {
      layerMap.set(layer, []);
    }
    for (const card of cards) {
      const arr = layerMap.get(card.dashboardLayer);
      if (arr) arr.push(card);
      else layerMap.get('backend')!.push(card);
    }
    const layers: LayerData[] = LAYER_ORDER.map((layer) => ({
      layer,
      label: LAYER_LABELS[layer],
      services: layerMap.get(layer) ?? [],
    }));

    // 비용 데이터
    interface CostTierRow { id: string; cost_tier_id: string | null; custom_cost_monthly: number | null; cost_tier: { tier_name: string; price_monthly: string | null } | null }
    const costData = (costTiersResult.data ?? []) as unknown as CostTierRow[];
    const costMap = new Map<string, { monthlyCost: number; tierName?: string }>();
    let totalMonthlyCost = 0;
    for (const ct of costData) {
      let cost = 0;
      let tierName: string | undefined;
      if (ct.custom_cost_monthly != null) {
        cost = ct.custom_cost_monthly;
      } else if (ct.cost_tier?.price_monthly) {
        const match = ct.cost_tier.price_monthly.match(/^\$?([\d,]+\.?\d*)$/);
        if (match) cost = parseFloat(match[1].replace(/,/g, ''));
        tierName = ct.cost_tier.tier_name;
      }
      totalMonthlyCost += cost;
      costMap.set(ct.id, { monthlyCost: cost, tierName });
    }
    for (const card of cards) {
      const cm = costMap.get(card.projectServiceId);
      if (cm) {
        card.monthlyCost = cm.monthlyCost;
        card.tierName = cm.tierName;
      }
    }

    // 메트릭
    const connectedCount = cards.filter((c) => c.status === 'connected').length;
    const monthlyBudget = (project.monthly_budget as number | null) ?? null;
    const metrics: DashboardMetrics = {
      totalServices: cards.length,
      connectedServices: connectedCount,
      totalEnvVars: envVars.length,
      progressPercent: cards.length > 0
        ? Math.round((connectedCount / cards.length) * 100)
        : 0,
      totalMonthlyCost,
      monthlyBudget,
      isOverBudget: monthlyBudget != null ? totalMonthlyCost > monthlyBudget : false,
    };

    const dbConnections = (connectionsResult.data ?? []) as unknown as UserConnection[];

    // 데모용 모의 헬스체크: 서비스 카테고리 기반으로 현실감 있는 상태 부여
    const DEGRADED_CATEGORIES = new Set(['payment', 'email', 'webhook']);
    const healthChecks: Record<string, { status: HealthCheckStatus }> = {};
    cards.forEach((card, idx) => {
      const cat = card.category as string;
      let status: HealthCheckStatus;
      if (card.status !== 'connected') {
        // 연결 안 된 서비스는 미검증
        status = 'unknown';
      } else if (DEGRADED_CATEGORIES.has(cat)) {
        // 결제·이메일 서비스는 경고 (현실감)
        status = 'degraded';
      } else if (idx === cards.length - 1 && cards.length > 2) {
        // 마지막 서비스 하나는 미검증 (아직 확인 안 된 것처럼)
        status = 'unknown';
      } else {
        status = 'healthy';
      }
      healthChecks[card.projectServiceId] = { status };
    });

    // 데모용 모의 연결: DB에 없는 경우 서비스 관계 기반으로 생성
    const connections: UserConnection[] =
      dbConnections.length > 0
        ? dbConnections
        : buildDemoConnections(id, cards);

    const dashboardData: DashboardResponse = { project, layers, metrics, connections, healthChecks };

    return <DemoDashboardView data={dashboardData} />;
  } catch {
    redirect('/demo');
  }
}
