'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroSection } from './env-guide/hero-section';
import { WhatIsEnvSection } from './env-guide/what-is-env-section';
import { LocalVsProductionSection } from './env-guide/local-vs-production-section';
import { ServiceEnvTableSection } from './env-guide/service-env-table-section';
import { NextPublicSection } from './env-guide/next-public-section';
import { DeployPlatformSection } from './env-guide/deploy-platform-section';
import { ChecklistSection } from './env-guide/checklist-section';
import { FaqSection } from './env-guide/faq-section';

const sections = [
  { id: 'what-is-env', label: '개념' },
  { id: 'local-vs-production', label: '로컬 vs 배포' },
  { id: 'service-env', label: '서비스별' },
  { id: 'next-public', label: 'NEXT_PUBLIC' },
  { id: 'deploy-platform', label: '배포 설정' },
  { id: 'checklist', label: '체크리스트' },
  { id: 'faq', label: 'FAQ' },
] as const;

export function EnvGuide() {
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

      <WhatIsEnvSection />
      <LocalVsProductionSection />
      <ServiceEnvTableSection />
      <NextPublicSection />
      <DeployPlatformSection />
      <ChecklistSection />
      <FaqSection />
    </div>
  );
}
