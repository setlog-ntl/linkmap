'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface CostTierSelectorProps {
  serviceId: string;
  currentTierId: string | null;
  currentCustomMonthly: number | null;
  currentCostNotes: string | null;
  currentBillingCycle: string;
  isPending: boolean;
  budgetCurrency: 'USD' | 'KRW';
  onSave: (data: {
    cost_tier_id?: string | null;
    custom_cost_monthly?: number | null;
    custom_cost_yearly?: number | null;
    cost_notes?: string | null;
    billing_cycle?: 'monthly' | 'yearly' | 'one_time' | 'usage_based';
  }) => void;
  onCancel: () => void;
}

interface CostTier {
  id: string;
  tier_name: string;
  tier_name_ko: string | null;
  price_monthly: string | null;
  price_yearly: string | null;
  features: unknown[];
  order_index: number;
}

const supabase = createClient();

export function CostTierSelector({
  serviceId,
  currentTierId,
  currentCustomMonthly,
  currentCostNotes,
  currentBillingCycle,
  isPending,
  budgetCurrency,
  onSave,
  onCancel,
}: CostTierSelectorProps) {
  const [mode, setMode] = useState<'tier' | 'custom'>(
    currentCustomMonthly != null ? 'custom' : 'tier'
  );
  const [selectedTierId, setSelectedTierId] = useState<string | null>(currentTierId);
  const [customMonthly, setCustomMonthly] = useState(currentCustomMonthly?.toString() ?? '');
  const [costNotes, setCostNotes] = useState(currentCostNotes ?? '');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | 'one_time' | 'usage_based'>(
    (currentBillingCycle as 'monthly' | 'yearly' | 'one_time' | 'usage_based') || 'monthly'
  );

  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ['cost-tiers', serviceId],
    queryFn: async (): Promise<CostTier[]> => {
      const { data, error } = await supabase
        .from('service_cost_tiers')
        .select('id, tier_name, tier_name_ko, price_monthly, price_yearly, features, order_index')
        .eq('service_id', serviceId)
        .order('order_index');
      if (error) throw error;
      return (data ?? []) as CostTier[];
    },
    enabled: !!serviceId,
  });

  // reset when tiers load and current mode is tier but no tier selected
  useEffect(() => {
    if (tiers.length === 0 && !currentCustomMonthly) {
      setMode('custom');
    }
  }, [tiers.length, currentCustomMonthly]);

  const handleSave = () => {
    if (mode === 'tier') {
      onSave({
        cost_tier_id: selectedTierId,
        custom_cost_monthly: null,
        custom_cost_yearly: null,
        cost_notes: costNotes.trim() || null,
        billing_cycle: billingCycle,
      });
    } else {
      const parsed = customMonthly.trim() ? parseFloat(customMonthly) : null;
      if (customMonthly.trim() && (isNaN(parsed!) || parsed! < 0)) return;
      onSave({
        cost_tier_id: null,
        custom_cost_monthly: parsed,
        cost_notes: costNotes.trim() || null,
        billing_cycle: billingCycle,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      {tiers.length > 0 && (
        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg w-fit">
          <button
            type="button"
            className={cn(
              'px-3 py-1 text-xs rounded-md transition-colors',
              mode === 'tier' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setMode('tier')}
          >
            요금제 선택
          </button>
          <button
            type="button"
            className={cn(
              'px-3 py-1 text-xs rounded-md transition-colors',
              mode === 'custom' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setMode('custom')}
          >
            직접 입력
          </button>
        </div>
      )}

      {mode === 'tier' && tiers.length > 0 ? (
        <div className="space-y-1.5">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              type="button"
              className={cn(
                'w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors',
                selectedTierId === tier.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              )}
              onClick={() => setSelectedTierId(tier.id)}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {tier.tier_name_ko ?? tier.tier_name}
                </p>
                {tier.price_monthly && (
                  <p className="text-xs text-muted-foreground font-mono">
                    {tier.price_monthly}/월
                    {tier.price_yearly && ` · ${tier.price_yearly}/연`}
                  </p>
                )}
              </div>
              <div
                className={cn(
                  'h-4 w-4 rounded-full border-2 shrink-0 ml-2',
                  selectedTierId === tier.id
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/30'
                )}
              >
                {selectedTierId === tier.id && (
                  <div className="h-full w-full rounded-full bg-background scale-[0.35]" />
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">월간 비용 ({budgetCurrency === 'KRW' ? '₩' : '$'})</Label>
            <Input
              type="number"
              step={budgetCurrency === 'KRW' ? '1000' : '0.01'}
              min="0"
              placeholder={budgetCurrency === 'KRW' ? '25000' : '25.00'}
              value={customMonthly}
              onChange={(e) => setCustomMonthly(e.target.value)}
              className="mt-1 h-8 text-sm font-mono"
            />
          </div>
        </div>
      )}

      {/* Billing cycle */}
      <div>
        <Label className="text-xs">결제 주기</Label>
        <Select value={billingCycle} onValueChange={(v) => setBillingCycle(v as 'monthly' | 'yearly' | 'one_time' | 'usage_based')}>
          <SelectTrigger className="mt-1 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">월간</SelectItem>
            <SelectItem value="yearly">연간</SelectItem>
            <SelectItem value="one_time">일회성</SelectItem>
            <SelectItem value="usage_based">사용량 기반</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div>
        <Label className="text-xs">메모 (선택)</Label>
        <Textarea
          value={costNotes}
          onChange={(e) => setCostNotes(e.target.value)}
          placeholder="예: 팀 5인 기준, 추가 스토리지 포함"
          className="mt-1 text-sm resize-none h-16"
          maxLength={500}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button size="sm" className="h-8 text-xs" onClick={handleSave} disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
}
