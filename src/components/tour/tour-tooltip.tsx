'use client';

import { useEffect, useRef, useCallback, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TourStep, TourPlacement } from '@/data/ui/tour-steps';

interface TourTooltipProps {
  steps: TourStep[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

interface TooltipPos {
  top: number;
  left: number;
  arrowPlacement: TourPlacement;
}

const TOOLTIP_WIDTH = 320;
const TOOLTIP_OFFSET = 12;

function computePosition(
  rect: DOMRect,
  placement: TourPlacement,
  tooltipHeight: number,
): TooltipPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top = 0;
  let left = 0;
  let arrowPlacement: TourPlacement = placement;

  switch (placement) {
    case 'bottom':
      top = rect.bottom + TOOLTIP_OFFSET;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      if (top + tooltipHeight > vh - 16) {
        top = rect.top - tooltipHeight - TOOLTIP_OFFSET;
        arrowPlacement = 'top';
      }
      break;
    case 'top':
      top = rect.top - tooltipHeight - TOOLTIP_OFFSET;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      if (top < 16) {
        top = rect.bottom + TOOLTIP_OFFSET;
        arrowPlacement = 'bottom';
      }
      break;
    case 'right':
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.right + TOOLTIP_OFFSET;
      if (left + TOOLTIP_WIDTH > vw - 16) {
        left = rect.left - TOOLTIP_WIDTH - TOOLTIP_OFFSET;
        arrowPlacement = 'left';
      }
      break;
    case 'left':
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.left - TOOLTIP_WIDTH - TOOLTIP_OFFSET;
      if (left < 16) {
        left = rect.right + TOOLTIP_OFFSET;
        arrowPlacement = 'right';
      }
      break;
  }

  // Clamp to viewport
  left = Math.max(16, Math.min(left, vw - TOOLTIP_WIDTH - 16));
  top = Math.max(16, Math.min(top, vh - tooltipHeight - 16));

  return { top, left, arrowPlacement };
}

function isOutsideViewport(rect: DOMRect): boolean {
  return (
    rect.bottom < 0 ||
    rect.top > window.innerHeight ||
    rect.right < 0 ||
    rect.left > window.innerWidth
  );
}

export function TourTooltip({ steps, currentStep, onNext, onPrev, onClose }: TourTooltipProps) {
  const step = steps[currentStep];
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  // P0-3: 스텝 전환 애니메이션
  const [visible, setVisible] = useState(false);

  // P0-5: ARIA id 연결
  const titleId = useId();
  const descId = useId();

  const updatePosition = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.targetSelector);
    if (!el) {
      setPos(null);
      setTargetRect(null);
      return;
    }
    const rect = el.getBoundingClientRect();

    // P0-2: 뷰포트 밖이면 스크롤 후 재계산
    if (isOutsideViewport(rect)) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => {
        const updated = el.getBoundingClientRect();
        setTargetRect(updated);
        const tooltipHeight = tooltipRef.current?.offsetHeight ?? 160;
        setPos(computePosition(updated, step.placement, tooltipHeight));
      }, 400);
      return;
    }

    setTargetRect(rect);
    const tooltipHeight = tooltipRef.current?.offsetHeight ?? 160;
    setPos(computePosition(rect, step.placement, tooltipHeight));
  }, [step]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // P0-3: 스텝 변경 시 애니메이션 리셋
  useEffect(() => {
    setVisible(false);
    const t = window.setTimeout(() => setVisible(true), 50);
    return () => window.clearTimeout(t);
  }, [currentStep]);

  useEffect(() => {
    if (!mounted) return;
    const t = window.setTimeout(updatePosition, 80);
    return () => window.clearTimeout(t);
  }, [mounted, updatePosition, currentStep]);

  useEffect(() => {
    if (!mounted) return;
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    const ro = new ResizeObserver(updatePosition);
    if (step) {
      const el = document.querySelector(step.targetSelector);
      if (el) ro.observe(el);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      ro.disconnect();
    };
  }, [mounted, updatePosition, step]);

  // Recompute when tooltip height settles
  useEffect(() => {
    if (tooltipRef.current && pos && step) {
      const h = tooltipRef.current.offsetHeight;
      if (h > 0) {
        const el = document.querySelector(step.targetSelector);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const newPos = computePosition(rect, step.placement, h);
        if (Math.abs(newPos.top - pos.top) > 2 || Math.abs(newPos.left - pos.left) > 2) {
          setPos(newPos);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos?.top, pos?.left]);

  // P0-5: 툴팁에 포커스 (스텝 이동 시)
  useEffect(() => {
    if (pos) {
      window.setTimeout(() => tooltipRef.current?.focus(), 60);
    }
  }, [pos]);

  // P0-1: 키보드 네비게이션 (Esc / ←→)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'ArrowRight' && currentStep < steps.length - 1) {
        e.preventDefault();
        onNext();
      }
      if (e.key === 'ArrowLeft' && currentStep > 0) {
        e.preventDefault();
        onPrev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentStep, steps.length, onClose, onNext, onPrev]);

  if (!mounted || !step) return null;

  const arrowStyle = (placement: TourPlacement): React.CSSProperties => {
    const base: React.CSSProperties = { position: 'absolute', width: 0, height: 0 };
    switch (placement) {
      case 'bottom':
        return {
          ...base,
          top: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: '8px solid hsl(var(--border))',
        };
      case 'top':
        return {
          ...base,
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid hsl(var(--border))',
        };
      case 'right':
        return {
          ...base,
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '8px solid hsl(var(--border))',
        };
      case 'left':
        return {
          ...base,
          right: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderLeft: '8px solid hsl(var(--border))',
        };
    }
  };

  return createPortal(
    <>
      {/* P0-5: aria-live 영역 — 스텝 전환 스크린리더 알림 */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {step.title}, {currentStep + 1}단계 / {steps.length}단계
      </div>

      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Target highlight */}
      {targetRect && (
        <div
          className="fixed z-[52] rounded-lg pointer-events-none transition-all duration-300"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: '0 0 0 2px hsl(var(--primary)), 0 0 0 5px hsl(var(--background))',
          }}
          aria-hidden="true"
        />
      )}

      {/* Tooltip */}
      {/* P0-3: 스텝 전환 fade + slide 애니메이션 */}
      <div
        ref={tooltipRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={[
          'fixed z-[51] bg-card border shadow-lg rounded-xl outline-none',
          'transition-all duration-200 ease-out',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5',
        ].join(' ')}
        style={{
          width: TOOLTIP_WIDTH,
          top: pos ? pos.top : -9999,
          left: pos ? pos.left : -9999,
        }}
      >
        {/* Arrow */}
        {pos && <div style={arrowStyle(pos.arrowPlacement)} aria-hidden="true" />}

        {/* Header */}
        <div className="flex items-start justify-between px-4 pt-4 pb-2">
          <p id={titleId} className="text-sm font-semibold leading-snug pr-2">{step.title}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 -mt-0.5"
            onClick={onClose}
            aria-label="투어 닫기 (Esc)"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-4 pb-3">
          <p id={descId} className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          {/* P0-4: 도트 인디케이터 */}
          <div className="flex items-center gap-1" aria-hidden="true">
            {steps.map((_, i) => (
              <div
                key={i}
                className={[
                  'h-1.5 rounded-full transition-all duration-300',
                  i === currentStep
                    ? 'w-4 bg-primary'
                    : 'w-1.5 bg-muted-foreground/30',
                ].join(' ')}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 gap-1"
                onClick={onPrev}
                aria-label="이전 단계 (←)"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                이전
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button
                size="sm"
                className="h-7 px-2.5 gap-1"
                onClick={onNext}
                aria-label="다음 단계 (→)"
              >
                다음
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button size="sm" className="h-7 px-3" onClick={onClose}>
                완료
              </Button>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
