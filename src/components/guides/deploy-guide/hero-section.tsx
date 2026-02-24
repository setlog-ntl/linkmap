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
            도메인 · 배포 · 서버란?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            내 컴퓨터에서 만든 코드를 전 세계가 접속하도록 만드는 방법
            <br className="hidden sm:block" />
            도메인 · DNS · 서버 · CDN · 배포의 모든 것
          </p>
        </div>
      </ScrollReveal>

      {/* 배포 전/후 도식 */}
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

              {/* 배포 화살표 */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <svg className="w-12 h-5 text-primary" viewBox="0 0 48 20" fill="none">
                  <path d="M0 10h40m0 0-8-5m8 5-8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[10px] font-medium text-primary">배포 (Deploy)</span>
              </div>

              {/* 서버 */}
              <div className="flex flex-col items-center text-center gap-2 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                  🌐
                </div>
                <div className="text-sm font-semibold">서버 + 도메인</div>
                <div className="text-[11px] text-muted-foreground">my-app.com</div>
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
