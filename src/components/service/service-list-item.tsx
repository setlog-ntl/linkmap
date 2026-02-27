'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight, KeyRound } from 'lucide-react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { DifficultyBadge, GithubStarsBadge, FreeTierBadge } from './service-badges';
import { allCategoryLabels } from '@/lib/constants/service-filters';
import type { Service, ServiceCategory } from '@/types';

interface ServiceListItemProps {
  service: Service;
  isUsed?: boolean;
  hasGuide?: boolean;
  apiKeyInfo?: { url: string; label: string | null } | null;
}

export function ServiceListItem({ service, isUsed = false, hasGuide = false, apiKeyInfo }: ServiceListItemProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center gap-4 p-4">
        {/* Icon */}
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <ServiceIcon serviceId={service.slug} size={24} />
        </div>

        {/* Name + Description */}
        <Link href={`/services/${service.slug}`} className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm group-hover:text-primary transition-colors truncate">
              {service.name}
            </span>
            {isUsed && (
              <Badge className="text-xs bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 shrink-0">
                사용 중
              </Badge>
            )}
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {service.description_ko || service.description}
          </p>
        </Link>

        {/* Category */}
        <Badge variant="secondary" className="text-xs hidden md:inline-flex shrink-0">
          {allCategoryLabels[service.category as ServiceCategory] || service.category}
        </Badge>

        {/* Badges */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <DifficultyBadge level={service.difficulty_level} />
          <FreeTierBadge quality={service.free_tier_quality} />
          <GithubStarsBadge stars={service.github_stars} />
        </div>

        {/* External links */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {hasGuide && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="빠른 설정">
              <Link href={`/services/${service.slug}?tab=quickstart`} onClick={(e) => e.stopPropagation()}>
                <KeyRound className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
          {apiKeyInfo && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title={apiKeyInfo.label || '키 설정'}>
              <a href={apiKeyInfo.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
          {service.website_url && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={service.website_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
