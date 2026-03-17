'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';

const flowSteps = [
  { emoji: '🖥️', label: '클라이언트', sub: '브라우저/앱' },
  { emoji: '📡', label: 'API 요청', sub: 'fetch / axios' },
  { emoji: '⚙️', label: '서버', sub: '데이터 처리' },
  { emoji: '📦', label: '응답', sub: 'JSON 데이터' },
  { emoji: '✨', label: '화면 표시', sub: 'UI 렌더링' },
];

export function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <ScrollReveal>
        <div className="text-center mb-4">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            초보자용 · 읽기 약 12분
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            API 연동 기초
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            다른 서비스와 대화하는 방법,
            <br className="hidden sm:block" />
            레스토랑 주문에 비유하면 쉽습니다
          </p>
        </div>
      </ScrollReveal>

      {/* API 흐름 도식: 클라이언트 → API 요청 → 서버 → 응답 → 화면 표시 */}
      <ScrollReveal delay={0.15}>
        <div className="max-w-3xl mx-auto mt-10">
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <div className="flex items-center justify-between gap-2">
              {flowSteps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center text-center gap-1.5 flex-1 min-w-[60px]">
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
                요청 하나로 다른 서비스의 데이터를 가져온다!
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
