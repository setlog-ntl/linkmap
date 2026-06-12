'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Loader2,
  RefreshCw,
  AlertTriangle,
  Github,
  ExternalLink,
  Globe,
  LayoutDashboard,
  GitFork,
  Crown,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useLocaleStore } from '@/stores/locale-store';
import { t, type Locale } from '@/lib/i18n';
import type { DeployStatus, HomepageTemplate } from '@/lib/queries/oneclick';
import { getErrorDetails } from '@/lib/deploy-error-map';
import { BuildingIllustration } from './building-illustration';
import { DeployProgress } from './deploy-progress';

interface DeployStepProps {
  status: DeployStatus | null;
  isLoading: boolean;
  error: Error | null;
  template?: HomepageTemplate | null;
  onRetry?: () => void;
}

export function DeployStep({ status, isLoading, error, template, onRetry }: DeployStepProps) {
  const { locale } = useLocaleStore();

  // Initial API error (mutation failure, no status yet)
  if (error && !status) {
    return (
      <ErrorCard
        onRetry={onRetry}
        locale={locale}
        errorMessage={error.message}
        errorCode={(error as Error & { code?: string }).code}
      />
    );
  }

  // Loading (deploying, no status yet)
  if (isLoading && !status) {
    return <InitialLoadingCard locale={locale} template={template} />;
  }

  if (!status) return null;

  const isError = status.deploy_status === 'error';
  const isTimeout = status.deploy_status === 'timeout';

  return (
    <div className="space-y-6">
      {/* Progress card */}
      <DeployProgress status={status} template={template} />

      {/* Error details */}
      {isError && (
        <ErrorCard
          onRetry={onRetry}
          locale={locale}
          errorMessage={status.deploy_error}
          deployStatus={status}
        />
      )}

      {/* Timeout */}
      {isTimeout && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="py-6 space-y-4">
            <div className="text-center space-y-2">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-semibold">
                {t(locale, 'deployStep.timeoutTitle')}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {t(locale, 'deployStep.timeoutDesc')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {status.pages_url && (
                <Button asChild>
                  <a href={status.pages_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t(locale, 'deployStep.checkSite')}
                  </a>
                </Button>
              )}
              {status.forked_repo_url && (
                <Button variant="outline" asChild>
                  <a href={`${status.forked_repo_url}/settings/pages`} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    {t(locale, 'deployStep.checkPages')}
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}

// ── Internal Initial Loading Card ──

const PREPARING_TIPS_KEYS = ['tip1', 'tip2', 'tip3'] as const;

function InitialLoadingCard({ locale, template }: { locale: Locale; template?: HomepageTemplate | null }) {
  const prefersReducedMotion = useReducedMotion();
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % PREPARING_TIPS_KEYS.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card>
      <CardContent className="py-12 text-center space-y-4">
        <BuildingIllustration slug={template?.slug ?? ''} />
        {template && (
          <p className="text-sm text-muted-foreground">
            {locale === 'ko' ? template.name_ko : template.name}
          </p>
        )}
        <div className="space-y-1">
          <p className="font-medium">
            {t(locale, 'deployProgress.preparing')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t(locale, 'deployProgress.preparingDesc')}
          </p>
        </div>
        <div className="h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-muted-foreground/60"
            >
              {t(locale, `deployProgress.${PREPARING_TIPS_KEYS[tipIndex]}`)}
            </motion.p>
          </AnimatePresence>
        </div>
        {/* GitHub Actions 배포 진행 시각화 */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <GitFork className="h-3.5 w-3.5" />
            <div className="flex gap-[3px]">
              <span className="h-[3px] w-2 rounded-full bg-muted-foreground/40 animate-code-blink" style={{ animationDelay: '0ms' }} />
              <span className="h-[3px] w-3 rounded-full bg-muted-foreground/40 animate-code-blink" style={{ animationDelay: '300ms' }} />
              <span className="h-[3px] w-1.5 rounded-full bg-muted-foreground/40 animate-code-blink" style={{ animationDelay: '600ms' }} />
            </div>
          </div>
          <span className="relative">
            <Github className="h-5 w-5 text-muted-foreground animate-github-wiggle" />
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          </span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <div className="flex gap-[3px]">
              <span className="h-[3px] w-1.5 rounded-full bg-muted-foreground/40 animate-code-blink" style={{ animationDelay: '900ms' }} />
              <span className="h-[3px] w-3 rounded-full bg-muted-foreground/40 animate-code-blink" style={{ animationDelay: '1200ms' }} />
            </div>
            <Globe className="h-3.5 w-3.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Internal Error Card ──

interface ErrorCardProps {
  onRetry?: () => void;
  locale: Locale;
  errorMessage?: string | null;
  errorCode?: string | null;
  deployStatus?: DeployStatus | null;
}

function ErrorCard({
  onRetry,
  locale,
  errorMessage,
  errorCode,
  deployStatus,
}: ErrorCardProps) {
  const isQuotaExceeded = errorCode === 'QUOTA_EXCEEDED' || errorMessage?.includes('한도를 초과');

  // 쿼터 초과 전용 UI
  if (isQuotaExceeded) {
    return (
      <Card className="border-brand-blue/30 dark:border-brand-blue/20 bg-brand-blue/5 dark:bg-brand-blue/5">
        <CardContent className="py-8 space-y-5">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center">
              <Crown className="h-8 w-8 text-brand-blue" />
            </div>
            <h3 className="text-lg font-semibold">
              무료 배포 한도에 도달했습니다
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {errorMessage || '사이트 배포 한도를 초과했습니다'}
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Pro 플랜으로 업그레이드하면 무제한 배포가 가능합니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-1">
            <Button size="sm" asChild>
              <Link prefetch={false} href="/pricing">
                <Crown className="mr-2 h-4 w-4" />
                Pro 플랜 보기
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link prefetch={false} href="/sites">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                내 사이트 관리
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const details = errorMessage
    ? getErrorDetails(errorMessage, deployStatus ?? null, locale, errorCode ?? undefined)
    : null;

  return (
    <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
      <CardContent className="py-8 space-y-5">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold">
            배포에 실패했습니다
          </h3>

          {details ? (
            <div className="text-left mx-auto max-w-md space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">{t(locale, 'deployStep.errorCause')}: </span>
                {details.cause}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">{t(locale, 'deployStep.errorSolution')}: </span>
                {details.solution}
              </p>
              {details.failedStep && (
                <p className="text-xs text-muted-foreground/70">
                  {t(locale, 'deployStep.failedAt')}: {details.failedStep}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {t(locale, 'deployStep.maintenanceDesc')}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 py-2">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            입력한 내용은 그대로 유지돼요 — 다시 시도하면 이어서 진행됩니다
          </span>
        </div>

        <div className="flex flex-wrap gap-3 justify-center pt-1">
          {onRetry && (
            <Button onClick={onRetry} size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t(locale, 'deployStep.tryAgain')}
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link prefetch={false} href="/sites">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {t(locale, 'deployStep.manageSites')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
