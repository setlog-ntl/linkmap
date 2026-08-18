import { Play, Clapperboard } from 'lucide-react';
import {
  getYoutubeWatchUrl,
  type ResourceYoutube,
} from '@/data/resources/free-resources';

/**
 * 자료 ↔ 유튜브 상호연결 카드.
 *
 * videoId가 null이면 "영상 준비 중", 채워지면 재생 카드로 자동 전환된다.
 * 외부 썸네일(i.ytimg.com)을 쓰지 않는다 — 외부 요청 0건으로 유지해
 * CSP·Workers 부담 없이 Linkmap 디자인 톤을 그대로 쓰기 위함.
 */
export function ResourceVideoCard({ youtube }: { youtube: ResourceYoutube }) {
  const watchUrl = getYoutubeWatchUrl(youtube);

  if (!watchUrl) {
    return (
      <div className="flex items-start gap-3.5 rounded-xl border border-dashed border-border bg-muted/40 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Clapperboard className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            영상 준비 중
          </p>
          <p className="mt-1 font-medium break-keep">{youtube.title}</p>
          <p className="mt-1 text-sm text-muted-foreground break-keep">
            영상이 공개되면 이 자리에 바로 연결됩니다. 자료는 지금도 그대로 쓸 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <a
      href={watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3.5 rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-brand-blue/40 hover:shadow-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 transition-colors group-hover:bg-brand-blue/20">
        <Play className="h-5 w-5 fill-brand-blue text-brand-blue" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
          영상으로 보기
        </p>
        <p className="mt-1 font-medium break-keep group-hover:text-brand-blue transition-colors">
          {youtube.title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground break-keep">
          {youtube.series ? `${youtube.series} · ` : ''}유튜브에서 재생됩니다
        </p>
      </div>
    </a>
  );
}
