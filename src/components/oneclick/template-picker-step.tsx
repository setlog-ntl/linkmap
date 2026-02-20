'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CheckCircle2,
  Loader2,
  Rocket,
  Github,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { TemplateCard } from './template-card';
import { RECOMMENDED_SLUGS } from '@/lib/constants/template-categories';
import type { HomepageTemplate } from '@/lib/queries/oneclick';

interface TemplatePickerStepProps {
  templates: HomepageTemplate[];
  isLoading: boolean;
  isDeploying?: boolean;
  onNext: (data: { templateId: string; siteName: string }) => void;
  githubUsername?: string;
  isGitHubLoading?: boolean;
  isAuthenticated?: boolean;
  defaultSiteName?: string;
  defaultTemplate?: string | null;
}

const SITE_NAME_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

export function TemplatePickerStep({
  templates,
  isLoading,
  isDeploying = false,
  onNext,
  githubUsername,
  isGitHubLoading = false,
  isAuthenticated = true,
  defaultSiteName = '',
  defaultTemplate = null,
}: TemplatePickerStepProps) {
  const { locale } = useLocaleStore();
  const prefersReducedMotion = useReducedMotion();

  // Auto-select recommended template if none selected
  const recommendedTemplateId = templates.find(
    (t) => RECOMMENDED_SLUGS.has(t.slug)
  )?.id ?? null;

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    defaultTemplate ?? recommendedTemplateId
  );
  const [siteName, setSiteName] = useState(defaultSiteName);
  const [siteNameError, setSiteNameError] = useState<string | null>(null);

  // Re-apply recommended template when templates load
  if (!selectedTemplate && recommendedTemplateId && templates.length > 0) {
    setSelectedTemplate(recommendedTemplateId);
  }

  const validateSiteName = (name: string) => {
    if (name.length < 2) {
      return locale === 'ko' ? '최소 2자 이상이어야 합니다' : 'Must be at least 2 characters';
    }
    if (name.length > 100) {
      return locale === 'ko' ? '100자 이하여야 합니다' : 'Must be 100 characters or less';
    }
    if (!SITE_NAME_REGEX.test(name)) {
      return locale === 'ko'
        ? '소문자, 숫자, 하이픈만 사용 가능합니다 (예: my-site-1)'
        : 'Only lowercase letters, numbers, and hyphens allowed (e.g., my-site-1)';
    }
    return null;
  };

  const handleSiteNameChange = (value: string) => {
    const lowered = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSiteName(lowered);
    if (lowered.length >= 2) {
      setSiteNameError(validateSiteName(lowered));
    } else {
      setSiteNameError(null);
    }
  };

  const canProceed = selectedTemplate && siteName.length >= 2 && !siteNameError;

  const handleNext = () => {
    if (!canProceed) return;
    const error = validateSiteName(siteName);
    if (error) {
      setSiteNameError(error);
      return;
    }
    onNext({ templateId: selectedTemplate!, siteName });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  const urlUsername = githubUsername || 'username';

  return (
    <div className="space-y-6">
      {/* GitHub connection status — inline indicator */}
      {isAuthenticated && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm ${
          isGitHubLoading
            ? 'bg-muted/50 border-border'
            : githubUsername
              ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
              : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
        }`}>
          {isGitHubLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">
                {locale === 'ko' ? 'GitHub 연결 확인 중...' : 'Checking GitHub connection...'}
              </span>
            </>
          ) : githubUsername ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <Github className="h-4 w-4 text-green-700 dark:text-green-300 flex-shrink-0" />
              <span className="font-medium text-green-700 dark:text-green-300">
                @{githubUsername}
              </span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {locale === 'ko' ? '연결됨' : 'Connected'}
              </Badge>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span className="text-amber-700 dark:text-amber-300">
                {locale === 'ko'
                  ? 'GitHub 미연결 — 배포 시 자동으로 연결됩니다'
                  : 'GitHub not connected — will connect automatically on deploy'}
              </span>
            </>
          )}
        </div>
      )}

      {/* Template selection */}
      <div>
        <Label className="text-base font-semibold mb-3 block">
          {t(locale, 'templatePicker.chooseTemplate')}
        </Label>

        {/* Template grid with animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {templates.map((tpl, index) => (
              <motion.div
                key={tpl.id}
                layout
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
              >
                <TemplateCard
                  template={tpl}
                  isSelected={selectedTemplate === tpl.id}
                  locale={locale}
                  onSelect={setSelectedTemplate}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Site name input with live URL preview */}
      <div className="space-y-2">
        <Label htmlFor="site-name" className="text-base font-semibold">
          {t(locale, 'templatePicker.siteName')}
        </Label>
        <Input
          id="site-name"
          placeholder={locale === 'ko' ? 'my-portfolio' : 'my-portfolio'}
          value={siteName}
          onChange={(e) => handleSiteNameChange(e.target.value)}
          className={siteNameError ? 'border-red-500' : ''}
        />
        {siteNameError && (
          <p className="text-sm text-red-500">{siteNameError}</p>
        )}
        {/* Live URL preview */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
          <Globe className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="font-mono truncate">
            https://{urlUsername}.github.io/{siteName || (locale === 'ko' ? '{사이트이름}' : '{site-name}')}
          </span>
        </div>
      </div>

      {/* Deploy button */}
      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!canProceed || isDeploying} size="lg" className="gap-2">
          {isDeploying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t(locale, 'templatePicker.deploying')}
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              {t(locale, 'templatePicker.deploy')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
