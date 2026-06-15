'use client';

import { useMemo, useState } from 'react';
import { Check, X, Loader2, Plus, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { ServiceIcon } from '@/components/ui/service-icon';
import { CreateCustomServiceDialog } from '@/components/service/create-custom-service-dialog';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useAddProjectService } from '@/lib/queries/services';
import {
  easyCategoryLabels,
  easyCategoryEmojis,
  serviceCategoryToEasy,
  EASY_CATEGORY_ORDER,
} from '@/lib/constants/easy-categories';
import type { Service, ProjectService, EasyCategory } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface CatalogSidebarProps {
  projectId: string;
  catalogServices: Service[];
  projectServices: (ProjectService & { service: Service })[];
  isLoading?: boolean;
  onCatalogRefresh?: () => void;
}

export function CatalogSidebar({
  projectId,
  catalogServices,
  projectServices,
  isLoading,
  onCatalogRefresh,
}: CatalogSidebarProps) {
  const { catalogSidebarOpen, setCatalogSidebarOpen } = useServiceMapStore();
  const addService = useAddProjectService(projectId);

  const [instanceDialog, setInstanceDialog] = useState<{ serviceId: string; serviceName: string } | null>(null);
  const [instanceLabel, setInstanceLabel] = useState('');
  const [instanceNotes, setInstanceNotes] = useState('');

  const addedServiceIds = useMemo(
    () => new Set(projectServices.map((ps) => ps.service_id)),
    [projectServices]
  );

  // 서비스별 등록된 인스턴스 수
  const serviceInstanceCount = useMemo(() => {
    const counts = new Map<string, number>();
    projectServices.forEach((ps) => {
      counts.set(ps.service_id, (counts.get(ps.service_id) || 0) + 1);
    });
    return counts;
  }, [projectServices]);

  // 글로벌 서비스: easyCategory��� 그룹핑
  const grouped = useMemo(() => {
    const groups: Record<EasyCategory, Service[]> = {} as Record<EasyCategory, Service[]>;
    for (const cat of EASY_CATEGORY_ORDER) {
      groups[cat] = [];
    }
    for (const svc of catalogServices) {
      if (svc.is_custom) continue; // 커스텀은 별도 처리
      const easy = serviceCategoryToEasy[svc.category] || 'analytics_other';
      if (!groups[easy]) groups[easy] = [];
      groups[easy].push(svc);
    }
    return groups;
  }, [catalogServices]);

  // 커스텀 서비스 분리
  const customServices = useMemo(
    () => catalogServices.filter((s) => s.is_custom),
    [catalogServices]
  );

  const handleAddService = (serviceId: string, serviceName: string) => {
    if (addService.isPending) return;
    // 이미 추가된 서비스면 인스턴스 라벨 입력 다이얼로그 표시
    if (addedServiceIds.has(serviceId)) {
      setInstanceDialog({ serviceId, serviceName });
      setInstanceLabel('');
      setInstanceNotes('');
      return;
    }
    addService.mutate(serviceId);
  };

  const handleAddInstance = () => {
    if (!instanceDialog || !instanceLabel.trim() || addService.isPending) return;
    addService.mutate(
      {
        serviceId: instanceDialog.serviceId,
        instanceLabel: instanceLabel.trim(),
        notes: instanceNotes.trim() || undefined,
      },
      { onSuccess: () => setInstanceDialog(null) }
    );
  };

  const renderServiceItem = (svc: Service) => {
    const isAdded = addedServiceIds.has(svc.id);
    const count = serviceInstanceCount.get(svc.id) || 0;
    return (
      <CommandItem
        key={svc.id}
        value={`${svc.name} ${svc.description_ko || svc.description || ''}`}
        onSelect={() => handleAddService(svc.id, svc.name)}
        className="flex items-center gap-2"
      >
        <ServiceIcon serviceId={svc.slug} iconEmoji={svc.icon_emoji} size={16} />
        <div className="flex-1 min-w-0">
          <div className="text-sm truncate">{svc.name}</div>
          {svc.free_tier_quality === 'excellent' && (
            <span className="text-[10px] text-green-600 dark:text-green-400">
              무료 티어 우수
            </span>
          )}
        </div>
        {isAdded && (
          <div className="flex items-center gap-1 shrink-0">
            {count > 1 && (
              <span className="text-[10px] text-muted-foreground">{count}개</span>
            )}
            <Check className="h-4 w-4 text-green-500" />
            <Copy className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
      </CommandItem>
    );
  };

  return (
    <AnimatePresence>
      {catalogSidebarOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 'min(280px, 72vw)' as unknown as number, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full border-r bg-background flex flex-col overflow-hidden shrink-0"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="text-sm font-semibold">서비스 추가</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCatalogSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Command className="flex-1 border-none">
            <CommandInput placeholder="서비스 검색..." />
            <CommandList className="max-h-none flex-1">
              <ScrollArea className="h-[calc(100%-3rem)]">
                <CommandEmpty>
                  <div className="py-4 space-y-2 text-center">
                    <p className="text-sm text-muted-foreground">서비스를 찾을 수 없습니다</p>
                    <CreateCustomServiceDialog
                      mode="create"
                      onSuccess={onCatalogRefresh ? () => onCatalogRefresh() : undefined}
                      trigger={
                        <Button variant="ghost" size="sm">
                          <Plus className="mr-1 h-3 w-3" /> 직접 추가
                        </Button>
                      }
                    />
                  </div>
                </CommandEmpty>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    {EASY_CATEGORY_ORDER.map((cat) => {
                      const services = grouped[cat];
                      if (!services || services.length === 0) return null;
                      return (
                        <CommandGroup
                          key={cat}
                          heading={`${easyCategoryEmojis[cat]} ${easyCategoryLabels[cat]}`}
                        >
                          {services.map(renderServiceItem)}
                        </CommandGroup>
                      );
                    })}

                    {customServices.length > 0 && (
                      <CommandGroup heading="👤 내 서비스">
                        {customServices.map(renderServiceItem)}
                      </CommandGroup>
                    )}
                  </>
                )}
              </ScrollArea>
            </CommandList>
          </Command>
        </motion.div>
      )}

      {/* 인스턴스 라벨 입력 다이얼로그 */}
      <Dialog open={!!instanceDialog} onOpenChange={(open) => !open && setInstanceDialog(null)}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>{instanceDialog?.serviceName} 인스턴스 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              같은 서비스를 구분할 별칭을 입력하세요.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">별칭</label>
              <Input
                placeholder="예: 메인 DB, 분석용 DB"
                value={instanceLabel}
                onChange={(e) => setInstanceLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddInstance()}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">용도 <span className="text-muted-foreground/60">(선택)</span></label>
              <Input
                placeholder="예: 사용자 인증 및 데이터 저장"
                value={instanceNotes}
                onChange={(e) => setInstanceNotes(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddInstance()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInstanceDialog(null)}>
              취소
            </Button>
            <Button
              onClick={handleAddInstance}
              disabled={!instanceLabel.trim() || addService.isPending}
            >
              {addService.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}
