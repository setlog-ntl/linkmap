'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, ExternalLink, Calendar, Loader2, AlertTriangle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useSubscription } from '@/lib/queries/subscription';
import { queryKeys } from '@/lib/queries/keys';
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
  const queryClient = useQueryClient();
  const [portalLoading, setPortalLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

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

  async function handleCancel() {
    setCancelLoading(true);
    try {
      const res = await fetch('/api/polar/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || '구독 취소에 실패했습니다');
        return;
      }
      toast.success('구독이 취소되었습니다. 현재 빌링 기간까지 서비스를 이용할 수 있습니다.');
      await queryClient.invalidateQueries({ queryKey: queryKeys.subscription.current });
      setCancelDialogOpen(false);
      setCancelReason('');
    } catch {
      toast.error('네트워크 오류가 발생했습니다');
    } finally {
      setCancelLoading(false);
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

      {isPaid && status !== 'canceled' && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              구독 취소
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              구독을 취소하더라도 현재 빌링 기간 종료일
              {subscription?.current_period_end && (
                <>
                  (
                  {new Date(subscription.current_period_end).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  )
                </>
              )}
              까지 {planLabel[plan]} 기능을 계속 이용할 수 있습니다.
            </p>
            <Button
              variant="destructive"
              onClick={() => setCancelDialogOpen(true)}
            >
              구독 취소
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>정말 구독을 취소하시겠습니까?</DialogTitle>
            <DialogDescription>
              현재 빌링 기간
              {subscription?.current_period_end && (
                <>
                  (
                  {new Date(subscription.current_period_end).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  )
                </>
              )}
              까지는 {planLabel[plan]} 기능을 계속 이용할 수 있습니다. 이후 Free 플랜으로 전환됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label htmlFor="cancel-reason" className="text-sm font-medium">
              취소 사유 (선택사항)
            </label>
            <Textarea
              id="cancel-reason"
              placeholder="취소하시는 이유를 알려주시면 서비스 개선에 참고하겠습니다."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
          </div>
          {/* 모바일: 세로 스택 / sm 이상: 우측 정렬 가로 배치 */}
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelLoading}
            >
              구독 유지
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelLoading}
            >
              {cancelLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              구독 취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isPaid && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              환불 안내
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              결제일로부터 7일 이내에 환불을 요청할 수 있습니다.
            </p>
            {(() => {
              const periodStart = subscription?.current_period_start;
              if (!periodStart) {
                return (
                  <p className="text-sm text-muted-foreground">
                    결제 정보를 확인할 수 없습니다. 환불이 필요하시면 고객센터에 문의해주세요.
                  </p>
                );
              }
              const startDate = new Date(periodStart);
              const daysSincePayment = Math.floor(
                (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
              );
              const isWithinRefundPeriod = daysSincePayment <= 7;

              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      결제일:{' '}
                      {startDate.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {isWithinRefundPeriod
                        ? ` (${7 - daysSincePayment}일 남음)`
                        : ' (환불 가능 기간 만료)'}
                    </span>
                  </div>
                  {isWithinRefundPeriod ? (
                    <div className="rounded-md border border-muted bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      <p>
                        현재 셀프 환불 기능은 준비 중입니다. 환불이 필요하시면{' '}
                        <strong>support@linkmap.run</strong>으로 문의해주세요.
                      </p>
                      <p className="mt-1">
                        향후 주문 이력 기능이 추가되면 셀프 환불이 가능해질 예정입니다.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-destructive">
                      환불 가능 기간(결제일로부터 7일)이 지났습니다.
                    </p>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
