import { Zap, Clock, Target, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GuideTLDRProps {
  /** 핵심 요약 (3줄 내외 권장) */
  points: string[];
  /** "이걸 배우면 할 수 있는 것" 한 줄 */
  youCanDo?: string;
  /** 예상 소요 시간 (예: "10분") */
  readingTime?: string;
  /** 난이도 라벨 (예: "왕초보", "입문", "초급", "중급") */
  level?: string;
  title?: string;
  className?: string;
}

/**
 * 가이드 상단 30초 요약 박스(TL;DR).
 * 초보자가 본문을 읽기 전 "큰 그림 + 이걸 배우면 뭘 할 수 있나"를 먼저 잡도록 한다.
 * hero 바로 아래에 표준 삽입.
 */
export function GuideTLDR({
  points,
  youCanDo,
  readingTime,
  level,
  title = '30초 요약',
  className,
}: GuideTLDRProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-primary/20 bg-primary/5 p-5 md:p-6',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
          <Zap className="h-4 w-4" aria-hidden />
          {title}
        </span>
        {level ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            <Target className="h-3 w-3" aria-hidden />
            {level}
          </span>
        ) : null}
        {readingTime ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden />
            {readingTime}
          </span>
        ) : null}
      </div>

      <ul className="space-y-1.5">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
            <Check className="h-4 w-4 shrink-0 mt-0.5 text-primary" aria-hidden />
            <span className="text-foreground/90">{point}</span>
          </li>
        ))}
      </ul>

      {youCanDo ? (
        <p className="mt-3 pt-3 border-t border-primary/15 text-sm">
          <span className="font-semibold text-primary">이걸 배우면 → </span>
          <span className="text-muted-foreground">{youCanDo}</span>
        </p>
      ) : null}
    </div>
  );
}
