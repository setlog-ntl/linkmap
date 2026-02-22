'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Key, Lock } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <ScrollReveal>
        <div className="text-center mb-4">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            초보자용 · 읽기 약 10분
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            환경변수 완전 정복
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            AI가 만든 코드를 배포하려면 꼭 알아야 할 것
            <br className="hidden sm:block" />
            환경변수를 모르면 배포는 영원히 실패합니다.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="max-w-lg mx-auto mt-8">
          <div className="flex items-center justify-center gap-6 md:gap-10">
            {/* 코드 = 자물쇠 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-muted flex items-center justify-center">
                <Lock className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">코드 = 자물쇠</span>
              <span className="text-xs text-muted-foreground">누구나 볼 수 있는 설계도</span>
            </div>

            {/* + */}
            <span className="text-2xl font-bold text-muted-foreground">+</span>

            {/* 환경변수 = 열쇠 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Key className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
              <span className="text-sm font-medium">환경변수 = 열쇠</span>
              <span className="text-xs text-muted-foreground">나만 가진 비밀 정보</span>
            </div>

            {/* = */}
            <span className="text-2xl font-bold text-muted-foreground">=</span>

            {/* 작동하는 앱 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <span className="text-3xl md:text-4xl">🚀</span>
              </div>
              <span className="text-sm font-medium">작동하는 앱</span>
              <span className="text-xs text-muted-foreground">배포 성공!</span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
