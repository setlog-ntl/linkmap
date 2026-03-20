'use client';

import Link from 'next/link';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState } from 'react';
import { ExternalLink, Globe, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { MapView } from '@/components/service-map/views/map-view';
import { DependencyView } from '@/components/service-map/views/dependency-view';
import { ViewLevelSwitcher } from '@/components/service-map/view-level-switcher';
import { ServiceIcon } from '@/components/ui/service-icon';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useServiceMapData } from '@/components/service-map/hooks/useServiceMapData';
import { useIsMobile } from '@/hooks/use-mobile';
import { SHOWCASE_CATEGORIES } from '@/types/core';

const STATUS_DOT: Record<string, string> = {
  connected: 'bg-green-400',
  in_progress: 'bg-yellow-400',
  error: 'bg-orange-400',
  not_started: 'bg-slate-400',
};

const STATUS_LABEL: Record<string, string> = {
  connected: '연결됨',
  in_progress: '진행 중',
  error: '오류',
  not_started: '시작 전',
};

interface SharedMapClientProps {
  shareToken: string;
}

function SharedMapInner({ shareToken }: SharedMapClientProps) {
  const { viewLevel } = useServiceMapStore();
  const isMobile = useIsMobile();
  const [panelExpanded, setPanelExpanded] = useState(false);

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
        {/* 프로젝트 정보 패널 — 데스크톱 */}
        <div className="absolute top-4 left-4 z-10 w-72 hidden md:block">
          <div className="bg-background/85 backdrop-blur-md rounded-xl border shadow-sm overflow-hidden">
            {/* 헤더: 프로젝트명 + 아이콘 */}
            <div className="p-3 border-b space-y-1.5">
              <div className="flex items-center gap-2">
                {projectMeta.iconType === 'emoji' && projectMeta.iconValue && (
                  <span className="text-xl">{projectMeta.iconValue}</span>
                )}
                <h2 className="text-sm font-bold truncate flex-1">{data.projectName}</h2>
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  {data.services.length}개
                </Badge>
              </div>

              {/* 프로젝트 설명 */}
              {projectMeta.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {projectMeta.description}
                </p>
              )}

              {/* 프로젝트 링크 */}
              {projectMeta.linkUrl && (
                <a
                  href={projectMeta.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-brand-blue hover:underline"
                >
                  <Globe className="h-3 w-3" />
                  {projectMeta.linkUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
            </div>

            {/* 서비스 목록 */}
            <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                등록된 서비스
              </div>
              <div className="space-y-1">
                {data.services.map((ps) => (
                  <div
                    key={ps.id}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative shrink-0">
                      <ServiceIcon
                        serviceId={ps.service?.slug ?? ''}
                        iconEmoji={ps.service?.icon_emoji}
                        size={16}
                      />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-background ${STATUS_DOT[ps.status] ?? STATUS_DOT.not_started}`} />
                    </div>
                    <span className="text-xs truncate flex-1">{ps.service?.name ?? 'Unknown'}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {STATUS_LABEL[ps.status] ?? ps.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 상태 요약 + 링크 */}
            <div className="p-3 border-t space-y-2">
              {/* 상태별 요약 */}
              <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <span key={status} className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] ?? STATUS_DOT.not_started}`} />
                    {STATUS_LABEL[status] ?? status} {count}
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
                  <ArrowRight className="h-3 w-3 ml-auto" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 프로젝트 정보 — 모바일 하단 콜랩서블 카드 */}
        <div className="absolute bottom-0 left-0 right-0 z-10 md:hidden">
          <div className="bg-background/90 backdrop-blur-md border-t shadow-sm">
            {/* 축소 헤더 — 항상 표시 */}
            <button
              onClick={() => setPanelExpanded(!panelExpanded)}
              className="w-full flex items-center gap-2 px-3 py-2.5 min-h-[48px]"
            >
              {projectMeta.iconType === 'emoji' && projectMeta.iconValue && (
                <span className="text-lg shrink-0">{projectMeta.iconValue}</span>
              )}
              <span className="text-sm font-bold truncate">{data.projectName}</span>

              {/* 서비스 아이콘 미리보기 (겹침, 최대 5개) */}
              <div className="flex -space-x-1 shrink-0">
                {data.services.slice(0, 5).map((ps) => (
                  <div key={ps.id} className="w-5 h-5 rounded-full bg-muted border border-background flex items-center justify-center overflow-hidden">
                    <ServiceIcon
                      serviceId={ps.service?.slug ?? ''}
                      iconEmoji={ps.service?.icon_emoji}
                      size={12}
                    />
                  </div>
                ))}
              </div>

              <Badge variant="secondary" className="text-[10px] shrink-0">
                {data.services.length}개
              </Badge>

              <span className="ml-auto shrink-0 text-muted-foreground">
                {panelExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </span>
            </button>

            {/* 펼침 컨텐츠 */}
            {panelExpanded && (
              <div className="max-h-[55vh] overflow-y-auto border-t px-3 py-2 space-y-2">
                {/* 설명 */}
                {projectMeta.description && (
                  <p className="text-xs text-muted-foreground">{projectMeta.description}</p>
                )}

                {/* 링크 */}
                {projectMeta.linkUrl && (
                  <a
                    href={projectMeta.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-brand-blue hover:underline"
                  >
                    <Globe className="h-3 w-3" />
                    {projectMeta.linkUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                )}

                {/* 서비스 리스트 */}
                <div className="space-y-0.5">
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    등록된 서비스
                  </div>
                  {data.services.map((ps) => (
                    <div
                      key={ps.id}
                      className="flex items-center gap-2 rounded-md px-2 py-2.5 hover:bg-muted/50 transition-colors"
                    >
                      <div className="relative shrink-0">
                        <ServiceIcon
                          serviceId={ps.service?.slug ?? ''}
                          iconEmoji={ps.service?.icon_emoji}
                          size={16}
                        />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-background ${STATUS_DOT[ps.status] ?? STATUS_DOT.not_started}`} />
                      </div>
                      <span className="text-xs truncate flex-1">{ps.service?.name ?? 'Unknown'}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {STATUS_LABEL[ps.status] ?? ps.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 상태 요약 */}
                <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground pt-1 border-t">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <span key={status} className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] ?? STATUS_DOT.not_started}`} />
                      {STATUS_LABEL[status] ?? status} {count}
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
                    <ArrowRight className="h-3 w-3 ml-auto" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-4 right-4 md:top-16 z-10">
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
