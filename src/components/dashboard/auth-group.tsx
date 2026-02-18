'use client';

import { CompactCard } from './compact-card';
import type { ServiceCardData } from '@/types';

interface AuthGroupProps {
  cards: ServiceCardData[];
}

export function AuthGroup({ cards }: AuthGroupProps) {
  if (cards.length === 0) return null;

  const authCards = cards.filter((c) => c.dashboardSubcategory === 'auth');
  const socialCards = cards.filter((c) => c.dashboardSubcategory === 'social_login');

  return (
    <div className="rounded-lg border border-dashed border-purple-300 dark:border-purple-700 p-2.5 space-y-2">
      <p className="text-xs font-medium text-muted-foreground px-0.5">인증</p>
      {authCards.map((card) => (
        <CompactCard key={card.projectServiceId} card={card} />
      ))}
      {socialCards.length > 0 && (
        <div className="space-y-1.5 pl-2 border-l-2 border-purple-200 dark:border-purple-800">
          <p className="text-[11px] text-muted-foreground">소셜 로그인</p>
          {socialCards.map((card) => (
            <CompactCard key={card.projectServiceId} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
