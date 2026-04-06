'use client';

import { useParams } from 'next/navigation';
import { McpContent } from '@/components/mcp/mcp-content';

export default function McpPage() {
  const params = useParams();
  const projectId = params.id as string;

  return <McpContent projectId={projectId} />;
}
