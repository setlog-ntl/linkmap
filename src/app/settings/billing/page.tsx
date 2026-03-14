'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/lib/queries/subscription';
import type { SubscriptionPlan } from '@/types';

const planLabel: Record<SubscriptionPlan, string> = {
  free: 'Free',
  pro: 'Pro',
  team: 'Team',
};

const statusLabel: Record<string, string> = {
  active: '활성',
  trialing: '무료 체험 중',
  past_due: '결제 미납',
  canceled: '해지됨',
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  active: 'default',
  trialing: 'default',
  past_due: 'destructive',
  canceled: 'secondary',
};

export default function BillingPage() {
  const { data: subscription, isLoading } = useSubscription();
  const router = useRouter();
  const [portalLoading, setPortalLoading] = useState(false);

  const plan: SubscriptionPlan = subscription?.plan ?? 'free';
  const status = subscription?.status ?? 'active';
  const isPaid = plan !== 'free';

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/polar/portal', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.error || '결제 관리 페이지 이동에 실패했습니다');
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error('네트워크 오류가 발생했습니다');
    } finally {
      setPortalLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">구독 및 결제</h1>
        <p className="text-muted-foreground mt-1">현재 플랜과 결제 수단을 관리합니다.</p>
      </div>

      {status === 'past_due' && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          결제가 실패했습니다. 결제 수단을 업데이트하지 않으면 서비스 이용이 제한될 수 있습니다.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            현재 플랜
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{planLabel[plan]}</span>
            <Badge variant={statusVariant[status] ?? 'secondary'}>
              {statusLabel[status] ?? status}
            </Badge>
          </div>

          {status === 'trialing' && subscription?.current_period_end && (
            <div className="rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
              <p className="font-medium text-primary">
                무료 체험 기간:{' '}
                {(() => {
                  const endDate = new Date(subscription.current_period_end);
                  const remaining = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                  return `${remaining}일 남음`;
                })()}
              </p>
              <p className="text-muted-foreground mt-1">
                {new Date(subscription.current_period_end).toLocaleDateString('ko-KR', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
                부터 자동 결제됩니다. 언제든 취소할 수 있습니다.
              </p>
            </div>
          )}

          {isPaid && status !== 'trialing' && subscription?.current_period_end && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                다음 갱신일:{' '}
                {new Date(subscription.current_period_end).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {isPaid ? (
              <Button onClick={handlePortal} disabled={portalLoading}>
                {portalLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                결제 수단 및 구독 관리
              </Button>
            ) : (
              <Button onClick={() => router.push('/pricing')}>
                업그레이드
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
