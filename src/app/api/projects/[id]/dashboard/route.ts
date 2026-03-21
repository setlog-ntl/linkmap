import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, serverError } from '@/lib/api/errors';
import type { DashboardLayer, DashboardResponse, ServiceCardData, LayerData, DashboardMetrics } from '@/types';
import type { UserConnection } from '@/types';

const LAYER_ORDER: DashboardLayer[] = ['frontend', 'backend', 'devtools', 'etc'];

const LAYER_LABELS: Record<DashboardLayer, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  devtools: 'DevTools',
  etc: 'ETC',
};

/** Map service domain to dashboard layer — domains not in frontend/backend/devtools go to etc */
const DOMAIN_TO_LAYER: Record<string, DashboardLayer> = {
  infrastructure: 'frontend',
  sns: 'frontend',
  backend: 'backend',
  devtools: 'devtools',
  observability: 'devtools',
  // These domains go to ETC
  communication: 'etc',
  business: 'etc',
  ai_ml: 'etc',
  integration: 'etc',
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  try {
    const [projectResult, servicesResult, envResult, connectionsResult, overridesResult, costTiersResult] = await Promise.all([
      supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('project_services')
        .select('id, status, service:services(id, name, slug, category, website_url, dashboard_layer, dashboard_subcategory, domain, required_env_vars)')
        .eq('project_id', id)
        .order('created_at'),
      supabase
        .from('environment_variables')
        .select('service_id')
        .eq('project_id', id),
      supabase
        .from('user_connections')
        .select('*')
        .eq('project_id', id)
        .order('created_at'),
      supabase
        .from('project_service_overrides')
        .select('service_id, dashboard_layer, dashboard_subcategory')
        .eq('project_id', id),
      supabase
        .from('project_services')
        .select('id, cost_tier_id, custom_cost_monthly, cost_tier:service_cost_tiers(tier_name, price_monthly)')
        .eq('project_id', id),
    ]);

    if (projectResult.error || !projectResult.data) {
      return notFoundError('프로젝트');
    }

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

    // Count env vars per service
    const envCountByService = new Map<string, number>();
    for (const ev of envVars) {
      if (ev.service_id) {
        envCountByService.set(ev.service_id, (envCountByService.get(ev.service_id) ?? 0) + 1);
      }
    }

    // Build override lookup: service_id → { layer, subcategory }
    interface OverrideRow { service_id: string; dashboard_layer: string | null; dashboard_subcategory: string | null }
    const overrides = new Map<string, OverrideRow>();
    for (const o of (overridesResult.data ?? []) as unknown as OverrideRow[]) {
      overrides.set(o.service_id, o);
    }

    // Build ServiceCardData array (override > service default > fallback)
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
        dashboardLayer: (ovr?.dashboard_layer ?? svc.dashboard_layer ?? DOMAIN_TO_LAYER[(svc as Record<string, unknown>).domain as string] ?? 'backend') as DashboardLayer,
        dashboardSubcategory: ovr?.dashboard_subcategory ?? svc.dashboard_subcategory ?? svc.category,
        envTotal,
        envFilled: Math.min(envFilled, envTotal),
        websiteUrl: svc.website_url,
      };
    });

    // Group by layer
    const layerMap = new Map<DashboardLayer, ServiceCardData[]>();
    for (const layer of LAYER_ORDER) {
      layerMap.set(layer, []);
    }
    for (const card of cards) {
      const arr = layerMap.get(card.dashboardLayer);
      if (arr) arr.push(card);
      else layerMap.get('etc')!.push(card);
    }

    const layers: LayerData[] = LAYER_ORDER.map((layer) => ({
      layer,
      label: LAYER_LABELS[layer],
      services: layerMap.get(layer) ?? [],
    }));

    // Build cost lookup for cards
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

    // Enrich cards with cost data
    for (const card of cards) {
      const cm = costMap.get(card.projectServiceId);
      if (cm) {
        card.monthlyCost = cm.monthlyCost;
        card.tierName = cm.tierName;
      }
    }

    // Metrics
    const connectedCount = cards.filter((c) => c.status === 'connected').length;
    const monthlyBudget = project.monthly_budget as number | null ?? null;
    const metrics: DashboardMetrics = {
      totalServices: cards.length,
      connectedServices: connectedCount,
      totalEnvVars: envVars.length,
      progressPercent: cards.length > 0
        ? Math.round((connectedCount / cards.length) * 100)
        : 0,
      totalMonthlyCost,
      monthlyBudget,
      budgetUsagePercent: monthlyBudget != null && monthlyBudget > 0
        ? Math.round((totalMonthlyCost / monthlyBudget) * 100)
        : null,
      isOverBudget: monthlyBudget != null ? totalMonthlyCost > monthlyBudget : false,
    };

    const connections = (connectionsResult.data as unknown as UserConnection[]) ?? [];
    const response: DashboardResponse = { project, layers, metrics, connections };
    return NextResponse.json(response);
  } catch (err) {
    console.error('[dashboard] error:', err);
    return serverError();
  }
}
