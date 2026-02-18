'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface CardRect {
  serviceId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export function useCardPositions(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [positions, setPositions] = useState<Map<string, CardRect>>(new Map());
  const rafRef = useRef<number | null>(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const cards = container.querySelectorAll<HTMLElement>('[data-service-id]');
    const next = new Map<string, CardRect>();

    cards.forEach((el) => {
      const serviceId = el.dataset.serviceId;
      if (!serviceId) return;
      const rect = el.getBoundingClientRect();
      const x = rect.left - containerRect.left;
      const y = rect.top - containerRect.top;
      next.set(serviceId, {
        serviceId,
        x,
        y,
        width: rect.width,
        height: rect.height,
        centerX: x + rect.width / 2,
        centerY: y + rect.height / 2,
      });
    });

    setPositions(next);
  }, [containerRef]);

  const scheduleMeasure = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(measure);
  }, [measure]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial measurement
    scheduleMeasure();

    // Observe resize changes
    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(container);

    // Also re-measure on window resize
    window.addEventListener('resize', scheduleMeasure);

    // MutationObserver for DOM changes (expand/collapse cards)
    const mo = new MutationObserver(scheduleMeasure);
    mo.observe(container, { childList: true, subtree: true, attributes: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, scheduleMeasure]);

  return { positions, refresh: scheduleMeasure };
}
