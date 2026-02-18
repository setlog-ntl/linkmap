'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CheckCircle2,
  Lock,
  Loader2,
  Rocket,
  Github,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import type { HomepageTemplate } from '@/lib/queries/oneclick';

interface TemplatePickerStepProps {
  templates: HomepageTemplate[];
  isLoading: boolean;
  isDeploying?: boolean;
  onNext: (data: { templateId: string; siteName: string }) => void;
  githubUsername?: string;
  isGitHubLoading?: boolean;
  isAuthenticated?: boolean;
}

const SITE_NAME_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

// Template category icons/colors
const TEMPLATE_COLORS: Record<string, string> = {
  'link-in-bio': 'from-pink-500/10 to-purple-500/10 border-pink-200 dark:border-pink-800',
  professional: 'from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-800',
  business: 'from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-800',
  community: 'from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800',
};

function getTemplateGradient(tags: string[]): string {
  for (const [key, value] of Object.entries(TEMPLATE_COLORS)) {
    if (tags.some((t) => t.includes(key))) return value;
  }
  return 'from-primary/5 to-primary/10 border-border';
}

export function TemplatePickerStep({
  templates,
  isLoading,
  isDeploying = false,
  onNext,
  githubUsername,
  isGitHubLoading = false,
  isAuthenticated = true,
}: TemplatePickerStepProps) {
  const { locale } = useLocaleStore();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [siteName, setSiteName] = useState('');
  const [siteNameError, setSiteNameError] = useState<string | null>(null);

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
          {locale === 'ko' ? '템플릿 선택' : 'Choose a Template'}
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl) => {
            const isSelected = selectedTemplate === tpl.id;
            const gradient = getTemplateGradient(tpl.tags);
            return (
              <Card
                key={tpl.id}
                className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${
                  isSelected ? 'ring-2 ring-primary shadow-md' : ''
                } ${tpl.is_premium ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={() => !tpl.is_premium && setSelectedTemplate(tpl.id)}
              >
                <CardContent className="p-0">
                  {/* Preview area */}
                  <div className={`h-24 rounded-t-xl bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
                    {tpl.preview_image_url ? (
                      <img
                        src={tpl.preview_image_url}
                        alt={locale === 'ko' ? tpl.name_ko : tpl.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Globe className="h-8 w-8 mx-auto text-muted-foreground/30" />
                        <span className="text-[10px] text-muted-foreground/40 mt-1 block">
                          {locale === 'ko' ? '미리보기' : 'Preview'}
                        </span>
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="h-6 w-6 text-primary drop-shadow" />
                      </div>
                    )}
                    {tpl.is_premium && (
                      <Badge variant="secondary" className="absolute top-2 right-2 gap-1">
                        <Lock className="h-3 w-3" /> Pro
                      </Badge>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4 pt-3">
                    <h4 className="font-semibold text-sm">
                      {locale === 'ko' ? tpl.name_ko : tpl.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {locale === 'ko' ? tpl.description_ko : tpl.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tpl.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Site name input with live URL preview */}
      <div className="space-y-2">
        <Label htmlFor="site-name" className="text-base font-semibold">
          {locale === 'ko' ? '사이트 이름' : 'Site Name'}
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
              {locale === 'ko' ? '배포 진행 중...' : 'Deploying...'}
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              {locale === 'ko' ? '이 템플릿으로 배포' : 'Deploy This Template'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
