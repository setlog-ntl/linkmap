'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const modes = [
  {
    key: 'CSR',
    name: 'CSR',
    full: 'Client-Side Rendering',
    korean: '클라이언트 사이드 렌더링',
    emoji: '🖥️',
    color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    flow: ['서버: 빈 HTML 전송', '브라우저: JS 다운로드', '브라우저: 화면 렌더링'],
    pros: ['빠른 페이지 전환', '서버 부하 낮음'],
    cons: ['초기 로딩 느림', 'SEO 불리'],
    example: 'React (기본)',
  },
  {
    key: 'SSR',
    name: 'SSR',
    full: 'Server-Side Rendering',
    korean: '서버 사이드 렌더링',
    emoji: '⚡',
    color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30',
    badgeColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
    flow: ['서버: DB 조회', '서버: HTML 생성 후 전송', '브라우저: 즉시 표시'],
    pros: ['빠른 첫 화면', 'SEO 유리'],
    cons: ['서버 부하 높음', '페이지 이동 시 새로고침'],
    example: 'Next.js (App Router)',
  },
  {
    key: 'SSG',
    name: 'SSG',
    full: 'Static Site Generation',
    korean: '정적 사이트 생성',
    emoji: '📦',
    color: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30',
    badgeColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    flow: ['빌드 시: HTML 미리 생성', 'CDN에 파일 저장', '브라우저: 초고속 수신'],
    pros: ['초고속 로딩', '저렴한 비용'],
    cons: ['실시간 데이터 불가', '빌드 후 내용 고정'],
    example: 'Next.js (generateStaticParams)',
  },
];

export function RenderingModesSection() {
  return (
    <section id="rendering-modes" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">CSR · SSR · SSG — 렌더링 방식</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          "화면을 어디서 그리느냐"에 따라 방식이 나뉩니다.
          Next.js는 세 가지를 상황에 맞게 혼합해서 사용합니다.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {modes.map((m) => (
            <div key={m.key} className={`rounded-xl border-2 p-5 ${m.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{m.emoji}</span>
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${m.badgeColor}`}>{m.name}</span>
                </div>
              </div>
              <div className="font-semibold text-sm mb-0.5">{m.full}</div>
              <div className="text-xs text-muted-foreground mb-4">{m.korean}</div>

              {/* 동작 흐름 */}
              <div className="space-y-1 mb-4">
                {m.flow.map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="font-mono text-muted-foreground shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {/* 장단점 */}
              <div className="space-y-1">
                {m.pros.map((p) => (
                  <div key={p} className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                    <span>✓</span><span>{p}</span>
                  </div>
                ))}
                {m.cons.map((c) => (
                  <div key={c} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>✗</span><span>{c}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-current/10">
                <span className="text-[10px] text-muted-foreground">대표: </span>
                <code className="text-[10px] font-mono">{m.example}</code>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="rounded-lg border bg-muted/30 p-5 max-w-2xl">
          <h3 className="font-semibold text-sm mb-3">언제 뭘 써야 하나요?</h3>
          <div className="space-y-2">
            {[
              { icon: '🛒', label: '쇼핑몰·뉴스·블로그 (SEO 중요)', rec: 'SSR 또는 SSG' },
              { icon: '📊', label: '대시보드·관리자 페이지 (로그인 필요)', rec: 'CSR 또는 SSR' },
              { icon: '📄', label: '소개 페이지·랜딩 (내용이 고정)', rec: 'SSG' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-sm">
                <span>{item.icon}</span>
                <span className="text-muted-foreground flex-1">{item.label}</span>
                <Badge variant="secondary" className="text-xs">{item.rec}</Badge>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
