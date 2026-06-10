import type { LucideIcon } from 'lucide-react';
import {
  Lightbulb,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  CircleAlert,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CalloutVariant =
  | 'tip'
  | 'warning'
  | 'info'
  | 'success'
  | 'analogy'
  | 'mistake'
  | 'note';

interface VariantStyle {
  container: string;
  icon: LucideIcon;
  iconColor: string;
  titleColor: string;
  defaultLabel: string;
}

const VARIANTS: Record<CalloutVariant, VariantStyle> = {
  tip: {
    container: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900',
    icon: Lightbulb,
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-800 dark:text-blue-200',
    defaultLabel: '팁',
  },
  warning: {
    container: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900',
    icon: AlertTriangle,
    iconColor: 'text-amber-600 dark:text-amber-400',
    titleColor: 'text-amber-800 dark:text-amber-200',
    defaultLabel: '주의',
  },
  info: {
    container: 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900',
    icon: Info,
    iconColor: 'text-sky-600 dark:text-sky-400',
    titleColor: 'text-sky-800 dark:text-sky-200',
    defaultLabel: '알아두기',
  },
  success: {
    container: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    titleColor: 'text-emerald-800 dark:text-emerald-200',
    defaultLabel: '좋아요',
  },
  analogy: {
    container: 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900',
    icon: Sparkles,
    iconColor: 'text-violet-600 dark:text-violet-400',
    titleColor: 'text-violet-800 dark:text-violet-200',
    defaultLabel: '비유로 이해하기',
  },
  mistake: {
    container: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900',
    icon: CircleAlert,
    iconColor: 'text-rose-600 dark:text-rose-400',
    titleColor: 'text-rose-800 dark:text-rose-200',
    defaultLabel: '흔한 실수',
  },
  note: {
    container: 'bg-muted/50 border-border',
    icon: Info,
    iconColor: 'text-muted-foreground',
    titleColor: 'text-foreground',
    defaultLabel: '참고',
  },
};

export interface GuideCalloutProps {
  variant?: CalloutVariant;
  /** 제목. 생략 시 variant 기본 라벨 사용. 빈 문자열(`''`)이면 제목 숨김 */
  title?: string;
  /** variant 기본 아이콘을 덮어쓰기 */
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

/**
 * 가이드 본문에서 쓰는 통합 콜아웃 박스.
 * 분산돼 있던 색상 박스 패턴(tip/warning/info 등)을 하나로 통일한다.
 */
export function GuideCallout({
  variant = 'tip',
  title,
  icon,
  children,
  className,
}: GuideCalloutProps) {
  const style = VARIANTS[variant];
  const Icon = icon ?? style.icon;
  const heading = title === undefined ? style.defaultLabel : title;

  return (
    <div className={cn('rounded-lg border p-4 flex gap-3', style.container, className)}>
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', style.iconColor)} aria-hidden />
      <div className="min-w-0 text-sm leading-relaxed">
        {heading ? <div className={cn('font-semibold mb-1', style.titleColor)}>{heading}</div> : null}
        <div className="text-muted-foreground [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline">
          {children}
        </div>
      </div>
    </div>
  );
}
