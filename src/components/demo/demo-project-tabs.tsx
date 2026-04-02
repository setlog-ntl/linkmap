'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Map, List, Key, Settings, Link2, DollarSign } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface DemoProjectTabsProps {
  projectId: string;
}

interface Tab {
  label: string;
  href: string;
  icon: LucideIcon;
}

const tabGroups: Tab[][] = [
  [
    { label: '대시보드', href: '', icon: LayoutDashboard },
    { label: '서비스', href: '/services', icon: List },
    { label: '연결', href: '/connections', icon: Link2 },
    { label: '환경변수', href: '/env', icon: Key },
    { label: '비용', href: '/costs', icon: DollarSign },
  ],
  [
    { label: '서비스 맵', href: '/service-map', icon: Map },
    { label: '설정', href: '/settings', icon: Settings },
  ],
];

export function DemoProjectTabs({ projectId }: DemoProjectTabsProps) {
  const pathname = usePathname();
  const basePath = `/demo/project/${projectId}`;

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

            return (
              <Link
                key={tab.href}
                href={tabPath}
                prefetch={false}
                className={cn(
                  'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                )}
                title={tab.label}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
