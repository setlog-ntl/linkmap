'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDashboard } from '@/lib/queries/dashboard';
import { useProjectStore } from '@/stores/project-store';
import { BentoDashboardSkeleton } from '@/components/dashboard/bento-dashboard-skeleton';
import { BentoDashboardLayout } from '@/components/dashboard/bento-dashboard-layout';
import { StackArchitectDialog } from '@/components/ai/stack-architect-dialog';

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params.id as string;
  const setActiveProjectId = useProjectStore((s) => s.setActiveProjectId);

  useEffect(() => {
    setActiveProjectId(projectId);
    return () => setActiveProjectId(null);
  }, [projectId, setActiveProjectId]);

  const { data, isLoading, error } = useDashboard(projectId);

  if (isLoading) return <BentoDashboardSkeleton />;

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">대시보드를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <StackArchitectDialog />
      </div>
      <BentoDashboardLayout data={data} />
    </div>
  );
}
