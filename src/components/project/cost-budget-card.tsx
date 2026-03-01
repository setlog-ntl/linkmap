'use client';

import { useState } from 'react';
import { DollarSign, Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useUpdateProject } from '@/lib/queries/projects';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/keys';
import { cn } from '@/lib/utils';

interface CostBudgetCardProps {
  projectId: string;
  monthlyBudget: number | null;
  budgetCurrency: 'USD' | 'KRW';
  totalMonthlyCost: number;
  budgetUsagePercent: number | null;
  isOverBudget: boolean;
}

function formatCurrency(amount: number, currency: 'USD' | 'KRW'): string {
  if (currency === 'KRW') {
    return `₩${amount.toLocaleString('ko-KR')}`;
  }
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CostBudgetCard({
  projectId,
  monthlyBudget,
  budgetCurrency,
  totalMonthlyCost,
  budgetUsagePercent,
  isOverBudget,
}: CostBudgetCardProps) {
  const [editing, setEditing] = useState(false);
  const [budgetValue, setBudgetValue] = useState(monthlyBudget?.toString() ?? '');
  const [currency, setCurrency] = useState(budgetCurrency);
  const updateProject = useUpdateProject();
  const queryClient = useQueryClient();

  const handleSave = () => {
    const parsed = budgetValue.trim() ? parseFloat(budgetValue) : null;
    if (budgetValue.trim() && (isNaN(parsed!) || parsed! < 0)) {
      toast.error('올바른 금액을 입력하세요');
      return;
    }
    updateProject.mutate(
      {
        id: projectId,
        monthly_budget: parsed,
        budget_currency: currency,
      } as Parameters<typeof updateProject.mutate>[0],
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.costs.byProject(projectId) });
          queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all(projectId) });
          setEditing(false);
          toast.success('예산이 저장되었습니다');
        },
        onError: () => toast.error('예산 저장에 실패했습니다'),
      }
    );
  };

  const handleCancel = () => {
    setBudgetValue(monthlyBudget?.toString() ?? '');
    setCurrency(budgetCurrency);
    setEditing(false);
  };

  const progressValue = budgetUsagePercent != null ? Math.min(budgetUsagePercent, 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <DollarSign className="h-4 w-4" />
            월간 예산
          </CardTitle>
          {!editing && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setEditing(true)}>
              <Pencil className="mr-1 h-3 w-3" />
              {monthlyBudget != null ? '수정' : '설정'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {editing ? (
          <div className="flex items-center gap-2">
            <Select value={currency} onValueChange={(v) => setCurrency(v as 'USD' | 'KRW')}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="KRW">KRW (₩)</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              step={currency === 'KRW' ? '1000' : '0.01'}
              min="0"
              placeholder={currency === 'KRW' ? '100000' : '100.00'}
              value={budgetValue}
              onChange={(e) => setBudgetValue(e.target.value)}
              className="h-8 text-sm flex-1"
              autoFocus
            />
            <Button size="sm" className="h-8" onClick={handleSave} disabled={updateProject.isPending}>
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8" onClick={handleCancel}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : monthlyBudget != null ? (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono">
                {formatCurrency(totalMonthlyCost, budgetCurrency)}
              </span>
              <span className="text-sm text-muted-foreground">
                / {formatCurrency(monthlyBudget, budgetCurrency)}
              </span>
            </div>
            <Progress
              value={progressValue}
              className={cn(
                'h-2.5',
                isOverBudget && '[&>[data-slot=progress-indicator]]:bg-red-500'
              )}
            />
            <p className="text-xs text-muted-foreground">
              {budgetUsagePercent != null ? (
                isOverBudget ? (
                  <span className="text-red-500 font-medium">
                    예산 초과 ({budgetUsagePercent}%)
                  </span>
                ) : (
                  `예산의 ${budgetUsagePercent}% 사용 중`
                )
              ) : null}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            월간 예산을 설정하면 비용 초과 여부를 확인할 수 있습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export { formatCurrency };
