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
import { ProjectHeroCard } from './project-hero-card';
import { HealthRingCard } from './health-ring-card';
import { ConnectionFlowMap } from './connection-flow-map';
import { LayerCard } from './layer-card';
import { ActionNeeded } from './action-needed';
import { OnboardingChecklist } from './onboarding-checklist';
import type { DashboardResponse, DashboardLayer, ServiceCardData } from '@/types';

interface BentoDashboardLayoutProps {
  data: DashboardResponse;
}

type MobileTab = DashboardLayer | 'project';

const MOBILE_TABS: { key: MobileTab; label: string }[] = [
  { key: 'frontend', label: 'Frontend' },
  { key: 'project', label: 'Project' },
  { key: 'backend', label: 'Backend' },
  { key: 'devtools', label: 'DevTools' },
];

export function BentoDashboardLayout({ data }: BentoDashboardLayoutProps) {
  const { project, layers, metrics, connections: initialConnections } = data;
  const activeTab = useDashboardStore((s) => s.activeTab);
  const setActiveTab = useDashboardStore((s) => s.setActiveTab);
  const selectedConnectionId = useDashboardStore((s) => s.selectedConnectionId);
  const setSelectedConnectionId = useDashboardStore((s) => s.setSelectedConnectionId);

  const containerRef = useRef<HTMLDivElement>(null);
  const { positions } = useCardPositions(containerRef);

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

  // Empty project onboarding
  if (allCards.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8">
            <ProjectHeroCard project={project} metrics={metrics} allCards={allCards} />
          </div>
          <div className="md:col-span-4">
            <HealthRingCard projectId={project.id} allCards={allCards} />
          </div>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="rounded-2xl bg-primary/10 p-4">
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
                <Link href={`/project/${project.id}/integrations`}>
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
    <div className="space-y-5">
      {/* Desktop Bento Layout */}
      <div className="hidden md:block space-y-5" ref={containerRef}>
        {/* Row 1: Hero (8 col) + Health Ring (4 col) */}
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-8">
            <ProjectHeroCard project={project} metrics={metrics} allCards={allCards} />
          </div>
          <div className="col-span-4">
            <HealthRingCard projectId={project.id} allCards={allCards} />
          </div>
        </div>

        {/* Row 2: Connection Flow Map */}
        {allCards.length > 0 && (
          <ConnectionFlowMap allCards={allCards} connections={connections} />
        )}

        {/* Row 3: Layer Cards (3 columns) */}
        <div className="grid grid-cols-3 gap-5 relative">
          <LayerCard data={frontendData} projectId={project.id} />
          <LayerCard data={backendData} projectId={project.id} />
          <LayerCard data={devtoolsData} projectId={project.id} />

          {/* SVG Connection Overlay */}
          {connections.length > 0 && (
            <ConnectionOverlay
              connections={connections}
              positions={positions}
              selectedConnectionId={selectedConnectionId}
              onSelectConnection={setSelectedConnectionId}
              allCards={allCards}
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

        {/* Row 4: Action Needed + Onboarding */}
        <div className="grid grid-cols-2 gap-5">
          <ActionNeeded projectId={project.id} allCards={allCards} metrics={metrics} />
          <OnboardingChecklist projectId={project.id} metrics={metrics} />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
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

        {activeTab === 'project' && (
          <div className="space-y-4">
            <ProjectHeroCard project={project} metrics={metrics} allCards={allCards} />
            <HealthRingCard projectId={project.id} allCards={allCards} />
            <OnboardingChecklist projectId={project.id} metrics={metrics} />
            <ActionNeeded projectId={project.id} allCards={allCards} metrics={metrics} />
          </div>
        )}
        {activeTab === 'frontend' && (
          <LayerCard data={frontendData} projectId={project.id} />
        )}
        {activeTab === 'backend' && (
          <LayerCard data={backendData} projectId={project.id} />
        )}
        {activeTab === 'devtools' && (
          <LayerCard data={devtoolsData} projectId={project.id} />
        )}
      </div>
    </div>
  );
}
