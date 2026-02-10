'use client';

import { ChevronRight } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { ProcessStep } from '@/lib/constants/easy-categories';

interface CategoryProcessDiagramProps {
  steps: ProcessStep[];
}

export function CategoryProcessDiagram({ steps }: CategoryProcessDiagramProps) {
  return (
    <ScrollArea className="w-full">
      <div
        className="flex items-center gap-1 pb-2"
        role="list"
        aria-label="서비스 연결 프로세스"
      >
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1 shrink-0" role="listitem">
            <div className="flex items-center gap-1.5 rounded-lg bg-muted/60 dark:bg-muted/30 px-2.5 py-1.5 text-xs">
              <span className="text-base" aria-hidden="true">{step.emoji}</span>
              <span className="text-muted-foreground font-medium whitespace-nowrap">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
