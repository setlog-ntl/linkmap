'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './server-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { WhatIsServerSection } from './server-guide/what-is-server-section';
import { ServerVsLocalSection } from './server-guide/server-vs-local-section';
import { HostingOverviewSection } from './server-guide/hosting-overview-section';

const sections = [
  { id: 'what-is-server', label: '서버란?' },
  { id: 'server-vs-local', label: '내 PC vs 서버' },
  { id: 'hosting-overview', label: '호스팅 유형' },
] as const;

export function ServerGuide() {
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
            '서버는 내 사이트를 24시간 켜두고 방문자에게 보여주는 "남의 컴퓨터"예요.',
            '정적·동적·서버리스 등 호스팅 방식마다 비용·관리 난이도가 달라요.',
            'CDN은 전 세계에 사본을 두어 사이트를 빠르게 보여주는 기술이에요.',
          ]}
          youCanDo="내 프로젝트에 맞는 호스팅 방식을 골라 비용·속도를 챙길 수 있어요."
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

      <WhatIsServerSection />
      <ServerVsLocalSection />
      <HostingOverviewSection />
    </div>
  );
}
