'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './payment-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { PaymentFlowSection } from './payment-guide/payment-flow-section';
import { PgComparisonSection } from './payment-guide/pg-comparison-section';
import { ImplementationSection } from './payment-guide/implementation-section';

const sections = [
  { id: 'payment-flow', label: '결제 흐름' },
  { id: 'pg-comparison', label: 'PG사 비교' },
  { id: 'implementation', label: '구현 가이드' },
] as const;

export function PaymentGuide() {
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
            '온라인 결제는 PG사(Stripe·토스)가 카드 정보를 안전하게 대신 처리해줘요.',
            '결제는 "테스트 모드"에서 충분히 연습한 뒤 실제 모드로 전환해요.',
            '결제 완료는 웹훅으로 확인하고, 중복 처리를 막는 멱등성이 중요해요.',
          ]}
          youCanDo="내 서비스에 안전하게 결제 기능을 붙이는 큰 그림을 이해해요."
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

      <PaymentFlowSection />
      <PgComparisonSection />
      <ImplementationSection />
    </div>
  );
}
