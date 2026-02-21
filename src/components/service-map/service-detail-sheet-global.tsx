'use client';

import { useServiceDetailStore } from '@/stores/service-detail-store';
import { ServiceDetailSheet } from '@/components/service-map/service-detail-sheet';

export function ServiceDetailSheetGlobal() {
  const { isOpen, fullData, pendingIdentifier, closeSheet } = useServiceDetailStore();

  const loading = isOpen && !fullData && !!pendingIdentifier;

  return (
    <ServiceDetailSheet
      service={fullData?.service ?? null}
      dependencies={fullData?.dependencies ?? []}
      serviceNames={fullData?.serviceNames ?? {}}
      open={isOpen}
      onOpenChange={(open) => { if (!open) closeSheet(); }}
      projectId={fullData?.projectId}
      envVars={fullData?.envVars}
      loading={loading}
    />
  );
}
