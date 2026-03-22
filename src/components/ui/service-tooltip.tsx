'use client';

import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ServiceTooltipProps {
  serviceName: string;
  category?: string;
  description?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export function ServiceTooltip({ serviceName, category, description, side = 'bottom', children }: ServiceTooltipProps) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className="max-w-[220px] space-y-0.5 p-2.5">
        <p className="text-xs font-semibold">{serviceName}</p>
        {category && (
          <p className="text-[10px] text-muted-foreground">{category}</p>
        )}
        {description && (
          <p className="text-[10px] text-muted-foreground/80 leading-relaxed">{description}</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
