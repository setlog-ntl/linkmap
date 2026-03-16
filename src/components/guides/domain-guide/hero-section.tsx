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
            도메인 완전 정복
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            내 사이트의 주소를 만들고 연결하는 방법
            <br className="hidden sm:block" />
            도메인 구매부터 DNS 설정까지 한 번에 이해하기
          </p>
        </div>
      </ScrollReveal>

      {/* IP → 도메인 변환 비유 (전화번호부) */}
      <ScrollReveal delay={0.15}>
        <div className="max-w-2xl mx-auto mt-10">
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <p className="text-xs text-muted-foreground text-center mb-4">
              📖 도메인은 인터넷의 <strong className="text-foreground">전화번호부</strong>입니다
            </p>
            <div className="flex items-center justify-between gap-4">
              {/* IP 주소 */}
              <div className="flex flex-col items-center text-center gap-2 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                  <span className="text-2xl">🔢</span>
                </div>
                <div className="text-sm font-semibold">IP 주소</div>
                <code className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  142.250.80.14
                </code>
                <div className="text-[10px] text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">
                  외우기 어려움 😵
                </div>
              </div>

              {/* 변환 화살표 */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <svg className="w-12 h-5 text-primary" viewBox="0 0 48 20" fill="none">
                  <path d="M0 10h40m0 0-8-5m8 5-8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[10px] font-medium text-primary">도메인 연결</span>
              </div>

              {/* 도메인 */}
              <div className="flex flex-col items-center text-center gap-2 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">🌐</span>
                </div>
                <div className="text-sm font-semibold">도메인</div>
                <code className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  google.com
                </code>
                <div className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded">
                  기억하기 쉬움 😊
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t text-center">
              <p className="text-xs text-muted-foreground leading-relaxed">
                전화번호부에서 &quot;홍길동&quot;을 찾으면 전화번호가 나오듯,
                <br className="hidden sm:block" />
                도메인(<strong className="text-foreground">google.com</strong>)을 입력하면 IP(<strong className="text-foreground">142.250.80.14</strong>)를 찾아 접속합니다.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
