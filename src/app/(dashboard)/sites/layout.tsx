'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Rocket, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

const sitesNav = [
  { label: '원클릭 배포', href: '/sites/new', icon: Rocket },
  { label: '내 사이트', href: '/sites/manage', icon: Monitor },
];

export default function SitesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale } = useLocaleStore();

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t(locale, 'nav.oneclick')}</h1>
        <p className="text-muted-foreground mt-1">{t(locale, 'nav.sitesDesc')}</p>
      </div>

      <nav className="flex gap-1 border-b mb-6">
        {sitesNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
