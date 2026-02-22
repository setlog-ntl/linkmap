'use client';

import Link from 'next/link';
import { FolderPlus, Rocket, Search, BookOpen } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

const actions = [
  {
    icon: FolderPlus,
    labelKey: 'dashboard.quickNewProject',
    href: '#new-project',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
  {
    icon: Rocket,
    labelKey: 'dashboard.quickOneclick',
    href: '/oneclick',
    color: 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 dark:text-orange-400',
  },
  {
    icon: Search,
    labelKey: 'dashboard.quickCatalog',
    href: '/services',
    color: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400',
  },
  {
    icon: BookOpen,
    labelKey: 'dashboard.quickGuide',
    href: '/guides/env',
    color: 'bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 dark:text-violet-400',
  },
];

interface QuickActionsProps {
  onNewProject?: () => void;
}

export function QuickActions({ onNewProject }: QuickActionsProps) {
  const { locale } = useLocaleStore();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {actions.map((action) => {
        const Icon = action.icon;
        const label = t(locale, action.labelKey);

        if (action.href === '#new-project') {
          return (
            <button
              key={action.labelKey}
              onClick={onNewProject}
              className={`flex items-center gap-3 rounded-xl border border-border/50 px-4 py-3 text-sm font-medium transition-colors ${action.color}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          );
        }

        return (
          <Link
            key={action.labelKey}
            href={action.href}
            className={`flex items-center gap-3 rounded-xl border border-border/50 px-4 py-3 text-sm font-medium transition-colors ${action.color}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
