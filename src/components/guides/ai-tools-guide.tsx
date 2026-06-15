'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './ai-tools-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { VibeCodingSection } from './ai-tools-guide/vibe-coding-section';
import { AiLandscapeSection } from './ai-tools-guide/ai-landscape-section';
import { GettingStartedSection } from './ai-tools-guide/getting-started-section';

const sections = [
  { id: 'vibe-coding', label: '바이브코딩이란?' },
  { id: 'ai-tools-landscape', label: 'AI 코딩 도구 지형도' },
  { id: 'getting-started', label: '시작하기' },
] as const;

export function AiToolsGuide() {
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
          level="왕초보"
          readingTime="15분"
          points={[
            '바이브코딩은 코드를 직접 타이핑하지 않고 AI와 대화하며 만드는 방식이에요.',
            'Cursor·Claude Code 같은 도구가 코드 작성·수정·실행을 대신 해줘요.',
            '핵심은 "무엇을, 어떻게" 정확히 지시하는 능력 — 도구보다 지시가 중요해요.',
          ]}
          youCanDo="나에게 맞는 AI 코딩 도구를 골라 첫 프로젝트 작업을 시작할 수 있어요."
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

      <VibeCodingSection />
      <AiLandscapeSection />
      <GettingStartedSection />
    </div>
  );
}
