'use client';

import * as React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface IconTooltipProps {
  label: string;
  shortcut?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactElement;
}

/**
 * 아이콘 버튼 + 툴팁 래퍼.
 *
 * 부모가 asChild 트리거(SheetTrigger·DropdownMenuTrigger 등)로 감싸면 트리거가
 * onClick·ref·aria-*·data-state·className을 이 컴포넌트로 주입한다. 이를 자식(Button)으로
 * 포워딩하지 않으면 트리거가 동작하지 않는다(클릭해도 드롭다운/시트가 열리지 않음).
 * 따라서 forwardRef + cloneElement로 주입 props와 ref를 자식에 전달하며, className은
 * 덮어쓰지 않고 병합한다. 트리거 밖 단독 사용 시에는 주입 props가 없어 동작이 동일하다.
 */
export const IconTooltip = React.forwardRef<HTMLElement, IconTooltipProps>(
  function IconTooltip({ label, shortcut, side = 'top', children, ...rest }, ref) {
    const injected = rest as { className?: string };
    const childProps = (children.props ?? {}) as { className?: string };
    const forwarded: Record<string, unknown> = {
      ...rest,
      className: cn(childProps.className, injected.className),
    };
    if (ref) forwarded.ref = ref;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {React.cloneElement(children, forwarded)}
        </TooltipTrigger>
        <TooltipContent side={side}>
          <span className="flex items-center gap-1.5">
            {label}
            {shortcut && (
              <kbd className="ml-1 px-1 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border">
                {shortcut}
              </kbd>
            )}
          </span>
        </TooltipContent>
      </Tooltip>
    );
  }
);
