'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';

export function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <ScrollReveal>
        <div className="text-center mb-4">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            초보자용 · 읽기 약 10분
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            서버·호스팅 이해하기
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            내 코드가 24시간 돌아가려면 필요한 것들
            <br className="hidden sm:block" />
            서버·호스팅·CDN의 개념을 쉽게 풀어드립니다
          </p>
        </div>
      </ScrollReveal>

      {/* 내 컴퓨터 vs 서버 비교 도식 */}
      <ScrollReveal delay={0.15}>
        <div className="max-w-2xl mx-auto mt-10">
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <div className="flex items-center justify-between gap-4">
              {/* 내 컴퓨터 */}
              <div className="flex flex-col items-center text-center gap-2 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-3xl">
                  💻
                </div>
                <div className="text-sm font-semibold">내 컴퓨터</div>
                <div className="text-[11px] text-muted-foreground">localhost:3000</div>
                <div className="text-[10px] text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">
                  나만 접속 가능
                </div>
              </div>

              {/* 화살표 */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <svg className="w-12 h-5 text-primary" viewBox="0 0 48 20" fill="none">
                  <path
                    d="M0 10h40m0 0-8-5m8 5-8 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[10px] font-medium text-primary">서버에 올리면</span>
              </div>

              {/* 서버 */}
              <div className="flex flex-col items-center text-center gap-2 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                  🌐
                </div>
                <div className="text-sm font-semibold">서버 (호스팅)</div>
                <div className="text-[11px] text-muted-foreground">myapp.com</div>
                <div className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded">
                  전 세계 접속 가능
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
