'use client';

import { useState, useDeferredValue } from 'react';
import {
  Users, UserPlus, TrendingUp, Calendar, RefreshCw, MonitorSmartphone,
  Globe, Network, ChevronDown, MessageSquarePlus, Search, ChevronLeft,
  ChevronRight, FolderOpen, Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { useAdminUserStats } from '@/lib/queries/admin-users';
import { useAdminVisitorStats } from '@/lib/queries/admin-visitors';
import { useFeedbackList } from '@/lib/queries/feedback';
import type { VisitorByIp } from '@/app/api/admin/visitors/route';
import type { AdminUserRow } from '@/app/api/admin/users/route';
import UserDetailSheet from './user-detail-sheet';
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

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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

function UsersTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('created_at');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, isError } = useAdminUserStats({
    page,
    limit: 20,
    search: deferredSearch,
    sort,
  });

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
  const allUsers = data?.allUsers ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 20;
  const totalPages = Math.ceil(total / limit);
  const trendWithLabel = trend.map((t) => ({ ...t, label: formatDate(t.date) }));

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* KPI 카드 */}
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

      {/* 플랜 분포 배지 */}
      {!isLoading && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground font-medium">플랜 분포</span>
          <Badge variant="secondary">Free: {kpis?.freeCount ?? 0}명</Badge>
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Pro: {kpis?.proCount ?? 0}명</Badge>
          <Badge variant="outline" className="border-purple-500 text-purple-600">Team: {kpis?.teamCount ?? 0}명</Badge>
        </div>
      )}

      {/* 차트 2열 */}
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
              <CardTitle className="text-base">플랜 분포</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={planDist}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
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
        </div>
      )}

      {/* 전체 사용자 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">전체 사용자 ({total}명)</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="이름 또는 이메일 검색..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 h-9 w-48 md:w-64"
                />
              </div>
              <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
                <SelectTrigger className="h-9 w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">가입일순</SelectItem>
                  <SelectItem value="last_sign_in">최근 로그인순</SelectItem>
                  <SelectItem value="project_count">프로젝트 많은순</SelectItem>
                  <SelectItem value="deploy_count">배포 많은순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : allUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              {search ? '검색 결과가 없습니다.' : '사용자가 없습니다.'}
            </p>
          ) : (
            <>
              <div className="space-y-1">
                {allUsers.map((u: AdminUserRow) => (
                  <UserRow key={u.id} user={u} onClick={handleUserClick} />
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    {total}명 중 {(page - 1) * limit + 1}~{Math.min(page * limit, total)}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm px-2">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* 사용자 상세 Sheet */}
      <UserDetailSheet
        userId={selectedUserId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}

function UserRow({ user, onClick }: { user: AdminUserRow; onClick: (id: string) => void }) {
  const initials = (user.name ?? user.email).charAt(0).toUpperCase();
  const badgeVariant = PLAN_BADGE_VARIANT[user.plan] ?? 'secondary';

  return (
    <button
      type="button"
      onClick={() => onClick(user.id)}
      className="w-full flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-muted/50 transition-colors text-left"
    >
      <Avatar className="h-8 w-8 shrink-0">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium truncate">{user.name ?? user.email}</p>
          {user.provider && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 shrink-0">
              {user.provider}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {user.email}
          {user.lastSignInAt && (
            <span className="ml-2 text-green-600 dark:text-green-400">
              로그인: {formatDateTime(user.lastSignInAt)}
            </span>
          )}
        </p>
      </div>
      <Badge
        variant={badgeVariant}
        className={
          user.plan === 'pro'
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : user.plan === 'team'
              ? 'border-purple-500 text-purple-600'
              : ''
        }
      >
        {user.plan}
      </Badge>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
          <FolderOpen className="h-3 w-3" />
          {user.projectCount}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
          <Rocket className="h-3 w-3" />
          {user.deployCount}
        </span>
      </div>
      <span className="text-xs text-muted-foreground shrink-0 hidden md:inline">
        {formatFullDate(user.createdAt)}
      </span>
    </button>
  );
}

function VisitorsTab() {
  const { data, isLoading, isError } = useAdminVisitorStats();

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          방문자 통계를 불러오지 못했습니다.
        </CardContent>
      </Card>
    );
  }

  const kpis = data?.kpis;
  const dailyTrend = data?.dailyTrend ?? [];
  const topPages = data?.topPages ?? [];
  const recentSessions = data?.recentSessions ?? [];
  const visitorsByIp = data?.visitorsByIp ?? [];
  const trendWithLabel = dailyTrend.map((t) => ({ ...t, label: formatDate(t.date) }));

  return (
    <div className="space-y-6">
      {/* KPI 카드 */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-8 w-16" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <MonitorSmartphone className="h-4 w-4 text-amber-500" />
                총 세션 (30일)
              </div>
              <p className="text-3xl font-bold">{(kpis?.totalSessions ?? 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <MonitorSmartphone className="h-4 w-4 text-green-500" />
                오늘 세션
              </div>
              <p className="text-3xl font-bold">{(kpis?.todaySessions ?? 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                이번 주 세션
              </div>
              <p className="text-3xl font-bold">{(kpis?.weekSessions ?? 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Globe className="h-4 w-4 text-red-500" />
                세션당 PV
              </div>
              <p className="text-3xl font-bold">{kpis?.avgPagesPerSession ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Network className="h-4 w-4 text-purple-500" />
                고유 IP
              </div>
              <p className="text-3xl font-bold">{(kpis?.uniqueIps ?? 0).toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 일별 추이 차트 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent className="pt-6"><Skeleton className="h-52 w-full" /></CardContent></Card>
          <Card><CardContent className="pt-6"><Skeleton className="h-52 w-full" /></CardContent></Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">일별 세션 수 (30일)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trendWithLabel}>
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(value: number | undefined) => [`${value ?? 0}`, '세션'] as [string, string]}
                    labelFormatter={(label) => `날짜: ${String(label)}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">일별 페이지뷰 (30일)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trendWithLabel}>
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(value: number | undefined) => [`${value ?? 0}`, '페이지뷰'] as [string, string]}
                    labelFormatter={(label) => `날짜: ${String(label)}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 상위 페이지 + 최근 세션 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
          <Card><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">상위 방문 페이지 (상위 10개)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {topPages.map((page) => (
                  <li key={page.path} className="flex items-center justify-between gap-2">
                    <span className="text-sm font-mono truncate flex-1">{page.path}</span>
                    <Badge variant="secondary">{page.views.toLocaleString()}</Badge>
                  </li>
                ))}
                {topPages.length === 0 && (
                  <li className="text-sm text-muted-foreground text-center py-4">
                    방문 데이터가 없습니다.
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">최근 세션 (최근 20개)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentSessions.map((s) => (
                  <li key={s.sessionId} className="flex items-start gap-3">
                    <MonitorSmartphone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono truncate">{s.firstPage}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(s.firstSeen)} · {s.pageCount}페이지
                        {s.ip && (
                          <span className="ml-1 text-purple-500 font-mono">· {s.ip}</span>
                        )}
                      </p>
                    </div>
                  </li>
                ))}
                {recentSessions.length === 0 && (
                  <li className="text-sm text-muted-foreground text-center py-4">
                    세션 데이터가 없습니다.
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* IP별 방문자 */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-purple-500" />
              <CardTitle className="text-base">IP별 방문자 (상위 100개, 페이지뷰 기준)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {visitorsByIp.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">IP 데이터가 없습니다.</p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {visitorsByIp.map((v: VisitorByIp) => (
                  <AccordionItem key={v.ip} value={v.ip}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 w-full pr-2">
                        <span className="font-mono text-sm text-purple-600 dark:text-purple-400 w-36 shrink-0 text-left">
                          {v.ip}
                        </span>
                        <div className="flex items-center gap-2 flex-1 flex-wrap">
                          <Badge variant="secondary" className="gap-1">
                            <MonitorSmartphone className="h-3 w-3" />
                            {v.sessionCount}세션
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Globe className="h-3 w-3" />
                            {v.pageViews}PV
                          </Badge>
                          <span className="text-xs text-muted-foreground hidden md:inline">
                            {formatDateTime(v.firstSeen)} ~ {formatDateTime(v.lastSeen)}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200" />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4 space-y-3 pt-1">
                        <div className="text-xs text-muted-foreground">
                          첫 방문: {formatDateTime(v.firstSeen)} · 마지막: {formatDateTime(v.lastSeen)}
                        </div>
                        {v.userAgent && (
                          <p className="text-xs text-muted-foreground truncate">
                            <span className="font-medium">UA:</span> {v.userAgent}
                          </p>
                        )}
                        <div>
                          <p className="text-xs font-medium mb-1.5">주요 방문 페이지</p>
                          <ul className="space-y-1">
                            {v.topPaths.map((p) => (
                              <li key={p.path} className="flex items-center justify-between gap-2">
                                <span className="text-xs font-mono truncate flex-1 text-muted-foreground">{p.path}</span>
                                <Badge variant="secondary" className="text-xs shrink-0">{p.count}</Badge>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FeedbackAdminTab() {
  const { data, isLoading } = useFeedbackList({ sort: 'newest', limit: 50 });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">총 {data?.total ?? 0}개의 요청</p>
        <a
          href="/feedback"
          className="text-xs text-brand-blue hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          공개 페이지 열기 →
        </a>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground text-sm">
            등록된 요청이 없습니다.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <a key={item.id} href={`/feedback/${item.id}`} className="block group">
              <Card className="hover:border-brand-blue/50 transition-colors">
                <CardContent className="pt-4 pb-3 flex items-center gap-3">
                  <div className="text-center min-w-[40px]">
                    <p className="text-lg font-bold leading-none">{item.vote_count}</p>
                    <p className="text-[10px] text-muted-foreground">투표</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-brand-blue transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    <Badge variant="secondary" className="text-xs">{item.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UserStatsDashboard() {
  const { refetch: refetchUsers, isFetching: isFetchingUsers } = useAdminUserStats();
  const { refetch: refetchVisitors, isFetching: isFetchingVisitors } = useAdminVisitorStats();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-brand-blue" />
            <h1 className="text-2xl font-bold">사용자 대시보드</h1>
          </div>
          <div className="flex items-center gap-2">
            <TabsList>
              <TabsTrigger value="users">가입자</TabsTrigger>
              <TabsTrigger value="visitors">방문자</TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-1.5">
                <MessageSquarePlus className="h-3.5 w-3.5" />
                피드백
              </TabsTrigger>
            </TabsList>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void refetchUsers();
                void refetchVisitors();
              }}
              disabled={isFetchingUsers || isFetchingVisitors}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${(isFetchingUsers || isFetchingVisitors) ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          </div>
        </div>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        <TabsContent value="visitors">
          <VisitorsTab />
        </TabsContent>

        <TabsContent value="feedback">
          <FeedbackAdminTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
