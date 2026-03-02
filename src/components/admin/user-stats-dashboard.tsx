'use client';

import { Users, UserPlus, TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAdminUserStats } from '@/lib/queries/admin-users';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const PLAN_COLORS: Record<string, string> = {
  free: '#94A3B8',
  pro: '#4F7BE0',
  team: '#8B5CF6',
};

const PLAN_BADGE_VARIANT: Record<string, 'secondary' | 'default' | 'outline'> = {
  free: 'secondary',
  pro: 'default',
  team: 'outline',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
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

export default function UserStatsDashboard() {
  const { data, isLoading, isError, refetch, isFetching } = useAdminUserStats();

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          사용자 통계를 불러오지 못했습니다.
        </CardContent>
      </Card>
    );
  }

  const kpis = data?.kpis;
  const trend = data?.registrationTrend ?? [];
  const planDist = data?.planDistribution ?? [];
  const recentUsers = data?.recentUsers ?? [];

  const trendWithLabel = trend.map((t) => ({ ...t, label: formatDate(t.date) }));

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-brand-blue" />
          <h1 className="text-2xl font-bold">사용자 대시보드</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      {/* ① KPI 카드 */}
      {isLoading ? (
        <KpiSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Users className="h-4 w-4 text-blue-500" />
                총 사용자
              </div>
              <p className="text-3xl font-bold">{(kpis?.totalUsers ?? 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <UserPlus className="h-4 w-4 text-green-500" />
                오늘 가입
              </div>
              <p className="text-3xl font-bold">{(kpis?.newToday ?? 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <TrendingUp className="h-4 w-4 text-yellow-500" />
                이번 주 가입
              </div>
              <p className="text-3xl font-bold">{(kpis?.newThisWeek ?? 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Calendar className="h-4 w-4 text-purple-500" />
                이번 달 가입
              </div>
              <p className="text-3xl font-bold">{(kpis?.newThisMonth ?? 0).toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ② 플랜 분포 배지 */}
      {!isLoading && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground font-medium">플랜 분포</span>
          <Badge variant="secondary">Free: {kpis?.freeCount ?? 0}명</Badge>
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Pro: {kpis?.proCount ?? 0}명</Badge>
          <Badge variant="outline" className="border-purple-500 text-purple-600">Team: {kpis?.teamCount ?? 0}명</Badge>
        </div>
      )}

      {/* ③ 차트 2열 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent className="pt-6"><Skeleton className="h-52 w-full" /></CardContent></Card>
          <Card><CardContent className="pt-6"><Skeleton className="h-52 w-full" /></CardContent></Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">일별 신규 가입 (30일)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trendWithLabel}>
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(value: number | undefined) => [`${value ?? 0}명`, '신규 가입'] as [string, string]}
                    labelFormatter={(label) => `날짜: ${String(label)}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#4F7BE0"
                    fill="#4F7BE0"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">누적 가입자 (30일)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trendWithLabel}>
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(value: number | undefined) => [`${(value ?? 0).toLocaleString()}명`, '누적 가입자'] as [string, string]}
                    labelFormatter={(label) => `날짜: ${String(label)}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#34C07A"
                    fill="#34C07A"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ④ PieChart + 최근 가입자 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
          <Card><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PieChart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">플랜 분포</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={planDist}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                  >
                    {planDist.map((entry) => (
                      <Cell
                        key={entry.plan}
                        fill={PLAN_COLORS[entry.plan] ?? '#94A3B8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number | undefined) => [`${value ?? 0}명`] as [string]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 최근 가입자 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">최근 가입자 (최대 10명)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentUsers.map((u) => {
                  const initials = (u.name ?? u.email).charAt(0).toUpperCase();
                  const badgeVariant = PLAN_BADGE_VARIANT[u.plan] ?? 'secondary';
                  return (
                    <li key={u.id} className="flex items-center gap-3">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{u.name ?? u.email}</p>
                        {u.name && (
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        )}
                      </div>
                      <Badge
                        variant={badgeVariant}
                        className={
                          u.plan === 'pro'
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : u.plan === 'team'
                              ? 'border-purple-500 text-purple-600'
                              : ''
                        }
                      >
                        {u.plan}
                      </Badge>
                      <span className="text-xs text-muted-foreground shrink-0">
                        프로젝트 {u.projectCount}개
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatFullDate(u.createdAt)}
                      </span>
                    </li>
                  );
                })}
                {recentUsers.length === 0 && (
                  <li className="text-sm text-muted-foreground text-center py-4">
                    가입자가 없습니다.
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
