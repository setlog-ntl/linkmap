'use client';

import {
  ExternalLink, FolderOpen, Globe, Rocket, Activity, Clock,
} from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminUserDetail } from '@/lib/queries/admin-users';

const PLAN_BADGE_VARIANT: Record<string, 'secondary' | 'default' | 'outline'> = {
  free: 'secondary',
  pro: 'default',
  team: 'outline',
};

const DEPLOY_STATUS_COLOR: Record<string, string> = {
  success: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
  error: 'text-red-600 bg-red-100 dark:bg-red-900/30',
  failed: 'text-red-600 bg-red-100 dark:bg-red-900/30',
};

// action을 한국어 라벨로 변환
const ACTION_LABELS: Record<string, string> = {
  'project.create': '프로젝트 생성',
  'project.update': '프로젝트 수정',
  'project.delete': '프로젝트 삭제',
  'env_var.create': '환경변수 추가',
  'env_var.update': '환경변수 수정',
  'env_var.delete': '환경변수 삭제',
  'env_var.decrypt': '환경변수 복호화',
  'env_var.bulk_create': '환경변수 일괄 추가',
  'connection.create': '연결 생성',
  'connection.update': '연결 수정',
  'connection.delete': '연결 삭제',
  'oneclick.deploy_pages': '원클릭 배포',
  'oneclick.deploy_success': '배포 성공',
  'oneclick.deploy_error': '배포 오류',
  'oneclick.redeploy': '재배포',
  'oneclick.file_edit': '파일 편집',
  'oneclick.file_create': '파일 생성',
  'oneclick.batch_update': '일괄 업데이트',
  'oneclick.deploy_rename': '배포 이름 변경',
  'oneclick.image_upload': '이미지 업로드',
  'ai.chat': 'AI 채팅',
  'ai.stack_recommend': 'AI 스택 추천',
  'ai.env_doctor': 'AI 환경변수 진단',
  'ai.compare_services': 'AI 서비스 비교',
  'ai.cost_report': 'AI 비용 리포트',
  'github.repo_link': 'GitHub 저장소 연결',
  'github.secrets_push': 'GitHub 시크릿 푸시',
  'profile.update': '프로필 수정',
  'feedback.create': '피드백 작성',
  'credential.create': '비밀키 추가',
  'credential.update': '비밀키 수정',
  'credential.delete': '비밀키 삭제',
  'credential.decrypt': '비밀키 복호화',
  'service_cost.update': '비용 업데이트',
  'project.budget_update': '예산 업데이트',
  'project.toggle_favorite': '즐겨찾기 토글',
  'project.set_icon': '아이콘 설정',
  'project.share_toggle': '공유 토글',
};

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString('ko-KR', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function getActionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action;
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

interface UserDetailSheetProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserDetailSheet({ userId, open, onOpenChange }: UserDetailSheetProps) {
  const { data, isLoading } = useAdminUserDetail(userId);

  const user = data?.user;
  const projects = data?.projects ?? [];
  const deploys = data?.deploys ?? [];
  const activitySummary = data?.activitySummary ?? [];
  const recentActivities = data?.recentActivities ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>사용자 상세</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <DetailSkeleton />
        ) : !user ? (
          <p className="text-sm text-muted-foreground mt-4">사용자 정보를 불러올 수 없습니다.</p>
        ) : (
          <div className="space-y-6 mt-4">
            {/* 프로필 헤더 */}
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <AvatarFallback className="text-lg">
                    {(user.name ?? user.email).charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold truncate">{user.name ?? user.email}</p>
                  <Badge
                    variant={PLAN_BADGE_VARIANT[user.plan] ?? 'secondary'}
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
                  {user.provider && (
                    <Badge variant="outline" className="text-xs">{user.provider}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  가입: {formatFullDate(user.createdAt)}
                  {user.lastSignInAt && (
                    <span className="ml-2">
                      마지막 로그인: {formatDateTime(user.lastSignInAt)}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* KPI 요약 */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-2xl font-bold">{projects.length}</p>
                  <p className="text-xs text-muted-foreground">프로젝트</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-2xl font-bold">{deploys.length}</p>
                  <p className="text-xs text-muted-foreground">배포</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-2xl font-bold">{activitySummary.reduce((s, a) => s + a.count, 0)}</p>
                  <p className="text-xs text-muted-foreground">총 활동</p>
                </CardContent>
              </Card>
            </div>

            {/* 탭: 프로젝트 / 배포 / 활동 */}
            <Tabs defaultValue="projects">
              <TabsList className="w-full">
                <TabsTrigger value="projects" className="flex-1 gap-1">
                  <FolderOpen className="h-3.5 w-3.5" />
                  프로젝트 ({projects.length})
                </TabsTrigger>
                <TabsTrigger value="deploys" className="flex-1 gap-1">
                  <Rocket className="h-3.5 w-3.5" />
                  배포 ({deploys.length})
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex-1 gap-1">
                  <Activity className="h-3.5 w-3.5" />
                  활동
                </TabsTrigger>
              </TabsList>

              {/* 프로젝트 탭 */}
              <TabsContent value="projects" className="space-y-3 mt-3">
                {projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    등록된 프로젝트가 없습니다.
                  </p>
                ) : (
                  projects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{project.name}</p>
                              <Badge variant="secondary" className="text-xs shrink-0">
                                서비스 {project.serviceCount}개
                              </Badge>
                            </div>
                            {project.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {project.description}
                              </p>
                            )}
                          </div>
                          {project.linkUrl && (
                            <a
                              href={project.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-brand-blue hover:underline shrink-0"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        {project.linkUrl && (
                          <a
                            href={project.linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-brand-blue hover:underline mt-1 block truncate"
                          >
                            {project.linkUrl}
                          </a>
                        )}
                        {project.services.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.services.map((s) => (
                              <Badge key={s.slug} variant="outline" className="text-[10px] px-1.5 py-0">
                                {s.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-1.5">
                          {formatFullDate(project.createdAt)}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* 배포 탭 */}
              <TabsContent value="deploys" className="space-y-3 mt-3">
                {deploys.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    배포 이력이 없습니다.
                  </p>
                ) : (
                  deploys.map((deploy) => (
                    <Card key={deploy.id}>
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                              <p className="font-medium truncate">
                                {deploy.siteName ?? '이름 없음'}
                              </p>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                  DEPLOY_STATUS_COLOR[deploy.deployStatus] ?? 'text-muted-foreground bg-muted'
                                }`}
                              >
                                {deploy.deployStatus}
                              </span>
                            </div>
                            {deploy.templateName && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                템플릿: {deploy.templateName}
                              </p>
                            )}
                          </div>
                          {deploy.pagesUrl && (
                            <a
                              href={deploy.pagesUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-brand-blue hover:underline shrink-0"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        {deploy.pagesUrl && (
                          <a
                            href={deploy.pagesUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-brand-blue hover:underline mt-1 block truncate"
                          >
                            {deploy.pagesUrl}
                          </a>
                        )}
                        {deploy.forkedRepoUrl && (
                          <a
                            href={deploy.forkedRepoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-muted-foreground hover:underline mt-0.5 block truncate"
                          >
                            {deploy.forkedRepoUrl}
                          </a>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-1.5">
                          {formatFullDate(deploy.createdAt)}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* 활동 탭 */}
              <TabsContent value="activity" className="space-y-4 mt-3">
                {/* 활동 요약 테이블 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">기능별 사용 횟수</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activitySummary.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        활동 기록이 없습니다.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-64 overflow-y-auto">
                        {activitySummary.map((item) => (
                          <div
                            key={item.action}
                            className="flex items-center justify-between gap-2 py-1 border-b border-border/50 last:border-0"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="text-sm truncate">{getActionLabel(item.action)}</span>
                              <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                                {item.action}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="secondary" className="font-mono">
                                {item.count}회
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {formatDateTime(item.lastUsedAt)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 최근 활동 타임라인 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">최근 활동 (최대 50건)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentActivities.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        활동 기록이 없습니다.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {recentActivities.map((act, idx) => (
                          <div
                            key={`${act.action}-${act.createdAt}-${idx}`}
                            className="flex items-start gap-2 py-1.5 border-b border-border/50 last:border-0"
                          >
                            <Clock className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium">
                                  {getActionLabel(act.action)}
                                </span>
                                {act.resourceId && (
                                  <span className="text-[10px] font-mono text-muted-foreground truncate max-w-32">
                                    {act.resourceId}
                                  </span>
                                )}
                              </div>
                              {Object.keys(act.details).length > 0 && (
                                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                                  {JSON.stringify(act.details).slice(0, 120)}
                                </p>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {formatDateTime(act.createdAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
