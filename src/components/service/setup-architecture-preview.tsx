'use client';

import type { Service } from '@/types';

interface SetupArchitecturePreviewProps {
  serviceName: string;
  projectName?: string;
  requiredVars: Service['required_env_vars'];
}

export function SetupArchitecturePreview({
  serviceName,
  projectName = 'My Project',
  requiredVars,
}: SetupArchitecturePreviewProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <p className="text-xs font-medium text-muted-foreground mb-3">아키텍처 프리뷰</p>
      <div className="flex items-center justify-center gap-4 min-h-[120px]">
        {/* Project node */}
        <div className="flex flex-col items-center gap-1">
          <div className="h-14 w-14 rounded-xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
            <span className="text-lg">&#x1F4E6;</span>
          </div>
          <span className="text-[10px] font-medium text-center max-w-[80px] truncate">
            {projectName}
          </span>
        </div>

        {/* Connection line */}
        <div className="flex flex-col items-center gap-1">
          <svg width="80" height="24" viewBox="0 0 80 24" className="text-muted-foreground">
            <line x1="0" y1="12" x2="70" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="70,6 80,12 70,18" fill="currentColor" />
          </svg>
          <span className="text-[9px] text-muted-foreground">
            {requiredVars.length}개 변수
          </span>
        </div>

        {/* Service node */}
        <div className="flex flex-col items-center gap-1">
          <div className="h-14 w-14 rounded-xl bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center">
            <span className="text-lg">&#x2601;&#xFE0F;</span>
          </div>
          <span className="text-[10px] font-medium text-center max-w-[80px] truncate">
            {serviceName}
          </span>
        </div>
      </div>

      {/* Env var badges */}
      {requiredVars.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 justify-center">
          {requiredVars.slice(0, 4).map((v) => (
            <code key={v.name} className="text-[9px] font-mono bg-background px-1.5 py-0.5 rounded border">
              {v.name}
            </code>
          ))}
          {requiredVars.length > 4 && (
            <span className="text-[9px] text-muted-foreground px-1.5 py-0.5">
              +{requiredVars.length - 4}개 더
            </span>
          )}
        </div>
      )}
    </div>
  );
}
