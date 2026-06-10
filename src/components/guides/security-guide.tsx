'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './security-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { WhySecuritySection } from './security-guide/why-security-section';
import { CommonMistakesSection } from './security-guide/common-mistakes-section';
import { ChecklistSection } from './security-guide/checklist-section';

const sections = [
  { id: 'why-security', label: '왜 보안이 중요한가' },
  { id: 'common-mistakes', label: '흔한 실수' },
  { id: 'checklist', label: '보안 체크리스트' },
] as const;

export function SecurityGuide() {
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
          level="필수"
          readingTime="12분"
          points={[
            'AI가 만든 코드도 보안 구멍이 있을 수 있어요 — 그대로 믿으면 위험해요.',
            '비밀 키 노출, XSS·SQL Injection 같은 흔한 공격은 기본만 알아도 막을 수 있어요.',
            'HTTPS와 입력 검증은 "기본 중의 기본" 보안 장치예요.',
          ]}
          youCanDo="배포 전 최소한의 보안 점검을 스스로 할 수 있어요."
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

      <WhySecuritySection />
      <CommonMistakesSection />
      <ChecklistSection />
    </div>
  );
}
