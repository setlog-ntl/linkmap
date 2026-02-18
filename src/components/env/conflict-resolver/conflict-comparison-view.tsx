'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { EnvConflict } from '@/lib/env/conflict-detector';
import type { Environment } from '@/types';

const envLabels: Record<Environment, string> = {
  development: '개발 (DEV)',
  staging: '스테이징 (STG)',
  production: '프로덕션 (PROD)',
};

const envColors: Record<Environment, string> = {
  development: 'bg-blue-500/10 border-blue-500/30',
  staging: 'bg-yellow-500/10 border-yellow-500/30',
  production: 'bg-red-500/10 border-red-500/30',
};

interface ConflictComparisonViewProps {
  conflict: EnvConflict;
  onResolve: (sourceEnv: Environment, targetEnvs: Environment[]) => void;
}

export function ConflictComparisonView({ conflict, onResolve }: ConflictComparisonViewProps) {
  const environments: Environment[] = ['development', 'staging', 'production'];

  // Find the most recently updated environment as suggested source
  const presentEnvs = environments.filter((env) => conflict.environments[env]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <code className="font-mono">{conflict.key_name}</code>
          <Badge
            variant={conflict.severity === 'critical' ? 'destructive' : 'secondary'}
            className="text-[10px]"
          >
            {conflict.type === 'missing_value' ? '누락' : conflict.type === 'critical_mismatch' ? '불일치' : '설정 불일치'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment comparison */}
        <div className="grid gap-3">
          {environments.map((env) => {
            const entry = conflict.environments[env];
            return (
              <div
                key={env}
                className={`p-3 rounded-lg border ${entry ? envColors[env] : 'bg-muted/50 border-dashed'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{envLabels[env]}</span>
                  {entry && (
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(entry.updated_at).toLocaleDateString('ko-KR')}
                    </span>
                  )}
                </div>
                {entry ? (
                  <div className="space-y-1">
                    <code className="text-xs font-mono text-muted-foreground block">
                      {'\u2022'.repeat(16)} (해시: {entry.value_hash})
                    </code>
                    {entry.service_name && (
                      <Badge variant="outline" className="text-[10px]">
                        {entry.service_name}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">값 없음</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick resolve actions */}
        {conflict.type === 'missing_value' && presentEnvs.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            <p className="text-sm font-medium">빠른 해결</p>
            {presentEnvs.map((sourceEnv) => {
              const missingEnvs = environments.filter((e) => !conflict.environments[e]);
              if (missingEnvs.length === 0) return null;
              return (
                <Button
                  key={sourceEnv}
                  variant="outline"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => onResolve(sourceEnv, missingEnvs)}
                >
                  <span className="text-xs">
                    {envLabels[sourceEnv]}에서 복사
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowRight className="h-3 w-3" />
                    {missingEnvs.map((e) => envLabels[e].split(' ')[0]).join(', ')}
                  </span>
                </Button>
              );
            })}
          </div>
        )}

        {conflict.type === 'config_mismatch' && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">
              이 변수는 환경별로 다른 서비스에 연결되어 있습니다. 필요한 경우 수동으로 확인하세요.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
