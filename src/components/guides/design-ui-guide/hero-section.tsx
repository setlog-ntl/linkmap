'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';

const flowSteps = [
  { emoji: '🎨', label: '디자인 토큰', sub: '색상·폰트·여백' },
  { emoji: '✨', label: 'CSS 스타일링', sub: 'Tailwind CSS' },
  { emoji: '🧩', label: '컴포넌트 조합', sub: 'shadcn/ui' },
  { emoji: '📱', label: '반응형 완성', sub: '모바일~데스크톱' },
];

export function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <ScrollReveal>
        <div className="text-center mb-4">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            초보자용 · 읽기 약 10분
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            디자인/UI 가이드
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            디자이너 없이도 깔끔한 UI를 만드는 실전 가이드
            <br className="hidden sm:block" />
            디자인 기초부터 Tailwind CSS, 컴포넌트 활용까지
          </p>
        </div>
      </ScrollReveal>

      {/* 디자인 흐름 도식 */}
      <ScrollReveal delay={0.15}>
        <div className="max-w-2xl mx-auto mt-10">
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <div className="flex items-center justify-between gap-2">
              {flowSteps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center text-center gap-1.5 flex-1 min-w-[70px]">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-muted flex items-center justify-center text-2xl sm:text-3xl">
                      {step.emoji}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold">{step.label}</div>
                    <div className="text-[10px] text-muted-foreground">{step.sub}</div>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div className="shrink-0 mx-1">
                      <svg className="w-8 h-5 sm:w-12 sm:h-5 text-primary" viewBox="0 0 48 20" fill="none">
                        <path d="M0 10h40m0 0-8-5m8 5-8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <div className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-1 rounded-full inline-block">
                디자인 토큰만 정하면 나머지는 도구가 해결!
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
