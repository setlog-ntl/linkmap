'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';

const flowSteps = [
  { emoji: '💡', label: '아이디어', sub: '머릿속 구상' },
  { emoji: '💬', label: 'AI에게 설명', sub: '프롬프트 작성' },
  { emoji: '⚡', label: '코드 생성', sub: 'AI가 작성' },
  { emoji: '🎉', label: '앱 완성', sub: 'my-app.com' },
];

export function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <ScrollReveal>
        <div className="text-center mb-4">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            바이브코딩 필수 · 읽기 약 15분
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            AI 도구 활용 가이드
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            AI와 대화하며 코딩하는 새로운 개발 방식,
            <br className="hidden sm:block" />
            프롬프트부터 API 연동까지
          </p>
        </div>
      </ScrollReveal>

      {/* 바이브코딩 흐름 도식: 아이디어 → AI에게 설명 → 코드 생성 → 앱 완성 */}
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
                코딩을 몰라도 AI와 대화하면 앱을 만들 수 있습니다!
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
