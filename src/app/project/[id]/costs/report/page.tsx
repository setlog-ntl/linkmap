'use client';

import { useParams } from 'next/navigation';
import { CostReportPage } from '@/components/project/cost-report-page';

export default function CostReportPageRoute() {
  const params = useParams();
  return <CostReportPage projectId={params.id as string} />;
}
