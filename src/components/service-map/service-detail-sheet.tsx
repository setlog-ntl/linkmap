'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DifficultyBadge,
  FreeTierBadge,
  GithubStarsBadge,
  CostEstimateBadge,
  VendorLockInBadge,
} from '@/components/service/service-badges';
import { HealthTimeline } from '@/components/project/health-timeline';
import { allCategoryLabels } from '@/lib/constants/service-filters';
import { domainLabels } from '@/lib/constants/service-filters';
import { useHealthChecks, useRunHealthCheck } from '@/lib/queries/health-checks';
import { ServiceAccountSection } from '@/components/service-map/service-account-section';
import { ServiceEnvVarsSection } from '@/components/service-map/service-env-vars-section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ExternalLink, BookOpen, GitFork, Activity, Loader2, X as XIcon, KeyRound, Lightbulb, Copy, Check, UserPlus, User, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from '@/lib/queries/keys';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useUpdateProjectServiceAccount } from '@/lib/queries/services';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import type { ProjectService, Service, ServiceDependency, ServiceCategory, ServiceDomain, EnvironmentVariable, ServiceGuide, ServiceFeatureGuide, ServiceSignupGuide } from '@/types';

interface ServiceDetailSheetProps {
  service: (ProjectService & { service: Service }) | null;
  dependencies: ServiceDependency[];
  serviceNames: Record<string, string>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  envVars?: EnvironmentVariable[];
  loading?: boolean;
}

const statusLabels: Record<string, { label: string; className: string }> = {
  connected: { label: '연결됨', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  in_progress: { label: '진행 중', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
  not_started: { label: '시작 전', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300' },
  error: { label: '오류', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
};

const depTypeLabels: Record<string, string> = {
  required: '필수',
  recommended: '권장',
  optional: '선택',
  alternative: '대체',
};

export function ServiceDetailSheet({
  service,
  dependencies,
  serviceNames,
  open,
  onOpenChange,
  projectId,
  envVars = [],
  loading = false,
}: ServiceDetailSheetProps) {
  const psId = service?.id || '';
  const svcId = service?.service_id || '';
  const { data: healthChecks = [] } = useHealthChecks(psId);
  const { data: guide } = useQuery({
    queryKey: queryKeys.serviceGuides.byService(svcId),
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('service_guides')
        .select('*')
        .eq('service_id', svcId)
        .single();
      return data as ServiceGuide | null;
    },
    enabled: !!svcId,
    staleTime: Infinity,
  });
  const runHealthCheck = useRunHealthCheck();

  const showLoading = loading || (open && !service);

  if (!open && !showLoading) {
    return null;
  }

  const containerClasses = cn(
    'fixed top-16 right-4 bottom-4 w-[380px] z-50 transition-transform duration-300 ease-in-out flex flex-col pointer-events-auto',
    'bg-background/80 dark:bg-zinc-950/80 backdrop-blur-xl border shadow-2xl rounded-xl overflow-hidden'
  );

  if (showLoading) {
    return (
      <div className={containerClasses}>
        <div className="p-4 flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4 px-4 pb-4">
          <div className="flex gap-2"><Skeleton className="h-5 w-16" /><Skeleton className="h-5 w-20" /></div>
          <Separator />
          <Skeleton className="h-24 w-full" />
          <Separator />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (!service) return null;

  const svc = service.service;
  const status = statusLabels[service.status] || statusLabels.not_started;
  const category = svc?.category as ServiceCategory;
  const domain = svc?.domain as ServiceDomain | undefined;

  const requiredEnvVars = svc?.required_env_vars || [];
  const recentChecks = healthChecks.slice(0, 5);

  // 미설정 필수 환경변수 개수 (탭 배지용)
  const serviceEnvVars = envVars.filter((ev) => ev.service_id === service.service_id);
  const configuredKeys = new Set(serviceEnvVars.map((ev) => ev.key_name));
  const unsetCount = requiredEnvVars.filter((t) => !configuredKeys.has(t.name)).length;

  // 가이드 데이터 유무 확인
  const hasGuideContent = guide && (
    guide.quick_start ||
    (guide.setup_steps && guide.setup_steps.length > 0) ||
    (guide.pros && guide.pros.length > 0) ||
    (guide.cons && guide.cons.length > 0) ||
    (guide.common_pitfalls && guide.common_pitfalls.length > 0) ||
    guide.signup ||
    (guide.features && guide.features.length > 0)
  );

  const handleRunCheck = () => {
    runHealthCheck.mutate(
      { project_service_id: service.id },
      {
        onSuccess: (data) => {
          const label = data.status === 'healthy' ? '정상' : data.status === 'degraded' ? '경고' : '오류';
          toast.success(`${svc?.name}: 상태 ${label}`);
        },
        onError: (error) => {
          toast.error(`${svc?.name}: ${error.message || '점검 실패'}`);
        },
      },
    );
  };

  return (
    <div className={containerClasses}>
      {/* 헤더 */}
      <div className="flex items-start justify-between p-4 pb-2 shrink-0">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{svc?.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {svc?.description_ko || svc?.description}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="-mt-1 -mr-1" onClick={() => onOpenChange(false)}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* 탭 */}
      <Tabs defaultValue="overview" className="flex flex-col flex-1 min-h-0">
        <TabsList className="mx-4 mb-1 flex h-8 shrink-0 gap-0">
          <TabsTrigger value="overview" className="text-xs flex-1">개요</TabsTrigger>
          <TabsTrigger value="envvars" className="text-xs flex-1">
            환경변수
            {unsetCount > 0 && (
              <span className="ml-1 bg-red-500 text-white rounded-full text-[9px] px-1 leading-4 min-w-[14px] inline-flex items-center justify-center">
                {unsetCount}
              </span>
            )}
          </TabsTrigger>
          {hasGuideContent && (
            <TabsTrigger value="guide" className="text-xs flex-1">가이드</TabsTrigger>
          )}
          <TabsTrigger value="connections" className="text-xs flex-1">연결</TabsTrigger>
          <TabsTrigger value="health" className="text-xs flex-1">상태</TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview" className="flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col">
          <ScrollArea className="flex-1 w-full">
            <div className="space-y-4 p-4 pt-2 pb-6">
              {/* Status & Category 배지 */}
              <div className="flex flex-wrap gap-2">
                <Badge className={cn('px-2.5 py-0.5', status.className)}>{status.label}</Badge>
                {category && (
                  <Badge variant="outline" className="px-2.5 py-0.5">
                    {allCategoryLabels[category] || category}
                  </Badge>
                )}
                {domain && (
                  <Badge variant="secondary" className="px-2.5 py-0.5">
                    {domainLabels[domain]}
                  </Badge>
                )}
              </div>

              <Separator />

              {/* 서비스 정보 배지 */}
              <div>
                <h4 className="text-sm font-medium mb-3">서비스 정보</h4>
                <div className="space-y-2.5">
                  <div className="flex flex-wrap gap-2 items-center">
                    <DifficultyBadge level={svc?.difficulty_level} />
                    <FreeTierBadge quality={svc?.free_tier_quality} />
                    <VendorLockInBadge risk={svc?.vendor_lock_in_risk} />
                  </div>
                  <div className="flex items-center gap-3">
                    <GithubStarsBadge stars={svc?.github_stars} />
                    <CostEstimateBadge estimate={svc?.monthly_cost_estimate} />
                  </div>
                </div>
              </div>

              {/* 계정 정보 */}
              <Separator />
              {projectId && (
                <SheetAccountField
                  projectServiceId={service.id}
                  projectId={projectId}
                  currentValue={service.account_identifier}
                />
              )}

              {/* 링크 */}
              {(svc?.website_url || svc?.docs_url || guide?.api_key_url) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    {(svc?.website_url || svc?.docs_url) && (
                      <div className="grid grid-cols-2 gap-2">
                        {svc?.website_url && (
                          <Button variant="outline" size="sm" asChild className="w-full justify-center">
                            <a href={svc.website_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3.5 w-3.5" />
                              공식 웹사이트
                            </a>
                          </Button>
                        )}
                        {svc?.docs_url && (
                          <Button variant="outline" size="sm" asChild className="w-full justify-center">
                            <a href={svc.docs_url} target="_blank" rel="noopener noreferrer">
                              <BookOpen className="mr-2 h-3.5 w-3.5" />
                              개발자 문서
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                    {guide?.api_key_url && (
                      <Button variant="outline" size="sm" asChild className="w-full justify-start gap-2 text-primary border-primary/30 hover:bg-primary/5">
                        <a href={guide.api_key_url} target="_blank" rel="noopener noreferrer">
                          <KeyRound className="h-3.5 w-3.5" />
                          {guide.api_key_url_label || 'API 키 발급 / 확인'}
                        </a>
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 환경변수 탭 */}
        <TabsContent value="envvars" className="flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col">
          <ScrollArea className="flex-1 w-full">
            <div className="p-4 pt-2 pb-6">
              {projectId ? (
                <ServiceEnvVarsSection
                  projectId={projectId}
                  serviceId={service.service_id}
                  requiredEnvVars={requiredEnvVars}
                  envVars={envVars.filter((ev) => ev.service_id === service.service_id)}
                />
              ) : (
                <p className="text-xs text-muted-foreground py-2">
                  프로젝트를 선택하면 환경변수를 관리할 수 있습니다.
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 가이드 탭 */}
        {hasGuideContent && (
          <TabsContent value="guide" className="flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col">
            <ScrollArea className="flex-1 w-full">
              <div className="space-y-4 p-4 pt-2 pb-6">
                {/* 1. 서비스 소개 */}
                {guide.quick_start && (
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-primary">서비스 소개</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{guide.quick_start}</p>
                  </div>
                )}

                {/* 2. 가입 안내 (signup 있을 때) */}
                {guide.signup && <SheetSignupSection signup={guide.signup} />}

                {/* 3. 기능별 아코디언 (features 있을 때) */}
                {guide.features && guide.features.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium mb-2">기능별 시작 가이드</h4>
                    <SheetFeatureAccordion features={guide.features} />
                  </div>
                )}

                {/* 4. Fallback: features 없을 때 기존 UI 유지 */}
                {(!guide.features || guide.features.length === 0) && (
                  <>
                    {/* API 키 발급 링크 */}
                    {guide.api_key_url && (
                      <Button variant="outline" size="sm" asChild className="w-full justify-start gap-2 text-primary border-primary/30 hover:bg-primary/5">
                        <a href={guide.api_key_url} target="_blank" rel="noopener noreferrer">
                          <KeyRound className="h-3.5 w-3.5" />
                          {guide.api_key_url_label || 'API 키 발급 / 확인'}
                          <ExternalLink className="ml-auto h-3 w-3" />
                        </a>
                      </Button>
                    )}

                    {/* 설정 단계 */}
                    {guide.setup_steps && guide.setup_steps.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">설정 단계</h4>
                        <Accordion type="multiple" className="space-y-1.5">
                          {guide.setup_steps.map((step, i) => (
                            <AccordionItem key={i} value={`step-${i}`} className="border rounded-lg px-3">
                              <AccordionTrigger className="text-xs py-2.5">
                                <span className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                                    {step.step}
                                  </Badge>
                                  <span className="text-left">{step.title_ko || step.title}</span>
                                </span>
                              </AccordionTrigger>
                              <AccordionContent className="space-y-2 pb-3">
                                <p className="text-xs text-muted-foreground">
                                  {step.description_ko || step.description}
                                </p>
                                {step.code_snippet && (
                                  <SheetCodeBlock code={step.code_snippet} />
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    )}

                    {/* 코드 예제 */}
                    {guide.code_examples && Object.keys(guide.code_examples).length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">코드 예제</h4>
                        <div className="space-y-3">
                          {Object.entries(guide.code_examples).map(([title, code]) => (
                            <div key={title}>
                              <p className="text-xs font-medium mb-1.5 text-muted-foreground">{title}</p>
                              <SheetCodeBlock code={code} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* 장점 / 단점 (항상 표시) */}
                {((guide.pros && guide.pros.length > 0) || (guide.cons && guide.cons.length > 0)) && (
                  <div className="space-y-3">
                    {guide.pros && guide.pros.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium mb-1.5 text-green-600 dark:text-green-400">장점</h4>
                        <ul className="space-y-1">
                          {guide.pros.map((item, i) => (
                            <li key={i} className="text-xs flex items-start gap-1.5">
                              <span className="shrink-0 mt-0.5 text-green-500">+</span>
                              <span className="text-muted-foreground">{item.text_ko || item.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {guide.cons && guide.cons.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium mb-1.5 text-red-600 dark:text-red-400">단점</h4>
                        <ul className="space-y-1">
                          {guide.cons.map((item, i) => (
                            <li key={i} className="text-xs flex items-start gap-1.5">
                              <span className="shrink-0 mt-0.5 text-red-500">-</span>
                              <span className="text-muted-foreground">{item.text_ko || item.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* 흔한 실수 */}
                {guide.common_pitfalls && guide.common_pitfalls.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">흔한 실수</h4>
                    <Accordion type="multiple" className="space-y-1.5">
                      {guide.common_pitfalls.map((pitfall, i) => (
                        <AccordionItem key={i} value={`pitfall-${i}`} className="border rounded-lg px-3">
                          <AccordionTrigger className="text-xs py-2.5">
                            {pitfall.title_ko || pitfall.title}
                          </AccordionTrigger>
                          <AccordionContent className="space-y-1.5 pb-3">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">문제:</span> {pitfall.problem}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">해결:</span> {pitfall.solution}
                            </p>
                            {pitfall.code && <SheetCodeBlock code={pitfall.code} />}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* 통합 팁 */}
                {guide.integration_tips && guide.integration_tips.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">통합 팁</h4>
                    <div className="space-y-2">
                      {guide.integration_tips.map((tip, i) => (
                        <div key={i} className="rounded-lg border p-3 space-y-1.5">
                          <Badge variant="outline" className="text-[10px]">
                            {tip.with_service_slug}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{tip.tip_ko || tip.tip}</p>
                          {tip.code && <SheetCodeBlock code={tip.code} />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        )}

        {/* 연결 탭 */}
        <TabsContent value="connections" className="flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col">
          <ScrollArea className="flex-1 w-full">
            <div className="space-y-4 p-4 pt-2 pb-6">
              {projectId && svc?.slug ? (
                <ServiceAccountSection
                  projectId={projectId}
                  serviceId={service.service_id}
                  serviceSlug={svc.slug}
                  serviceName={svc.name}
                />
              ) : (
                <p className="text-xs text-muted-foreground py-2">
                  계정 연결 정보를 표시하려면 프로젝트가 필요합니다.
                </p>
              )}

              {/* 최신 상태 요약 */}
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">연결 상태</span>
                  {recentChecks.length > 0 ? (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className={cn(
                        'h-2 w-2 rounded-full',
                        recentChecks[0].status === 'healthy' ? 'bg-green-500' :
                        recentChecks[0].status === 'degraded' ? 'bg-yellow-500' :
                        recentChecks[0].status === 'unhealthy' ? 'bg-red-500' : 'bg-muted-foreground'
                      )} />
                      {recentChecks[0].status === 'healthy' ? '정상' :
                       recentChecks[0].status === 'degraded' ? '경고' :
                       recentChecks[0].status === 'unhealthy' ? '오류' : '알 수 없음'}
                      {recentChecks[0].checked_at && (
                        <span className="text-[10px]">
                          ({new Date(recentChecks[0].checked_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">미검증</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRunCheck}
                  disabled={runHealthCheck.isPending}
                  className="h-7 text-xs"
                >
                  {runHealthCheck.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    '점검'
                  )}
                </Button>
              </div>

              {dependencies.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                      <GitFork className="h-4 w-4" />
                      의존성 관계
                    </h4>
                    <div className="space-y-2">
                      {dependencies.map((dep) => (
                        <div
                          key={dep.id}
                          className="flex items-center justify-between text-sm rounded-lg bg-muted/40 border border-muted px-3 py-2"
                        >
                          <span className="font-medium">{serviceNames[dep.depends_on_service_id] || '알 수 없는 서비스'}</span>
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                            {depTypeLabels[dep.dependency_type] || dep.dependency_type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {!projectId && dependencies.length === 0 && (
                <p className="text-xs text-muted-foreground py-2">연결 정보가 없습니다.</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 상태 탭 */}
        <TabsContent value="health" className="flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col">
          <ScrollArea className="flex-1 w-full">
            <div className="space-y-4 p-4 pt-2 pb-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-blue-500" />
                  연결 및 상태
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRunCheck}
                  disabled={runHealthCheck.isPending}
                  className="h-8 text-xs"
                >
                  {runHealthCheck.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    '상태 업데이트'
                  )}
                </Button>
              </div>

              <div className="bg-muted/40 rounded-lg p-3">
                {requiredEnvVars.length > 0 && (
                  <p className="text-xs text-muted-foreground mb-3">
                    필수 환경변수: {requiredEnvVars.length}개
                  </p>
                )}
                {recentChecks.length > 0 ? (
                  <HealthTimeline checks={recentChecks} />
                ) : (
                  <p className="text-xs text-muted-foreground">이 서비스에 대한 연결 검증 이력이 없습니다.</p>
                )}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── 가입 안내 (시트용, 소형) ──────────────────────────────────────────────────
function SheetSignupSection({ signup }: { signup: ServiceSignupGuide }) {
  return (
    <div className="rounded-lg border p-3 space-y-3">
      <div className="flex items-center gap-1.5">
        <UserPlus className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium">가입 안내</span>
        {signup.free_tier && (
          <span className="ml-1 text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-1.5 py-0.5 rounded-full">
            {signup.free_tier}
          </span>
        )}
      </div>
      <ol className="space-y-1.5">
        {signup.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            <span className="flex-shrink-0 h-4 w-4 rounded-full bg-primary/15 text-primary font-semibold flex items-center justify-center text-[10px] mt-0.5">
              {i + 1}
            </span>
            <span className="text-muted-foreground">{step}</span>
          </li>
        ))}
      </ol>
      <Button size="sm" variant="outline" asChild className="w-full h-7 text-xs">
        <a href={signup.url} target="_blank" rel="noopener noreferrer">
          가입하기
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </Button>
    </div>
  );
}

// ── 기능별 아코디언 (시트용, 소형) ───────────────────────────────────────────
const sheetFeatureTagLabels: Record<string, { label: string; className: string }> = {
  free: { label: '무료', className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  paid: { label: '유료', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  beta: { label: 'Beta', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
};

function SheetFeatureAccordion({ features }: { features: ServiceFeatureGuide[] }) {
  return (
    <Accordion type="multiple" className="space-y-1.5">
      {features.map((feature) => {
        const tagMeta = feature.tag ? sheetFeatureTagLabels[feature.tag] : null;
        return (
          <AccordionItem key={feature.id} value={feature.id} className="border rounded-lg px-3">
            <AccordionTrigger className="text-xs py-2.5 hover:no-underline">
              <span className="flex items-center gap-2 min-w-0">
                <span className="font-medium truncate text-left">{feature.name}</span>
                {tagMeta && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${tagMeta.className}`}>
                    {tagMeta.label}
                  </span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-3">
              <p className="text-xs text-muted-foreground">{feature.description}</p>

              {feature.api_key && (
                <div className="rounded-md bg-muted/60 border p-2.5 space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <KeyRound className="h-3 w-3 text-primary shrink-0" />
                      <span className="text-[11px] font-medium">API 키 발급</span>
                    </div>
                    <code className="text-[10px] bg-background border rounded px-1 py-0.5 font-mono text-primary">
                      {feature.api_key.env_var}
                    </code>
                  </div>
                  <ol className="space-y-1.5">
                    {feature.api_key.issue_steps.map((s) => (
                      <li key={s.step} className="flex items-start gap-1.5 text-[11px]">
                        <span className="flex-shrink-0 h-3.5 w-3.5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-[9px] mt-0.5">
                          {s.step}
                        </span>
                        <div>
                          <span className="font-medium text-foreground">{s.title}</span>
                          {s.description && (
                            <p className="text-muted-foreground mt-0.5">{s.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                  <Button variant="outline" size="sm" asChild className="w-full h-6 text-[11px] justify-center">
                    <a href={feature.api_key.url} target="_blank" rel="noopener noreferrer">
                      {feature.api_key.url_label}
                      <ExternalLink className="ml-1 h-2.5 w-2.5" />
                    </a>
                  </Button>
                </div>
              )}

              {feature.code_example && (
                <div>
                  <p className="text-[11px] font-medium mb-1 text-muted-foreground">코드 예제</p>
                  <SheetCodeBlock code={feature.code_example} />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

// ── 계정 인라인 편집 (시트용) ─────────────────────────────────────────────────
function SheetAccountField({ projectServiceId, projectId, currentValue }: {
  projectServiceId: string;
  projectId: string;
  currentValue: string | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentValue || '');
  const updateAccount = useUpdateProjectServiceAccount(projectId);

  const handleSave = useCallback(() => {
    const trimmed = value.trim();
    updateAccount.mutate({
      projectServiceId,
      accountIdentifier: trimmed || null,
    });
    setIsEditing(false);
  }, [value, projectServiceId, updateAccount]);

  const handleCancel = useCallback(() => {
    setValue(currentValue || '');
    setIsEditing(false);
  }, [currentValue]);

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">사용 계정</h4>
      {isEditing ? (
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="계정 아이디 또는 이메일"
            className="h-8 text-xs font-mono flex-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleSave}>
            <Check className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCancel}>
            <XIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : currentValue ? (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 w-full rounded-md bg-muted/60 border px-3 py-2 group hover:border-foreground/30 transition-colors"
        >
          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-mono text-sm flex-1 text-left">{currentValue}</span>
          <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 w-full rounded-md border border-dashed border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20 px-3 py-2 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
        >
          <User className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="text-xs text-amber-700 dark:text-amber-400">
            클릭하여 계정 아이디 입력
          </span>
        </button>
      )}
    </div>
  );
}

function SheetCodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      <pre className="bg-muted rounded-md p-3 overflow-x-auto text-[11px] leading-relaxed">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );
}
