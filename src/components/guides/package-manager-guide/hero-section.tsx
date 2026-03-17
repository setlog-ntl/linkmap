'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';

const flowSteps = [
  { emoji: '✍️', label: '코드 작성', sub: 'VS Code' },
  { emoji: '📦', label: 'npm install', sub: '패키지 설치' },
  { emoji: '🔧', label: '패키지 사용', sub: 'import ...' },
  { emoji: '🚀', label: 'npm run build', sub: '빌드 & 배포' },
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
            패키지 매니저 가이드
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            남이 만든 코드를 가져다 쓰는 가장 쉬운 방법
            <br className="hidden sm:block" />
            npm, yarn, pnpm 비교부터 에러 해결까지
          </p>
        </div>
      </ScrollReveal>

      {/* 흐름 도식: 코드작성 → npm install → 패키지 사용 → npm run build */}
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
                한 줄 명령어로 수천 개의 라이브러리를 바로 사용!
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
