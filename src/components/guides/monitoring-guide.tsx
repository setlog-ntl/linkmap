'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './monitoring-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { WhyMonitoringSection } from './monitoring-guide/why-monitoring-section';
import { ToolsOverviewSection } from './monitoring-guide/tools-overview-section';
import { GettingStartedSection } from './monitoring-guide/getting-started-section';

const sections = [
  { id: 'why-monitoring', label: '왜 모니터링이 필요한가' },
  { id: 'tools-overview', label: '도구 소개' },
  { id: 'getting-started', label: '시작하기' },
] as const;

export function MonitoringGuide() {
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
            '배포하면 끝이 아니에요 — 사용자가 겪는 에러는 모니터링해야 보여요.',
            '에러 추적(Sentry)·웹 분석(GA)·세션 리플레이로 문제를 빨리 찾아요.',
            '피처 플래그로 새 기능을 일부 사용자에게만 점진적으로 열 수 있어요.',
          ]}
          youCanDo="배포 후 문제를 빨리 발견하고 대응하는 체계를 갖출 수 있어요."
        />
      </div>

      {/* Sticky section nav */}
      <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none [mask-image:linear-gradient(to_right,black_85%,transparent)] md:[mask-image:none]">
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

      <WhyMonitoringSection />
      <ToolsOverviewSection />
      <GettingStartedSection />
    </div>
  );
}
