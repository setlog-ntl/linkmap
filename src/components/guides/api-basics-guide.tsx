'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './api-basics-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { WhatIsApiSection } from './api-basics-guide/what-is-api-section';
import { HttpBasicsSection } from './api-basics-guide/http-basics-section';
import { RealWorldSection } from './api-basics-guide/real-world-section';

const sections = [
  { id: 'what-is-api', label: 'API란?' },
  { id: 'http-basics', label: 'HTTP 기초' },
  { id: 'real-world', label: '실전 활용' },
] as const;

export function ApiBasicsGuide() {
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
            'API는 두 프로그램이 정해진 약속대로 데이터를 주고받는 "창구"예요.',
            'fetch로 요청을 보내고, 상태 코드(200·404·500)로 성공·실패를 확인해요.',
            '에러는 try/catch로 잡아 사용자에게 친절한 메시지를 보여줘요.',
          ]}
          youCanDo="외부 서비스의 데이터를 불러와 내 화면에 보여줄 수 있어요."
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

      <WhatIsApiSection />
      <HttpBasicsSection />
      <RealWorldSection />
    </div>
  );
}
