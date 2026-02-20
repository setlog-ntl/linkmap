'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  XCircle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Copy,
  Check,
  Github,
  ExternalLink,
  CheckCircle2,
  Rocket,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocaleStore } from '@/stores/locale-store';
import { t, type Locale } from '@/lib/i18n';
import type { DeployStatus, HomepageTemplate } from '@/lib/queries/oneclick';
import { getErrorDetails } from '@/lib/deploy-error-map';
import { DeployProgress } from './deploy-progress';
import { DeploySuccess } from './deploy-success';

interface DeployStepProps {
  status: DeployStatus | null;
  isLoading: boolean;
  error: Error | null;
  projectId: string | null;
  template?: HomepageTemplate | null;
  onRetry?: () => void;
}

export function DeployStep({ status, isLoading, error, projectId, template, onRetry }: DeployStepProps) {
  const { locale } = useLocaleStore();
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyError = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Initial API error (mutation failure, no status yet)
  if (error && !status) {
    const details = getErrorDetails(error.message, null, locale);
    return (
      <ErrorCard
        details={details}
        errorMessage={error.message}
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails(!showDetails)}
        copied={copied}
        onCopy={handleCopyError}
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

  const isCompleted = status.deploy_status === 'ready';
  const isError = status.deploy_status === 'error';
  const isTimeout = status.deploy_status === 'timeout';
  const errorMessage = status.deploy_error || error?.message || '';
  const errorDetails = isError ? getErrorDetails(errorMessage, status, locale) : null;

  return (
    <div className="space-y-6">
      {/* Progress card */}
      <DeployProgress status={status} template={template} />

      {/* Error details */}
      {isError && errorDetails && (
        <ErrorCard
          details={errorDetails}
          errorMessage={errorMessage}
          showDetails={showDetails}
          onToggleDetails={() => setShowDetails(!showDetails)}
          copied={copied}
          onCopy={handleCopyError}
          onRetry={onRetry}
          repoUrl={status.forked_repo_url}
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
                {locale === 'ko'
                  ? '배포 상태 확인 시간이 초과되었습니다'
                  : 'Deployment status check timed out'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {locale === 'ko'
                  ? '배포가 아직 진행 중일 수 있습니다. 잠시 후 사이트를 확인해보세요.'
                  : 'Deployment may still be in progress. Check your site in a moment.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {status.pages_url && (
                <Button asChild>
                  <a href={status.pages_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {locale === 'ko' ? '사이트 확인' : 'Check Site'}
                  </a>
                </Button>
              )}
              {status.forked_repo_url && (
                <Button variant="outline" asChild>
                  <a href={`${status.forked_repo_url}/settings/pages`} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    {locale === 'ko' ? 'Pages 설정 확인' : 'Check Pages Settings'}
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success */}
      {isCompleted && <DeploySuccess status={status} projectId={projectId} template={template} />}
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
  details: { cause: string; solution: string };
  errorMessage: string;
  showDetails: boolean;
  onToggleDetails: () => void;
  copied: boolean;
  onCopy: (text: string) => void;
  onRetry?: () => void;
  repoUrl?: string | null;
  locale: string;
}

function ErrorCard({
  details,
  errorMessage,
  showDetails,
  onToggleDetails,
  copied,
  onCopy,
  onRetry,
  repoUrl,
  locale,
}: ErrorCardProps) {
  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardContent className="py-6 space-y-4">
        <div className="text-center space-y-2">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-semibold text-red-500">
            {locale === 'ko' ? '배포 오류' : 'Deployment Error'}
          </h3>
        </div>

        <div className="space-y-3 bg-red-50 dark:bg-red-950/20 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                {locale === 'ko' ? '원인' : 'Cause'}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400/80">{details.cause}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                {locale === 'ko' ? '해결 방법' : 'Solution'}
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400/80">{details.solution}</p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div>
            <button
              onClick={onToggleDetails}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {locale === 'ko' ? '기술적 상세 정보' : 'Technical Details'}
            </button>
            {showDetails && (
              <div className="mt-2 bg-muted rounded-md p-3 relative">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-all font-mono pr-8">
                  {errorMessage}
                </pre>
                <button
                  onClick={() => onCopy(errorMessage)}
                  className="absolute top-2 right-2 p-1 rounded hover:bg-background transition-colors"
                  title={locale === 'ko' ? '복사' : 'Copy'}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          {onRetry && (
            <Button onClick={onRetry} size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              {locale === 'ko' ? '다시 시도' : 'Try Again'}
            </Button>
          )}
          {repoUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                {locale === 'ko' ? 'GitHub에서 확인' : 'Check on GitHub'}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
