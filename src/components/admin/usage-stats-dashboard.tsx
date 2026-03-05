'use client';

import {
  BarChart3, RefreshCw, FolderKanban, Link2, Key, Rocket,
  TrendingUp, Bot, MessageSquarePlus, Percent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminUsageStats } from '@/lib/queries/admin-usage-stats';
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

const CHART_COLORS = [
  '#4F7BE0', '#38bdf8', '#8B5CF6', '#F59E0B', '#10B981',
  '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#F97316',
];

const STATUS_LABELS: Record<string, string> = {
  pending: '검토 대기',
  in_review: '검토 중',
  planned: '계획됨',
  in_progress: '진행 중',
  completed: '완료',
  rejected: '반려',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  in_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  planned: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  in_progress: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function UsageStatsDashboard() {
  const { data, isLoading, isError, refetch, isFetching } = useAdminUsageStats();

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          기능 사용 통계를 불러오지 못했습니다.
        </CardContent>
      </Card>
    );
  }

  const kpis = data?.kpis;
  const topServices = data?.topServices ?? [];
  const categoryDist = data?.categoryDistribution ?? [];
  const trend = data?.dailyTrend ?? [];
  const activity = data?.activity;
  const featureStatuses = data?.featureRequestsByStatus ?? [];
  const trendWithLabel = trend.map((t) => ({ ...t, label: formatDate(t.date) }));

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-brand-blue" />
          <h1 className="text-2xl font-bold">기능 사용 통계</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      {/* ① KPI 카드 2x4 */}
      {isLoading ? (
        <KpiSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <FolderKanban className="h-4 w-4 text-blue-500" />
                총 프로젝트
              </div>
              <p className="text-3xl font-bold">{(kpis?.totalProjects ?? 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                이번 달 신규
              </div>
              <p className="text-3xl font-bold">{(kpis?.newProjectsThisMonth ?? 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Link2 className="h-4 w-4 text-purple-500" />
                서비스 연결
              </div>
              <p className="text-3xl font-bold">{(kpis?.totalServiceConnections ?? 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                성공률 {kpis?.serviceConnectionSuccessRate ?? 0}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Key className="h-4 w-4 text-yellow-500" />
                환경변수
              </div>
              <p className="text-3xl font-bold">{(kpis?.totalEnvVars ?? 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                시크릿 비율 {kpis?.secretRatio ?? 0}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Rocket className="h-4 w-4 text-cyan-500" />
                총 배포
              </div>
              <p className="text-3xl font-bold">{(kpis?.totalDeploys ?? 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                성공률 {kpis?.deploySuccessRate ?? 0}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Bot className="h-4 w-4 text-indigo-500" />
                AI 요청
              </div>
              <p className="text-3xl font-bold">{(activity?.aiRequests ?? 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(activity?.aiTotalTokens ?? 0).toLocaleString()} 토큰
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Percent className="h-4 w-4 text-orange-500" />
                프로젝트당 서비스
              </div>
              <p className="text-3xl font-bold">{activity?.avgServicesPerProject ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                환경변수 평균 {activity?.avgEnvVarsPerProject ?? 0}개
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <MessageSquarePlus className="h-4 w-4 text-pink-500" />
                기능 요청
              </div>
              <p className="text-3xl font-bold">
                {featureStatuses.reduce((s, f) => s + f.count, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                API 토큰 활성 {activity?.activeTokenRatio ?? 0}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ② 서비스 인기도 (2열: BarChart + PieChart) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent className="pt-6"><Skeleton className="h-52 w-full" /></CardContent></Card>
          <Card><CardContent className="pt-6"><Skeleton className="h-52 w-full" /></CardContent></Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">인기 서비스 TOP 10</CardTitle>
            </CardHeader>
            <CardContent>
              {topServices.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">데이터 없음</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={topServices} layout="vertical" margin={{ left: 60 }}>
                    <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      width={55}
                    />
                    <Tooltip
                      formatter={(value: number | undefined) => [`${value ?? 0}개`, '연결 수'] as [string, string]}
                      labelFormatter={(label) => String(label)}
                    />
                    <Bar dataKey="count" fill="#4F7BE0" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">카테고리 분포</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryDist.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">데이터 없음</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categoryDist}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(props: PieLabelRenderProps) => {
                        const cat = String((props as PieLabelRenderProps & { category?: string }).category ?? '');
                        const pct = Number(props.percent ?? 0);
                        return `${cat} ${(pct * 100).toFixed(0)}%`;
                      }}
                      labelLine={false}
                    >
                      {categoryDist.map((_, idx) => (
                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number | undefined) => [`${value ?? 0}개`, '연결 수'] as [string, string]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ③ 기능 사용 추이 (AreaChart 30일) */}
      {isLoading ? (
        <Card><CardContent className="pt-6"><Skeleton className="h-52 w-full" /></CardContent></Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">기능 사용 추이 (30일)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendWithLabel}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={4} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  labelFormatter={(label) => `날짜: ${String(label)}`}
                />
                <Area
                  type="monotone"
                  dataKey="projects"
                  name="프로젝트"
                  stroke="#4F7BE0"
                  fill="#4F7BE0"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="serviceConnections"
                  name="서비스 연결"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="envVars"
                  name="환경변수"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="deploys"
                  name="배포"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* ④ 기능별 활성도 테이블 */}
      {!isLoading && activity && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">기능별 활성도</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 pr-4 font-medium">지표</th>
                    <th className="text-right py-2 font-medium">값</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-4">프로젝트당 평균 서비스 연결</td>
                    <td className="text-right py-2 font-mono">{activity.avgServicesPerProject}개</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4">프로젝트당 평균 환경변수</td>
                    <td className="text-right py-2 font-mono">{activity.avgEnvVarsPerProject}개</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4">API 토큰 활성 비율</td>
                    <td className="text-right py-2 font-mono">{activity.activeTokenRatio}%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4">AI 총 요청 수</td>
                    <td className="text-right py-2 font-mono">{activity.aiRequests.toLocaleString()}건</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">AI 총 토큰 사용량</td>
                    <td className="text-right py-2 font-mono">{activity.aiTotalTokens.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ⑤ 기능 요청 현황 */}
      {!isLoading && featureStatuses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">기능 요청 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {featureStatuses.map((item) => (
                <Badge
                  key={item.status}
                  variant="secondary"
                  className={STATUS_COLORS[item.status] ?? ''}
                >
                  {STATUS_LABELS[item.status] ?? item.status}: {item.count}건
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
