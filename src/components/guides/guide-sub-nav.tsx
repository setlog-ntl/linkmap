'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GUIDE_LIST, getSubGuides } from '@/data/ui/guide-meta';

interface GuideSubNavProps {
  parentSlug: string;
}

export function GuideSubNav({ parentSlug }: GuideSubNavProps) {
  const pathname = usePathname();
  const parent = GUIDE_LIST.find(g => g.slug === parentSlug);
  const subGuides = getSubGuides(parentSlug);

  if (!parent || subGuides.length === 0) return null;

  const ParentIcon = parent.icon;
  const navItems = [
    { href: parent.href, label: '개요', icon: ParentIcon },
    ...subGuides
      .filter(sg => sg.href !== parent.href)
      .map(sg => ({ href: sg.href, label: sg.title, icon: sg.icon })),
  ];

  return (
    <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
