'use client';

import { useParams } from 'next/navigation';
import { CostPageContent } from '@/components/project/cost-page-content';

export default function ProjectCostsPage() {
  const params = useParams();
  const projectId = params.id as string;

  return <CostPageContent projectId={projectId} />;
}
