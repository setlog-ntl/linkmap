'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Plus, Link2, Sparkles } from 'lucide-react';

interface MatchDetail {
  key_name: string;
  service_name: string;
  confidence: 'exact' | 'prefix';
}

export interface EnvSyncResult {
  updated_vars: number;
  added_services: number;
  updated_statuses: number;
  auto_connections: number;
  matched_details: MatchDetail[];
  added_service_names: string[];
}

interface EnvSyncResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: EnvSyncResult | null;
}

export function EnvSyncResultDialog({ open, onOpenChange, result }: EnvSyncResultDialogProps) {
  if (!result) return null;

  const hasChanges = result.updated_vars > 0 || result.added_services > 0 || result.auto_connections > 0;

  // 서비스별로 매칭된 키 그룹핑
  const groupedByService = new Map<string, MatchDetail[]>();
  for (const detail of result.matched_details) {
    const existing = groupedByService.get(detail.service_name);
    if (existing) existing.push(detail);
    else groupedByService.set(detail.service_name, [detail]);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            서비스 확인 결과
          </DialogTitle>
          <DialogDescription>
            환경변수 키 이름을 분석하여 서비스를 자동으로 매칭했습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 요약 카드 */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className="text-xl font-bold font-mono">{result.updated_vars}</p>
              <p className="text-[11px] text-muted-foreground">키 매칭</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className="text-xl font-bold font-mono">{result.added_services}</p>
              <p className="text-[11px] text-muted-foreground">서비스 추가</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className="text-xl font-bold font-mono">{result.auto_connections}</p>
              <p className="text-[11px] text-muted-foreground">연결 생성</p>
            </div>
          </div>

          {/* 자동 추가된 서비스 */}
          {result.added_service_names.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                자동 추가된 서비스
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.added_service_names.map((name) => (
                  <Badge key={name} variant="default" className="bg-green-500/10 text-green-700 border-green-300 dark:text-green-400 dark:border-green-700">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 매칭 상세 */}
          {groupedByService.size > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5" />
                키 → 서비스 매칭
              </h4>
              <div className="space-y-2">
                {[...groupedByService.entries()].map(([serviceName, details]) => (
                  <div key={serviceName} className="rounded-lg border p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{serviceName}</span>
                      <Badge variant="secondary" className="text-[10px]">{details.length}개</Badge>
                    </div>
                    <div className="space-y-1">
                      {details.map((d) => (
                        <div key={d.key_name} className="flex items-center gap-2 text-xs">
                          <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded truncate max-w-[240px]">
                            {d.key_name}
                          </code>
                          <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                          <Badge
                            variant="outline"
                            className={d.confidence === 'exact'
                              ? 'text-[10px] border-green-300 text-green-600 dark:text-green-400'
                              : 'text-[10px] border-yellow-300 text-yellow-600 dark:text-yellow-400'
                            }
                          >
                            {d.confidence === 'exact' ? '정확 매칭' : '접두사 매칭'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 변경 없음 */}
          {!hasChanges && (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <p className="text-sm font-medium">이미 최신 상태입니다</p>
              <p className="text-xs text-muted-foreground">
                모든 환경변수가 올바른 서비스에 연결되어 있습니다.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
