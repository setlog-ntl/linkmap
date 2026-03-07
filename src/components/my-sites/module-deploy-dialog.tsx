'use client';

import { useEffect, useState, useRef, useReducer, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Loader2,
  XCircle,
  FileCode2,
  GitCommitHorizontal,
  Settings2,
  Globe,
  Lightbulb,
  Clock,
  ExternalLink,
  AlertTriangle,
  Github,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { t, type Locale } from '@/lib/i18n';

// ── Types ──

export type DeployDialogMode = 'apply-only' | 'apply-and-deploy';

type StepId = 'generate' | 'commit' | 'build' | 'verify';
type StepStatus = 'pending' | 'in_progress' | 'completed' | 'error';
type OverallStatus = 'idle' | 'running' | 'completed' | 'error';

interface StepState {
  id: StepId;
  status: StepStatus;
}

export interface DiffStats {
  fileCount: number;
  added: number;
  removed: number;
}

export interface DeployDialogState {
  open: boolean;
  mode: DeployDialogMode;
  overallStatus: OverallStatus;
  steps: StepState[];
  errorMessage: string | null;
  diffStats: DiffStats | null;
}

// ── Actions ──

type DeployDialogAction =
  | { type: 'START'; mode: DeployDialogMode }
  | { type: 'ADVANCE_STEP'; stepId: StepId }
  | { type: 'COMPLETE'; diffStats: DiffStats }
  | { type: 'ERROR'; message: string }
  | { type: 'CLOSE' };

// ── Step definitions per mode ──

const APPLY_ONLY_STEPS: StepId[] = ['generate', 'commit'];
const DEPLOY_STEPS: StepId[] = ['generate', 'commit', 'build', 'verify'];

function getStepsForMode(mode: DeployDialogMode): StepState[] {
  const ids = mode === 'apply-only' ? APPLY_ONLY_STEPS : DEPLOY_STEPS;
  return ids.map((id, i) => ({
    id,
    status: i === 0 ? 'in_progress' : 'pending',
  }));
}

// ── Reducer ──

export const initialDeployDialogState: DeployDialogState = {
  open: false,
  mode: 'apply-only',
  overallStatus: 'idle',
  steps: [],
  errorMessage: null,
  diffStats: null,
};

export function deployDialogReducer(
  state: DeployDialogState,
  action: DeployDialogAction
): DeployDialogState {
  switch (action.type) {
    case 'START':
      return {
        open: true,
        mode: action.mode,
        overallStatus: 'running',
        steps: getStepsForMode(action.mode),
        errorMessage: null,
        diffStats: null,
      };

    case 'ADVANCE_STEP': {
      const steps = state.steps.map((s) => ({ ...s }));
      const idx = steps.findIndex((s) => s.id === action.stepId);
      if (idx !== -1) {
        steps[idx].status = 'completed';
        if (idx + 1 < steps.length) {
          steps[idx + 1].status = 'in_progress';
        }
      }
      return { ...state, steps };
    }

    case 'COMPLETE':
      return {
        ...state,
        overallStatus: 'completed',
        steps: state.steps.map((s) => ({ ...s, status: 'completed' as StepStatus })),
        diffStats: action.diffStats,
      };

    case 'ERROR': {
      const steps = state.steps.map((s) => {
        if (s.status === 'in_progress') return { ...s, status: 'error' as StepStatus };
        return s;
      });
      return {
        ...state,
        overallStatus: 'error',
        steps,
        errorMessage: action.message,
      };
    }

    case 'CLOSE':
      return { ...state, open: false };

    default:
      return state;
  }
}

// ── Hooks ──

const TIP_KEYS = ['tip1', 'tip2', 'tip3', 'tip4', 'tip5'] as const;
const TIP_INTERVAL_MS = 8000;

function useElapsedTime(isActive: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      setElapsed(0);
      return;
    }
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
      setIndex((prev) => (prev + 1) % TIP_KEYS.length);
    }, TIP_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isActive]);

  return TIP_KEYS[index];
}

function useAutoClose(
  isCompleted: boolean,
  onClose: () => void,
  delaySeconds: number = 5
) {
  const [countdown, setCountdown] = useState(delaySeconds);

  useEffect(() => {
    if (!isCompleted) {
      setCountdown(delaySeconds);
      return;
    }
    setCountdown(delaySeconds);
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isCompleted, onClose, delaySeconds]);

  return countdown;
}

// ── Step icon/label helpers ──

const STEP_ICONS: Record<StepId, typeof FileCode2> = {
  generate: FileCode2,
  commit: GitCommitHorizontal,
  build: Settings2,
  verify: Globe,
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getStepLabel(stepId: StepId, locale: Locale): string {
  return t(locale, `moduleDeployDialog.step${capitalize(stepId)}`);
}

function getStepDesc(stepId: StepId, locale: Locale): string {
  return t(locale, `moduleDeployDialog.step${capitalize(stepId)}Desc`);
}

// ── Component ──

interface ModuleDeployDialogProps {
  state: DeployDialogState;
  dispatch: React.Dispatch<DeployDialogAction>;
  locale: Locale;
  liveUrl?: string | null;
  onRetry?: () => void;
  buildSubLabel?: string;
  actionsUrl?: string | null;
}

export function ModuleDeployDialog({
  state,
  dispatch,
  locale,
  liveUrl,
  onRetry,
  buildSubLabel,
  actionsUrl,
}: ModuleDeployDialogProps) {
  const prefersReducedMotion = useReducedMotion();
  const isRunning = state.overallStatus === 'running';
  const isCompleted = state.overallStatus === 'completed';
  const isError = state.overallStatus === 'error';

  const elapsedTime = useElapsedTime(isRunning);
  const currentTipKey = useRotatingTip(isRunning);

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLOSE' });
  }, [dispatch]);

  const countdown = useAutoClose(isCompleted, handleClose);

  // Progress calculation
  const completedSteps = state.steps.filter((s) => s.status === 'completed').length;
  const totalSteps = state.steps.length;
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  // Title
  const title = isCompleted
    ? t(locale, 'moduleDeployDialog.titleCompleted')
    : isError
      ? t(locale, 'moduleDeployDialog.titleError')
      : state.mode === 'apply-only'
        ? t(locale, 'moduleDeployDialog.titleApplyOnly')
        : t(locale, 'moduleDeployDialog.titleDeploy');

  // Diff stats bar
  const diffBar = state.diffStats
    ? (() => {
      const { added, removed } = state.diffStats;
      const total = added + removed;
      if (total === 0) return null;
      const addedPct = Math.round((added / total) * 100);
      return { added, removed, addedPct, removedPct: 100 - addedPct };
    })()
    : null;

  return (
    <Dialog
      open={state.open}
      onOpenChange={(open) => {
        if (!open && !isRunning) {
          dispatch({ type: 'CLOSE' });
        }
      }}
    >
      <DialogContent
        showCloseButton={!isRunning}
        onInteractOutside={(e) => {
          if (isRunning) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isRunning) e.preventDefault();
        }}
        className="sm:max-w-md"
      >
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {isRunning && (
                <span className="relative">
                  <Github className="h-4 w-4 text-primary animate-github-wiggle" />
                  <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                </span>
              )}
              {isCompleted && (
                <motion.div
                  initial={prefersReducedMotion ? false : { scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </motion.div>
              )}
              {isError && <XCircle className="h-5 w-5 text-red-500" />}
              {title}
            </DialogTitle>
            {isRunning && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {elapsedTime}
              </span>
            )}
          </div>
          <DialogDescription className="sr-only">
            {title}
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        {!isCompleted && (
          <div className={isRunning ? 'animate-pulse' : ''}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <Progress
              value={progressPercent}
              className={`h-2 ${isError ? '[&>div]:bg-red-500' : ''}`}
            />
          </div>
        )}

        {/* Completed: Diff stats */}
        {isCompleted && state.diffStats && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <p className="text-sm text-foreground font-medium text-center">
              {state.mode === 'apply-only'
                ? t(locale, 'moduleDeployDialog.completedApply')
                : t(locale, 'moduleDeployDialog.completedDeploy')}
            </p>
            {state.mode === 'apply-and-deploy' && (
              <p className="text-xs text-muted-foreground text-center">
                GitHub Actions 빌드 특성상 실제 사이트 반영까지 1~3분 정도 걸릴 수 있어요
              </p>
            )}
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="text-muted-foreground">
                {state.diffStats.fileCount}{t(locale, 'moduleDeployDialog.filesChanged')}
              </span>
              <span className="text-green-500 font-mono text-xs">
                +{state.diffStats.added}
              </span>
              <span className="text-red-500 font-mono text-xs">
                -{state.diffStats.removed}
              </span>
            </div>
            {diffBar && (
              <div className="h-2 w-full rounded-full overflow-hidden flex bg-muted">
                <div
                  className="bg-green-500 transition-all"
                  style={{ width: `${diffBar.addedPct}%` }}
                />
                <div
                  className="bg-red-500 transition-all"
                  style={{ width: `${diffBar.removedPct}%` }}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Steps */}
        {!isCompleted && (
          <div className="space-y-2.5">
            {state.steps.map((step) => {
              const IconComponent = STEP_ICONS[step.id];
              const isActive = step.status === 'in_progress';
              const isStepCompleted = step.status === 'completed';
              const isStepError = step.status === 'error';

              return (
                <motion.div
                  key={step.id}
                  layout={!prefersReducedMotion}
                  className="space-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    {isStepCompleted ? (
                      <motion.div
                        initial={prefersReducedMotion ? false : { scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      </motion.div>
                    ) : isActive && (step.id === 'commit' || step.id === 'build') ? (
                      <span className="relative flex-shrink-0">
                        <Github className="h-5 w-5 text-primary animate-github-wiggle" />
                        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background bg-amber-500 animate-pulse" />
                      </span>
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
                    ) : isStepError ? (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    ) : (
                      <IconComponent className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />
                    )}

                    <span
                      className={`text-sm ${
                        isStepCompleted
                          ? 'text-foreground'
                          : isActive
                            ? 'text-primary font-medium'
                            : isStepError
                              ? 'text-red-500 font-medium'
                              : 'text-muted-foreground'
                      }`}
                    >
                      {getStepLabel(step.id, locale)}
                    </span>
                  </div>

                  {/* Step description (active or just completed) */}
                  <AnimatePresence>
                    {(isActive || isStepCompleted) && (
                      <motion.p
                        initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-muted-foreground ml-8 leading-relaxed"
                      >
                        {getStepDesc(step.id, locale)}
                        {step.id === 'build' && isActive && buildSubLabel && (
                          <span className="block text-primary/70 mt-0.5">{buildSubLabel}</span>
                        )}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Error message */}
        {isError && state.errorMessage && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <span>{state.errorMessage}</span>
              {actionsUrl && (
                <a
                  href={actionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 mt-1 text-xs underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  GitHub Actions 로그 확인
                </a>
              )}
            </div>
          </div>
        )}

        {/* Rotating tips (only during build/verify — long wait steps) */}
        {isRunning && state.steps.some((s) => s.status === 'in_progress' && (s.id === 'build' || s.id === 'verify')) && (
          <div className="border-t pt-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5" />
              {t(locale, 'moduleDeployDialog.tipPrefix')}
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
                {t(locale, `moduleDeployDialog.${currentTipKey}`)}
              </motion.p>
            </AnimatePresence>
          </div>
        )}

        {/* Do not close warning */}
        {isRunning && (
          <p className="text-xs text-muted-foreground/60 flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" />
            {t(locale, 'moduleDeployDialog.doNotClose')}
          </p>
        )}

        {/* Footer */}
        {(isCompleted || isError) && (
          <DialogFooter className="gap-2 sm:gap-2">
            {isError && onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                {t(locale, 'moduleDeployDialog.retry')}
              </Button>
            )}
            {isCompleted && liveUrl && state.mode === 'apply-and-deploy' && (
              <Button variant="outline" size="sm" asChild>
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  {t(locale, 'moduleDeployDialog.visitSite')}
                </a>
              </Button>
            )}
            <Button
              size="sm"
              variant={isError ? 'outline' : 'default'}
              onClick={handleClose}
            >
              {t(locale, 'moduleDeployDialog.close')}
              {isCompleted && (
                <span className="ml-1 text-xs opacity-70">
                  ({countdown})
                </span>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
