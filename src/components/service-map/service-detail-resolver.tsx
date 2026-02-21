'use client';

import { useEffect } from 'react';
import { useServiceDetailStore } from '@/stores/service-detail-store';
import { useProjectServices } from '@/lib/queries/services';
import { useServiceDependencies } from '@/lib/queries/dependencies';
import { useEnvVars } from '@/lib/queries/env-vars';

/**
 * Watches pendingIdentifier in the global store.
 * When set, resolves full service data using TanStack Query (leverages cache).
 */
export function ServiceDetailResolver() {
  const { pendingIdentifier, resolvePending, isOpen } = useServiceDetailStore();
  const projectId = pendingIdentifier?.projectId ?? '';

  const { data: services = [] } = useProjectServices(projectId);
  const { data: dependencies = [] } = useServiceDependencies();
  const { data: envVars = [] } = useEnvVars(projectId);

  useEffect(() => {
    if (!pendingIdentifier || !isOpen || services.length === 0) return;

    const target = services.find((s) => s.id === pendingIdentifier.projectServiceId);
    if (!target) return;

    const serviceNames: Record<string, string> = {};
    for (const s of services) {
      serviceNames[s.service_id] = s.service?.name || 'Unknown';
    }

    const targetDeps = dependencies.filter(
      (d) => d.service_id === target.service_id
    );

    resolvePending({
      service: target,
      dependencies: targetDeps,
      serviceNames,
      projectId: pendingIdentifier.projectId,
      envVars,
    });
  }, [pendingIdentifier, isOpen, services, dependencies, envVars, resolvePending]);

  return null;
}
