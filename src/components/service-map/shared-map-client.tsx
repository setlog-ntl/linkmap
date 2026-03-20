'use client';

import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MapView } from '@/components/service-map/views/map-view';
import { DependencyView } from '@/components/service-map/views/dependency-view';
import { ViewLevelSwitcher } from '@/components/service-map/view-level-switcher';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useServiceMapData } from '@/components/service-map/hooks/useServiceMapData';

interface SharedMapClientProps {
  shareToken: string;
}

function SharedMapInner({ shareToken }: SharedMapClientProps) {
  const { viewLevel } = useServiceMapStore();

  // shared 모드: projectId 불필요 (토큰으로 조회)
  const data = useServiceMapData('', { mode: 'shared', shareToken });

  const isDataLoading = data.servicesLoading || data.depsLoading || data.connectionsLoading;
  if (isDataLoading) {
    return <div className="h-full min-h-[500px] rounded-2xl bg-muted/50 animate-pulse" />;
  }

  if (data.services.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">공유된 서비스맵을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col w-full h-full relative">
        <div className="absolute top-16 right-4 z-10">
          <ViewLevelSwitcher />
        </div>

        {viewLevel === 'map' && <MapView data={data} projectId="" isReadOnly />}
        {viewLevel === 'dependency' && <DependencyView data={data} projectId="" isReadOnly />}
      </div>
    </TooltipProvider>
  );
}

export default function SharedMapClient(props: SharedMapClientProps) {
  return (
    <ReactFlowProvider>
      <SharedMapInner {...props} />
    </ReactFlowProvider>
  );
}
