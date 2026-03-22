'use client';

import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface IconTooltipProps {
  label: string;
  shortcut?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export function IconTooltip({ label, shortcut, side = 'top', children }: IconTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        <span className="flex items-center gap-1.5">
          {label}
          {shortcut && (
            <kbd className="ml-1 px-1 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border">
              {shortcut}
            </kbd>
          )}
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
