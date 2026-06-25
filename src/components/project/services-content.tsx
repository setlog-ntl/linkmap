'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useProjectServices, useAddProjectService, useRemoveProjectService, useUpdateProjectServiceAccount } from '@/lib/queries/services';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { AddServiceDialog } from '@/components/service/add-service-dialog';
import { ServiceChecklist } from '@/components/service/service-checklist';
import { SetupWizard } from '@/components/service/setup-wizard';
import { ManualRegisterDialog } from '@/components/service/manual-register-dialog';
import { Trash2, ExternalLink, Wand2, PencilLine, List as ListIcon, User, Check, X, Activity, Loader2, Search, Layers, Copy } from 'lucide-react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { allCategoryLabels, allCategoryEmojis } from '@/lib/constants/service-filters';
import { useRunHealthCheck } from '@/lib/queries/health-checks';
import { toast } from 'sonner';
import type { ServiceCategory, ProjectService, Service } from '@/types';
import type { Locale } from '@/lib/i18n';

const statusLabels: Record<string, string> = {
  not_started: '시작 전',
  in_progress: '진행 중',
  connected: '연결됨',
  error: '오류',
};

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  not_started: 'secondary',
  in_progress: 'outline',
  connected: 'default',
  error: 'destructive',
};

interface ServicesContentProps {
  projectId: string;
}

function AccountIdentifierField({ projectServiceId, projectId, currentValue, autoEdit = false }: {
  projectServiceId: string;
  projectId: string;
  currentValue: string | null;
  autoEdit?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(autoEdit && !currentValue);
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

  if (!isEditing) {
    return currentValue ? (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
      >
        <User className="h-3.5 w-3.5" />
        <span className="font-mono">{currentValue}</span>
        <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">수정</span>
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 w-full rounded-md border border-dashed border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20 px-3 py-2 text-xs text-amber-700 dark:text-amber-400 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
      >
        <User className="h-3.5 w-3.5 shrink-0" />
        <span>계정 아이디를 입력하세요 (이메일, 사용자명 등)</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="계정 아이디 또는 이메일"
        className="h-8 text-xs font-mono max-w-[280px]"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
          if (e.key === 'Escape') handleCancel();
        }}
      />
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSave}>
        <Check className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancel}>
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

type ProjectServiceWithService = ProjectService & { service: Service };

function ServiceAccordionItem({
  ps,
  projectId,
  locale,
  runHealthCheck,
  onRemove,
  onWizard,
  onManual,
}: {
  ps: ProjectServiceWithService;
  projectId: string;
  locale: Locale;
  runHealthCheck: ReturnType<typeof useRunHealthCheck>;
  onRemove: (id: string) => void;
  onWizard: (ps: ProjectServiceWithService) => void;
  onManual: (ps: ProjectServiceWithService) => void;
}) {
  return (
    <AccordionItem value={ps.id} className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center gap-3 flex-1 text-left">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <ServiceIcon serviceId={ps.service?.slug || ''} size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{ps.service?.name}</span>
              <Badge variant="secondary" className="text-xs">
                {allCategoryLabels[ps.service?.category as ServiceCategory]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {ps.service?.description_ko || ps.service?.description}
            </p>
            {ps.notes && (
              <p className="text-[11px] text-brand-blue mt-0.5 truncate">
                {ps.notes}
              </p>
            )}
            {ps.account_identifier ? (
              <span className="inline-flex items-center gap-1 mt-1 font-mono text-[11px] text-foreground bg-muted border rounded px-1.5 py-0.5 group/acct">
                <User className="h-3 w-3 shrink-0" />
                {ps.account_identifier}
                <button
                  type="button"
                  className="ml-0.5 opacity-0 group-hover/acct:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(ps.account_identifier!);
                    toast.success('계정 정보가 복사되었습니다');
                  }}
                >
                  <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-300/50 dark:border-amber-700/50 rounded px-1.5 py-0.5">
                <User className="h-3 w-3 shrink-0" />
                계정 미설정 — 펼쳐서 입력
              </span>
            )}
          </div>
          <Badge variant={statusVariants[ps.status]} className="ml-2 shrink-0">
            {statusLabels[ps.status]}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <div className="space-y-4 pt-2">
          <div className={`pb-3 border-b ${!ps.account_identifier ? 'pt-1' : ''}`}>
            <AccountIdentifierField
              projectServiceId={ps.id}
              projectId={projectId}
              currentValue={ps.account_identifier}
              autoEdit
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {ps.service && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onManual(ps)}
              >
                <PencilLine className="mr-1.5 h-3.5 w-3.5" />
                수동 등록
              </Button>
            )}
            {ps.service && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onWizard(ps)}
              >
                <Wand2 className="mr-1.5 h-3.5 w-3.5" />
                빠른 설정
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={runHealthCheck.isPending && runHealthCheck.variables?.project_service_id === ps.id}
              onClick={() => {
                runHealthCheck.mutate(
                  { project_service_id: ps.id },
                  {
                    onSuccess: (data) => {
                      const label = data.status === 'healthy' ? '정상' : data.status === 'degraded' ? '경고' : '오류';
                      toast.success(`${ps.service?.name}: 상태 ${label}`);
                    },
                    onError: () => {
                      toast.error(`${ps.service?.name}: 점검 실패`);
                    },
                  },
                );
              }}
            >
              {runHealthCheck.isPending && runHealthCheck.variables?.project_service_id === ps.id ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Activity className="mr-1.5 h-3.5 w-3.5" />
              )}
              상태 점검
            </Button>
            {ps.service?.website_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={ps.service.website_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  웹사이트
                </a>
              </Button>
            )}
            {ps.service?.docs_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={ps.service.docs_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  문서
                </a>
              </Button>
            )}
            <ConfirmDialog
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive ml-auto"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  제거
                </Button>
              }
              title={t(locale, 'common.deleteConfirmTitle')}
              description={t(locale, 'common.deleteConfirmDesc')}
              confirmLabel={t(locale, 'common.delete')}
              cancelLabel={t(locale, 'common.cancel')}
              variant="destructive"
              onConfirm={() => onRemove(ps.id)}
            />
          </div>

          {Array.isArray(ps.service?.required_env_vars) && ps.service.required_env_vars.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">필요한 환경변수</h4>
              <div className="space-y-1">
                {ps.service.required_env_vars.map((env) => (
                  <div key={env.name} className="flex items-center gap-2 text-xs">
                    <code className="bg-muted px-1.5 py-0.5 rounded font-mono">
                      {env.name}
                    </code>
                    <Badge variant={env.public ? 'secondary' : 'destructive'} className="text-[10px]">
                      {env.public ? '공개' : '비밀'}
                    </Badge>
                    <span className="text-muted-foreground">
                      {String(env.description_ko || env.description || '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium mb-2">연결 체크리스트</h4>
            <ServiceChecklist
              projectServiceId={ps.id}
              serviceId={ps.service_id}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function ServicesContent({ projectId }: ServicesContentProps) {
  const { locale } = useLocaleStore();
  const { data: services = [], isLoading } = useProjectServices(projectId);
  const addService = useAddProjectService(projectId);
  const removeService = useRemoveProjectService(projectId);
  const runHealthCheck = useRunHealthCheck();
  const [wizardTarget, setWizardTarget] = useState<ProjectServiceWithService | null>(null);
  const [manualTarget, setManualTarget] = useState<ProjectServiceWithService | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'flat' | 'category'>('category');

  useEffect(() => {
    debounceRef.current = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const filteredServices = useMemo(() => {
    if (!search) return services;
    const q = search.toLowerCase();
    return services.filter((ps) => {
      const name = ps.service?.name?.toLowerCase() || '';
      const desc = ps.service?.description_ko?.toLowerCase() || ps.service?.description?.toLowerCase() || '';
      const account = ps.account_identifier?.toLowerCase() || '';
      return name.includes(q) || desc.includes(q) || account.includes(q);
    });
  }, [services, search]);

  const groupedServices = useMemo(() => {
    if (viewMode !== 'category') return null;
    const groups: Record<string, typeof filteredServices> = {};
    for (const ps of filteredServices) {
      const cat = (ps.service?.category as string) || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(ps);
    }
    return groups;
  }, [filteredServices, viewMode]);

  const handleAddService = async (serviceId: string, instanceLabel?: string, notes?: string) => {
    if (instanceLabel || notes) {
      await addService.mutateAsync({ serviceId, instanceLabel, notes });
    } else {
      await addService.mutateAsync(serviceId);
    }
  };

  const handleRemoveService = async (projectServiceId: string) => {
    await removeService.mutateAsync(projectServiceId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 + 도구 */}
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold mr-1">서비스 목록</h2>
        {services.length > 0 && (
          <Badge variant="secondary" className="text-xs">{services.length}</Badge>
        )}
        <div className="flex-1" />
        {services.length > 0 && (
          <>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="검색..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8 w-40 h-8 text-sm"
                aria-label="서비스 검색"
              />
            </div>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'category' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 rounded-r-none gap-1 px-2 text-xs"
                onClick={() => setViewMode('category')}
                aria-label="카테고리별 보기"
              >
                <Layers className="h-3.5 w-3.5" />
                카테고리별
              </Button>
              <Button
                variant={viewMode === 'flat' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 rounded-l-none gap-1 px-2 text-xs"
                onClick={() => setViewMode('flat')}
                aria-label="전체 보기"
              >
                <ListIcon className="h-3.5 w-3.5" />
                전체
              </Button>
            </div>
          </>
        )}
        <AddServiceDialog
          projectId={projectId}
          existingServiceIds={services.map((s) => s.service_id)}
          onAdd={handleAddService}
        />
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={ListIcon}
              title={t(locale, 'project.emptyServices')}
              description={t(locale, 'project.emptyServicesDesc')}
            >
              <AddServiceDialog
                projectId={projectId}
                existingServiceIds={[]}
                onAdd={handleAddService}
              />
            </EmptyState>
          </CardContent>
        </Card>
      ) : filteredServices.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Search}
              title="검색 결과 없음"
              description={`"${search}"에 해당하는 서비스가 없습니다.`}
            />
          </CardContent>
        </Card>
      ) : viewMode === 'category' && groupedServices ? (
        <div className="space-y-6">
          {Object.entries(groupedServices).map(([cat, items]) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{allCategoryEmojis[cat as ServiceCategory] || '🔧'}</span>
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {allCategoryLabels[cat as ServiceCategory] || cat}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {items.length}
                </Badge>
              </div>
              <Accordion type="multiple" className="space-y-3">
                {items.map((ps) => (
                  <ServiceAccordionItem
                    key={ps.id}
                    ps={ps}
                    projectId={projectId}
                    locale={locale}
                    runHealthCheck={runHealthCheck}
                    onRemove={handleRemoveService}
                    onWizard={setWizardTarget}
                    onManual={setManualTarget}
                  />
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {filteredServices.map((ps) => (
            <ServiceAccordionItem
              key={ps.id}
              ps={ps}
              projectId={projectId}
              locale={locale}
              runHealthCheck={runHealthCheck}
              onRemove={handleRemoveService}
              onWizard={setWizardTarget}
              onManual={setManualTarget}
            />
          ))}
        </Accordion>
      )}

      {wizardTarget?.service && (
        <SetupWizard
          key={wizardTarget.id}
          open={!!wizardTarget}
          onOpenChange={(open) => { if (!open) setWizardTarget(null); }}
          service={wizardTarget.service}
          projectService={wizardTarget}
          projectId={projectId}
        />
      )}

      {manualTarget?.service && (
        <ManualRegisterDialog
          key={manualTarget.id}
          open={!!manualTarget}
          onOpenChange={(open) => { if (!open) setManualTarget(null); }}
          service={manualTarget.service}
          projectId={projectId}
        />
      )}
    </div>
  );
}
