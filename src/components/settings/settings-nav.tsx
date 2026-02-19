'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

const tabs = [
  { href: '/settings/account', labelKey: 'account.tab' },
  { href: '/settings/tokens', labelKey: 'account.apiTokensTab' },
] as const;

export function SettingsNav() {
  const pathname = usePathname();
  const { locale } = useLocaleStore();

  return (
    <div className="border-b mb-6">
      <nav className="flex gap-4">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'pb-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              pathname === tab.href
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t(locale, tab.labelKey)}
          </Link>
        ))}
      </nav>
    </div>
  );
}
