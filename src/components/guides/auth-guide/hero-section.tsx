'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { TwoLayerDiagram } from './two-layer-diagram';

export function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <ScrollReveal>
        <div className="text-center mb-4">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            초보자용 · 읽기 약 15분
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            인증의 모든 것: 개념부터 설정까지
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            앱 로그인과 서비스 연동의 차이부터, 구글·카카오 로그인
            <br className="hidden sm:block" />
            설정 방법까지 한 번에 알아보세요.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <TwoLayerDiagram />
      </ScrollReveal>
    </section>
  );
}
