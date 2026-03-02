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

export function WireframeSVG({ slug }: { slug: string }) {
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

    // 히어로 배너 + CTA 버튼 + 기능 3열 그리드
    case 'product-landing':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <rect x="15" y="8" width="170" height="38" rx="6" />
          <rect x="55" y="18" width="90" height="7" rx="3.5" opacity={0.6} />
          <rect x="70" y="30" width="60" height="10" rx="5" opacity={0.5} />
          <rect x="15" y="54" width="50" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="75" y="54" width="50" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="135" y="54" width="50" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="60" y="90" width="80" height="22" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
        </svg>
      );

    // 헤더 + 로고 행 + 기능 카드 + 가격표
    case 'saas-landing':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <rect x="20" y="8" width="160" height="24" rx="5" />
          <rect x="25" y="38" width="30" height="8" rx="4" opacity={0.5} />
          <rect x="62" y="38" width="30" height="8" rx="4" opacity={0.5} />
          <rect x="99" y="38" width="30" height="8" rx="4" opacity={0.5} />
          <rect x="136" y="38" width="30" height="8" rx="4" opacity={0.5} />
          <rect x="15" y="56" width="50" height="40" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="75" y="56" width="50" height="40" rx="5" />
          <rect x="135" y="56" width="50" height="40" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="80" y="64" width="40" height="5" rx="2.5" opacity={0.4} />
          <rect x="83" y="74" width="34" height="4" rx="2" opacity={0.4} />
          <rect x="83" y="82" width="34" height="4" rx="2" opacity={0.4} />
        </svg>
      );

    // 헤더 프로필 + 타임라인 + 스킬 바
    case 'resume-site':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <circle cx="36" cy="28" r="16" />
          <rect x="60" y="16" width="80" height="8" rx="4" />
          <rect x="60" y="30" width="55" height="5" rx="2.5" />
          <rect x="60" y="40" width="70" height="4" rx="2" opacity={0.6} />
          <rect x="15" y="60" width="4" height="50" rx="2" />
          <circle cx="17" cy="68" r="4" />
          <rect x="28" y="64" width="75" height="5" rx="2.5" />
          <rect x="28" y="74" width="55" height="4" rx="2" opacity={0.6} />
          <circle cx="17" cy="90" r="4" />
          <rect x="28" y="86" width="65" height="5" rx="2.5" />
          <rect x="28" y="96" width="45" height="4" rx="2" opacity={0.6} />
          <rect x="115" y="60" width="70" height="8" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="115" y="60" width="52" height="8" rx="4" opacity={0.7} />
          <rect x="115" y="76" width="70" height="8" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="115" y="76" width="38" height="8" rx="4" opacity={0.7} />
          <rect x="115" y="92" width="70" height="8" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="115" y="92" width="60" height="8" rx="4" opacity={0.7} />
        </svg>
      );

    // QR 코드 박스 + 카테고리 탭 + 메뉴 행
    case 'qr-menu-pro':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <rect x="70" y="8" width="60" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="2" opacity={0.4} />
          <rect x="76" y="14" width="18" height="18" rx="2" />
          <rect x="106" y="14" width="18" height="18" rx="2" />
          <rect x="76" y="44" width="18" height="18" rx="2" />
          <rect x="98" y="38" width="6" height="6" rx="1" />
          <rect x="108" y="44" width="16" height="6" rx="1" />
          <rect x="108" y="54" width="10" height="6" rx="1" />
          <rect x="15" y="78" width="40" height="8" rx="4" opacity={0.6} />
          <rect x="62" y="78" width="40" height="8" rx="4" />
          <rect x="109" y="78" width="40" height="8" rx="4" opacity={0.6} />
          <rect x="15" y="94" width="170" height="6" rx="3" opacity={0.4} />
          <rect x="15" y="106" width="170" height="6" rx="3" opacity={0.4} />
        </svg>
      );

    // 제목 + 구독 입력 폼 + 최근 글 목록
    case 'newsletter-landing':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <rect x="40" y="8" width="120" height="10" rx="5" />
          <rect x="55" y="24" width="90" height="6" rx="3" opacity={0.6} />
          <rect x="25" y="38" width="115" height="14" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.4} />
          <rect x="145" y="38" width="35" height="14" rx="5" />
          <rect x="25" y="62" width="150" height="1" opacity={0.25} />
          <rect x="25" y="70" width="100" height="6" rx="3" />
          <rect x="25" y="80" width="70" height="4" rx="2" opacity={0.5} />
          <rect x="25" y="92" width="100" height="6" rx="3" />
          <rect x="25" y="102" width="80" height="4" rx="2" opacity={0.5} />
        </svg>
      );

    // 멤버 아바타 그룹 + 일정 카드 + 자료 링크
    case 'community-hub':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <circle cx="72" cy="22" r="12" />
          <circle cx="100" cy="22" r="12" />
          <circle cx="128" cy="22" r="12" />
          <rect x="75" y="38" width="50" height="5" rx="2.5" />
          <rect x="85" y="47" width="30" height="4" rx="2" opacity={0.6} />
          <rect x="15" y="60" width="80" height="50" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="22" y="68" width="50" height="5" rx="2.5" />
          <rect x="22" y="78" width="65" height="4" rx="2" opacity={0.5} />
          <rect x="22" y="88" width="55" height="4" rx="2" opacity={0.5} />
          <rect x="22" y="98" width="60" height="4" rx="2" opacity={0.5} />
          <rect x="105" y="60" width="80" height="22" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="113" y="68" width="55" height="5" rx="2.5" />
          <rect x="113" y="76" width="40" height="4" rx="2" opacity={0.5} />
          <rect x="105" y="90" width="80" height="22" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="113" y="98" width="55" height="5" rx="2.5" />
          <rect x="113" y="106" width="40" height="4" rx="2" opacity={0.5} />
        </svg>
      );

    // 마감 카운트다운 + 커리큘럼 + 신청 버튼
    case 'study-recruit':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <rect x="30" y="8" width="140" height="10" rx="5" />
          <rect x="25" y="26" width="35" height="24" rx="5" />
          <rect x="66" y="26" width="35" height="24" rx="5" />
          <rect x="107" y="26" width="35" height="24" rx="5" />
          <rect x="148" y="26" width="35" height="24" rx="5" />
          <rect x="25" y="58" width="6" height="6" rx="1" />
          <rect x="37" y="58" width="100" height="6" rx="3" />
          <rect x="25" y="70" width="6" height="6" rx="1" />
          <rect x="37" y="70" width="80" height="6" rx="3" />
          <rect x="25" y="82" width="6" height="6" rx="1" />
          <rect x="37" y="82" width="90" height="6" rx="3" />
          <rect x="55" y="98" width="90" height="16" rx="8" />
        </svg>
      );

    // 이벤트 날짜 + 카운트다운 숫자 + 스피커 행
    case 'event-page':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <rect x="40" y="8" width="120" height="10" rx="5" />
          <rect x="60" y="22" width="80" height="6" rx="3" opacity={0.6} />
          <rect x="22" y="36" width="35" height="22" rx="4" />
          <rect x="63" y="36" width="35" height="22" rx="4" />
          <rect x="104" y="36" width="35" height="22" rx="4" />
          <rect x="145" y="36" width="35" height="22" rx="4" />
          <rect x="22" y="64" width="150" height="1" opacity={0.25} />
          <circle cx="45" cy="82" r="10" />
          <circle cx="80" cy="82" r="10" />
          <circle cx="115" cy="82" r="10" />
          <circle cx="150" cy="82" r="10" />
          <rect x="30" y="96" width="30" height="4" rx="2" opacity={0.5} />
          <rect x="65" y="96" width="30" height="4" rx="2" opacity={0.5} />
          <rect x="100" y="96" width="30" height="4" rx="2" opacity={0.5} />
          <rect x="135" y="96" width="30" height="4" rx="2" opacity={0.5} />
        </svg>
      );

    // 미션 텍스트 + 통계 수치 + 후원 CTA
    case 'nonprofit-page':
      return (
        <svg viewBox="0 0 200 120" className={common} fill="currentColor" opacity={0.18}>
          <rect x="20" y="8" width="160" height="28" rx="6" />
          <rect x="35" y="16" width="130" height="7" rx="3.5" opacity={0.5} />
          <rect x="55" y="27" width="90" height="5" rx="2.5" opacity={0.5} />
          <rect x="15" y="46" width="50" height="28" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="75" y="46" width="50" height="28" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="135" y="46" width="50" height="28" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.35} />
          <rect x="22" y="54" width="36" height="8" rx="4" />
          <rect x="82" y="54" width="36" height="8" rx="4" />
          <rect x="142" y="54" width="36" height="8" rx="4" />
          <rect x="55" y="84" width="90" height="16" rx="8" />
          <rect x="25" y="106" width="150" height="6" rx="3" opacity={0.35} />
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
        <div className="h-28 sm:h-36 rounded-t-xl bg-muted/50 flex items-center justify-center relative overflow-hidden px-4 sm:px-6">
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
        <div className="p-3 sm:p-4 pt-2.5 sm:pt-3">
          <h4 className="font-semibold text-xs sm:text-sm">
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
