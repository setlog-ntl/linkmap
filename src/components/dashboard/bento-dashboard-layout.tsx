'use client';

import Link from 'next/link';
import { Cable, Plus, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useProjectConnections } from '@/lib/queries/connections';
import { ProjectHeroCard } from './project-hero-card';
import { HealthRingCard } from './health-ring-card';
import { ConnectionFlowMap } from './connection-flow-map';
import { ActionNeeded } from './action-needed';
import { OnboardingChecklist } from './onboarding-checklist';
import type { DashboardResponse, ServiceCardData } from '@/types';

interface BentoDashboardLayoutProps {
  data: DashboardResponse;
}

export function BentoDashboardLayout({ data }: BentoDashboardLayoutProps) {
  const { project, layers, metrics, connections: initialConnections } = data;
  const { data: liveConnections } = useProjectConnections(project.id);
  const connections = liveConnections ?? initialConnections ?? [];
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
      {/* Row 1: Hero (8 col) + Health Ring (4 col) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-8">
          <ProjectHeroCard project={project} metrics={metrics} allCards={allCards} />
        </div>
        <div className="md:col-span-4">
          <HealthRingCard projectId={project.id} allCards={allCards} />
        </div>
      </div>

      {/* Row 2: Architecture Flow */}
      <ConnectionFlowMap allCards={allCards} connections={connections} projectId={project.id} />

      {/* Row 3: Action Needed + Onboarding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ActionNeeded projectId={project.id} allCards={allCards} metrics={metrics} />
        <OnboardingChecklist projectId={project.id} metrics={metrics} />
      </div>
    </div>
  );
}
