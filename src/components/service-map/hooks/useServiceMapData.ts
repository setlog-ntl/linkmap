'use client';

import { useRef, useState, useEffect } from 'react';
import { useProjectConnections, useCreateConnection, useDeleteConnection } from '@/lib/queries/connections';
import { useProjectServices, useCatalogServices, useRemoveProjectService } from '@/lib/queries/services';
import { useLatestHealthChecks, useRunHealthCheck } from '@/lib/queries/health-checks';
import { useServiceDependencies } from '@/lib/queries/dependencies';
import { useServiceAccounts } from '@/lib/queries/service-accounts';
import { useEnvVars } from '@/lib/queries/env-vars';
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

const EMPTY_CONNECTIONS: UserConnection[] = [];

export interface ServiceMapData {
  // Project
  projectName: string;

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
}

export function useServiceMapData(projectId: string): ServiceMapData {
  const supabaseRef = useRef(createClient());

  // Project name
  const [projectName, setProjectName] = useState('내 앱');

  useEffect(() => {
    const supabase = supabaseRef.current;
    const fetchProjectName = async () => {
      const { data: project } = await supabase
        .from('projects')
        .select('name')
        .eq('id', projectId)
        .single();
      if (project) setProjectName(project.name);
    };
    fetchProjectName();
  }, [projectId]);

  // TanStack Query hooks
  const { data: services = [], isLoading: servicesLoading } = useProjectServices(projectId);
  const { data: catalogServices = [], isLoading: catalogLoading } = useCatalogServices();
  const { data: healthChecks = {} } = useLatestHealthChecks(projectId);
  const runHealthCheck = useRunHealthCheck();
  const removeService = useRemoveProjectService(projectId);

  // Dependencies via TanStack Query
  const { data: dependencies = [], isLoading: depsLoading } = useServiceDependencies();

  // Service accounts
  const { data: serviceAccounts = [] } = useServiceAccounts(projectId);

  // Environment variables
  const { data: envVars = [] } = useEnvVars(projectId);

  // Fetch user connections
  const { data: userConnections = EMPTY_CONNECTIONS, isLoading: connectionsLoading } = useProjectConnections(projectId);
  const createConnectionMutation = useCreateConnection(projectId);
  const deleteConnectionMutation = useDeleteConnection(projectId);

  // Stable refs for mutations
  const createConnectionRef = useRef(createConnectionMutation);
  createConnectionRef.current = createConnectionMutation;
  const deleteConnectionRef = useRef(deleteConnectionMutation);
  deleteConnectionRef.current = deleteConnectionMutation;

  return {
    projectName,
    services,
    servicesLoading,
    catalogServices,
    catalogLoading,
    removeService,
    healthChecks,
    runHealthCheck,
    dependencies,
    depsLoading,
    serviceAccounts,
    envVars,
    userConnections,
    connectionsLoading,
    createConnectionRef,
    deleteConnectionRef,
  };
}
