'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { GUIDE_LIST, getSubGuides } from '@/data/ui/guide-meta';
import { GuideSubNav } from './guide-sub-nav';

interface GuideLayoutClientProps {
  parentSlug: string;
  children: React.ReactNode;
}

export function GuideLayoutClient({ parentSlug, children }: GuideLayoutClientProps) {
  const pathname = usePathname();
  const parent = GUIDE_LIST.find(g => g.slug === parentSlug);
  const subGuides = getSubGuides(parentSlug);

  if (!parent) return <>{children}</>;

  const isSubPage = pathname !== parent.href;

  // 서브 가이드 href → title 매핑
  const currentSub = subGuides.find(sg => sg.href === pathname);
  const currentLabel = currentSub?.title ?? '';

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground py-4">
        <Link href="/guides" prefetch={false} className="hover:text-foreground transition-colors">
          가이드
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {isSubPage ? (
          <>
            <Link href={parent.href} prefetch={false} className="hover:text-foreground transition-colors">
              {parent.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">{currentLabel}</span>
          </>
        ) : (
          <span className="text-foreground font-medium">{parent.title}</span>
        )}
      </nav>

      {/* Sub Navigation */}
      {subGuides.length > 0 && <GuideSubNav parentSlug={parentSlug} />}

      {/* Content */}
      {children}
    </div>
  );
}
