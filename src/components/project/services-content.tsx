'use client';

import { useState, useCallback } from 'react';
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
import { Trash2, ExternalLink, Wand2, List as ListIcon, User, Check, X, Activity, Loader2 } from 'lucide-react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { allCategoryLabels } from '@/lib/constants/service-filters';
import { useRunHealthCheck } from '@/lib/queries/health-checks';
import { toast } from 'sonner';
import type { ServiceCategory, ProjectService, Service } from '@/types';

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

function AccountIdentifierField({ projectServiceId, projectId, currentValue }: {
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

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
      >
        <User className="h-3 w-3" />
        {currentValue ? (
          <span className="font-mono">{currentValue}</span>
        ) : (
          <span className="italic group-hover:underline">계정 아이디 입력</span>
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <User className="h-3 w-3 text-muted-foreground shrink-0" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="계정 아이디 또는 이메일"
        className="h-7 text-xs font-mono max-w-[240px]"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
          if (e.key === 'Escape') handleCancel();
        }}
      />
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSave}>
        <Check className="h-3 w-3" />
      </Button>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCancel}>
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function ServicesContent({ projectId }: ServicesContentProps) {
  const { locale } = useLocaleStore();
  const { data: services = [], isLoading } = useProjectServices(projectId);
  const addService = useAddProjectService(projectId);
  const removeService = useRemoveProjectService(projectId);
  const runHealthCheck = useRunHealthCheck();
  const [wizardTarget, setWizardTarget] = useState<(ProjectService & { service: Service }) | null>(null);

  const handleAddService = async (serviceId: string) => {
    await addService.mutateAsync(serviceId);
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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">서비스 목록</h2>
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
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {services.map((ps) => (
            <AccordionItem key={ps.id} value={ps.id} className="border rounded-lg px-4">
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
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{ps.service?.description_ko || ps.service?.description}</span>
                      {ps.account_identifier && (
                        <span className="flex items-center gap-1 shrink-0 font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">
                          <User className="h-3 w-3" />
                          {ps.account_identifier}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={statusVariants[ps.status]} className="ml-2 shrink-0">
                    {statusLabels[ps.status]}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4 pt-2">
                  <div className="pb-2 border-b">
                    <AccountIdentifierField
                      projectServiceId={ps.id}
                      projectId={projectId}
                      currentValue={ps.account_identifier}
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {ps.service && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setWizardTarget(ps)}
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
                      onConfirm={() => handleRemoveService(ps.id)}
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
    </div>
  );
}
