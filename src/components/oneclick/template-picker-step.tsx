'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
  Coffee,
  PartyPopper,
  Table2,
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
  'link-card': 'linkcard',
  'digital-namecard': 'namecard',
  'dev-showcase': 'devfolio',
  'small-biz': 'myshop',
  'small-biz-cafe': 'mycafe',
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
  'invitation': 'myinvite',
  'excel-merge': 'excelmerge',
};

// 템플릿 slug → 대표 아이콘 (lucide-react)
const TEMPLATE_ICONS: Record<string, LucideIcon> = {
  'link-card': Link2,
  'digital-namecard': CreditCard,
  'dev-showcase': Code2,
  'small-biz': Store,
  'small-biz-cafe': Coffee,
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
  'invitation': PartyPopper,
  'excel-merge': Table2,
};

function resolveDefaultSiteName(
  templateId: string | null,
  templates: HomepageTemplate[],
  existingSiteNames: string[] = []
): string {
  if (!templateId) return '';
  const tpl = templates.find((t) => t.id === templateId);
  if (!tpl) return '';
  const baseName = TEMPLATE_DEFAULT_NAMES[tpl.slug] ?? '';
  if (!baseName) return '';

  // 기존 사이트 이름과 중복되지 않도록 일련번호 추가
  const nameSet = new Set(existingSiteNames.map((n) => n.toLowerCase()));
  if (!nameSet.has(baseName)) return baseName;

  let suffix = 2;
  while (nameSet.has(`${baseName}-${suffix}`)) {
    suffix++;
  }
  return `${baseName}-${suffix}`;
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
  existingSiteNames?: string[];
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
  existingSiteNames = [],
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
    defaultSiteName || resolveDefaultSiteName(initialTemplateId, templates, existingSiteNames)
  );
  const [siteNameTouched, setSiteNameTouched] = useState(!!defaultSiteName);
  const [siteNameError, setSiteNameError] = useState<string | null>(null);
  const [siteNameWarning, setSiteNameWarning] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // GitHub 레포 중복 체크 (디바운스)
  const checkRepoAvailability = useCallback((name: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSiteNameWarning(null);

    if (name.length < 2 || !SITE_NAME_REGEX.test(name)) return;

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/oneclick/preflight?site_name=${encodeURIComponent(name)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.siteNameAvailable === false) {
          setSiteNameWarning(`GitHub에 '${name}' 레포가 이미 존재합니다. 배포 시 자동으로 다른 이름이 지정됩니다.`);
        }
      } catch { /* non-critical */ }
    }, 500);
  }, []);

  // 기존 배포 목록이 비동기 로딩 후 도착하면 사이트 이름 재계산
  const prevExistingCountRef = useRef(existingSiteNames.length);
  useEffect(() => {
    // 배포 목록이 0 → N으로 로딩 완료된 시점에만 실행
    if (prevExistingCountRef.current === 0 && existingSiteNames.length > 0 && !siteNameTouched && selectedTemplate) {
      const autoName = resolveDefaultSiteName(selectedTemplate, templates, existingSiteNames);
      if (autoName) {
        setSiteName(autoName);
        checkRepoAvailability(autoName);
      }
    }
    prevExistingCountRef.current = existingSiteNames.length;
  }, [existingSiteNames, siteNameTouched, selectedTemplate, templates, checkRepoAvailability]);

  // 템플릿 로딩 완료 시 추천 템플릿 자동 선택 + 사이트 이름 자동 생성
  useEffect(() => {
    if (!selectedTemplate && recommendedTemplateId && templates.length > 0) {
      setSelectedTemplate(recommendedTemplateId);
    }
  }, [selectedTemplate, recommendedTemplateId, templates.length]);

  // 템플릿이 선택되었는데 사이트 이름이 아직 비어있으면 자동 생성
  useEffect(() => {
    if (selectedTemplate && !siteName && !siteNameTouched && templates.length > 0) {
      const autoName = resolveDefaultSiteName(selectedTemplate, templates, existingSiteNames);
      if (autoName) {
        setSiteName(autoName);
        checkRepoAvailability(autoName);
      }
    }
  }, [selectedTemplate, siteName, siteNameTouched, templates, existingSiteNames, checkRepoAvailability]);

  // Sort templates: small-biz-cafe 상단 고정 → 나머지 원본 순서 유지
  const sortedTemplates = useMemo(() => {
    return [...templates].sort((a, b) => {
      if (a.slug === 'small-biz-cafe') return -1;
      if (b.slug === 'small-biz-cafe') return 1;
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
    const hasKorean = /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(value);
    let lowered = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    // 시작/끝 하이픈 자동 제거
    lowered = lowered.replace(/^-+/, '').replace(/-+$/, '');
    setSiteName(lowered);
    setSiteNameTouched(true);

    if (hasKorean && lowered.length < 2) {
      setSiteNameError(t(locale, 'templatePicker.koreanNotAllowed'));
      return;
    }
    if (lowered.length >= 2) {
      setSiteNameError(validateSiteName(lowered));
      checkRepoAvailability(lowered);
    } else {
      setSiteNameError(null);
      setSiteNameWarning(null);
    }
  };

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
    // 사용자가 이름을 직접 수정하지 않은 경우에만 자동 네이밍 적용
    if (!siteNameTouched) {
      const autoName = resolveDefaultSiteName(id, templates, existingSiteNames);
      if (autoName) {
        setSiteName(autoName);
        checkRepoAvailability(autoName);
      }
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
        <div className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border text-sm ${
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
                <SelectTrigger className="h-7 w-auto min-w-[120px] sm:min-w-[160px] border-green-300 dark:border-green-700 bg-transparent text-green-700 dark:text-green-300 text-sm font-medium">
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

      {/* Site name + Deploy button — 상단 배치로 즉시 배포 가능 */}
      <div className="bg-card border rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <Label htmlFor="site-name" className="text-base font-semibold">
          {t(locale, 'templatePicker.siteName')}
        </Label>
        {/* 모바일: 세로 스택 — 입력창 눌림·에러 메시지 잘림 방지 */}
        <div className="flex flex-col md:flex-row gap-2 md:items-start">
          <div className="flex-1 space-y-1.5">
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
            {!siteNameError && siteNameWarning && (
              <p className="text-sm text-amber-600 dark:text-amber-400">{siteNameWarning}</p>
            )}
          </div>
          <Button
            onClick={handleNext}
            disabled={!canProceed || isDeploying}
            size="default"
            className="gap-2 shrink-0 h-10 w-full md:w-auto"
          >
            {isDeploying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">{t(locale, 'templatePicker.deploying')}</span>
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                <span>원클릭 배포</span>
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {t(locale, 'templatePicker.siteNameHint')}
        </p>
        {/* Live URL preview */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
          <Globe className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          {/* 모바일: URL 전체 표시 (잘림 방지) */}
          <span className="font-mono break-all whitespace-normal text-[10px] sm:text-xs">
            https://{urlUsername}.github.io/{siteName || t(locale, 'templatePicker.urlPlaceholder')}
          </span>
        </div>
      </div>

      {/* Template selection */}
      <div>
        <Label className="text-base font-semibold mb-3 block">
          {t(locale, 'templatePicker.chooseTemplate')}
        </Label>

        {/* Template grid with animations */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
    </div>
  );
}
