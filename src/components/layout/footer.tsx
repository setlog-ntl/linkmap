'use client';

import Link from 'next/link';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { GUIDE_CATEGORIES_DATA, LEARNING_STAGES_DATA, GUIDE_DATA, getGuideDataByCategory } from '@/data/ui/guide-data';

export function Footer() {
  const { locale } = useLocaleStore();

  return (
    <footer className="bg-[var(--circuit-950)] text-muted-foreground">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-6 md:gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" prefetch={false} className="flex items-center gap-1 font-bold text-lg mb-3">
              <span className="text-brand-green">Link</span>
              <span className="text-white">map</span>
            </Link>
            <p className="text-sm">
              {t(locale, 'landing.footerTagline')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white">{t(locale, 'landing.footerProduct')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" prefetch={false} className="hover:text-white transition-colors">{t(locale, 'nav.serviceCatalog')}</Link></li>
              <li><Link href="/#features" prefetch={false} className="hover:text-white transition-colors">{t(locale, 'landing.featuresTitle')}</Link></li>
              <li><Link href="/#pricing" prefetch={false} className="hover:text-white transition-colors">{t(locale, 'landing.pricingTitle')}</Link></li>
            </ul>
          </div>
          {/* 기본 개념 — 학습 단계별 요약 */}
          <div className="sm:col-span-2 md:col-span-2">
            <h4 className="font-semibold text-sm mb-3 text-white">{GUIDE_CATEGORIES_DATA.concept.label}</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {LEARNING_STAGES_DATA.map((stage) => {
                const stageGuides = stage.slugs
                  .map(slug => GUIDE_DATA.find(g => g.slug === slug))
                  .filter(Boolean);
                return (
                  <div key={stage.id}>
                    <p className="font-medium text-white/80 mb-1 text-xs uppercase tracking-wider">{stage.label}</p>
                    <ul className="space-y-1">
                      {stageGuides.map((guide) => guide && (
                        <li key={guide.slug}>
                          <Link href={guide.href} prefetch={false} className="hover:text-white transition-colors text-xs">
                            {guide.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              <div>
                <Link href="/guides" prefetch={false} className="hover:text-white transition-colors text-xs font-medium">
                  전체 보기 →
                </Link>
              </div>
            </div>
          </div>
          {/* 서비스 가이드 */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white">{GUIDE_CATEGORIES_DATA.service.label}</h4>
            <ul className="space-y-2 text-sm">
              {getGuideDataByCategory('service').map((guide) => (
                <li key={guide.slug}>
                  <Link href={guide.href} prefetch={false} className="hover:text-white transition-colors">
                    {guide.title}
                  </Link>
                </li>
              ))}
              <li><a href="mailto:cdhrich@naver.com" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white">콘텐츠</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/resources" prefetch={false} className="hover:text-white transition-colors">무료배포 자료</Link></li>
              <li><Link href="/blog" prefetch={false} className="hover:text-white transition-colors">블로그</Link></li>
              <li><Link href="/faq" prefetch={false} className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/glossary" prefetch={false} className="hover:text-white transition-colors">용어집</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white">{t(locale, 'landing.footerLegal')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" prefetch={false} className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" prefetch={false} className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white">{t(locale, 'landing.footerCommunity')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://open.kakao.com/o/gctXEtji"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Linkmap 오픈채팅방
                </a>
              </li>
              <li>
                <a
                  href="mailto:cdhrich@naver.com"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Linkmap. {t(locale, 'landing.footerCopyright')}</p>
        </div>
      </div>
    </footer>
  );
}
