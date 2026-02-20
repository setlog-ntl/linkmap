'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import {
  Cloud,
  Terminal,
  Key,
  GitBranch,
  CheckCircle2,
  Github,
  ExternalLink,
  Check,
  ArrowRight,
  ArrowLeft,
  Copy,
  type LucideIcon,
} from 'lucide-react';

interface GuideStepTip {
  textKey: string;
  isCode?: boolean;
}

interface GuideStep {
  id: number;
  navLabelKey: keyof typeof import('@/lib/i18n/locales/ko.json') extends `cloudflareGuide.${infer K}` ? K : never;
  titleKey: string;
  subtitleKey: string;
  icon: LucideIcon;
  actionLabelKey?: string;
  actionUrl?: string;
  estimatedMinutes: number;
  tips: GuideStepTip[];
  /** Step별 추가 콘텐츠 렌더 (카드 본문) */
  renderContent?: (locale: 'ko' | 'en') => React.ReactNode;
}

const STEP_KEYS = [
  'navOverview',
  'navAccount',
  'navBuildDeploy',
  'navEnvVars',
  'navGitBuild',
  'navGitActions',
  'navSummary',
] as const;

function createSteps(): GuideStep[] {
  return [
    {
      id: 0,
      navLabelKey: 'navOverview',
      titleKey: 'cloudflareGuide.overviewTitle',
      subtitleKey: 'cloudflareGuide.overviewDesc',
      icon: Cloud,
      estimatedMinutes: 1,
      tips: [
        { textKey: 'cloudflareGuide.overviewItem1' },
        { textKey: 'cloudflareGuide.overviewItem2' },
        { textKey: 'cloudflareGuide.overviewItem3' },
      ],
    },
    {
      id: 1,
      navLabelKey: 'navAccount',
      titleKey: 'cloudflareGuide.accountTitle',
      subtitleKey: 'cloudflareGuide.accountStep1',
      icon: Cloud,
      actionLabelKey: 'cloudflareGuide.accountAction',
      actionUrl: 'https://dash.cloudflare.com',
      estimatedMinutes: 2,
      tips: [
        { textKey: 'cloudflareGuide.accountStep2' },
        { textKey: 'cloudflareGuide.accountStep3' },
        { textKey: 'cloudflareGuide.accountStep3a' },
        { textKey: 'cloudflareGuide.accountStep3b' },
        { textKey: 'cloudflareGuide.accountWarning' },
      ],
    },
    {
      id: 2,
      navLabelKey: 'navBuildDeploy',
      titleKey: 'cloudflareGuide.buildTitle',
      subtitleKey: 'cloudflareGuide.buildDesc',
      icon: Terminal,
      estimatedMinutes: 3,
      tips: [
        { textKey: 'cloudflareGuide.buildLogin' },
        { textKey: 'cloudflareGuide.buildCmd', isCode: true },
        { textKey: 'cloudflareGuide.deployCmd', isCode: true },
        { textKey: 'cloudflareGuide.buildNote' },
      ],
    },
    {
      id: 3,
      navLabelKey: 'navEnvVars',
      titleKey: 'cloudflareGuide.envTitle',
      subtitleKey: 'cloudflareGuide.envDesc',
      icon: Key,
      estimatedMinutes: 5,
      tips: [
        { textKey: 'cloudflareGuide.envSource' },
        { textKey: 'cloudflareGuide.envCodeBlock', isCode: true },
      ],
      renderContent: (locale) => (
        <pre className="rounded-lg bg-muted p-4 text-sm overflow-x-auto mt-2">
          <code>{`npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put ENCRYPTION_KEY`}</code>
        </pre>
      ),
    },
    {
      id: 4,
      navLabelKey: 'navGitBuild',
      titleKey: 'cloudflareGuide.gitTitle',
      subtitleKey: 'cloudflareGuide.gitDesc',
      icon: GitBranch,
      estimatedMinutes: 2,
      tips: [
        { textKey: 'cloudflareGuide.gitWhy' },
        { textKey: 'cloudflareGuide.gitCommitFiles' },
      ],
      renderContent: (locale) => (
        <div className="rounded-lg border bg-muted/30 p-4 overflow-x-auto mt-2 text-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">{t(locale, 'cloudflareGuide.gitBuildLabel')}</th>
                <th className="text-left py-2 font-mono text-red-600 dark:text-red-400">npm run build</th>
                <th className="text-left py-2 font-mono text-green-600 dark:text-green-400 font-bold">npm run build:cf</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 text-muted-foreground">{t(locale, 'cloudflareGuide.gitDeployLabel')}</td>
                <td className="py-2 font-mono" colSpan={2}>npx wrangler deploy</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-muted-foreground text-xs">package.json, wrangler.jsonc, open-next.config.ts</p>
        </div>
      ),
    },
    {
      id: 5,
      navLabelKey: 'navGitActions',
      titleKey: 'cloudflareGuide.gitActionsTitle',
      subtitleKey: 'cloudflareGuide.gitActionsDesc',
      icon: Github,
      estimatedMinutes: 3,
      tips: [
        { textKey: 'cloudflareGuide.gitActionsStep1' },
        { textKey: 'cloudflareGuide.gitActionsStep2' },
        { textKey: 'cloudflareGuide.gitActionsStep3' },
        { textKey: 'cloudflareGuide.gitActionsWorkflow' },
      ],
      renderContent: (locale) => (
        <div className="rounded-lg border bg-muted/30 p-4 overflow-x-auto mt-2 text-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">{t(locale, 'cloudflareGuide.gitActionsSecretName')}</th>
                <th className="text-left py-2 font-medium">{t(locale, 'cloudflareGuide.gitActionsSecretDesc')}</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b"><td className="py-2 font-mono">CLOUDFLARE_API_TOKEN</td><td className="py-2">{t(locale, 'cloudflareGuide.gitActionsSecretToken')}</td></tr>
              <tr className="border-b"><td className="py-2 font-mono">CLOUDFLARE_ACCOUNT_ID</td><td className="py-2">{t(locale, 'cloudflareGuide.gitActionsSecretAccount')}</td></tr>
              <tr className="border-b"><td className="py-2 font-mono">NEXT_PUBLIC_SUPABASE_URL</td><td className="py-2">{t(locale, 'cloudflareGuide.gitActionsSecretSupabaseUrl')}</td></tr>
              <tr><td className="py-2 font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</td><td className="py-2">{t(locale, 'cloudflareGuide.gitActionsSecretSupabaseKey')}</td></tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: 6,
      navLabelKey: 'navSummary',
      titleKey: 'cloudflareGuide.summaryTitle',
      subtitleKey: 'cloudflareGuide.summary1',
      icon: CheckCircle2,
      estimatedMinutes: 0,
      tips: [
        { textKey: 'cloudflareGuide.summary2' },
        { textKey: 'cloudflareGuide.summary3' },
        { textKey: 'cloudflareGuide.summary4' },
        { textKey: 'cloudflareGuide.summary5' },
        { textKey: 'cloudflareGuide.summaryDoc' },
      ],
      renderContent: (locale) => (
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground mt-2">
          <li>{t(locale, 'cloudflareGuide.summary1')}</li>
          <li>{t(locale, 'cloudflareGuide.summary2')}</li>
          <li>{t(locale, 'cloudflareGuide.summary3')}</li>
          <li>{t(locale, 'cloudflareGuide.summary4')}</li>
          <li>{t(locale, 'cloudflareGuide.summary5')}</li>
        </ol>
      ),
    },
  ];
}

const STEPS = createSteps();
const STORAGE_KEY = 'linkmap-cloudflare-guide-progress';

export function CloudflareGuide() {
  const { locale } = useLocaleStore();
  const prefersReducedMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCompletedSteps(new Set(JSON.parse(saved)));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (completedSteps.size > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps]));
    }
  }, [completedSteps]);

  const toggleComplete = useCallback((stepId: number, checked: boolean | 'indeterminate') => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (checked === true) next.add(stepId);
      else next.delete(stepId);
      return next;
    });
  }, []);

  const goNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(text);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch {
      // ignore
    }
  };

  const progressPercent = (completedSteps.size / STEPS.length) * 100;
  const allDone = completedSteps.size === STEPS.length;
  const step = STEPS[currentStep];
  const StepIcon = step.icon;
  const navLabelKey = `cloudflareGuide.${step.navLabelKey}` as const;

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] as const },
      };

  return (
    <div className="py-12 md:py-20">
      {/* Hero - GitHub 가이드와 동일 */}
      <ScrollReveal>
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            {t(locale, 'cloudflareGuide.badge')}
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t(locale, 'cloudflareGuide.heroTitle')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t(locale, 'cloudflareGuide.heroDesc')}
          </p>

          <div className="max-w-md mx-auto mt-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">{t(locale, 'cloudflareGuide.progressLabel')}</span>
              <span className="font-medium">
                {completedSteps.size} / {STEPS.length} {t(locale, 'cloudflareGuide.completedCount')}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      </ScrollReveal>

      {/* Stepper - GitHub 가이드와 동일 */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-4xl mx-auto mb-10">
          <div className="hidden md:flex items-center justify-between relative">
            <div className="absolute top-5 left-[5%] right-[5%] h-[2px]">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <line x1="0" y1="1" x2="100%" y2="1" stroke="currentColor" className="text-border" strokeWidth="2" strokeDasharray="8 6" />
              </svg>
            </div>
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                className="relative z-10 flex flex-col items-center gap-2 group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    completedSteps.has(i)
                      ? 'bg-green-500 text-white'
                      : i === currentStep
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110'
                        : 'bg-muted border-2 border-border text-muted-foreground group-hover:border-primary/50'
                  }`}
                >
                  {completedSteps.has(i) ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-xs whitespace-nowrap max-w-[4rem] text-center truncate ${i === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {t(locale, `cloudflareGuide.${s.navLabelKey}`)}
                </span>
              </button>
            ))}
          </div>

          <div className="flex md:hidden items-center justify-between px-1 overflow-x-auto gap-1">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    completedSteps.has(i)
                      ? 'bg-green-500 text-white'
                      : i === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted border border-border text-muted-foreground'
                  }`}
                >
                  {completedSteps.has(i) ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <span className={`text-[10px] max-w-[3rem] truncate ${i === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {t(locale, `cloudflareGuide.${s.navLabelKey}`)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Step Content Card - GitHub 가이드와 동일 구조 */}
      <div className="max-w-2xl mx-auto px-4 md:px-0">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} {...motionProps}>
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                    <StepIcon className="h-6 w-6 text-primary" style={step.icon === Cloud ? { color: '#f38020' } : undefined} />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-1">
                      {t(locale, 'cloudflareGuide.stepLabel', { n: step.id + 1 })} {t(locale, step.titleKey)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{t(locale, step.subtitleKey)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {step.renderContent?.(locale)}

                {step.actionUrl && step.actionLabelKey && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild size="lg">
                      <a href={step.actionUrl} target="_blank" rel="noopener noreferrer">
                        {t(locale, step.actionLabelKey)}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )}

                {step.estimatedMinutes >= 0 && (
                  <div className="flex items-center gap-3 py-3 border-t">
                    <Checkbox
                      id={`step-${step.id}`}
                      checked={completedSteps.has(step.id)}
                      onCheckedChange={(checked) => toggleComplete(step.id, checked)}
                    />
                    <label htmlFor={`step-${step.id}`} className="text-sm font-medium cursor-pointer select-none">
                      {t(locale, 'cloudflareGuide.stepDoneLabel')}
                    </label>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {step.estimatedMinutes === 0 ? '—' : `${t(locale, 'cloudflareGuide.minutesEst')} ${step.estimatedMinutes}`}
                    </Badge>
                  </div>
                )}

                <Accordion type="single" collapsible>
                  <AccordionItem value="tips" className="border-none">
                    <AccordionTrigger className="text-sm py-2 hover:no-underline">
                      {t(locale, 'cloudflareGuide.needHelp')}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2.5 pt-1">
                        {step.tips.map((tip, i) => (
                          <li key={i}>
                            {tip.isCode ? (
                              <div className="flex items-center gap-2">
                                <code className="font-mono text-xs bg-muted px-3 py-1.5 rounded block flex-1">
                                  {t(locale, tip.textKey)}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 shrink-0"
                                  onClick={() => copyToClipboard(t(locale, tip.textKey))}
                                >
                                  {copiedCommand === t(locale, tip.textKey) ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-2 text-sm text-muted-foreground">
                                <span className="text-primary shrink-0">•</span>
                                <span>{t(locale, tip.textKey)}</span>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={goBack} disabled={currentStep === 0}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            {t(locale, 'cloudflareGuide.prev')}
          </Button>
          <Button onClick={goNext} disabled={currentStep === STEPS.length - 1}>
            {t(locale, 'cloudflareGuide.next')}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>

        {allDone && (
          <motion.div
            className="mt-10"
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
              <CardContent className="text-center py-10">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">{t(locale, 'cloudflareGuide.congratsTitle')}</h3>
                <p className="text-muted-foreground mb-6">{t(locale, 'cloudflareGuide.congratsDesc')}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild>
                    <Link href="/">
                      {t(locale, 'cloudflareGuide.ctaLinkmap')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/guides/github">{t(locale, 'cloudflareGuide.ctaOtherGuide')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
