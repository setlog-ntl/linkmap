'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './deploy-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { DeployBasicsSection } from './deploy-guide/deploy-basics-section';
import { DeployFlowSection } from './deploy-guide/deploy-flow-section';
import { PlatformsSection } from './deploy-guide/platforms-section';

const sections = [
  { id: 'deploy-basics', label: '배포란?' },
  { id: 'deploy-flow', label: '배포 파이프라인' },
  { id: 'platforms', label: '배포 플랫폼' },
] as const;

export function DeployGuide() {
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
            '배포는 내 컴퓨터에만 있던 코드를 인터넷에 "공개"하는 일이에요.',
            'GitHub에 코드를 올리면 Vercel·Cloudflare가 자동으로 배포해줘요(자동 배포).',
            '로컬에 있던 환경변수를 배포 플랫폼에도 똑같이 등록해야 정상 작동해요.',
          ]}
          youCanDo="내가 만든 사이트를 실제 인터넷 주소로 공개할 수 있어요."
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

      <DeployBasicsSection />
      <DeployFlowSection />
      <PlatformsSection />
    </div>
  );
}
