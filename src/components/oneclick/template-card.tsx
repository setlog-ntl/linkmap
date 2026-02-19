'use client';

import { Check, Lock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RECOMMENDED_SLUGS, TEMPLATE_USE_CASES } from '@/lib/constants/template-categories';
import type { HomepageTemplate } from '@/lib/queries/oneclick';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';

interface TemplateCardProps {
  template: HomepageTemplate;
  isSelected: boolean;
  locale: Locale;
  onSelect: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Wireframe SVGs — abstract layout previews per template slug
// Uses currentColor + opacity so it auto-adapts to light/dark mode
// ---------------------------------------------------------------------------

function WireframeSVG({ slug }: { slug: string }) {
  const common = 'w-full h-full';

  switch (slug) {
    // 원형 아바타 + 수평 링크 바 + 소셜 아이콘
    case 'link-in-bio-pro':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <circle cx="100" cy="24" r="14" />
          <rect x="50" y="48" width="100" height="10" rx="5" />
          <rect x="50" y="64" width="100" height="10" rx="5" />
          <rect x="50" y="80" width="100" height="10" rx="5" />
          <circle cx="80" cy="106" r="5" />
          <circle cx="100" cy="106" r="5" />
          <circle cx="120" cy="106" r="5" />
        </svg>
      );

    // 카드 외곽선 + 상단 컬러바 + 아바타 + 연락처 행
    case 'digital-namecard':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <rect x="30" y="10" width="140" height="100" rx="8" fill="none" stroke="currentColor" strokeWidth="2" opacity={0.3} />
          <rect x="30" y="10" width="140" height="20" rx="8" />
          <circle cx="65" cy="52" r="12" />
          <rect x="85" y="42" width="70" height="6" rx="3" />
          <rect x="85" y="54" width="50" height="5" rx="2.5" />
          <rect x="45" y="76" width="110" height="5" rx="2.5" />
          <rect x="45" y="88" width="90" height="5" rx="2.5" />
        </svg>
      );

    // 터미널 점 3개 + 코드 라인 + 프로젝트 카드 2열
    case 'dev-showcase':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <rect x="20" y="8" width="160" height="44" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
          <circle cx="32" cy="18" r="3" />
          <circle cx="42" cy="18" r="3" />
          <circle cx="52" cy="18" r="3" />
          <rect x="30" y="28" width="60" height="4" rx="2" />
          <rect x="30" y="36" width="80" height="4" rx="2" />
          <rect x="30" y="44" width="40" height="4" rx="2" />
          <rect x="20" y="62" width="75" height="50" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
          <rect x="28" y="70" width="50" height="5" rx="2.5" />
          <rect x="28" y="80" width="60" height="4" rx="2" />
          <rect x="105" y="62" width="75" height="50" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
          <rect x="113" y="70" width="50" height="5" rx="2.5" />
          <rect x="113" y="80" width="60" height="4" rx="2" />
        </svg>
      );

    // 히어로 배너 + 메뉴 그리드 + 지도 핀
    case 'small-biz':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <rect x="15" y="8" width="170" height="35" rx="6" />
          <rect x="15" y="50" width="50" height="30" rx="4" />
          <rect x="75" y="50" width="50" height="30" rx="4" />
          <rect x="135" y="50" width="50" height="30" rx="4" />
          <circle cx="100" cy="102" r="4" />
          <path d="M100 98 L100 90" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="80" y="88" width="40" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
        </svg>
      );

    // 풀스크린 히어로 + 텍스트 + 갤러리
    case 'personal-brand':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <rect x="10" y="8" width="180" height="45" rx="6" />
          <rect x="40" y="24" width="120" height="8" rx="4" opacity={0.6} />
          <rect x="60" y="38" width="80" height="5" rx="2.5" opacity={0.6} />
          <rect x="10" y="62" width="55" height="50" rx="4" />
          <rect x="72" y="62" width="55" height="50" rx="4" />
          <rect x="134" y="62" width="55" height="50" rx="4" />
        </svg>
      );

    // 프로필 + 서비스 카드 + 후기
    case 'freelancer-page':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <circle cx="100" cy="20" r="12" />
          <rect x="70" y="38" width="60" height="6" rx="3" />
          <rect x="80" y="48" width="40" height="4" rx="2" />
          <rect x="15" y="62" width="50" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
          <rect x="75" y="62" width="50" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
          <rect x="135" y="62" width="50" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
          <rect x="25" y="96" width="65" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
          <rect x="100" y="96" width="65" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <rect x="30" y="15" width="140" height="10" rx="5" />
          <rect x="50" y="35" width="100" height="6" rx="3" />
          <rect x="20" y="55" width="75" height="50" rx="6" />
          <rect x="105" y="55" width="75" height="50" rx="6" />
        </svg>
      );
  }
}

export function TemplateCard({ template, isSelected, locale, onSelect }: TemplateCardProps) {
  const isRecommended = RECOMMENDED_SLUGS.has(template.slug);
  const useCases = TEMPLATE_USE_CASES[template.slug];

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary shadow-md' : ''
      } ${template.is_premium ? 'opacity-60 cursor-not-allowed' : ''}`}
      onClick={() => !template.is_premium && onSelect(template.id)}
    >
      <CardContent className="p-0">
        {/* Preview area */}
        <div className="h-36 rounded-t-xl bg-muted/50 flex items-center justify-center relative overflow-hidden px-6">
          <WireframeSVG slug={template.slug} />

          {/* Recommended badge — top left */}
          {isRecommended && (
            <Badge className="absolute top-2 left-2 gap-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
              <Star className="h-3 w-3" />
              {t(locale, 'templatePicker.recommended')}
            </Badge>
          )}

          {/* Selected check — top right */}
          {isSelected && (
            <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-4 w-4 text-primary-foreground" />
            </div>
          )}

          {/* Premium badge */}
          {template.is_premium && (
            <Badge variant="secondary" className="absolute top-2 right-2 gap-1">
              <Lock className="h-3 w-3" /> Pro
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="p-4 pt-3">
          <h4 className="font-semibold text-sm">
            {locale === 'ko' ? template.name_ko : template.name}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {locale === 'ko' ? template.description_ko : template.description}
          </p>
          {useCases && (
            <div className="flex flex-wrap gap-1 mt-2">
              {(locale === 'ko' ? useCases.ko : useCases.en).map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
