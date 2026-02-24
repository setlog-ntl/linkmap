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
            백엔드란?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            사용자 눈에는 보이지 않지만 앱을 돌아가게 하는 엔진
            <br className="hidden sm:block" />
            서버 · API · 데이터베이스의 모든 것
          </p>
        </div>
      </ScrollReveal>

      {/* 레스토랑 비유 */}
      <ScrollReveal delay={0.15}>
        <div className="max-w-2xl mx-auto mt-10">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="px-4 py-2 bg-muted border-b text-xs text-center text-muted-foreground font-medium">
              레스토랑으로 이해하는 프론트엔드 vs 백엔드
            </div>
            <div className="grid grid-cols-2 divide-x">
              {/* 프론트엔드 = 홀 */}
              <div className="p-5 text-center">
                <div className="text-4xl mb-3">🍽️</div>
                <div className="font-bold text-sm mb-1">프론트엔드</div>
                <div className="text-xs text-muted-foreground mb-3">홀 (손님이 보는 공간)</div>
                <div className="space-y-1 text-xs text-muted-foreground text-left">
                  <div>• 메뉴판 (UI)</div>
                  <div>• 웨이터 (인터랙션)</div>
                  <div>• 테이블 세팅 (레이아웃)</div>
                </div>
              </div>
              {/* 백엔드 = 주방 */}
              <div className="p-5 text-center bg-muted/30">
                <div className="text-4xl mb-3">👨‍🍳</div>
                <div className="font-bold text-sm mb-1">백엔드</div>
                <div className="text-xs text-muted-foreground mb-3">주방 (손님이 못 보는 공간)</div>
                <div className="space-y-1 text-xs text-muted-foreground text-left">
                  <div>• 요리 (데이터 처리)</div>
                  <div>• 식재료 창고 (데이터베이스)</div>
                  <div>• 주문 처리 (API)</div>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-muted/20 border-t text-center">
              <span className="text-xs text-muted-foreground">
                손님(사용자) → 웨이터(프론트엔드) → 주방(백엔드) → 다시 웨이터 → 손님
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
