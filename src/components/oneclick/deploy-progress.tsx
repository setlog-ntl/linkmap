'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  AlertTriangle,
  GitFork,
  Settings2,
  Globe,
  Lightbulb,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocaleStore } from '@/stores/locale-store';
import { t, type Locale } from '@/lib/i18n';
import type { DeployStatus } from '@/lib/queries/oneclick';

interface DeployProgressProps {
  status: DeployStatus;
}

const TIPS_KEYS = ['tip1', 'tip2', 'tip3', 'tip4', 'tip5'] as const;
const TIP_INTERVAL_MS = 8000;

function useElapsedTime(isActive: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!isActive) return;
    startRef.current = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [isActive]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function useRotatingTip(isActive: boolean) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % TIPS_KEYS.length);
    }, TIP_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isActive]);

  return TIPS_KEYS[index];
}

function getStepDescription(stepName: string, locale: Locale): string | null {
  if (stepName.includes('repo') || stepName.includes('fork')) {
    return t(locale, 'deployProgress.repoDesc');
  }
  if (stepName.includes('pages') || stepName.includes('config') || stepName.includes('setting')) {
    return t(locale, 'deployProgress.pagesDesc');
  }
  if (stepName.includes('live') || stepName.includes('deploy') || stepName.includes('build')) {
    return t(locale, 'deployProgress.liveDesc');
  }
  return null;
}

function getStepIcon(stepName: string) {
  if (stepName.includes('repo') || stepName.includes('fork')) return GitFork;
  if (stepName.includes('pages') || stepName.includes('config') || stepName.includes('setting')) return Settings2;
  if (stepName.includes('live') || stepName.includes('deploy') || stepName.includes('build')) return Globe;
  return Circle;
}

export function DeployProgress({ status }: DeployProgressProps) {
  const { locale } = useLocaleStore();
  const prefersReducedMotion = useReducedMotion();

  const isCompleted = status.deploy_status === 'ready';
  const isError = status.deploy_status === 'error';
  const isTimeout = status.deploy_status === 'timeout';
  const isRunning = !isCompleted && !isError && !isTimeout;

  const completedSteps = status.steps.filter((s) => s.status === 'completed').length;
  const progressPercent = (completedSteps / status.steps.length) * 100;

  const elapsedTime = useElapsedTime(isRunning);
  const currentTipKey = useRotatingTip(isRunning);

  const activeStep = status.steps.find((s) => s.status === 'in_progress');
  const activeStepDesc = activeStep ? getStepDescription(activeStep.name, locale) : null;

  return (
    <Card>
      <CardContent className="py-6">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {isCompleted
                ? t(locale, 'deployProgress.completed')
                : isError
                  ? t(locale, 'deployProgress.failed')
                  : isTimeout
                    ? t(locale, 'deployProgress.timeout')
                    : t(locale, 'deployProgress.preparingSite')}
            </h3>
            <div className="flex items-center gap-2">
              {isRunning && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {elapsedTime} {t(locale, 'deployProgress.elapsed')}
                </span>
              )}
              {isRunning && (
                <Badge variant="secondary" className="gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {t(locale, 'deployProgress.inProgress')}
                </Badge>
              )}
              {isError && (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  {t(locale, 'deployProgress.failed')}
                </Badge>
              )}
              {isTimeout && (
                <Badge variant="outline" className="gap-1 border-amber-500 text-amber-600">
                  <AlertTriangle className="h-3 w-3" />
                  {t(locale, 'deployProgress.timeout')}
                </Badge>
              )}
            </div>
          </div>

          {/* Progress bar with pulse animation when running */}
          <div className={isRunning ? 'animate-pulse' : ''}>
            <Progress
              value={progressPercent}
              className={`h-2 ${isError ? '[&>div]:bg-red-500' : ''}`}
            />
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {status.steps.map((step) => {
              const IconComponent = getStepIcon(step.name);
              const isActive = step.status === 'in_progress';
              const isStepCompleted = step.status === 'completed';
              const desc = isActive ? getStepDescription(step.name, locale) : null;

              return (
                <motion.div
                  key={step.name}
                  layout={!prefersReducedMotion}
                  className="space-y-1"
                >
                  <div className="flex items-center gap-3">
                    {/* Step icon */}
                    {isStepCompleted ? (
                      <motion.div
                        initial={prefersReducedMotion ? false : { scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      </motion.div>
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
                    ) : step.status === 'error' ? (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    ) : (
                      <IconComponent className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />
                    )}

                    <span className={`text-sm ${
                      isStepCompleted ? 'text-foreground' :
                      isActive ? 'text-primary font-medium' :
                      step.status === 'error' ? 'text-red-500 font-medium' :
                      'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                  </div>

                  {/* Active step description */}
                  <AnimatePresence>
                    {desc && (
                      <motion.p
                        initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-muted-foreground ml-8 leading-relaxed"
                      >
                        {desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Rotating tips */}
          {isRunning && (
            <div className="border-t pt-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" />
                {t(locale, 'deployProgress.tipPrefix')}
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentTipKey}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-muted-foreground"
                >
                  {t(locale, `deployProgress.${currentTipKey}`)}
                </motion.p>
              </AnimatePresence>

              {/* Don't close warning */}
              <p className="text-xs text-muted-foreground/60 pt-1">
                {t(locale, 'deployProgress.doNotClose')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
