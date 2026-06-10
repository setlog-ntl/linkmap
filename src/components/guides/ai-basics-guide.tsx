'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './ai-basics-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { HowAiWorksSection } from './ai-basics-guide/how-ai-works-section';
import { AiModelsSection } from './ai-basics-guide/ai-models-section';
import { SafeUsageSection } from './ai-basics-guide/safe-usage-section';

const sections = [
  { id: 'how-ai-works', label: 'AI는 어떻게 작동할까?' },
  { id: 'ai-models', label: 'AI 모델 지형도' },
  { id: 'safe-usage', label: '안전하게 사용하기' },
] as const;

export function AiBasicsGuide() {
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
          readingTime="20분"
          points={[
            'AI(LLM)는 수많은 글에서 패턴을 배워 "다음에 올 단어"를 확률로 예측하는 도구예요.',
            '모델마다 똑똑함·속도·가격이 달라요 — 작업에 맞게 고르는 게 핵심이에요.',
            'AI는 가끔 틀린 답을 자신 있게 말해요(환각). 중요한 내용은 꼭 직접 확인하세요.',
          ]}
          youCanDo="AI 도구를 골라 바이브코딩을 시작할 기본기를 갖춰요."
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

      <HowAiWorksSection />
      <AiModelsSection />
      <SafeUsageSection />
    </div>
  );
}
