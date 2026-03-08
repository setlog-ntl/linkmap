'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDashboard } from '@/lib/queries/dashboard';
import { useProjectStore } from '@/stores/project-store';
import { BentoDashboardSkeleton } from '@/components/dashboard/bento-dashboard-skeleton';
import { BentoDashboardLayout } from '@/components/dashboard/bento-dashboard-layout';
import { AiChatPanel } from '@/components/ai/ai-chat-panel';
import { HealthContent } from '@/components/project/health-content';
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
    <>
      <BentoDashboardLayout data={data} />
      <div className="mt-8">
        <HealthContent projectId={projectId} />
        <div className="mt-3 text-right">
          <Link
            href={`/project/${projectId}/monitoring`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            상세 모니터링 보기 →
          </Link>
        </div>
      </div>
      <AiChatPanel data={data} />
    </>
  );
}
