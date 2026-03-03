'use client';

import { CostReportPage } from '@/components/project/cost-report-page';
import type { CostReportResult } from '@/lib/validations/ai-cost-report';

interface DemoCostReportViewProps {
  projectId: string;
  initialReport: { report: CostReportResult; generatedAt: string };
  backHref: string;
}

export function DemoCostReportView({ projectId, initialReport, backHref }: DemoCostReportViewProps) {
  return (
    <CostReportPage
      projectId={projectId}
      isDemo
      initialReport={initialReport}
      backHref={backHref}
    />
  );
}
