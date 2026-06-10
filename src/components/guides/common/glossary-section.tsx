'use client';

import type { LucideIcon } from 'lucide-react';
import { ScrollReveal } from '@/components/landing/scroll-reveal';

export interface GlossaryEntry {
  term: string;
  icon: LucideIcon;
  /** 일상적 비유 (배지로 표시) */
  metaphor?: string;
  description: string;
}

type Accent = 'purple' | 'blue' | 'green';

const ACCENTS: Record<Accent, { dot: string; label: string; iconWrap: string; icon: string; badge: string }> = {
  purple: {
    dot: 'bg-purple-500',
    label: 'text-purple-600 dark:text-purple-400',
    iconWrap: 'bg-purple-100 dark:bg-purple-900/30',
    icon: 'text-purple-600 dark:text-purple-400',
    badge: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
  },
  blue: {
    dot: 'bg-blue-500',
    label: 'text-blue-600 dark:text-blue-400',
    iconWrap: 'bg-blue-100 dark:bg-blue-900/30',
    icon: 'text-blue-600 dark:text-blue-400',
    badge: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
  },
  green: {
    dot: 'bg-emerald-500',
    label: 'text-emerald-600 dark:text-emerald-400',
    iconWrap: 'bg-emerald-100 dark:bg-emerald-900/30',
    icon: 'text-emerald-600 dark:text-emerald-400',
    badge: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
  },
};

export interface GlossarySectionProps {
  items: GlossaryEntry[];
  title?: string;
  description?: string;
  accent?: Accent;
  id?: string;
}

/**
 * 공통 용어사전 섹션 — 어려운 용어를 일상 비유 배지와 함께 설명한다.
 * 기존 auth-guide/glossary-section.tsx 패턴을 일반화.
 */
export function GlossarySection({
  items,
  title = '용어 사전',
  description = '헷갈리는 용어가 나오면 여기서 확인하세요. 일상적인 비유와 함께 설명합니다.',
  accent = 'purple',
  id = 'glossary',
}: GlossarySectionProps) {
  const c = ACCENTS[accent];

  return (
    <section id={id} className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <div className="mb-8">
          <div className={`inline-flex items-center gap-2 text-xs font-semibold ${c.label} mb-2 tracking-wide uppercase`}>
            <div className={`w-2 h-2 rounded-full ${c.dot}`} />
            Glossary
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.term} className="rounded-xl border bg-card p-5 flex flex-col gap-3">
                <dt className="flex items-center gap-3 flex-wrap">
                  <div className={`w-9 h-9 rounded-lg ${c.iconWrap} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${c.icon}`} />
                  </div>
                  <div>
                    <span className="font-semibold text-sm">{item.term}</span>
                    {item.metaphor ? (
                      <span className={`ml-2 text-xs ${c.badge} px-2 py-0.5 rounded-full`}>
                        {item.metaphor}
                      </span>
                    ) : null}
                  </div>
                </dt>
                <dd className="text-sm text-muted-foreground leading-relaxed">{item.description}</dd>
              </div>
            );
          })}
        </dl>
      </ScrollReveal>
    </section>
  );
}
