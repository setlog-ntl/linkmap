'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './auth-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { AuthBasicsSection } from './auth-guide/auth-basics-section';
import { GuideLinkCards } from './auth-guide/guide-link-cards';
import { AppLoginSection } from './auth-guide/app-login-section';
import { ServiceAuthSection } from './auth-guide/service-auth-section';
import { ComparisonTable } from './auth-guide/comparison-table';
import { GlossarySection } from './auth-guide/glossary-section';
import { FaqSection } from './auth-guide/faq-section';

const sections = [
  { id: 'app-login', label: '앱 로그인' },
  { id: 'service-auth', label: '서비스 연동' },
  { id: 'comparison', label: '비교' },
  { id: 'glossary', label: '용어 사전' },
  { id: 'faq', label: 'FAQ' },
] as const;

export function AuthGuide() {
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
          readingTime="15분"
          points={[
            '인증(Authentication)은 "누구인지" 확인하는 과정 — 곧 로그인이에요.',
            '"Google로 로그인"은 비밀번호 없이 권한만 빌려 쓰는 OAuth 방식이에요.',
            '로그인 상태는 세션·토큰으로 유지되고, 콜백 URL이 정확해야 작동해요.',
          ]}
          youCanDo="소셜 로그인을 붙이고 흔한 리다이렉트 오류를 스스로 해결할 수 있어요."
        />
      </div>

      {/* 핵심 개념: 두 가지 인증 레이어 */}
      <AuthBasicsSection />

      {/* 소셜 로그인 설정 가이드 링크 카드 */}
      <GuideLinkCards />

      {/* Section nav for remaining content */}
      <nav className="sticky top-[var(--header-height)] z-20 bg-background/80 backdrop-blur-sm border-b -mx-4 px-4 sm:mx-0 sm:px-0">
        {/* 모바일: 가로 스크롤 가능 표시를 위해 우측 페이드 마스크 적용 */}
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

      <AppLoginSection />
      <ServiceAuthSection />
      <ComparisonTable />
      <GlossarySection />
      <FaqSection />
    </div>
  );
}
