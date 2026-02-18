'use client';

import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/stores/dashboard-store';
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
  const { project, layers, metrics } = data;
  const activeTab = useDashboardStore((s) => s.activeTab);
  const setActiveTab = useDashboardStore((s) => s.setActiveTab);

  const frontendData = layers.find((l) => l.layer === 'frontend')!;
  const backendData = layers.find((l) => l.layer === 'backend')!;
  const devtoolsData = layers.find((l) => l.layer === 'devtools')!;

  const allCards: ServiceCardData[] = layers.flatMap((l) => l.services);

  return (
    <div className="space-y-4">
      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-[1fr_260px_1fr] gap-4">
        <LayerColumn data={frontendData} projectId={project.id} />
        <MyProjectCard project={project} metrics={metrics} allCards={allCards} />
        <LayerColumn data={backendData} projectId={project.id} />
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
