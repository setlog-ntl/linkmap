'use client';

import { useState } from 'react';
import { AlertTriangle, Zap, ArrowRight, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useImpactAnalysis } from '@/lib/queries/connections';
import type { RiskLevel } from '@/lib/connections/impact-analysis';

const RISK_CONFIG: Record<RiskLevel, { label: string; badge: string; row: string }> = {
  high:   { label: '직접 영향', badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',   row: 'bg-red-50/50 dark:bg-red-950/20' },
  medium: { label: '간접 영향', badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', row: 'bg-yellow-50/50 dark:bg-yellow-950/20' },
  low:    { label: '미미한 영향', badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', row: '' },
};

const RISK_SUMMARY_CONFIG: Record<RiskLevel, { label: string; color: string; icon: React.ReactNode }> = {
  high:   { label: '높음', color: 'text-red-600 dark:text-red-400',    icon: <AlertTriangle className="h-5 w-5 text-red-500" /> },
  medium: { label: '중간', color: 'text-yellow-600 dark:text-yellow-400', icon: <Zap className="h-5 w-5 text-yellow-500" /> },
  low:    { label: '낮음', color: 'text-slate-500',                        icon: <Info className="h-5 w-5 text-slate-400" /> },
};

interface ImpactAnalysisPanelProps {
  projectId: string;
  serviceOptions: Array<{ id: string; name: string }>;
}

export function ImpactAnalysisPanel({ projectId, serviceOptions }: ImpactAnalysisPanelProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const { data: result, isLoading } = useImpactAnalysis(projectId, selectedServiceId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          서비스 장애 영향 분석
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground shrink-0">만약</span>
          <Select value={selectedServiceId ?? ''} onValueChange={setSelectedServiceId}>
            <SelectTrigger className="h-9 text-sm flex-1 max-w-[240px]">
              <SelectValue placeholder="서비스 선택..." />
            </SelectTrigger>
            <SelectContent>
              {serviceOptions.map((svc) => (
                <SelectItem key={svc.id} value={svc.id} className="text-sm">
                  {svc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground shrink-0">이/가 장애 발생 시</span>
        </div>

        {!selectedServiceId && (
          <p className="text-sm text-muted-foreground py-2">
            서비스를 선택하면 영향받는 서비스와 리스크 레벨을 확인할 수 있습니다.
          </p>
        )}

        {selectedServiceId && isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        )}

        {selectedServiceId && result && !isLoading && (
          <>
            {/* Summary bar */}
            <div className="flex items-center gap-4 rounded-lg border px-4 py-3 bg-muted/30">
              {RISK_SUMMARY_CONFIG[result.summary.risk_level].icon}
              <div>
                <p className="text-sm font-medium">
                  영향받는 서비스:{' '}
                  <span className={`font-bold ${RISK_SUMMARY_CONFIG[result.summary.risk_level].color}`}>
                    {result.summary.total}개
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  직접 {result.summary.direct_count}개
                  {result.summary.transitive_count > 0 && ` · 간접 ${result.summary.transitive_count}개`}
                  {' · '}전체 리스크:{' '}
                  <span className={RISK_SUMMARY_CONFIG[result.summary.risk_level].color}>
                    {RISK_SUMMARY_CONFIG[result.summary.risk_level].label}
                  </span>
                </p>
              </div>
            </div>

            {result.affected.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2 px-1">
                이 서비스에 의존하는 다른 서비스가 없습니다.
              </p>
            ) : (
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">영향받는 서비스</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">리스크</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground hidden sm:table-cell">연결 경로</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.affected.map((svc) => {
                      const riskCfg = RISK_CONFIG[svc.risk];
                      return (
                        <tr key={svc.service_id} className={`border-b last:border-0 ${riskCfg.row}`}>
                          <td className="px-3 py-2.5 font-medium">
                            <div className="flex items-center gap-1.5">
                              {svc.depth > 1 && (
                                <span className="text-muted-foreground">
                                  {'→ '.repeat(svc.depth - 1)}
                                </span>
                              )}
                              {svc.name}
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${riskCfg.badge}`}>
                              {riskCfg.label}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-xs text-muted-foreground hidden sm:table-cell">
                            <span className="flex items-center gap-1">
                              {result.failing_service_name}
                              {svc.depth > 1 && <ArrowRight className="h-3 w-3 shrink-0" />}
                              {svc.depth > 1 && '...'}
                              <ArrowRight className="h-3 w-3 shrink-0" />
                              {svc.name}
                              <span className="text-muted-foreground/60">({svc.via_connection_type})</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
