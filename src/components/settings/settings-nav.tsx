'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, GitBranch, Wrench, CreditCard, type LucideIcon } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

interface SettingsLink {
  key?: string;
  label?: string;
  href: string;
  icon: LucideIcon;
}

const settingsLinks: SettingsLink[] = [
  { key: 'account.myAccount', href: '/settings/account', icon: User },
  { label: '구독 및 결제', href: '/settings/billing', icon: CreditCard },
  { key: 'account.githubTab', href: '/settings/github', icon: GitBranch },
  { key: 'account.developer', href: '/settings/developer', icon: Wrench },
];

export function SettingsNav() {
  const pathname = usePathname();
  const { locale } = useLocaleStore();

  return (
    <nav className="flex flex-col gap-1">
      {settingsLinks.map((link) => {
        const isActive = pathname === link.href;
        const label = link.label ?? t(locale, link.key ?? '');
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
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
