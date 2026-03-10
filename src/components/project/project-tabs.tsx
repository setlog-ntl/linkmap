'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Map, List, Key, Settings, Link2, DollarSign, Activity, UserCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

interface ProjectTabsProps {
  projectId: string;
}

interface Tab {
  labelKey: string;
  href: string;
  icon: LucideIcon;
  fallbackLabel?: string;
}

const tabGroups: Tab[][] = [
  [
    { labelKey: 'project.overview', href: '', icon: LayoutDashboard },
    { labelKey: 'project.services', href: '/services', icon: List },
    { labelKey: 'project.connections', href: '/connections', icon: Link2 },
    { labelKey: 'project.envVars', href: '/env', icon: Key },
    { labelKey: 'project.credentials', href: '/credentials', icon: UserCheck, fallbackLabel: '계정 관리' },
    { labelKey: 'project.costs', href: '/costs', icon: DollarSign },
    { labelKey: 'project.monitoring', href: '/monitoring', icon: Activity },
  ],
  [
    { labelKey: 'project.serviceMap', href: '/service-map', icon: Map },
    { labelKey: 'project.settings', href: '/settings', icon: Settings },
  ],
];

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  const pathname = usePathname();
  const basePath = `/project/${projectId}`;
  const { locale } = useLocaleStore();

  return (
    <nav className="flex border-b overflow-x-auto scrollbar-none -mx-1 sm:mx-0">
      {tabGroups.map((group, gi) => (
        <div key={gi} className="flex items-stretch">
          {gi > 0 && (
            <div className="hidden sm:flex items-center px-1">
              <div className="h-4 w-px bg-border" />
            </div>
          )}
          {group.map((tab) => {
            const tabPath = `${basePath}${tab.href}`;
            const isActive = tab.href === ''
              ? pathname === basePath
              : pathname.startsWith(tabPath);
            const translated = t(locale, tab.labelKey);
            const label = translated === tab.labelKey && tab.fallbackLabel ? tab.fallbackLabel : translated;

            return (
              <Link
                key={tab.href}
                href={tabPath}
                className={cn(
                  'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                )}
                title={label}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
