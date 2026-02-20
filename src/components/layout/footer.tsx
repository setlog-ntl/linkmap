'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export function Footer() {
  const { locale } = useLocaleStore();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-1 font-bold text-lg mb-3">
              <span className="text-primary">Link</span>
              <span>map</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t(locale, 'landing.footerTagline')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">{t(locale, 'landing.footerProduct')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-foreground transition-colors">{t(locale, 'nav.serviceCatalog')}</Link></li>
              <li><Link href="/#features" className="hover:text-foreground transition-colors">{t(locale, 'landing.featuresTitle')}</Link></li>
              <li><Link href="/#pricing" className="hover:text-foreground transition-colors">{t(locale, 'landing.pricingTitle')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">{t(locale, 'landing.footerSupport')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/guides/github" className="hover:text-foreground transition-colors">{t(locale, 'landing.guideGitHub')}</Link></li>
              <li><Link href="/guides/auth" className="hover:text-foreground transition-colors">{t(locale, 'landing.guideAuth')}</Link></li>
              <li><Link href="/guides/cloudflare" className="hover:text-foreground transition-colors">{t(locale, 'landing.guideCloudflare')}</Link></li>
              <li><a href="mailto:support@linkmap.dev" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">{t(locale, 'landing.footerLegal')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">{t(locale, 'landing.footerCommunity')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://github.com/linkmap-dev" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" />
                  {t(locale, 'landing.footerGitHub')}
                </a>
              </li>
              <li>
                <a href="https://discord.gg/linkmap" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  {t(locale, 'landing.footerDiscord')}
                </a>
              </li>
              <li>
                <a href="https://x.com/linkmap_dev" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  {t(locale, 'landing.footerTwitter')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Linkmap. {t(locale, 'landing.footerCopyright')}</p>
        </div>
      </div>
    </footer>
  );
}
