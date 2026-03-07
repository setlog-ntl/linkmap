'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Globe, Loader2 } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { SHOWCASE_CATEGORIES } from '@/types/core';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { ShowcaseItem } from '@/lib/queries/showcase';

interface ShowcaseCardProps {
  item: ShowcaseItem;
}

export function ShowcaseCard({ item }: ShowcaseCardProps) {
  const { locale } = useLocaleStore();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const liveUrl = item.pages_url || item.deployment_url;

  const templateName = item.homepage_templates
    ? (locale === 'ko' ? item.homepage_templates.name_ko : item.homepage_templates.name)
    : null;

  const authorName = item.profiles?.name || '익명';
  const authorInitial = authorName.charAt(0).toUpperCase();

  const categoryLabel = item.showcase_category
    ? SHOWCASE_CATEGORIES.find((c) => c.value === item.showcase_category)?.label
    : null;

  const deployDate = item.deployed_at
    ? new Date(item.deployed_at).toLocaleDateString(
        locale === 'ko' ? 'ko-KR' : 'en-US',
        { year: 'numeric', month: 'short', day: 'numeric' }
      )
    : null;

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      {/* Preview - 클릭 시 상세 페이지 이동 */}
      <Link
        href={`/showcase/${item.id}`}
        className="block relative w-full bg-muted border-b cursor-pointer"
        style={{ height: '200px' }}
      >
        {liveUrl ? (
          <>
            {/* Mini browser bar */}
            <div className="absolute top-0 left-0 right-0 h-7 bg-muted/90 border-b z-20 flex items-center px-2 gap-1.5 rounded-t-[inherit]">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-red-400/60" />
                <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
                <span className="h-2 w-2 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 h-4 bg-background/70 rounded flex items-center gap-1 px-1.5 text-muted-foreground truncate min-w-0 ml-1">
                <Globe className="h-2 w-2 shrink-0" />
                <span className="text-[8px] font-mono truncate">
                  {liveUrl.replace('https://', '')}
                </span>
              </div>
            </div>

            {/* Scaled iframe */}
            <div className="absolute left-0 right-0 bottom-0 top-7 overflow-hidden pointer-events-none">
              <iframe
                src={liveUrl}
                title={`${item.site_name} 미리보기`}
                className={cn(
                  'absolute top-0 left-0 border-0 transition-opacity duration-700',
                  iframeLoaded ? 'opacity-100' : 'opacity-80'
                )}
                style={{
                  width: '1280px',
                  height: '800px',
                  transform: 'scale(0.25)',
                  transformOrigin: 'top left',
                }}
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>

            {/* Loading overlay */}
            {!iframeLoaded && (
              <div className="absolute left-0 right-0 bottom-0 top-7 flex items-center justify-center bg-muted">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 top-7 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/60 px-3 py-1.5 rounded-md text-sm font-medium">
                상세보기
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Globe className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
      </Link>

      {/* Info */}
      <CardContent className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link href={`/showcase/${item.id}`} className="hover:underline">
              <h3 className="font-semibold truncate">{item.site_name}</h3>
            </Link>
            {templateName && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {templateName}
                {item.homepage_templates?.framework && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">
                    {item.homepage_templates.framework}
                  </span>
                )}
              </p>
            )}
          </div>
          {categoryLabel && (
            <Badge variant="outline" className="text-[10px] shrink-0">
              {categoryLabel}
            </Badge>
          )}
        </div>

        {/* Description */}
        {item.showcase_description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.showcase_description}
          </p>
        )}

        {/* Tags */}
        {item.showcase_tags && item.showcase_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.showcase_tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Author + Date + Visit */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={item.profiles?.avatar_url || undefined} alt={authorName} />
              <AvatarFallback className="text-[8px]">{authorInitial}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            {deployDate && (
              <span className="text-[10px] text-muted-foreground">{deployDate}</span>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
