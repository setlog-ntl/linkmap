'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Zap, Clock, AlertTriangle } from 'lucide-react';
import { useAiUsage } from '@/lib/queries/ai-config';

const PERIODS = [
  { value: 'today', label: '오늘' },
  { value: '7d', label: '7일' },
  { value: '30d', label: '30일' },
] as const;

export default function AiUsageTab() {
  const [period, setPeriod] = useState('today');
  const { data, isLoading } = useAiUsage(period);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const summary = data?.summary;
  const logs = data?.logs || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">사용량 통계</h2>
          <p className="text-sm text-muted-foreground">
            AI API 호출 통계와 사용 로그를 확인합니다
          </p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              총 요청수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary?.total_requests || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              총 토큰
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{(summary?.total_tokens || 0).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              평균 응답시간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary?.avg_response_time || 0}ms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              오류율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary?.error_rate || 0}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">최근 사용 로그</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              아직 사용 기록이 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">시간</th>
                    <th className="text-left py-2 pr-4">제공자</th>
                    <th className="text-left py-2 pr-4">모델</th>
                    <th className="text-right py-2 pr-4">토큰</th>
                    <th className="text-right py-2 pr-4">응답시간</th>
                    <th className="text-center py-2">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 text-muted-foreground text-xs">
                        {new Date(log.created_at).toLocaleString('ko-KR', {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2 pr-4">{log.provider}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{log.model}</td>
                      <td className="py-2 pr-4 text-right">{log.total_tokens.toLocaleString()}</td>
                      <td className="py-2 pr-4 text-right">
                        {log.response_time_ms != null ? `${log.response_time_ms}ms` : '-'}
                      </td>
                      <td className="py-2 text-center">
                        <Badge
                          variant={log.status === 'success' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {log.status === 'success' ? '성공' : '오류'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
