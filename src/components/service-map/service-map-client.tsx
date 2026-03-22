'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EmptyMapState } from '@/components/service-map/empty-map-state';
import { ViewLevelSwitcher } from '@/components/service-map/view-level-switcher';
import { MapView } from '@/components/service-map/views/map-view';
import { DependencyView } from '@/components/service-map/views/dependency-view';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useServiceDetailStore } from '@/stores/service-detail-store';
import { useServiceMapData } from '@/components/service-map/hooks/useServiceMapData';

interface ServiceMapInnerProps {
  isReadOnly?: boolean;
}

function ServiceMapInner({ isReadOnly = false }: ServiceMapInnerProps) {
  const params = useParams();
  const projectId = params.id as string;
  const { viewLevel } = useServiceMapStore();
  const isSheetOpen = useServiceDetailStore((s) => s.isOpen);

  // OAuth success redirect handling (로그인 상태에서만)
  useEffect(() => {
    if (isReadOnly) return;
    const urlParams = new URLSearchParams(window.location.search);
    const oauthSuccess = urlParams.get('oauth_success');
    const ALLOWED_PROVIDERS = ['github', 'google', 'vercel', 'gitlab', 'bitbucket', 'azure', 'aws'];
    if (oauthSuccess && ALLOWED_PROVIDERS.includes(oauthSuccess.toLowerCase())) {
      toast.success(`${oauthSuccess} 계정이 연결되었습니다`);
      const url = new URL(window.location.href);
      url.searchParams.delete('oauth_success');
      window.history.replaceState({}, '', url.toString());
    }
  }, [isReadOnly]);

  // Single data fetch — shared across all views (isReadOnly = 데모 모드)
  const data = useServiceMapData(projectId, isReadOnly);

  // Loading state
  const isDataLoading = data.servicesLoading || data.depsLoading || data.connectionsLoading;
  if (isDataLoading) {
    return <div className="h-[calc(100vh-16rem)] min-h-[500px] max-h-[900px] rounded-2xl bg-muted/50 animate-pulse" />;
  }

  // Empty state
  if (data.services.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold tracking-tight shrink-0">서비스 맵</h2>
          <ViewLevelSwitcher />
        </div>
        <div className="h-[calc(100vh-16rem)] min-h-[500px] max-h-[900px]">
          {isReadOnly ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed">
              <p className="text-sm text-muted-foreground">연결된 서비스가 없습니다.</p>
            </div>
          ) : (
            <EmptyMapState projectId={projectId} />
          )}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col w-full h-full relative">
        <div
          className="absolute top-16 z-10 flex items-center gap-4 transition-all duration-300"
          style={{ right: isSheetOpen ? 'calc(380px + 1.5rem)' : '1rem' }}
        >
          <ViewLevelSwitcher />
        </div>

        {viewLevel === 'map' && <MapView data={data} projectId={projectId} isReadOnly={isReadOnly} />}
        {viewLevel === 'dependency' && <DependencyView data={data} projectId={projectId} isReadOnly={isReadOnly} />}
      </div>
    </TooltipProvider>
  );
}

interface ServiceMapClientProps {
  isReadOnly?: boolean;
}

export default function ServiceMapClient({ isReadOnly = false }: ServiceMapClientProps) {
  return (
    <ReactFlowProvider>
      <ServiceMapInner isReadOnly={isReadOnly} />
    </ReactFlowProvider>
  );
}
