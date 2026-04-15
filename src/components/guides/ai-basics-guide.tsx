'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './ai-basics-guide/hero-section';
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
