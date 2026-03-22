'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Plus, Search, Pencil, Trash2, ArrowRightLeft } from 'lucide-react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { ServiceTooltip } from '@/components/ui/service-tooltip';
import { getServiceDescription } from '@/lib/constants/service-descriptions';
import { CreateCustomServiceDialog } from './create-custom-service-dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useDeleteCustomService, useCustomServiceMatches, useMigrateCustomService } from '@/lib/queries/services';
import { toast } from 'sonner';
import type { Service, ServiceCategory } from '@/types';

const categoryLabels: Partial<Record<ServiceCategory, string>> = {
  auth: '인증',
  social_login: '소셜 로그인',
  database: '데이터베이스',
  deploy: '배포',
  email: '이메일',
  payment: '결제',
  storage: '스토리지',
  monitoring: '모니터링',
  ai: 'AI',
  other: '기타',
};

interface AddServiceDialogProps {
  projectId: string;
  existingServiceIds: string[];
  onAdd: (serviceId: string) => Promise<void>;
}

export function AddServiceDialog({ projectId: _projectId, existingServiceIds, onAdd }: AddServiceDialogProps) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const deleteMutation = useDeleteCustomService();
  const { data: matches } = useCustomServiceMatches(open);
  const migrateMutation = useMigrateCustomService();

  // 커스텀 서비스 ID → 매칭된 글로벌 서비스
  const matchMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    if (matches) {
      for (const m of matches) {
        map.set(m.customService.id, { id: m.globalService.id, name: m.globalService.name });
      }
    }
    return map;
  }, [matches]);

  const handleMigrateService = async (customId: string, globalId: string, globalName: string) => {
    try {
      await migrateMutation.mutateAsync({ customServiceId: customId, globalServiceId: globalId });
      toast.success(`"${globalName}" 글로벌 서비스로 전환되었습니다`);
      fetchServices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '전환에 실패했습니다');
    }
  };

  const fetchServices = () => {
    setLoading(true);
    supabase
      .from('services')
      .select('*')
      .order('is_custom', { ascending: true })
      .order('name')
      .then(({ data }) => {
        setServices((data as Service[]) || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (open) fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const { globalServices, customServices } = useMemo(() => {
    const filtered = services.filter((s) => {
      if (existingServiceIds.includes(s.id)) return false;
      if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.description_ko?.toLowerCase().includes(q)
        );
      }
      return true;
    });
    return {
      globalServices: filtered.filter((s) => !s.is_custom),
      customServices: filtered.filter((s) => s.is_custom),
    };
  }, [services, existingServiceIds, selectedCategory, search]);

  const handleAdd = async (serviceId: string) => {
    setAdding(serviceId);
    try {
      await onAdd(serviceId);
    } finally {
      setAdding(null);
    }
  };

  const handleCustomServiceCreated = () => {
    fetchServices();
  };

  const handleDeleteCustomService = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('커스텀 서비스가 삭제되었습니다');
      fetchServices();
    } catch {
      toast.error('삭제에 실패했습니다');
    }
  };

  const isEmpty = globalServices.length === 0 && customServices.length === 0;

  const categories: (ServiceCategory | 'all')[] = ['all', 'auth', 'social_login', 'database', 'deploy', 'email', 'payment', 'storage', 'monitoring', 'ai', 'other'];

  const renderServiceRow = (service: Service) => (
    <div
      key={service.id}
      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-sm font-medium shrink-0">
          {service.is_custom && service.icon_emoji ? (
            <span className="text-lg">{service.icon_emoji}</span>
          ) : (
            <ServiceTooltip
              serviceName={service.name}
              category={categoryLabels[service.category as ServiceCategory]}
              description={getServiceDescription(service.slug)}
            >
              <ServiceIcon serviceId={service.slug} iconEmoji={service.icon_emoji} size={20} />
            </ServiceTooltip>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{service.name}</p>
            {service.is_custom && (
              <Badge variant="outline" className="text-[10px] px-1 py-0">커스텀</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {service.description_ko || service.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 ml-2">
        <Badge variant="secondary" className="text-xs shrink-0">
          {categoryLabels[service.category as ServiceCategory]}
        </Badge>
        {service.is_custom && (
          <>
            {matchMap.get(service.id) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15"
                      disabled={migrateMutation.isPending}
                      onClick={() => {
                        const m = matchMap.get(service.id)!;
                        handleMigrateService(service.id, m.id, m.name);
                      }}
                    >
                      <ArrowRightLeft className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>&quot;{matchMap.get(service.id)!.name}&quot; 글로벌 서비스로 전환</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <CreateCustomServiceDialog
              mode="edit"
              service={service}
              onSuccess={() => fetchServices()}
              trigger={
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Pencil className="h-3 w-3" />
                </Button>
              }
            />
            <ConfirmDialog
              title="커스텀 서비스 삭제"
              description={`"${service.name}" 서비스를 삭제하시겠습니까? 이 서비스가 연결된 프로젝트에서도 제거됩니다.`}
              onConfirm={() => handleDeleteCustomService(service.id)}
              trigger={
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              }
            />
          </>
        )}
        <Button
          size="sm"
          onClick={() => handleAdd(service.id)}
          disabled={adding === service.id}
        >
          {adding === service.id ? '추가 중...' : '추가'}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          서비스 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>서비스 카탈로그</DialogTitle>
          <DialogDescription>프로젝트에 추가할 서비스를 선택하세요</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="서비스 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? '전체' : categoryLabels[cat]}
              </Badge>
            ))}
          </div>

          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded bg-muted animate-pulse" />
                ))}
              </div>
            ) : isEmpty ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-muted-foreground">
                  {search ? `"${search}"에 대한 검색 결과가 없습니다` : '추가할 수 있는 서비스가 없습니다'}
                </p>
                <CreateCustomServiceDialog
                  mode="create"
                  onSuccess={handleCustomServiceCreated}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" /> 직접 서비스 추가
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="space-y-2">
                {globalServices.map(renderServiceRow)}

                {customServices.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 py-2 px-1">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground shrink-0">👤 내 서비스</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    {customServices.map(renderServiceRow)}
                  </>
                )}

                {/* 항상 "직접 추가" 버튼 표시 (결과가 있을 때도) */}
                <div className="pt-2 text-center">
                  <CreateCustomServiceDialog
                    mode="create"
                    onSuccess={handleCustomServiceCreated}
                    trigger={
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Plus className="mr-1 h-3 w-3" /> 직접 서비스 추가
                      </Button>
                    }
                  />
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
