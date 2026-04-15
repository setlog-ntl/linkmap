'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';

const flowSteps = [
  { emoji: '📚', label: '데이터 학습', sub: '수십억 페이지' },
  { emoji: '🔍', label: '패턴 발견', sub: '언어 규칙 파악' },
  { emoji: '🧩', label: '다음 단어 예측', sub: '확률 기반 생성' },
  { emoji: '💬', label: '답변 생성', sub: '자연스러운 문장' },
];

export function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <ScrollReveal>
        <div className="text-center mb-4">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            입문 · 읽기 약 20분
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            AI 기초 이해 가이드
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            AI가 어떻게 작동하는지, 어떤 모델이 있는지,
            <br className="hidden sm:block" />
            안전하게 사용하는 법을 알아봅니다
          </p>
        </div>
      </ScrollReveal>

      {/* AI 작동 흐름 도식 */}
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
              <div className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full inline-block">
                AI는 수십억 페이지의 텍스트에서 패턴을 배워 답변을 생성합니다
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
