import type { ReactNode } from 'react';
import { GuideCallout } from './guide-callout';

export interface AnalogyBoxProps {
  /** 설명할 개념 (예: "API") */
  concept: string;
  /** 한 줄 비유 (예: "레스토랑에서 메뉴판으로 주문하기") */
  analogy: string;
  /** 비유에 대한 상세 설명 */
  children?: ReactNode;
  className?: string;
}

/**
 * "비유로 이해하기" 박스 — 어려운 개념을 실생활 비유로 풀어준다.
 * 초보자가 추상 개념을 직관적으로 잡도록 돕는 표준 컴포넌트.
 */
export function AnalogyBox({ concept, analogy, children, className }: AnalogyBoxProps) {
  return (
    <GuideCallout variant="analogy" title={`비유로 이해하기 — ${concept}`} className={className}>
      <p className="font-medium text-violet-800 dark:text-violet-200 mb-1">
        {concept} = {analogy}
      </p>
      {children ? <div className="mt-1">{children}</div> : null}
    </GuideCallout>
  );
}
