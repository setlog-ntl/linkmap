'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './frontend-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { BrowserRenderingSection } from './frontend-guide/browser-rendering-section';
import { ComponentsSection } from './frontend-guide/components-section';
import { RenderingModesSection } from './frontend-guide/rendering-modes-section';
import { StackSection } from './frontend-guide/stack-section';

const sections = [
  { id: 'browser-rendering', label: '브라우저 렌더링' },
  { id: 'components', label: '컴포넌트' },
  { id: 'rendering-modes', label: 'CSR · SSR · SSG' },
  { id: 'stack', label: '기술 스택' },
] as const;

export function FrontendGuide() {
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
          readingTime="12분"
          points={[
            '프론트엔드는 사용자가 직접 보고 누르는 "화면"을 만드는 영역이에요.',
            '브라우저는 HTML(뼈대)·CSS(꾸미기)·JS(동작)를 받아 화면을 그려요.',
            'CSR·SSR·SSG는 "언제·어디서 화면을 그리느냐"의 차이 — 상황에 맞게 골라요.',
          ]}
          youCanDo="AI가 만든 화면 코드의 구조를 이해하고 어디를 고칠지 잡을 수 있어요."
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

      <BrowserRenderingSection />
      <ComponentsSection />
      <RenderingModesSection />
      <StackSection />
    </div>
  );
}
