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
  Rocket,
  LayoutDashboard,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useLocaleStore } from '@/stores/locale-store';
import { t, type Locale } from '@/lib/i18n';
import type { DeployStatus, HomepageTemplate } from '@/lib/queries/oneclick';
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
        <motion.div
          animate={prefersReducedMotion ? {} : { scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Rocket className="h-10 w-10 mx-auto text-primary" />
        </motion.div>
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
        <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
      </CardContent>
    </Card>
  );
}

// ── Internal Error Card ──

interface ErrorCardProps {
  onRetry?: () => void;
  locale: Locale;
}

function ErrorCard({
  onRetry,
  locale,
}: ErrorCardProps) {
  return (
    <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
      <CardContent className="py-8 space-y-5">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold">
            {t(locale, 'deployStep.maintenanceTitle')}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {t(locale, 'deployStep.maintenanceDesc')}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 py-2">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            {t(locale, 'deployStep.maintenanceNotice')}
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
            <Link href="/sites">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {t(locale, 'deployStep.manageSites')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
