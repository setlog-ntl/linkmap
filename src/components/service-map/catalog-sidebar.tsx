'use client';

import { useMemo } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { ServiceIcon } from '@/components/landing/service-icon';
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
}

export function CatalogSidebar({
  projectId,
  catalogServices,
  projectServices,
  isLoading,
}: CatalogSidebarProps) {
  const { catalogSidebarOpen, setCatalogSidebarOpen } = useServiceMapStore();
  const addService = useAddProjectService(projectId);

  const addedServiceIds = useMemo(
    () => new Set(projectServices.map((ps) => ps.service_id)),
    [projectServices]
  );

  // easyCategory별로 그룹핑
  const grouped = useMemo(() => {
    const groups: Record<EasyCategory, Service[]> = {} as Record<EasyCategory, Service[]>;
    for (const cat of EASY_CATEGORY_ORDER) {
      groups[cat] = [];
    }
    for (const svc of catalogServices) {
      const easy = serviceCategoryToEasy[svc.category] || 'analytics_other';
      if (!groups[easy]) groups[easy] = [];
      groups[easy].push(svc);
    }
    return groups;
  }, [catalogServices]);

  const handleAddService = (serviceId: string) => {
    if (addedServiceIds.has(serviceId) || addService.isPending) return;
    addService.mutate(serviceId);
  };

  return (
    <AnimatePresence>
      {catalogSidebarOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 'min(280px, 85vw)' as unknown as number, opacity: 1 }}
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
                <CommandEmpty>서비스를 찾을 수 없습니다</CommandEmpty>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  EASY_CATEGORY_ORDER.map((cat) => {
                    const services = grouped[cat];
                    if (!services || services.length === 0) return null;
                    return (
                      <CommandGroup
                        key={cat}
                        heading={`${easyCategoryEmojis[cat]} ${easyCategoryLabels[cat]}`}
                      >
                        {services.map((svc) => {
                          const isAdded = addedServiceIds.has(svc.id);
                          return (
                            <CommandItem
                              key={svc.id}
                              value={`${svc.name} ${svc.description_ko || svc.description || ''}`}
                              onSelect={() => handleAddService(svc.id)}
                              disabled={isAdded}
                              className="flex items-center gap-2"
                            >
                              <ServiceIcon serviceId={svc.slug} size={16} />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm truncate">{svc.name}</div>
                                {svc.free_tier_quality === 'excellent' && (
                                  <span className="text-[10px] text-green-600 dark:text-green-400">
                                    무료 티어 우수
                                  </span>
                                )}
                              </div>
                              {isAdded && (
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                              )}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    );
                  })
                )}
              </ScrollArea>
            </CommandList>
          </Command>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
