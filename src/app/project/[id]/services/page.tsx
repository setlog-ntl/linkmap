'use client';

import { useParams } from 'next/navigation';
import { ServicesContent } from '@/components/project/services-content';

export default function ServicesPage() {
  const params = useParams();
  const projectId = params.id as string;

  return <ServicesContent projectId={projectId} />;
}
