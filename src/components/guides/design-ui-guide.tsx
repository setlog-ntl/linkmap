'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './design-ui-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { DesignBasicsSection } from './design-ui-guide/design-basics-section';
import { CssApproachSection } from './design-ui-guide/css-approach-section';
import { QuickStartSection } from './design-ui-guide/quick-start-section';

const sections = [
  { id: 'design-basics', label: '디자인 기초' },
  { id: 'css-approach', label: 'CSS 접근법' },
  { id: 'quick-start', label: '빠르게 시작하기' },
] as const;

export function DesignUiGuide() {
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
            '보기 좋은 UI의 기본은 색·글자·여백 3가지를 일관되게 쓰는 거예요.',
            'Tailwind CSS는 클래스 이름만으로 빠르게 스타일을 입히는 도구예요.',
            'shadcn/ui 같은 컴포넌트를 가져다 쓰면 디자인 시간을 크게 줄여요.',
          ]}
          youCanDo="AI가 만든 화면을 더 보기 좋고 일관되게 다듬을 수 있어요."
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

      <DesignBasicsSection />
      <CssApproachSection />
      <QuickStartSection />
    </div>
  );
}
