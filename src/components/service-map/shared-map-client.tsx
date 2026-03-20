'use client';

import Link from 'next/link';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Layers, ExternalLink } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { MapView } from '@/components/service-map/views/map-view';
import { DependencyView } from '@/components/service-map/views/dependency-view';
import { ViewLevelSwitcher } from '@/components/service-map/view-level-switcher';
import { ServiceIcon } from '@/components/ui/service-icon';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useServiceMapData } from '@/components/service-map/hooks/useServiceMapData';
import { SHOWCASE_CATEGORIES } from '@/types/core';

const STATUS_DOT: Record<string, string> = {
  connected: 'bg-green-400',
  in_progress: 'bg-yellow-400',
  error: 'bg-orange-400',
  not_started: 'bg-slate-400',
};

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

  const { projectMeta } = data;
  const showcaseCategoryLabel = projectMeta.showcaseCategory
    ? SHOWCASE_CATEGORIES.find((c) => c.value === projectMeta.showcaseCategory)?.label
    : null;

  // 서비스별 상태 카운트
  const statusCounts: Record<string, number> = {};
  for (const s of data.services) {
    statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col w-full h-full relative">
        {/* 프로젝트 정보 헤더 */}
        <div className="absolute top-4 left-4 z-10 max-w-sm">
          <div className="bg-background/80 backdrop-blur-md rounded-xl border shadow-sm p-3 space-y-2.5">
            {/* 프로젝트 이름 + 아이콘 */}
            <div className="flex items-center gap-2">
              {projectMeta.iconType === 'emoji' && projectMeta.iconValue && (
                <span className="text-lg">{projectMeta.iconValue}</span>
              )}
              <h2 className="text-sm font-bold truncate">{data.projectName}</h2>
              <Badge variant="secondary" className="text-[10px] shrink-0">
                <Layers className="h-3 w-3 mr-1" />
                {data.services.length}개 서비스
              </Badge>
            </div>

            {/* 서비스 아이콘 목록 + 상태 */}
            <div className="flex flex-wrap gap-1.5">
              {data.services.slice(0, 12).map((ps) => (
                <div
                  key={ps.id}
                  className="relative flex items-center justify-center rounded-md bg-muted/50 p-1.5"
                  title={`${ps.service?.name ?? 'Unknown'} (${ps.status})`}
                >
                  <ServiceIcon
                    serviceId={ps.service?.slug ?? ''}
                    iconEmoji={ps.service?.icon_emoji}
                    size={18}
                  />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background ${STATUS_DOT[ps.status] ?? STATUS_DOT.not_started}`} />
                </div>
              ))}
              {data.services.length > 12 && (
                <span className="text-[10px] text-muted-foreground self-center ml-1">
                  +{data.services.length - 12}
                </span>
              )}
            </div>

            {/* 상태별 요약 */}
            <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
              {Object.entries(statusCounts).map(([status, count]) => (
                <span key={status} className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] ?? STATUS_DOT.not_started}`} />
                  {status === 'connected' ? '연결됨' : status === 'in_progress' ? '진행 중' : status === 'error' ? '오류' : '시작 전'} {count}
                </span>
              ))}
            </div>

            {/* 쇼케이스 링크 */}
            {projectMeta.isShowcase && projectMeta.id && (
              <Link
                href={`/showcase/${projectMeta.id}`}
                prefetch={false}
                className="flex items-center gap-1.5 text-xs text-brand-blue hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                {showcaseCategoryLabel ? `${showcaseCategoryLabel} 쇼케이스 보기` : '쇼케이스 보기'}
              </Link>
            )}
          </div>
        </div>

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
