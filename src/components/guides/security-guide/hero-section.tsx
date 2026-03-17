'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';

const flowSteps = [
  { emoji: '✍️', label: '코드 작성', sub: 'AI 코딩' },
  { emoji: '🔍', label: '보안 점검', sub: '취약점 확인' },
  { emoji: '🔒', label: '시크릿 보호', sub: '.env 관리' },
  { emoji: '🚀', label: '안전한 배포', sub: 'HTTPS' },
];

export function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <ScrollReveal>
        <div className="text-center mb-4">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            필수 · 읽기 약 12분
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            보안 기초 가이드
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            AI가 만든 코드, 보안은 직접 챙겨야 합니다
            <br className="hidden sm:block" />
            시크릿 관리부터 HTTPS·CORS까지 초보자 눈높이로
          </p>
        </div>
      </ScrollReveal>

      {/* 보안 흐름 도식: 코드작성 → 보안점검 → 시크릿보호 → 안전한배포 */}
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
                코드 작성 → 보안 점검 → 안전한 배포!
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 안전한 코드 vs 위험한 코드 도식 */}
      <ScrollReveal delay={0.25}>
        <div className="max-w-2xl mx-auto mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔓</span>
                <span className="text-sm font-bold text-red-600 dark:text-red-400">위험한 코드</span>
              </div>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>API 키 하드코딩</li>
                <li>입력값 검증 없음</li>
                <li>HTTP 사용</li>
              </ul>
            </div>
            <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔐</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">안전한 코드</span>
              </div>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>환경변수로 키 관리</li>
                <li>Zod로 입력 검증</li>
                <li>HTTPS 필수 적용</li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
