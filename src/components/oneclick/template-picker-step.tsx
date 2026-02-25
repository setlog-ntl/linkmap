'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2,
  Loader2,
  Rocket,
  Github,
  Globe,
  AlertCircle,
  Plus,
  Link2,
  CreditCard,
  Code2,
  Store,
  User,
  Briefcase,
  Package,
  Layers,
  FileText,
  QrCode,
  Mail,
  Users,
  BookOpen,
  Calendar,
  Heart,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { TemplateCard } from './template-card';
import { RECOMMENDED_SLUGS } from '@/lib/constants/template-categories';
import type { HomepageTemplate } from '@/lib/queries/oneclick';
import type { GitHubConnection } from '@/types';

// 템플릿 slug → 기본 사이트 이름 (GitHub repo 이름이 되므로 a-z0-9- 형식)
const TEMPLATE_DEFAULT_NAMES: Record<string, string> = {
  'link-in-bio-pro': 'linkcard',
  'digital-namecard': 'namecard',
  'dev-showcase': 'devfolio',
  'small-biz': 'myshop',
  'personal-brand': 'mypage',
  'freelancer-page': 'mywork',
  'product-landing': 'myprod',
  'saas-landing': 'mysaas',
  'resume-site': 'myresume',
  'qr-menu-pro': 'mymenu',
  'newsletter-landing': 'mynews',
  'community-hub': 'myhub',
  'study-recruit': 'mystudy',
  'event-page': 'myevent',
  'nonprofit-page': 'myorg',
};

// 템플릿 slug → 대표 아이콘 (lucide-react)
const TEMPLATE_ICONS: Record<string, LucideIcon> = {
  'link-in-bio-pro': Link2,
  'digital-namecard': CreditCard,
  'dev-showcase': Code2,
  'small-biz': Store,
  'personal-brand': User,
  'freelancer-page': Briefcase,
  'product-landing': Package,
  'saas-landing': Layers,
  'resume-site': FileText,
  'qr-menu-pro': QrCode,
  'newsletter-landing': Mail,
  'community-hub': Users,
  'study-recruit': BookOpen,
  'event-page': Calendar,
  'nonprofit-page': Heart,
};

function resolveDefaultSiteName(templateId: string | null, templates: HomepageTemplate[]): string {
  if (!templateId) return '';
  const tpl = templates.find((t) => t.id === templateId);
  if (!tpl) return '';
  return TEMPLATE_DEFAULT_NAMES[tpl.slug] ?? '';
}

interface TemplatePickerStepProps {
  templates: HomepageTemplate[];
  isLoading: boolean;
  isDeploying?: boolean;
  onNext: (data: { templateId: string; siteName: string; accountId?: string }) => void;
  githubUsername?: string;
  isGitHubLoading?: boolean;
  isAuthenticated?: boolean;
  defaultSiteName?: string;
  defaultTemplate?: string | null;
  accounts?: GitHubConnection[];
  selectedAccountId?: string | null;
  onAccountChange?: (id: string) => void;
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
  accounts = [],
  selectedAccountId = null,
  onAccountChange,
}: TemplatePickerStepProps) {
  const { locale } = useLocaleStore();
  const prefersReducedMotion = useReducedMotion();

  // Auto-select recommended template if none selected
  const recommendedTemplateId = templates.find(
    (t) => RECOMMENDED_SLUGS.has(t.slug)
  )?.id ?? null;

  const initialTemplateId = defaultTemplate ?? recommendedTemplateId;
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(initialTemplateId);
  const [siteName, setSiteName] = useState(
    defaultSiteName || resolveDefaultSiteName(initialTemplateId, templates)
  );
  const [siteNameTouched, setSiteNameTouched] = useState(!!defaultSiteName);
  const [siteNameError, setSiteNameError] = useState<string | null>(null);

  // Re-apply recommended template when templates load
  if (!selectedTemplate && recommendedTemplateId && templates.length > 0) {
    setSelectedTemplate(recommendedTemplateId);
  }

  // Sort templates: link-in-bio-pro 상단 고정 → 나머지 원본 순서 유지
  const sortedTemplates = useMemo(() => {
    return [...templates].sort((a, b) => {
      if (a.slug === 'link-in-bio-pro') return -1;
      if (b.slug === 'link-in-bio-pro') return 1;
      return 0;
    });
  }, [templates]);

  const validateSiteName = (name: string) => {
    if (name.length < 2) {
      return t(locale, 'templatePicker.minLength');
    }
    if (name.length > 100) {
      return t(locale, 'templatePicker.maxLength');
    }
    if (!SITE_NAME_REGEX.test(name)) {
      return t(locale, 'templatePicker.invalidChars');
    }
    return null;
  };

  const handleSiteNameChange = (value: string) => {
    const lowered = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSiteName(lowered);
    setSiteNameTouched(true);
    if (lowered.length >= 2) {
      setSiteNameError(validateSiteName(lowered));
    } else {
      setSiteNameError(null);
    }
  };

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
    // 사용자가 이름을 직접 수정하지 않은 경우에만 자동 네이밍 적용
    if (!siteNameTouched) {
      const autoName = resolveDefaultSiteName(id, templates);
      if (autoName) setSiteName(autoName);
    }
  };

  const canProceed = selectedTemplate && siteName.length >= 2 && !siteNameError;

  // 선택된 템플릿의 slug → 아이콘
  const selectedTemplateSlug = templates.find((t) => t.id === selectedTemplate)?.slug ?? null;
  const TemplateIcon: LucideIcon | null = selectedTemplateSlug ? (TEMPLATE_ICONS[selectedTemplateSlug] ?? null) : null;

  const handleNext = () => {
    if (!canProceed) return;
    const error = validateSiteName(siteName);
    if (error) {
      setSiteNameError(error);
      return;
    }
    onNext({ templateId: selectedTemplate!, siteName, accountId: selectedAccountId || undefined });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  // Derive the display username from selected account or fallback
  const getAccountLogin = (conn: GitHubConnection) =>
    (conn.oauth_metadata as { login?: string })?.login || conn.oauth_provider_user_id || 'GitHub User';

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const urlUsername = selectedAccount ? getAccountLogin(selectedAccount) : githubUsername || 'username';
  const hasAccounts = accounts.length >= 1;

  const handleAccountSelect = (value: string) => {
    if (value === '__add__') {
      window.location.href = '/api/oauth/github/authorize?flow_context=oneclick';
      return;
    }
    onAccountChange?.(value);
  };

  return (
    <div className="space-y-6">
      {/* GitHub connection status — inline indicator */}
      {isAuthenticated && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm ${
          isGitHubLoading
            ? 'bg-muted/50 border-border'
            : (hasAccounts || githubUsername)
              ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
              : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
        }`}>
          {isGitHubLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">
                {t(locale, 'templatePicker.checkingGitHub')}
              </span>
            </>
          ) : hasAccounts ? (
            <>
              <Github className="h-4 w-4 text-green-700 dark:text-green-300 flex-shrink-0" />
              <Select value={selectedAccountId || ''} onValueChange={handleAccountSelect}>
                <SelectTrigger className="h-7 w-auto min-w-[160px] border-green-300 dark:border-green-700 bg-transparent text-green-700 dark:text-green-300 text-sm font-medium">
                  <SelectValue placeholder={t(locale, 'templatePicker.selectAccount')} />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      <span className="flex items-center gap-2">
                        <Github className="h-3.5 w-3.5" />
                        @{getAccountLogin(acc)}
                      </span>
                    </SelectItem>
                  ))}
                  <SelectSeparator />
                  <SelectItem value="__add__">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Plus className="h-3.5 w-3.5" />
                      {t(locale, 'templatePicker.addAccount')}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {t(locale, 'templatePicker.connected')}
              </Badge>
            </>
          ) : githubUsername ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <Github className="h-4 w-4 text-green-700 dark:text-green-300 flex-shrink-0" />
              <span className="font-medium text-green-700 dark:text-green-300">
                @{githubUsername}
              </span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {t(locale, 'templatePicker.connected')}
              </Badge>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span className="text-amber-700 dark:text-amber-300">
                {t(locale, 'templatePicker.githubNotConnected')}
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
            {sortedTemplates.map((tpl, index) => (
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
                  onSelect={handleTemplateSelect}
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
        <div className="relative">
          {TemplateIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <TemplateIcon className="h-4 w-4" />
            </div>
          )}
          <Input
            id="site-name"
            placeholder={t(locale, 'templatePicker.siteNamePlaceholder')}
            value={siteName}
            onChange={(e) => handleSiteNameChange(e.target.value)}
            className={`${TemplateIcon ? 'pl-10' : ''} ${siteNameError ? 'border-red-500' : ''}`}
          />
        </div>
        {siteNameError && (
          <p className="text-sm text-red-500">{siteNameError}</p>
        )}
        {/* Live URL preview */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
          <Globe className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="font-mono truncate">
            https://{urlUsername}.github.io/{siteName || t(locale, 'templatePicker.urlPlaceholder')}
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
              원클릭 배포
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
