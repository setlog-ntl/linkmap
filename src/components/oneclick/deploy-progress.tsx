'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import type { DeployStatus } from '@/lib/queries/oneclick';

interface DeployProgressProps {
  status: DeployStatus;
}

export function DeployProgress({ status }: DeployProgressProps) {
  const { locale } = useLocaleStore();

  const isCompleted = status.deploy_status === 'ready';
  const isError = status.deploy_status === 'error';
  const isTimeout = status.deploy_status === 'timeout';
  const completedSteps = status.steps.filter((s) => s.status === 'completed').length;
  const progressPercent = (completedSteps / status.steps.length) * 100;

  return (
    <Card>
      <CardContent className="py-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {isCompleted
                ? (locale === 'ko' ? '배포 완료!' : 'Deployment Complete!')
                : isError
                  ? (locale === 'ko' ? '배포 실패' : 'Deployment Failed')
                  : isTimeout
                    ? (locale === 'ko' ? '응답 대기 시간 초과' : 'Polling Timeout')
                    : (locale === 'ko' ? '사이트 준비 중...' : 'Preparing your site...')}
            </h3>
            {!isCompleted && !isError && !isTimeout && (
              <Badge variant="secondary" className="gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                {locale === 'ko' ? '진행 중' : 'In Progress'}
              </Badge>
            )}
            {isError && (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" />
                {locale === 'ko' ? '실패' : 'Failed'}
              </Badge>
            )}
            {isTimeout && (
              <Badge variant="outline" className="gap-1 border-amber-500 text-amber-600">
                <AlertTriangle className="h-3 w-3" />
                {locale === 'ko' ? '시간 초과' : 'Timeout'}
              </Badge>
            )}
          </div>

          <Progress
            value={progressPercent}
            className={`h-2 ${isError ? '[&>div]:bg-red-500' : ''}`}
          />

          <div className="space-y-3">
            {status.steps.map((step) => (
              <div key={step.name} className="flex items-center gap-3">
                <StepIcon status={step.status} />
                <span className={`text-sm ${
                  step.status === 'completed' ? 'text-foreground' :
                  step.status === 'in_progress' ? 'text-primary font-medium' :
                  step.status === 'error' ? 'text-red-500 font-medium' :
                  'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StepIcon({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />;
    case 'in_progress':
      return <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />;
    default:
      return <Circle className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />;
  }
}
