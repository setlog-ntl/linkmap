'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Globe, FolderKanban, Rocket, Heart, MessageSquare } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { SHOWCASE_CATEGORIES } from '@/types/core';
import Link from 'next/link';
import type { ShowcaseItem } from '@/lib/queries/showcase';

// 카테고리별 그라데이션 색상
const CATEGORY_GRADIENTS: Record<string, string> = {
  portfolio: 'from-violet-500/20 to-purple-600/20',
  business: 'from-blue-500/20 to-cyan-600/20',
  blog: 'from-emerald-500/20 to-teal-600/20',
  landing: 'from-orange-500/20 to-amber-600/20',
  community: 'from-pink-500/20 to-rose-600/20',
  ecommerce: 'from-indigo-500/20 to-blue-600/20',
  other: 'from-slate-500/20 to-gray-600/20',
};

interface ShowcaseCardProps {
  item: ShowcaseItem;
}

export function ShowcaseCard({ item }: ShowcaseCardProps) {
  const { locale } = useLocaleStore();
  const liveUrl = item.pages_url || item.deployment_url;

  const templateName = item.homepage_templates
    ? (locale === 'ko' ? item.homepage_templates.name_ko : item.homepage_templates.name)
    : null;

  const authorName = item.profiles?.name || '익명';
  const authorInitial = authorName.charAt(0).toUpperCase();

  const categoryLabel = item.showcase_category
    ? SHOWCASE_CATEGORIES.find((c) => c.value === item.showcase_category)?.label
    : null;

  const isProject = item.source === 'project';
  const gradient = CATEGORY_GRADIENTS[item.showcase_category || 'other'] || CATEGORY_GRADIENTS.other;
  const previewImage = item.showcase_image_url || item.homepage_templates?.preview_image_url;

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      {/* Preview Area */}
      <Link
        prefetch={false}
        href={`/showcase/${item.id}`}
        className="block relative w-full h-40 sm:h-48 md:h-60 border-b cursor-pointer"
      >
        {previewImage ? (
          /* 이미지가 있을 때 */
          <>
            <img
              src={previewImage}
              alt={item.site_name || '쇼케이스'}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/60 px-3 py-1.5 rounded-md text-sm font-medium">
                상세보기
              </span>
            </div>
          </>
        ) : (
          /* 이미지 없을 때 기존 시각적 카드 */
          <>
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }} />

            {/* Mini browser bar */}
            <div className="absolute top-0 left-0 right-0 h-7 bg-muted/90 border-b z-20 flex items-center px-2 gap-1.5 rounded-t-[inherit]">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-red-400/60" />
                <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
                <span className="h-2 w-2 rounded-full bg-green-400/60" />
              </div>
              {liveUrl && (
                <div className="flex-1 h-4 bg-background/70 rounded flex items-center gap-1 px-1.5 text-muted-foreground truncate min-w-0 ml-1">
                  <Globe className="h-2 w-2 shrink-0" />
                  <span className="text-[8px] font-mono truncate">
                    {liveUrl.replace('https://', '').replace('http://', '')}
                  </span>
                </div>
              )}
            </div>

            {/* Center content */}
            <div className="absolute inset-0 top-7 flex flex-col items-center justify-center gap-3 p-4">
              {isProject && item.project_icon_type === 'emoji' && item.project_icon_value ? (
                <span className="text-4xl">{item.project_icon_value}</span>
              ) : (
                <div className="h-12 w-12 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                  {isProject ? (
                    <FolderKanban className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <Rocket className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              )}
              <span className="text-sm font-semibold text-foreground/80 text-center line-clamp-1 max-w-[80%]">
                {item.site_name}
              </span>
              {categoryLabel && (
                <Badge variant="secondary" className="text-[10px]">
                  {categoryLabel}
                </Badge>
              )}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 top-7 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/60 px-3 py-1.5 rounded-md text-sm font-medium">
                상세보기
              </span>
            </div>
          </>
        )}
      </Link>

      {/* Info */}
      <CardContent className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link prefetch={false} href={`/showcase/${item.id}`} className="hover:underline">
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
          {/* Source badge */}
          <Badge variant="outline" className="text-[10px] shrink-0 gap-1">
            {isProject ? (
              <><FolderKanban className="h-2.5 w-2.5" /> 프로젝트</>
            ) : (
              <><Rocket className="h-2.5 w-2.5" /> 배포</>
            )}
          </Badge>
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
          <div className="flex items-center gap-3">
            {/* 추천수 */}
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Heart className="h-3 w-3 text-red-400" />
              {item.like_count ?? 0}
            </span>
            {/* 댓글수 */}
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              {item.comment_count ?? 0}
            </span>
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
