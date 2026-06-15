'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './package-manager-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { WhatIsPmSection } from './package-manager-guide/what-is-pm-section';
import { ComparisonSection } from './package-manager-guide/comparison-section';
import { EssentialsSection } from './package-manager-guide/essentials-section';

const sections = [
  { id: 'what-is-pm', label: '패키지 매니저란?' },
  { id: 'comparison', label: 'npm vs yarn vs pnpm' },
  { id: 'essentials', label: '필수 지식' },
] as const;

export function PackageManagerGuide() {
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
            '패키지 매니저(npm)는 남이 만든 코드(라이브러리)를 받아 설치·관리하는 도구예요.',
            'package.json은 내 프로젝트가 어떤 패키지에 의존하는지 적은 "목록표"예요.',
            'npm install 한 번이면 필요한 코드를 한꺼번에 받아와요.',
          ]}
          youCanDo="에러 없이 패키지를 설치하고 흔한 의존성 문제를 스스로 풀 수 있어요."
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

      <WhatIsPmSection />
      <ComparisonSection />
      <EssentialsSection />
    </div>
  );
}
