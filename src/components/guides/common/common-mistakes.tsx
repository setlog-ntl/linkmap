import { CircleAlert, XCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MistakeItem {
  /** 초보자가 자주 저지르는 실수 */
  mistake: string;
  /** 올바른 해결/대처 방법 */
  fix: string;
  /** 선택: 해결 코드 스니펫 */
  code?: string;
}

export interface CommonMistakesProps {
  items: MistakeItem[];
  title?: string;
  className?: string;
}

/**
 * "흔한 실수 & 해결" 목록 — 각 항목을 ❌ 실수 → ✅ 해결로 대비시켜 보여준다.
 * 실전 트러블슈팅 감각을 초보자에게 미리 심어주는 표준 컴포넌트.
 */
export function CommonMistakes({ items, title = '흔한 실수 & 해결', className }: CommonMistakesProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="flex items-center gap-2 text-base font-semibold">
        <CircleAlert className="h-4.5 w-4.5 text-rose-500" aria-hidden />
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="rounded-lg border bg-card p-4">
            <div className="flex items-start gap-2 text-sm">
              <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" aria-hidden />
              <span className="text-foreground">{item.mistake}</span>
            </div>
            <div className="flex items-start gap-2 text-sm mt-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" aria-hidden />
              <span className="text-muted-foreground">{item.fix}</span>
            </div>
            {item.code ? (
              <pre className="mt-2 ml-6 overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs font-mono text-foreground">
                <code>{item.code}</code>
              </pre>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
