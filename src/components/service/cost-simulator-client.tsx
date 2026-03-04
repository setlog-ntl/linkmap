'use client';

import { useState, useMemo, useCallback } from 'react';
import { Plus, X, Calculator, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ServiceIcon } from '@/components/ui/service-icon';
import { useExchangeRate } from '@/lib/queries/costs';
import { cn } from '@/lib/utils';
import type { Service, ServiceCostTier } from '@/types';

interface CostSimulatorClientProps {
  services: Service[];
  costTiers: ServiceCostTier[];
}

interface SelectedService {
  serviceId: string;
  tierId: string | null;
}

/** "$25" → 25, "$0" → 0, null → 0 */
function parsePrice(price: string | null): number {
  if (!price) return 0;
  const cleaned = price.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CostSimulatorClient({ services, costTiers }: CostSimulatorClientProps) {
  const [selected, setSelected] = useState<SelectedService[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: exchangeRate } = useExchangeRate();
  const usdToKrw = exchangeRate?.rate ?? null;

  // Build tier lookup by service_id
  const tiersByService = useMemo(() => {
    const map = new Map<string, ServiceCostTier[]>();
    for (const tier of costTiers) {
      const arr = map.get(tier.service_id) ?? [];
      arr.push(tier);
      map.set(tier.service_id, arr);
    }
    return map;
  }, [costTiers]);

  // 요금제 있는 서비스만
  const servicesWithTiers = useMemo(
    () => services.filter((s) => tiersByService.has(s.id)),
    [services, tiersByService],
  );

  const selectedIds = useMemo(() => new Set(selected.map((s) => s.serviceId)), [selected]);

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return servicesWithTiers;
    return servicesWithTiers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description_ko ?? '').toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q),
    );
  }, [servicesWithTiers, searchQuery]);

  const addService = useCallback((serviceId: string) => {
    const tiers = tiersByService.get(serviceId);
    // 첫 번째 티어(보통 무료) 자동 선택
    const defaultTierId = tiers?.[0]?.id ?? null;
    setSelected((prev) => [...prev, { serviceId, tierId: defaultTierId }]);
  }, [tiersByService]);

  const removeService = useCallback((serviceId: string) => {
    setSelected((prev) => prev.filter((s) => s.serviceId !== serviceId));
  }, []);

  const changeTier = useCallback((serviceId: string, tierId: string) => {
    setSelected((prev) =>
      prev.map((s) => (s.serviceId === serviceId ? { ...s, tierId } : s)),
    );
  }, []);

  // 합산 계산
  const totalMonthly = useMemo(() => {
    let total = 0;
    for (const sel of selected) {
      if (!sel.tierId) continue;
      const tier = costTiers.find((t) => t.id === sel.tierId);
      if (tier) total += parsePrice(tier.price_monthly);
    }
    return total;
  }, [selected, costTiers]);

  const totalYearly = useMemo(() => {
    let total = 0;
    for (const sel of selected) {
      if (!sel.tierId) continue;
      const tier = costTiers.find((t) => t.id === sel.tierId);
      if (tier) {
        const yearly = parsePrice(tier.price_yearly);
        total += yearly > 0 ? yearly : parsePrice(tier.price_monthly) * 12;
      }
    }
    return total;
  }, [selected, costTiers]);

  const freeCount = useMemo(() => {
    return selected.filter((sel) => {
      if (!sel.tierId) return false;
      const tier = costTiers.find((t) => t.id === sel.tierId);
      return tier && parsePrice(tier.price_monthly) === 0;
    }).length;
  }, [selected, costTiers]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 왼쪽: 서비스 선택 */}
      <div className="lg:col-span-5 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4" />
              서비스 추가
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="서비스 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-sm"
            />
            <div className="max-h-[400px] overflow-y-auto space-y-1 pr-1">
              {filteredServices.map((svc) => {
                const isAdded = selectedIds.has(svc.id);
                const tiers = tiersByService.get(svc.id) ?? [];
                const hasFree = tiers.some((t) => parsePrice(t.price_monthly) === 0);

                return (
                  <button
                    key={svc.id}
                    type="button"
                    disabled={isAdded}
                    onClick={() => addService(svc.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors',
                      isAdded
                        ? 'opacity-50 cursor-not-allowed border-border bg-muted/30'
                        : 'border-border hover:border-primary/30 hover:bg-muted/30 cursor-pointer',
                    )}
                  >
                    <ServiceIcon serviceId={svc.slug} size={20} />
                    <span className="flex-1 min-w-0">
                      <span className="text-sm font-medium truncate block">{svc.name}</span>
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {hasFree && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                        >
                          무료 플랜
                        </Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground">{tiers.length}개 플랜</span>
                    </div>
                    {isAdded && (
                      <Badge variant="outline" className="text-[10px]">추가됨</Badge>
                    )}
                  </button>
                );
              })}
              {filteredServices.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  검색 결과가 없습니다
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 오른쪽: 선택된 서비스 + 합산 */}
      <div className="lg:col-span-7 space-y-4">
        {/* 합산 결과 카드 */}
        <Card className={cn(
          'border-2',
          totalMonthly === 0 && selected.length > 0
            ? 'border-emerald-300 dark:border-emerald-700'
            : selected.length > 0
              ? 'border-brand-blue/30'
              : 'border-border',
        )}>
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'rounded-xl p-2.5',
                  totalMonthly === 0 && selected.length > 0
                    ? 'bg-emerald-100 dark:bg-emerald-900/40'
                    : 'bg-brand-blue/10',
                )}>
                  <Calculator className={cn(
                    'h-5 w-5',
                    totalMonthly === 0 && selected.length > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-brand-blue',
                  )} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {selected.length}개 서비스 합산
                    {freeCount > 0 && (
                      <span className="ml-1 text-emerald-600 dark:text-emerald-400">
                        ({freeCount}개 무료)
                      </span>
                    )}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold font-mono">
                      {formatUsd(totalMonthly)}
                      <span className="text-sm text-muted-foreground font-normal">/월</span>
                    </p>
                    {usdToKrw && totalMonthly > 0 && (
                      <span className="text-sm text-muted-foreground font-mono">
                        ≈ ₩{Math.round(totalMonthly * usdToKrw).toLocaleString('ko-KR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">연간</p>
                <p className="text-lg font-semibold font-mono">
                  {formatUsd(totalYearly)}
                  <span className="text-xs text-muted-foreground font-normal">/년</span>
                </p>
              </div>
            </div>

            {totalMonthly === 0 && selected.length > 0 && (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                <Zap className="h-4 w-4" />
                모든 서비스 무료 조합!
              </div>
            )}
          </CardContent>
        </Card>

        {/* 선택된 서비스 목록 + 티어 선택 */}
        {selected.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <div className="mx-auto rounded-2xl bg-muted/50 p-4 w-fit mb-4">
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                왼쪽에서 서비스를 선택하면 비용이 자동 계산됩니다
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {selected.map((sel) => {
              const svc = services.find((s) => s.id === sel.serviceId);
              const tiers = tiersByService.get(sel.serviceId) ?? [];
              const activeTier = tiers.find((t) => t.id === sel.tierId);
              const tierPrice = activeTier ? parsePrice(activeTier.price_monthly) : 0;

              if (!svc) return null;

              return (
                <Card key={sel.serviceId}>
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center gap-3 mb-2">
                      <ServiceIcon serviceId={svc.slug} size={20} />
                      <span className="text-sm font-medium flex-1">{svc.name}</span>
                      <span className="text-sm font-mono font-semibold">
                        {formatUsd(tierPrice)}/월
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeService(sel.serviceId)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tiers.map((tier) => {
                        const price = parsePrice(tier.price_monthly);
                        const isFree = price === 0;
                        const isActive = sel.tierId === tier.id;

                        return (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => changeTier(sel.serviceId, tier.id)}
                            className={cn(
                              'rounded-md border px-2.5 py-1 text-xs transition-colors',
                              isActive
                                ? isFree
                                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-medium'
                                  : 'border-primary bg-primary/5 text-primary font-medium'
                                : 'border-border hover:border-primary/30 text-muted-foreground hover:text-foreground',
                            )}
                          >
                            {tier.tier_name_ko ?? tier.tier_name}
                            <span className="ml-1 font-mono">
                              {isFree ? '$0' : tier.price_monthly}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
