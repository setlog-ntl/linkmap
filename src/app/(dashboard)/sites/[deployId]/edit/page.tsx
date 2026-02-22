'use client';

import { useParams } from 'next/navigation';
import { SiteEditorClient } from '@/components/my-sites/site-editor-client';

export default function SiteEditPage() {
  const params = useParams();
  const deployId = params.deployId as string;

  return (
    <div className="flex-1">
      <SiteEditorClient deployId={deployId} />
    </div>
  );
}
