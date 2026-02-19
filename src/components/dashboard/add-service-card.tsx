'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

interface AddServiceCardProps {
  projectId: string;
}

export function AddServiceCard({ projectId }: AddServiceCardProps) {
  return (
    <Link
      href={`/project/${projectId}/integrations`}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <Plus className="h-4 w-4" />
      <span>서비스 추가</span>
    </Link>
  );
}
