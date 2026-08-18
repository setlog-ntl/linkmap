import Link from 'next/link';
import { ArrowRight, Clapperboard, Gift, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  RESOURCE_CATEGORIES,
  type FreeResource,
} from '@/data/resources/free-resources';

function ResourceCard({ resource }: { resource: FreeResource }) {
  const category = RESOURCE_CATEGORIES[resource.category];
  const hasVideo = resource.youtube.videoId !== null;

  return (
    <Link
      href={`/resources/${resource.slug}`}
      prefetch={false}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-brand-blue/40 hover:shadow-md"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-brand-green/15 text-brand-green">
          자료 {resource.order}번
        </Badge>
        <Badge variant="outline" className="border-brand-blue/30 text-brand-blue">
          {category.label}
        </Badge>
      </div>

      <h2 className="text-lg font-bold tracking-tight break-keep transition-colors group-hover:text-brand-blue">
        {resource.title}
      </h2>
      <p className="text-sm text-muted-foreground break-keep">{resource.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {resource.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          {hasVideo ? (
            <>
              <Play className="h-3.5 w-3.5 fill-brand-blue text-brand-blue" />
              영상 연결됨
            </>
          ) : (
            <>
              <Clapperboard className="h-3.5 w-3.5" />
              영상 준비 중
            </>
          )}
        </span>
        <span className="flex items-center gap-1 font-medium text-brand-blue">
          자료 보기
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function ResourcesHub({ resources }: { resources: FreeResource[] }) {
  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-sm font-medium text-brand-green">
          <Gift className="h-4 w-4" />
          무료배포 자료
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight break-keep">
          영상에서 쓴 것, 그대로 드립니다
        </h1>
        <p className="mx-auto max-w-lg text-muted-foreground break-keep">
          복사해서 바로 쓰는 지시문과 도구를 무료로 공개합니다.
          가입도 결제도 없이 열어 보고, 마음에 들면 Linkmap으로 배포까지 해보세요.
        </p>
      </div>

      {/* Resource grid — 자료가 1건일 때 반쪽 카드로 남지 않도록 폭을 맞춘다 */}
      <div
        className={cn(
          'mx-auto grid gap-5',
          resources.length > 1 ? 'max-w-5xl md:grid-cols-2' : 'max-w-xl'
        )}
      >
        {resources.map((resource) => (
          <ResourceCard key={resource.slug} resource={resource} />
        ))}
      </div>

      {/* 예고 */}
      <p className="mt-10 text-center text-sm text-muted-foreground">
        새 영상이 올라갈 때마다 자료가 한 건씩 추가됩니다.
      </p>
    </div>
  );
}
