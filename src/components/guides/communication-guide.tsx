'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './communication-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { NotificationTypesSection } from './communication-guide/notification-types-section';
import { ChoosingSection } from './communication-guide/choosing-section';
import { IntegrationTipsSection } from './communication-guide/integration-tips-section';

const sections = [
  { id: 'notification-types', label: '알림 종류' },
  { id: 'choosing', label: '선택 기준' },
  { id: 'integration-tips', label: '연동 팁' },
] as const;

export function CommunicationGuide() {
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
            '앱에서 사용자에게 알리는 방법은 이메일·SMS·푸시·실시간 4가지가 있어요.',
            '회원가입 확인 메일 같은 건 "트랜잭셔널 이메일"(Resend·SendGrid)로 보내요.',
            '실시간 알림은 WebSocket·Supabase Realtime 같은 기술을 써요.',
          ]}
          youCanDo="내 앱에 이메일·알림 기능을 용도에 맞게 골라 붙일 수 있어요."
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

      <NotificationTypesSection />
      <ChoosingSection />
      <IntegrationTipsSection />
    </div>
  );
}
