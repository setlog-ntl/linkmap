'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Map, List, Key, Settings, ScrollText, Activity } from 'lucide-react';

interface ProjectTabsProps {
  projectId: string;
}

const tabs = [
  { label: '개요', href: '', icon: LayoutDashboard },
  { label: '서비스 맵', href: '/service-map', icon: Map },
  { label: '서비스 목록', href: '/services', icon: List },
  { label: '환경변수', href: '/env', icon: Key },
  { label: '상태 모니터링', href: '/health', icon: Activity },
  { label: '감사 로그', href: '/audit', icon: ScrollText },
  { label: '설정', href: '/settings', icon: Settings },
];

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  const pathname = usePathname();
  const basePath = `/project/${projectId}`;

  return (
    <nav className="flex border-b overflow-x-auto scrollbar-none -mx-1 sm:mx-0">
      {tabs.map((tab) => {
        const tabPath = `${basePath}${tab.href}`;
        const isActive = tab.href === ''
          ? pathname === basePath
          : pathname.startsWith(tabPath);

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
            title={tab.label}
          >
            <tab.icon className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
