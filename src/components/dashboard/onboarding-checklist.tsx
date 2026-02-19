'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { DashboardMetrics } from '@/types';

interface OnboardingChecklistProps {
  projectId: string;
  metrics: DashboardMetrics;
}

const DISMISSED_KEY = (id: string) => `linkmap-onboarding-dismissed-${id}`;
const MANUAL_KEY = (id: string) => `linkmap-onboarding-manual-${id}`;

export function OnboardingChecklist({ projectId, metrics }: OnboardingChecklistProps) {
  const { locale } = useLocaleStore();
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [manualComplete, setManualComplete] = useState<Set<string>>(new Set());

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY(projectId)) === 'true');
    const stored = localStorage.getItem(MANUAL_KEY(projectId));
    if (stored) {
      try { setManualComplete(new Set(JSON.parse(stored))); } catch { /* ignore */ }
    }
  }, [projectId]);

  const steps = useMemo(() => [
    {
      id: 'add-service',
      labelKey: 'project.onboarding.step1',
      descKey: 'project.onboarding.step1Desc',
      href: `/project/${projectId}/integrations`,
      done: metrics.totalServices > 0,
    },
    {
      id: 'set-env',
      labelKey: 'project.onboarding.step2',
      descKey: 'project.onboarding.step2Desc',
      href: `/project/${projectId}/env`,
      done: metrics.totalEnvVars > 0,
    },
    {
      id: 'connect',
      labelKey: 'project.onboarding.step3',
      descKey: 'project.onboarding.step3Desc',
      href: `/project/${projectId}/integrations?tab=connections`,
      done: metrics.connectedServices > 0,
    },
    {
      id: 'view-map',
      labelKey: 'project.onboarding.step4',
      descKey: 'project.onboarding.step4Desc',
      href: `/project/${projectId}/service-map`,
      done: manualComplete.has('view-map'),
    },
  ], [projectId, metrics, manualComplete]);

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  if (dismissed || allDone) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY(projectId), 'true');
    setDismissed(true);
  };

  const toggleManual = (stepId: string) => {
    setManualComplete((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      localStorage.setItem(MANUAL_KEY(projectId), JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            {t(locale, 'project.onboarding.title')}
            <span className="text-xs font-normal text-muted-foreground">
              {completedCount}/{steps.length}
            </span>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={handleDismiss}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <Progress value={progressPercent} className="h-1.5 mt-2" />
      </CardHeader>
      {!collapsed && (
        <CardContent className="pt-0 space-y-2">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-3 py-1.5">
              <button
                onClick={() => !step.done || step.id === 'view-map' ? toggleManual(step.id) : undefined}
                className="mt-0.5 shrink-0"
              >
                {step.done ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                {step.done ? (
                  <p className="text-sm text-muted-foreground line-through">{t(locale, step.labelKey)}</p>
                ) : (
                  <Link href={step.href} className="text-sm font-medium hover:underline">
                    {t(locale, step.labelKey)}
                  </Link>
                )}
                {!step.done && (
                  <p className="text-xs text-muted-foreground">{t(locale, step.descKey)}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
