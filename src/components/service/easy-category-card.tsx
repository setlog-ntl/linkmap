'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import type { EasyCategory } from '@/types';
import {
  easyCategoryLabels,
  easyCategoryEmojis,
  easyCategoryDescriptions,
} from '@/lib/constants/easy-categories';

const POPULAR_CATEGORIES: EasyCategory[] = ['login_signup', 'data_storage', 'deploy_hosting'];

interface EasyCategoryCardProps {
  category: EasyCategory;
  serviceCount: number;
  selected: boolean;
  onClick: () => void;
}

export function EasyCategoryCard({ category, serviceCount, selected, onClick }: EasyCategoryCardProps) {
  const isPopular = POPULAR_CATEGORIES.includes(category);
  const label = easyCategoryLabels[category];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group ${
        selected ? 'ring-2 ring-primary shadow-md' : ''
      } ${isPopular ? 'border-primary/30' : ''}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`${label} 카테고리, ${serviceCount}개 서비스`}
      onKeyDown={handleKeyDown}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{easyCategoryEmojis[category]}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm">{label}</h3>
                {isPopular && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-0">
                    인기
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {easyCategoryDescriptions[category]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant="secondary" className="text-xs">
              {serviceCount}개
            </Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
