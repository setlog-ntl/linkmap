'use client';

import { useParams } from 'next/navigation';
import { MonitoringDashboard } from '@/components/project/monitoring-dashboard';

export default function MonitoringPage() {
  const params = useParams();
  const projectId = params.id as string;

  return <MonitoringDashboard projectId={projectId} />;
}
