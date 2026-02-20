'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EmptyMapState } from '@/components/service-map/empty-map-state';
import { ViewLevelSwitcher } from '@/components/service-map/view-level-switcher';
import { StatusView } from '@/components/service-map/views/status-view';
import { MapView } from '@/components/service-map/views/map-view';
import { DependencyView } from '@/components/service-map/views/dependency-view';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useServiceMapData } from '@/components/service-map/hooks/useServiceMapData';

function ServiceMapInner() {
  const params = useParams();
  const projectId = params.id as string;
  const { viewLevel } = useServiceMapStore();

  // OAuth success redirect handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthSuccess = urlParams.get('oauth_success');
    const ALLOWED_PROVIDERS = ['github', 'google', 'vercel', 'gitlab', 'bitbucket', 'azure', 'aws'];
    if (oauthSuccess && ALLOWED_PROVIDERS.includes(oauthSuccess.toLowerCase())) {
      toast.success(`${oauthSuccess} 계정이 연결되었습니다`);
      const url = new URL(window.location.href);
      url.searchParams.delete('oauth_success');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Single data fetch — shared across all views
  const data = useServiceMapData(projectId);

  // Loading state
  const isDataLoading = data.servicesLoading || data.depsLoading || data.connectionsLoading;
  if (isDataLoading) {
    return <div className="h-[calc(100vh-16rem)] min-h-[500px] max-h-[900px] rounded-lg bg-muted animate-pulse" />;
  }

  // Empty state
  if (data.services.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold shrink-0">서비스 맵</h2>
          <ViewLevelSwitcher />
        </div>
        <div className="h-[calc(100vh-16rem)] min-h-[500px] max-h-[900px]">
          <EmptyMapState projectId={projectId} />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold shrink-0">서비스 맵</h2>
          <ViewLevelSwitcher />
        </div>

        {viewLevel === 'status' && <StatusView data={data} projectId={projectId} />}
        {viewLevel === 'map' && <MapView data={data} />}
        {viewLevel === 'dependency' && <DependencyView data={data} projectId={projectId} />}
      </div>
    </TooltipProvider>
  );
}

export default function ServiceMapClient() {
  return (
    <ReactFlowProvider>
      <ServiceMapInner />
    </ReactFlowProvider>
  );
}
