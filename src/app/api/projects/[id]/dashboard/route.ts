import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, serverError } from '@/lib/api/errors';
import type { DashboardLayer, DashboardResponse, ServiceCardData, LayerData, DashboardMetrics, UserConnection } from '@/types';

const LAYER_ORDER: DashboardLayer[] = ['frontend', 'backend', 'devtools'];

const LAYER_LABELS: Record<DashboardLayer, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  devtools: 'DevTools',
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
    const [projectResult, servicesResult, envResult, connectionsResult, overridesResult] = await Promise.all([
      supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('project_services')
        .select('id, status, service:services(id, name, slug, category, website_url, dashboard_layer, dashboard_subcategory, required_env_vars)')
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
        dashboardLayer: (ovr?.dashboard_layer ?? svc.dashboard_layer ?? 'backend') as DashboardLayer,
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
      else layerMap.get('backend')!.push(card);
    }

    const layers: LayerData[] = LAYER_ORDER.map((layer) => ({
      layer,
      label: LAYER_LABELS[layer],
      services: layerMap.get(layer) ?? [],
    }));

    // Metrics
    const connectedCount = cards.filter((c) => c.status === 'connected').length;
    const metrics: DashboardMetrics = {
      totalServices: cards.length,
      connectedServices: connectedCount,
      totalEnvVars: envVars.length,
      progressPercent: cards.length > 0
        ? Math.round((connectedCount / cards.length) * 100)
        : 0,
    };

    const connections = (connectionsResult.data as unknown as UserConnection[]) ?? [];
    const response: DashboardResponse = { project, layers, metrics, connections };
    return NextResponse.json(response);
  } catch (err) {
    console.error('[dashboard] error:', err);
    return serverError();
  }
}
