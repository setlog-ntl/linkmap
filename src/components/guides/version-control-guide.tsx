'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './version-control-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { BranchConceptSection } from './version-control-guide/branch-concept-section';
import { WorkflowSection } from './version-control-guide/workflow-section';
import { AiBranchSection } from './version-control-guide/ai-branch-section';

const sections = [
  { id: 'branch-concept', label: '브랜치 개념' },
  { id: 'workflow', label: '일반적인 워크플로우' },
  { id: 'ai-branch', label: 'AI 코드 브랜치 관리' },
] as const;

export function VersionControlGuide() {
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
            'Git은 코드의 "변경 이력"을 저장해 언제든 과거로 되돌릴 수 있게 해줘요.',
            '브랜치는 본 코드를 건드리지 않고 안전하게 실험하는 "평행 작업 공간"이에요.',
            'AI가 만든 코드는 별도 브랜치에서 검토한 뒤 합치는 게 안전해요.',
          ]}
          youCanDo="실수해도 되돌릴 수 있게 코드를 안전하게 관리할 수 있어요."
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

      <BranchConceptSection />
      <WorkflowSection />
      <AiBranchSection />
    </div>
  );
}
