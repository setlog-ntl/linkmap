'use client';

import { BentoDashboardLayout } from '@/components/dashboard/bento-dashboard-layout';
import type { DashboardResponse } from '@/types';

interface DemoDashboardViewProps {
  data: DashboardResponse;
}

export function DemoDashboardView({ data }: DemoDashboardViewProps) {
  return <BentoDashboardLayout data={data} />;
}
