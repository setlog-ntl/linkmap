'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { GitBranch, GitPullRequest, GitMerge, CheckCircle2 } from 'lucide-react';

const flowSteps = [
  { icon: GitBranch, label: '브랜치 생성', sub: 'feature/login' },
  { icon: GitPullRequest, label: '개발', sub: '코드 작성·커밋' },
  { icon: GitPullRequest, label: 'PR', sub: '코드 리뷰 요청' },
  { icon: GitMerge, label: '머지', sub: 'main에 합치기' },
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
            버전 관리 심화
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Git 브랜치로 코드를 안전하게 관리하는 방법
          </p>
        </div>
      </ScrollReveal>

      {/* 브랜치 트리 도식 */}
      <ScrollReveal delay={0.15}>
        <div className="max-w-3xl mx-auto mt-10">
          <div className="rounded-xl border bg-card shadow-sm p-6">
            {/* 브랜치 트리 비주얼 */}
            <div className="mb-6">
              <div className="relative flex flex-col gap-2 pl-6">
                {/* main 브랜치 라인 */}
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100 dark:ring-green-900/40 shrink-0" />
                  <div className="text-sm font-semibold text-green-700 dark:text-green-400">main</div>
                  <div className="flex-1 h-px bg-green-300 dark:bg-green-700" />
                  <div className="w-4 h-4 rounded-full bg-green-500 shrink-0" />
                </div>

                {/* feature-a 분기 */}
                <div className="ml-8 flex items-center gap-3">
                  <svg className="w-6 h-8 shrink-0 text-blue-400" viewBox="0 0 24 32" fill="none">
                    <path d="M0 0 C0 16, 24 16, 24 32" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                  <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400">feature-a</div>
                  <div className="flex-1 h-px bg-blue-200 dark:bg-blue-800" />
                  <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                  <svg className="w-6 h-8 shrink-0 text-blue-400 rotate-180" viewBox="0 0 24 32" fill="none">
                    <path d="M0 0 C0 16, 24 16, 24 32" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                {/* feature-b 분기 */}
                <div className="ml-16 flex items-center gap-3">
                  <svg className="w-6 h-8 shrink-0 text-purple-400" viewBox="0 0 24 32" fill="none">
                    <path d="M0 0 C0 16, 24 16, 24 32" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                  <div className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
                  <div className="text-xs font-medium text-purple-600 dark:text-purple-400">feature-b</div>
                  <div className="flex-1 h-px bg-purple-200 dark:bg-purple-800" />
                  <div className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
                  <svg className="w-6 h-8 shrink-0 text-purple-400 rotate-180" viewBox="0 0 24 32" fill="none">
                    <path d="M0 0 C0 16, 24 16, 24 32" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Flow steps */}
            <div className="flex items-center justify-between gap-2">
              {flowSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-center">
                    <div className="flex flex-col items-center text-center gap-1.5 flex-1 min-w-[70px]">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-muted flex items-center justify-center">
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
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
                );
              })}
            </div>

            <div className="text-center mt-5">
              <div className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-1 rounded-full inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                브랜치를 나눠서 작업하면 main 코드는 항상 안전합니다
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
