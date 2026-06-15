'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './domain-guide/hero-section';
import { GuideTLDR } from '@/components/guides/common';
import { DomainBasicsSection } from './domain-guide/domain-basics-section';
import { UrlAnatomySection } from './domain-guide/url-anatomy-section';
import { RegistrarsSection } from './domain-guide/registrars-section';

const sections = [
  { id: 'domain-basics', label: '도메인 기초' },
  { id: 'url-anatomy', label: 'URL 해부' },
  { id: 'registrars', label: '구매처 비교' },
] as const;

export function DomainGuide() {
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
          readingTime="8분"
          points={[
            '도메인은 외우기 어려운 IP 주소 대신 쓰는 "인터넷 주소(이름)"예요.',
            '도메인을 사고, DNS 레코드(A·CNAME)로 내 사이트에 연결해요.',
            '연결 후 적용까지 시간이 걸릴 수 있어요(전파). 조급해하지 마세요.',
          ]}
          youCanDo="내 사이트에 나만의 도메인을 사서 연결할 수 있어요."
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

      <DomainBasicsSection />
      <UrlAnatomySection />
      <RegistrarsSection />
    </div>
  );
}
