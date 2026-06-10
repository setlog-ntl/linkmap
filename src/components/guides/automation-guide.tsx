'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './automation-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { WhatIsAutomationSection } from './automation-guide/what-is-automation-section';
import { AutomationTypesSection } from './automation-guide/automation-types-section';
import { UseCasesSection } from './automation-guide/use-cases-section';

const sections = [
  { id: 'what-is-automation', label: '자동화란?' },
  { id: 'automation-types', label: '자동화 유형' },
  { id: 'use-cases', label: '활용 사례' },
] as const;

export function AutomationGuide() {
  const [activeSection, setActiveSection] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    for (const el of elements) {
      observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <HeroSection />

      <div className="max-w-2xl mx-auto mb-6 px-1">
        <GuideTLDR
          level="입문"
          readingTime="10분"
          points={[
            '자동화는 반복되는 수작업을 코드가 알아서 하게 만드는 거예요.',
            '웹훅은 "어떤 일이 생기면 알려줘" 하는 이벤트 알림 방식이에요.',
            '정해진 시간에 작업을 돌리는 스케줄링(cron)·큐도 자주 써요.',
          ]}
          youCanDo="반복 작업을 줄이고 서비스 간 연동을 자동으로 굴릴 수 있어요."
        />
      </div>

      {/* Sticky section nav */}
      <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === s.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      <WhatIsAutomationSection />
      <AutomationTypesSection />
      <UseCasesSection />
    </div>
  );
}
