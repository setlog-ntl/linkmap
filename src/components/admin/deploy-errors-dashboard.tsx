'use client';

import { useState, useCallback } from 'react';
import {
  AlertTriangle, Bug, CheckCircle2, Clock, Filter,
  RefreshCw, ChevronRight, MessageSquare, Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ErrorPattern {
  id: string;
  fingerprint: string;
  error_category: string;
  failed_step: string | null;
  sample_message: string;
  cause: string | null;
  solution: string | null;
  occurrence_count: number;
  first_seen_at: string;
  last_seen_at: string;
  is_resolved: boolean;
  resolution_note: string | null;
}

interface ErrorLog {
  id: string;
  deploy_id: string | null;
  pattern_id: string | null;
  user_id: string;
  template_id: string | null;
  template_slug: string | null;
  site_name: string | null;
  error_message: string;
  error_category: string;
  failed_step: string | null;
  http_status: number | null;
  error_context: Record<string, unknown>;
  created_at: string;
}

interface CategoryStats {
  [key: string]: { total: number; resolved: number; occurrences: number };
}

const CATEGORY_LABELS: Record<string, string> = {
  repo_conflict: '저장소 충돌',
  template_not_found: '템플릿 미발견',
  file_upload: '파일 업로드',
  permission: '권한 오류',
  token: '토큰 문제',
  rate_limit: '속도 제한',
  timeout: '시간 초과',
  retry_exhausted: '재시도 실패',
  workflow_build: '빌드 실패',
  pages_error: 'Pages 오류',
  network: '네트워크 오류',
  quota: '쿼터 초과',
  unknown: '기타',
};

const CATEGORY_COLORS: Record<string, string> = {
  repo_conflict: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  template_not_found: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  file_upload: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  permission: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  token: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  rate_limit: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  timeout: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  retry_exhausted: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
  workflow_build: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  pages_error: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  network: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  quota: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString('ko-KR', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

async function fetchPatterns(category: string | null, resolved: string | null, page: number) {
  const params = new URLSearchParams({ view: 'patterns', page: String(page), limit: '20' });
  if (category) params.set('category', category);
  if (resolved) params.set('resolved', resolved);
  const res = await fetch(`/api/admin/deploy-errors?${params}`);
  if (!res.ok) throw new Error('Failed to fetch patterns');
  return res.json() as Promise<{
    patterns: ErrorPattern[];
    total: number;
    page: number;
    limit: number;
    categoryStats: CategoryStats;
  }>;
}

async function fetchLogs(category: string | null, patternId: string | null, page: number) {
  const params = new URLSearchParams({ view: 'logs', page: String(page), limit: '20' });
  if (category) params.set('category', category);
  if (patternId) params.set('pattern_id', patternId);
  const res = await fetch(`/api/admin/deploy-errors?${params}`);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json() as Promise<{
    logs: ErrorLog[];
    total: number;
    page: number;
    limit: number;
  }>;
}

export default function DeployErrorsDashboard() {
  const [tab, setTab] = useState<'patterns' | 'logs'>('patterns');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [resolvedFilter, setResolvedFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedPattern, setSelectedPattern] = useState<ErrorPattern | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [logPatternId, setLogPatternId] = useState<string | null>(null);
  const qc = useQueryClient();

  const patternsQuery = useQuery({
    queryKey: ['admin', 'deploy-errors', 'patterns', categoryFilter, resolvedFilter, page],
    queryFn: () => fetchPatterns(categoryFilter, resolvedFilter, page),
    enabled: tab === 'patterns',
  });

  const logsQuery = useQuery({
    queryKey: ['admin', 'deploy-errors', 'logs', categoryFilter, logPatternId, page],
    queryFn: () => fetchLogs(categoryFilter, logPatternId, page),
    enabled: tab === 'logs',
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/admin/deploy-errors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'deploy-errors'] });
      toast.success('패턴이 업데이트되었습니다');
      setEditDialogOpen(false);
    },
    onError: () => toast.error('업데이트 실패'),
  });

  const handleRefresh = useCallback(() => {
    qc.invalidateQueries({ queryKey: ['admin', 'deploy-errors'] });
  }, [qc]);

  const handleViewLogs = useCallback((patternId: string) => {
    setLogPatternId(patternId);
    setPage(1);
    setTab('logs');
  }, []);

  const handleToggleResolved = useCallback((pattern: ErrorPattern) => {
    updateMutation.mutate({
      pattern_id: pattern.id,
      is_resolved: !pattern.is_resolved,
    });
  }, [updateMutation]);

  const categoryStats = patternsQuery.data?.categoryStats;
  const totalOccurrences = categoryStats
    ? Object.values(categoryStats).reduce((sum, s) => sum + s.occurrences, 0)
    : 0;
  const totalPatterns = categoryStats
    ? Object.values(categoryStats).reduce((sum, s) => sum + s.total, 0)
    : 0;
  const unresolvedPatterns = categoryStats
    ? Object.values(categoryStats).reduce((sum, s) => sum + (s.total - s.resolved), 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bug className="h-6 w-6 text-red-500" />
            배포 오류 로그
          </h1>
          <p className="text-muted-foreground mt-1">
            배포 실패 오류를 추적하고, 유사 오류를 그룹화하여 개선합니다.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-1" />
          새로고침
        </Button>
      </div>

      {/* KPI Cards */}
      {patternsQuery.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-8 w-20" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <AlertTriangle className="h-4 w-4" />
                총 오류 발생
              </div>
              <p className="text-3xl font-bold">{totalOccurrences}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Bug className="h-4 w-4" />
                오류 패턴
              </div>
              <p className="text-3xl font-bold">{totalPatterns}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Clock className="h-4 w-4" />
                미해결 패턴
              </div>
              <p className="text-3xl font-bold text-red-500">{unresolvedPatterns}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Stats */}
      {categoryStats && Object.keys(categoryStats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">카테고리별 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryStats)
                .sort(([, a], [, b]) => b.occurrences - a.occurrences)
                .map(([cat, stats]) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(categoryFilter === cat ? null : cat);
                      setPage(1);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      categoryFilter === cat ? 'ring-2 ring-brand-blue' : ''
                    } ${CATEGORY_COLORS[cat] || CATEGORY_COLORS.unknown}`}
                  >
                    {CATEGORY_LABELS[cat] || cat}
                    <span className="font-bold">{stats.occurrences}</span>
                    {stats.resolved > 0 && (
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                    )}
                  </button>
                ))}
              {categoryFilter && (
                <button
                  onClick={() => { setCategoryFilter(null); setPage(1); }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80"
                >
                  <Filter className="h-3 w-3" />
                  필터 해제
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => { setTab(v as 'patterns' | 'logs'); setPage(1); setLogPatternId(null); }}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="patterns">오류 패턴</TabsTrigger>
            <TabsTrigger value="logs">개별 로그</TabsTrigger>
          </TabsList>
          {tab === 'patterns' && (
            <Select value={resolvedFilter || 'all'} onValueChange={(v) => { setResolvedFilter(v === 'all' ? null : v); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="false">미해결</SelectItem>
                <SelectItem value="true">해결됨</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Patterns Tab */}
        <TabsContent value="patterns" className="space-y-3 mt-4">
          {patternsQuery.isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}><CardContent className="pt-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))
          ) : !patternsQuery.data?.patterns?.length ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Bug className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>오류 패턴이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            patternsQuery.data.patterns.map((pattern) => (
              <Card key={pattern.id} className={pattern.is_resolved ? 'opacity-60' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge className={CATEGORY_COLORS[pattern.error_category] || CATEGORY_COLORS.unknown}>
                          {CATEGORY_LABELS[pattern.error_category] || pattern.error_category}
                        </Badge>
                        {pattern.failed_step && (
                          <Badge variant="outline" className="text-xs">{pattern.failed_step}</Badge>
                        )}
                        {pattern.is_resolved && (
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            해결됨
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {pattern.occurrence_count}회 발생
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">{pattern.sample_message}</p>
                      {pattern.cause && (
                        <p className="text-xs text-muted-foreground mt-1">원인: {pattern.cause}</p>
                      )}
                      {pattern.solution && (
                        <p className="text-xs text-brand-blue mt-0.5">해결: {pattern.solution}</p>
                      )}
                      {pattern.resolution_note && (
                        <p className="text-xs text-green-600 mt-0.5">메모: {pattern.resolution_note}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>최초: {formatDateTime(pattern.first_seen_at)}</span>
                        <span>최근: {formatRelative(pattern.last_seen_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => handleViewLogs(pattern.id)}
                      >
                        <Search className="h-3.5 w-3.5 mr-1" />
                        로그
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => { setSelectedPattern(pattern); setEditDialogOpen(true); }}
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        관리
                      </Button>
                      <Button
                        variant={pattern.is_resolved ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => handleToggleResolved(pattern)}
                        disabled={updateMutation.isPending}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        {pattern.is_resolved ? '미해결' : '해결'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {/* Pagination */}
          {patternsQuery.data && patternsQuery.data.total > 20 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline" size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                이전
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {Math.ceil(patternsQuery.data.total / 20)}
              </span>
              <Button
                variant="outline" size="sm"
                disabled={page >= Math.ceil(patternsQuery.data.total / 20)}
                onClick={() => setPage(page + 1)}
              >
                다음
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-3 mt-4">
          {logPatternId && (
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">패턴 필터 적용됨</Badge>
              <Button variant="ghost" size="sm" onClick={() => { setLogPatternId(null); setPage(1); }}>
                필터 해제
              </Button>
            </div>
          )}

          {logsQuery.isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}><CardContent className="pt-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
            ))
          ) : !logsQuery.data?.logs?.length ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>오류 로그가 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">시간</th>
                    <th className="text-left p-3 font-medium">카테고리</th>
                    <th className="text-left p-3 font-medium">에러 메시지</th>
                    <th className="text-left p-3 font-medium">단계</th>
                    <th className="text-left p-3 font-medium">템플릿</th>
                    <th className="text-left p-3 font-medium">HTTP</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logsQuery.data.logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30">
                      <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">
                        {formatDateTime(log.created_at)}
                      </td>
                      <td className="p-3">
                        <Badge className={`text-xs ${CATEGORY_COLORS[log.error_category] || CATEGORY_COLORS.unknown}`}>
                          {CATEGORY_LABELS[log.error_category] || log.error_category}
                        </Badge>
                      </td>
                      <td className="p-3 max-w-xs truncate" title={log.error_message}>
                        {log.error_message}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {log.failed_step || '-'}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {log.template_slug || '-'}
                      </td>
                      <td className="p-3 text-xs">
                        {log.http_status ? (
                          <Badge variant={log.http_status >= 500 ? 'destructive' : 'outline'} className="text-xs">
                            {log.http_status}
                          </Badge>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {logsQuery.data && logsQuery.data.total > 20 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline" size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                이전
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {Math.ceil(logsQuery.data.total / 20)}
              </span>
              <Button
                variant="outline" size="sm"
                disabled={page >= Math.ceil(logsQuery.data.total / 20)}
                onClick={() => setPage(page + 1)}
              >
                다음
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Pattern Dialog */}
      <PatternEditDialog
        pattern={selectedPattern}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={(data) => updateMutation.mutate(data)}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}

function PatternEditDialog({
  pattern,
  open,
  onOpenChange,
  onSave,
  isPending,
}: {
  pattern: ErrorPattern | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Record<string, unknown>) => void;
  isPending: boolean;
}) {
  const [cause, setCause] = useState('');
  const [solution, setSolution] = useState('');
  const [note, setNote] = useState('');

  // Sync with pattern when opened
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && pattern) {
      setCause(pattern.cause || '');
      setSolution(pattern.solution || '');
      setNote(pattern.resolution_note || '');
    }
    onOpenChange(isOpen);
  };

  if (!pattern) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>오류 패턴 관리</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">대표 에러 메시지</p>
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{pattern.sample_message}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={CATEGORY_COLORS[pattern.error_category] || CATEGORY_COLORS.unknown}>
              {CATEGORY_LABELS[pattern.error_category] || pattern.error_category}
            </Badge>
            <span className="text-sm text-muted-foreground">{pattern.occurrence_count}회 발생</span>
          </div>
          <div>
            <label className="text-sm font-medium">원인 분석</label>
            <Textarea
              value={cause}
              onChange={(e) => setCause(e.target.value)}
              placeholder="이 오류가 발생하는 원인을 기록합니다..."
              rows={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium">해결 방안</label>
            <Textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="이 오류를 해결하기 위한 방안을 기록합니다..."
              rows={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium">해결 메모</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="해결 과정이나 참고 사항을 메모합니다..."
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
          <Button
            onClick={() => onSave({
              pattern_id: pattern.id,
              cause: cause || null,
              solution: solution || null,
              resolution_note: note || null,
            })}
            disabled={isPending}
          >
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
