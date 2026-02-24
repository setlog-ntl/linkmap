'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';

export function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <ScrollReveal>
        <div className="text-center mb-4">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            초보자용 · 읽기 약 8분
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            프론트엔드란?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            사용자가 보고, 클릭하고, 입력하는 화면의 모든 것
            <br className="hidden sm:block" />
            HTML · CSS · JavaScript 그리고 React까지
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="max-w-2xl mx-auto mt-10">
          {/* 브라우저 창 목업 */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            {/* 브라우저 툴바 */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-3 h-6 rounded bg-background flex items-center px-3">
                <span className="text-xs text-muted-foreground font-mono">https://my-app.com</span>
              </div>
            </div>
            {/* 브라우저 내용 */}
            <div className="p-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-3">
                <div className="text-2xl mb-1">📄</div>
                <div className="text-xs font-semibold text-orange-700 dark:text-orange-300">HTML</div>
                <div className="text-[10px] text-muted-foreground mt-1">구조 · 뼈대</div>
              </div>
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
                <div className="text-2xl mb-1">🎨</div>
                <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">CSS</div>
                <div className="text-[10px] text-muted-foreground mt-1">스타일 · 색상</div>
              </div>
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 p-3">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">JS</div>
                <div className="text-[10px] text-muted-foreground mt-1">동작 · 인터랙션</div>
              </div>
            </div>
            <div className="px-6 pb-4 text-center">
              <span className="text-xs text-muted-foreground">
                이 세 가지가 합쳐져 브라우저 화면이 됩니다
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
