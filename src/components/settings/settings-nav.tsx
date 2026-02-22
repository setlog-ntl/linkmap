'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, GitBranch, Layers, Key, AlertTriangle } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

const settingsLinks = [
  { key: 'account.profileInfo', href: '/settings/profile', icon: User },
  { key: 'account.connectionsTab', href: '/settings/accounts', icon: GitBranch },
  { key: 'account.allServices', href: '/settings/services', icon: Layers },
  { key: 'account.apiTokensTab', href: '/settings/tokens', icon: Key },
  { key: 'account.dangerZone', href: '/settings/danger', icon: AlertTriangle },
];

export function SettingsNav() {
  const pathname = usePathname();
  const { locale } = useLocaleStore();

  return (
    <nav className="flex flex-col gap-1">
      {settingsLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            )}
          >
            <link.icon className="h-4 w-4 shrink-0" />
            <span>{t(locale, link.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
