'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useProjectConnections, useCreateConnection, useDeleteConnection } from '@/lib/queries/connections';
import { useProjectServices, useCatalogServices, useRemoveProjectService } from '@/lib/queries/services';
import { useLatestHealthChecks, useRunHealthCheck } from '@/lib/queries/health-checks';
import { useServiceDependencies } from '@/lib/queries/dependencies';
import { useServiceAccounts } from '@/lib/queries/service-accounts';
import { useEnvVars } from '@/lib/queries/env-vars';
import { useLayerOverrides } from '@/lib/queries/layer-overrides';
import { createClient } from '@/lib/supabase/client';
import type {
  ProjectService,
  Service,
  ServiceDependency,
  ServiceAccount,
  EnvironmentVariable,
  HealthCheck,
  UserConnection,
} from '@/types';
import type { ShowcaseCategory } from '@/types/core';

const EMPTY_CONNECTIONS: UserConnection[] = [];

export type ServiceMapMode = 'normal' | 'demo' | 'shared';

export interface ServiceMapOptions {
  mode?: ServiceMapMode;
  shareToken?: string;
}

export interface ProjectMeta {
  id: string | null;
  description: string | null;
  iconType: string | null;
  iconValue: string | null;
  linkUrl: string | null;
  isShowcase: boolean;
  showcaseDescription: string | null;
  showcaseCategory: ShowcaseCategory | null;
}

export interface ServiceMapData {
  // Project
  projectName: string;
  mainServiceId: string | null;
  projectMeta: ProjectMeta;

  // Services
  services: (ProjectService & { service: Service })[];
  servicesLoading: boolean;
  catalogServices: Service[];
  catalogLoading: boolean;
  removeService: ReturnType<typeof useRemoveProjectService>;

  // Health checks
  healthChecks: Record<string, HealthCheck>;
  runHealthCheck: ReturnType<typeof useRunHealthCheck>;

  // Dependencies
  dependencies: ServiceDependency[];
  depsLoading: boolean;

  // Service accounts
  serviceAccounts: ServiceAccount[];

  // Environment variables
  envVars: EnvironmentVariable[];

  // Connections
  userConnections: UserConnection[];
  connectionsLoading: boolean;
  createConnectionRef: React.RefObject<ReturnType<typeof useCreateConnection>>;
  deleteConnectionRef: React.RefObject<ReturnType<typeof useDeleteConnection>>;

  // Layer overrides
  layerOverrides: Record<string, string>; // service_id → dashboard_layer
  // Saved node positions (service_id → {x, y})
  savedNodePositions: Record<string, { x: number; y: number }>;
}

// 데모/공유 API 응답 타입
interface RemoteApiResponse {
  project?: {
    id?: string;
    name?: string;
    description?: string | null;
    main_service_id?: string | null;
    icon_type?: string | null;
    icon_value?: string | null;
    link_url?: string | null;
    is_showcase?: boolean;
    showcase_description?: string | null;
    showcase_category?: ShowcaseCategory | null;
  };
  services?: (ProjectService & { service: Service })[];
  dependencies?: ServiceDependency[];
  userConnections?: UserConnection[];
  envVars?: EnvironmentVariable[];
  layerOverrides?: { service_id: string; dashboard_layer: string | null }[];
}

const EMPTY_META: ProjectMeta = {
  id: null,
  description: null,
  iconType: null,
  iconValue: null,
  linkUrl: null,
  isShowcase: false,
  showcaseDescription: null,
  showcaseCategory: null,
};

export function useServiceMapData(projectId: string, options?: ServiceMapOptions | boolean): ServiceMapData {
  // 하위 호환: isDemo boolean 지원
  const opts: ServiceMapOptions = typeof options === 'boolean'
    ? { mode: options ? 'demo' : 'normal' }
    : options ?? {};
  const mode = opts.mode ?? 'normal';
  const shareToken = opts.shareToken;
  const isRemote = mode === 'demo' || mode === 'shared';

  const supabaseRef = useRef(createClient());

  // Project name + main_service_id + meta
  const [projectName, setProjectName] = useState('내 앱');
  const [mainServiceId, setMainServiceId] = useState<string | null>(null);
  const [projectMeta, setProjectMeta] = useState<ProjectMeta>(EMPTY_META);

  // 리모트(데모/공유) 모드 전용 상태
  const [remoteData, setRemoteData] = useState<{
    services: (ProjectService & { service: Service })[];
    dependencies: ServiceDependency[];
    connections: UserConnection[];
    envVars: EnvironmentVariable[];
    layerOverrides: Record<string, string>;
  }>({
    services: [],
    dependencies: [],
    connections: [],
    envVars: [],
    layerOverrides: {},
  });
  const [remoteLoading, setRemoteLoading] = useState(isRemote);

  useEffect(() => {
    if (isRemote) {
      const apiUrl = mode === 'shared'
        ? `/api/shared/map/${shareToken}`
        : `/api/demo/project/${projectId}`;

      setRemoteLoading(true);
      fetch(apiUrl)
        .then((r) => r.ok ? r.json() as Promise<RemoteApiResponse> : null)
        .then((json) => {
          if (!json) return;
          if (json.project) {
            setProjectName(json.project.name ?? '내 앱');
            setMainServiceId(json.project.main_service_id ?? null);
            setProjectMeta({
              id: json.project.id ?? null,
              description: json.project.description ?? null,
              iconType: json.project.icon_type ?? null,
              iconValue: json.project.icon_value ?? null,
              linkUrl: json.project.link_url ?? null,
              isShowcase: json.project.is_showcase ?? false,
              showcaseDescription: json.project.showcase_description ?? null,
              showcaseCategory: json.project.showcase_category ?? null,
            });
          }
          const overridesMap: Record<string, string> = {};
          for (const o of json.layerOverrides ?? []) {
            if (o.dashboard_layer) overridesMap[o.service_id] = o.dashboard_layer;
          }
          setRemoteData({
            services: json.services ?? [],
            dependencies: json.dependencies ?? [],
            connections: json.userConnections ?? [],
            envVars: json.envVars ?? [],
            layerOverrides: overridesMap,
          });
        })
        .catch(() => {})
        .finally(() => setRemoteLoading(false));
      return;
    }

    const supabase = supabaseRef.current;
    const fetchProject = async () => {
      const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      if (project) {
        const p = project as Record<string, unknown>;
        setProjectName(project.name);
        setMainServiceId(p.main_service_id as string | null ?? null);
        setProjectMeta({
          id: project.id,
          description: p.description as string | null ?? null,
          iconType: p.icon_type as string | null ?? null,
          iconValue: p.icon_value as string | null ?? null,
          linkUrl: p.link_url as string | null ?? null,
          isShowcase: (p.is_showcase as boolean) ?? false,
          showcaseDescription: p.showcase_description as string | null ?? null,
          showcaseCategory: p.showcase_category as ShowcaseCategory | null ?? null,
        });
      }
    };
    fetchProject();
  }, [projectId, isRemote, mode, shareToken]);

  // TanStack Query hooks — 리모트 모드에서는 빈 projectId로 비활성화 (enabled: !!projectId)
  const queryProjectId = isRemote ? '' : projectId;
  const { data: services = [], isLoading: servicesLoading } = useProjectServices(queryProjectId);
  const { data: catalogServices = [], isLoading: catalogLoading } = useCatalogServices();
  const { data: healthChecks = {} } = useLatestHealthChecks(queryProjectId);
  const runHealthCheck = useRunHealthCheck();
  const removeService = useRemoveProjectService(queryProjectId);

  // Dependencies via TanStack Query
  const { data: dependencies = [], isLoading: depsLoading } = useServiceDependencies();

  // Service accounts
  const { data: serviceAccounts = [] } = useServiceAccounts(queryProjectId);

  // Environment variables
  const { data: envVars = [] } = useEnvVars(queryProjectId);

  // Fetch user connections
  const { data: userConnections = EMPTY_CONNECTIONS, isLoading: connectionsLoading } = useProjectConnections(queryProjectId);
  const createConnectionMutation = useCreateConnection(queryProjectId);
  const deleteConnectionMutation = useDeleteConnection(queryProjectId);

  // Layer overrides (memoized to prevent infinite re-render)
  const { data: layerOverridesRaw = [] } = useLayerOverrides(queryProjectId);
  const layerOverrides = useMemo(() => {
    if (isRemote) return remoteData.layerOverrides;
    const map: Record<string, string> = {};
    for (const o of layerOverridesRaw) {
      if (o.dashboard_layer) map[o.service_id] = o.dashboard_layer;
    }
    return map;
  }, [isRemote, remoteData.layerOverrides, layerOverridesRaw]);

  // Saved node positions from DB
  const savedNodePositions = useMemo(() => {
    if (isRemote) return {};
    const map: Record<string, { x: number; y: number }> = {};
    for (const o of layerOverridesRaw) {
      if (o.position_x != null && o.position_y != null) {
        map[o.service_id] = { x: Number(o.position_x), y: Number(o.position_y) };
      }
    }
    return map;
  }, [isRemote, layerOverridesRaw]);

  // Stable refs for mutations
  const createConnectionRef = useRef(createConnectionMutation);
  createConnectionRef.current = createConnectionMutation;
  const deleteConnectionRef = useRef(deleteConnectionMutation);
  deleteConnectionRef.current = deleteConnectionMutation;

  return {
    projectName,
    mainServiceId,
    projectMeta,
    services: isRemote ? remoteData.services : services,
    servicesLoading: isRemote ? remoteLoading : servicesLoading,
    catalogServices,
    catalogLoading,
    removeService,
    healthChecks,
    runHealthCheck,
    dependencies: isRemote ? remoteData.dependencies : dependencies,
    depsLoading: isRemote ? remoteLoading : depsLoading,
    serviceAccounts,
    envVars: isRemote ? remoteData.envVars : envVars,
    userConnections: isRemote ? remoteData.connections : userConnections,
    connectionsLoading: isRemote ? remoteLoading : connectionsLoading,
    createConnectionRef,
    deleteConnectionRef,
    layerOverrides,
    savedNodePositions,
  };
}
