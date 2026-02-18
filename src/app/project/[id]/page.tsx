'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDashboard } from '@/lib/queries/dashboard';
import { useProjectStore } from '@/stores/project-store';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params.id as string;
  const setActiveProjectId = useProjectStore((s) => s.setActiveProjectId);

  useEffect(() => {
    setActiveProjectId(projectId);
    return () => setActiveProjectId(null);
  }, [projectId, setActiveProjectId]);

  const { data, isLoading, error } = useDashboard(projectId);

  if (isLoading) return <DashboardSkeleton />;

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">대시보드를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return <DashboardLayout data={data} />;
}
