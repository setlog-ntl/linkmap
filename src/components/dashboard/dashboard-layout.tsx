'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Cable, Plus, LayoutTemplate } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboardStore } from '@/stores/dashboard-store';
import { useProjectConnections, useUpdateConnection, useDeleteConnection } from '@/lib/queries/connections';
import { useCardPositions } from './hooks/use-card-positions';
import { ConnectionOverlay } from './connection-overlay';
import { ConnectionPopover } from './connection-popover';
import { LayerColumn } from './layer-column';
import { MyProjectCard } from './my-project-card';
import { DevtoolsRow } from './devtools-row';
import type { DashboardResponse, DashboardLayer, ServiceCardData } from '@/types';

interface DashboardLayoutProps {
  data: DashboardResponse;
}

type MobileTab = DashboardLayer | 'project';

const MOBILE_TABS: { key: MobileTab; label: string }[] = [
  { key: 'frontend', label: 'Frontend' },
  { key: 'project', label: '프로젝트' },
  { key: 'backend', label: 'Backend' },
  { key: 'devtools', label: 'DevTools' },
];

export function DashboardLayout({ data }: DashboardLayoutProps) {
  const { project, layers, metrics, connections: initialConnections } = data;
  const activeTab = useDashboardStore((s) => s.activeTab);
  const setActiveTab = useDashboardStore((s) => s.setActiveTab);
  const showConnections = useDashboardStore((s) => s.showConnections);
  const setShowConnections = useDashboardStore((s) => s.setShowConnections);
  const selectedConnectionId = useDashboardStore((s) => s.selectedConnectionId);
  const setSelectedConnectionId = useDashboardStore((s) => s.setSelectedConnectionId);

  const containerRef = useRef<HTMLDivElement>(null);
  const { positions } = useCardPositions(containerRef);

  // Use server-fetched connections as initial, live connections from query
  const { data: liveConnections } = useProjectConnections(project.id);
  const connections = liveConnections ?? initialConnections ?? [];

  const updateMutation = useUpdateConnection(project.id);
  const deleteMutation = useDeleteConnection(project.id);

  const selectedConnection = selectedConnectionId
    ? connections.find((c) => c.id === selectedConnectionId) ?? null
    : null;

  const frontendData = layers.find((l) => l.layer === 'frontend')!;
  const backendData = layers.find((l) => l.layer === 'backend')!;
  const devtoolsData = layers.find((l) => l.layer === 'devtools')!;

  const allCards: ServiceCardData[] = layers.flatMap((l) => l.services);

  // Onboarding overlay for empty projects
  if (allCards.length === 0) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px_1fr] gap-4">
          <div />
          <MyProjectCard project={project} metrics={metrics} allCards={allCards} />
          <div />
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Cable className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">대시보드를 시작하세요</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">
                서비스를 추가하고 연결 상태를 한눈에 확인하세요. 추가된 서비스는 레이어별로 자동 분류됩니다.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href={`/project/${project.id}/services`}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  서비스 추가하기
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/services">
                  <LayoutTemplate className="mr-1.5 h-4 w-4" />
                  카탈로그 보기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Connection toggle */}
      <div className="hidden md:flex justify-end">
        <Button
          variant={showConnections ? 'default' : 'outline'}
          size="sm"
          className="h-7 text-xs gap-1.5"
          onClick={() => setShowConnections(!showConnections)}
        >
          <Cable className="h-3.5 w-3.5" />
          연결선 {showConnections ? 'ON' : 'OFF'}
        </Button>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block relative" ref={containerRef}>
        <div className="grid grid-cols-[1fr_260px_1fr] gap-4">
          <LayerColumn data={frontendData} projectId={project.id} />
          <MyProjectCard project={project} metrics={metrics} allCards={allCards} />
          <LayerColumn data={backendData} projectId={project.id} />
        </div>

        {/* SVG Connection Overlay */}
        {showConnections && connections.length > 0 && (
          <ConnectionOverlay
            connections={connections}
            positions={positions}
            selectedConnectionId={selectedConnectionId}
            onSelectConnection={setSelectedConnectionId}
          />
        )}

        {/* Connection popover */}
        {selectedConnection && (
          <div
            className="absolute z-50"
            style={{
              top: (() => {
                const src = positions.get(selectedConnection.source_service_id);
                const tgt = positions.get(selectedConnection.target_service_id);
                if (src && tgt) return (src.centerY + tgt.centerY) / 2 - 80;
                return 100;
              })(),
              left: (() => {
                const src = positions.get(selectedConnection.source_service_id);
                const tgt = positions.get(selectedConnection.target_service_id);
                if (src && tgt) return (src.centerX + tgt.centerX) / 2 - 144;
                return 100;
              })(),
            }}
          >
            <ConnectionPopover
              connection={selectedConnection}
              onUpdate={(params) => updateMutation.mutate(params)}
              onDelete={(id) => {
                deleteMutation.mutate(id);
                setSelectedConnectionId(null);
              }}
              onClose={() => setSelectedConnectionId(null)}
            />
          </div>
        )}
      </div>

      {/* Desktop devtools row */}
      <div className="hidden md:block">
        <DevtoolsRow data={devtoolsData} projectId={project.id} />
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        {/* Tab bar */}
        <div className="flex gap-1 mb-4 overflow-x-auto scrollbar-none">
          {MOBILE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 min-w-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap',
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'project' && (
          <MyProjectCard project={project} metrics={metrics} allCards={allCards} />
        )}
        {activeTab === 'frontend' && (
          <LayerColumn data={frontendData} projectId={project.id} />
        )}
        {activeTab === 'backend' && (
          <LayerColumn data={backendData} projectId={project.id} />
        )}
        {activeTab === 'devtools' && (
          <DevtoolsRow data={devtoolsData} projectId={project.id} />
        )}
      </div>
    </div>
  );
}
