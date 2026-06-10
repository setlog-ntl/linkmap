'use client';

import type { ReactNode } from 'react';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface FaqItem {
  q: string;
  a: ReactNode;
}

export interface FaqSectionProps {
  items: FaqItem[];
  title?: string;
  description?: string;
  /** 하단 CTA 등 추가 콘텐츠 */
  footer?: ReactNode;
  id?: string;
  className?: string;
}

/**
 * 공통 FAQ 아코디언 섹션.
 * 기존 auth-guide / env-guide의 중복 구현을 단일화한다.
 */
export function FaqSection({
  items,
  title = '자주 묻는 질문',
  description,
  footer,
  id = 'faq',
  className,
}: FaqSectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 py-12 md:py-16 ${className ?? ''}`}>
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>
        {description ? (
          <p className="text-muted-foreground mb-8 max-w-2xl">{description}</p>
        ) : (
          <div className="mb-8" />
        )}
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="max-w-2xl">
          <Accordion type="single" collapsible className="space-y-2">
            {items.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border px-4">
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollReveal>

      {footer ? <ScrollReveal delay={0.2}>{footer}</ScrollReveal> : null}
    </section>
  );
}
