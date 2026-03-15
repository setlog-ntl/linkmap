'use client';

import Link from 'next/link';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { GUIDE_CATEGORIES, getGuidesByCategory } from '@/data/ui/guide-meta';

export function Footer() {
  const { locale } = useLocaleStore();

  return (
    <footer className="bg-[var(--circuit-950)] text-muted-foreground">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-1 font-bold text-lg mb-3">
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
              <li><Link href="/services" className="hover:text-white transition-colors">{t(locale, 'nav.serviceCatalog')}</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">{t(locale, 'landing.featuresTitle')}</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">{t(locale, 'landing.pricingTitle')}</Link></li>
            </ul>
          </div>
          {(['concept', 'service'] as const).map((catKey) => {
            const cat = GUIDE_CATEGORIES[catKey];
            const guides = getGuidesByCategory(catKey);
            return (
              <div key={catKey}>
                <h4 className="font-semibold text-sm mb-3 text-white">{cat.label}</h4>
                <ul className="space-y-2 text-sm">
                  {guides.map((guide) => (
                    <li key={guide.slug}>
                      <Link href={guide.href} className="hover:text-white transition-colors">
                        {guide.title}
                      </Link>
                    </li>
                  ))}
                  {catKey === 'concept' && (
                    <li><a href="mailto:cdhrich2@gmail.com" className="hover:text-white transition-colors">Contact</a></li>
                  )}
                </ul>
              </div>
            );
          })}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white">콘텐츠</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-white transition-colors">블로그</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/glossary" className="hover:text-white transition-colors">용어집</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white">{t(locale, 'landing.footerLegal')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
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
                  href="mailto:cdhrich2@gmail.com"
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
