'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';
import type { EnvConflict, ConflictSeverity } from '@/lib/env/conflict-detector';
import type { Environment } from '@/types';

const severityConfig: Record<ConflictSeverity, { icon: typeof AlertTriangle; color: string; label: string }> = {
  critical: { icon: AlertTriangle, color: 'text-red-500', label: 'Critical' },
  warning: { icon: AlertCircle, color: 'text-yellow-500', label: 'Warning' },
  info: { icon: Info, color: 'text-blue-500', label: 'Info' },
};

const envLabels: Record<Environment, string> = {
  development: 'DEV',
  staging: 'STG',
  production: 'PROD',
};

interface ConflictListProps {
  conflicts: EnvConflict[];
  selectedId: string | null;
  onSelect: (conflict: EnvConflict) => void;
}

export function ConflictList({ conflicts, selectedId, onSelect }: ConflictListProps) {
  if (conflicts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-3">&#x2705;</div>
          <p className="font-medium">충돌이 없습니다</p>
          <p className="text-sm text-muted-foreground mt-1">
            모든 환경변수가 일관성 있게 설정되어 있습니다
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {conflicts.map((conflict) => {
        const config = severityConfig[conflict.severity];
        const Icon = config.icon;
        const isSelected = selectedId === conflict.id;

        return (
          <Card
            key={conflict.id}
            className={`cursor-pointer transition-all ${isSelected ? 'border-primary ring-1 ring-primary' : 'hover:border-muted-foreground/50'}`}
          >
            <Button
              variant="ghost"
              className="w-full h-auto p-4 justify-start"
              onClick={() => onSelect(conflict)}
            >
              <div className="flex items-start gap-3 w-full">
                <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${config.color}`} />
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-sm font-mono font-medium">{conflict.key_name}</code>
                    <Badge
                      variant={conflict.severity === 'critical' ? 'destructive' : 'secondary'}
                      className="text-[10px]"
                    >
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{conflict.description}</p>
                  <div className="flex gap-1 mt-2">
                    {(['development', 'staging', 'production'] as Environment[]).map((env) => (
                      <Badge
                        key={env}
                        variant={conflict.environments[env] ? 'outline' : 'secondary'}
                        className={`text-[10px] ${!conflict.environments[env] ? 'opacity-40' : ''}`}
                      >
                        {envLabels[env]}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 mt-1 text-muted-foreground" />
              </div>
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
