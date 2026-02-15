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
            초보자용 · 읽기 약 5분
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            인증, 두 가지만 알면 됩니다
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Linkmap의 &quot;앱 로그인&quot;과 &quot;서비스 연동&quot;은 목적이 다릅니다.
            <br className="hidden sm:block" />
            같은 GitHub이라도 역할이 다를 수 있어요.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <TwoLayerDiagram />
      </ScrollReveal>
    </section>
  );
}
