'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { EnvConflict } from '@/lib/env/conflict-detector';

interface ConflictMetricsPanelProps {
  conflicts: EnvConflict[];
}

export function ConflictMetricsPanel({ conflicts }: ConflictMetricsPanelProps) {
  const criticalCount = conflicts.filter((c) => c.severity === 'critical').length;
  const warningCount = conflicts.filter((c) => c.severity === 'warning').length;
  const infoCount = conflicts.filter((c) => c.severity === 'info').length;

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className={criticalCount > 0 ? 'border-red-500/50' : ''}>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{criticalCount}</p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
        </CardContent>
      </Card>

      <Card className={warningCount > 0 ? 'border-yellow-500/50' : ''}>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{warningCount}</p>
            <p className="text-xs text-muted-foreground">Warning</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <Info className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{infoCount}</p>
            <p className="text-xs text-muted-foreground">Info</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
