'use client';

import { useParams } from 'next/navigation';
import { ConnectionsContent } from '@/components/project/connections-content';

export default function ConnectionsPage() {
  const params = useParams();
  const projectId = params.id as string;

  return <ConnectionsContent projectId={projectId} />;
}
