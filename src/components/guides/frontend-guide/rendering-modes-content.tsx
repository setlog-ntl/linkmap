'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

const modes = [
  {
    key: 'CSR',
    name: 'CSR',
    full: 'Client-Side Rendering',
    korean: '클라이언트 사이드 렌더링',
    color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    flow: [
      { label: '서버', text: '빈 HTML 파일 전송 (내용 없음)' },
      { label: '브라우저', text: 'JavaScript 파일 다운로드' },
      { label: '브라우저', text: 'JS가 실행되어 화면을 그림' },
    ],
    pros: ['페이지 전환이 빠름', '서버 부하가 낮음', 'SPA 구현에 적합'],
    cons: ['초기 로딩이 느림 (흰 화면)', 'SEO에 불리', 'JS 끄면 화면 없음'],
    nextjsHow: "'use client' 컴포넌트 또는 useState/useEffect 사용",
    bestFor: '대시보드, 관리자 페이지, 로그인 후 앱',
  },
  {
    key: 'SSR',
    name: 'SSR',
    full: 'Server-Side Rendering',
    korean: '서버 사이드 렌더링',
    color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30',
    badgeColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
    flow: [
      { label: '서버', text: 'DB 조회 + 데이터 처리' },
      { label: '서버', text: '완성된 HTML 생성 후 전송' },
      { label: '브라우저', text: '완성된 HTML을 즉시 표시' },
    ],
    pros: ['첫 화면이 빠름', 'SEO에 유리', '실시간 데이터 반영'],
    cons: ['서버 부하가 높음', '요청마다 서버 처리 필요'],
    nextjsHow: "서버 컴포넌트에서 fetch() 또는 DB 직접 조회",
    bestFor: '상품 상세, 뉴스 기사, 사용자별 개인화 페이지',
  },
  {
    key: 'SSG',
    name: 'SSG',
    full: 'Static Site Generation',
    korean: '정적 사이트 생성',
    color: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30',
    badgeColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    flow: [
      { label: '빌드 시', text: 'HTML 파일을 미리 전부 생성' },
      { label: 'CDN', text: '생성된 파일을 전 세계 서버에 저장' },
      { label: '브라우저', text: '가장 가까운 CDN에서 초고속 수신' },
    ],
    pros: ['초고속 로딩', '서버 비용 거의 없음', '보안 강함'],
    cons: ['실시간 데이터 반영 불가', '내용 변경 시 재빌드 필요'],
    nextjsHow: "generateStaticParams() 또는 기본 서버 컴포넌트 (fetch 캐시)",
    bestFor: '소개 페이지, 블로그, 문서 사이트',
  },
];

const decisionTree = [
  { condition: '실시간 데이터가 필요한가?', yes: 'SSR 또는 CSR', no: '다음 확인' },
  { condition: '검색 엔진 노출(SEO)이 중요한가?', yes: 'SSR', no: 'CSR' },
  { condition: '내용이 거의 바뀌지 않는가?', yes: 'SSG (가장 빠름)', no: 'SSR' },
];

const nextjsExample = `// app/posts/[id]/page.tsx

// 서버 컴포넌트 (SSR) — 요청마다 최신 데이터
export default async function PostPage({ params }) {
  const post = await fetch(\`/api/posts/\${params.id}\`, {
    cache: 'no-store' // SSR: 캐시 없이 매번 새로 가져옴
  });
  return <article>{post.content}</article>;
}

// SSG로 변경 — 빌드 시 미리 생성
export default async function PostPage({ params }) {
  const post = await fetch(\`/api/posts/\${params.id}\`);
  // cache: 'force-cache' 가 기본값 → SSG
  return <article>{post.content}</article>;
}`;

export function RenderingModesContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <RefreshCw className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">CSR vs SSR vs SSG</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          &ldquo;화면을 어디서 그리느냐&rdquo;에 따라 렌더링 방식이 나뉩니다.
          Next.js는 세 가지를 상황에 맞게 혼합해서 사용합니다.
          어떤 방식을 선택할지 알면 성능과 SEO를 모두 잡을 수 있습니다.
        </p>
      </ScrollReveal>

      {/* 3가지 방식 카드 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">3가지 렌더링 방식</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            각 방식의 동작 흐름, 장단점, Next.js에서 사용하는 방법을 비교합니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {modes.map((m, idx) => (
            <ScrollReveal key={m.key} delay={idx * 0.08}>
              <div className={`rounded-xl border-2 p-5 h-full flex flex-col ${m.color}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${m.badgeColor}`}>{m.name}</span>
                </div>
                <div className="font-semibold text-sm mb-0.5">{m.full}</div>
                <div className="text-xs text-muted-foreground mb-4">{m.korean}</div>

                {/* 동작 흐름 */}
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">동작 흐름</h4>
                <div className="space-y-1.5 mb-4">
                  {m.flow.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="font-mono text-muted-foreground shrink-0 w-4">{i + 1}.</span>
                      <div>
                        <span className="font-medium text-[10px] mr-1">[{step.label}]</span>
                        <span className="text-muted-foreground">{step.text}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 장단점 */}
                <div className="space-y-1 mb-4">
                  {m.pros.map((p) => (
                    <div key={p} className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                      <span className="shrink-0">✓</span><span>{p}</span>
                    </div>
                  ))}
                  {m.cons.map((c) => (
                    <div key={c} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="shrink-0">✗</span><span>{c}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-3 border-t border-current/10 space-y-2">
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-0.5">Next.js에서</div>
                    <code className="text-[10px] font-mono">{m.nextjsHow}</code>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-0.5">추천 용도</div>
                    <div className="text-[10px]">{m.bestFor}</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 선택 기준 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">언제 무엇을 선택할까?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            프로젝트 요구사항에 따라 방식을 선택하세요.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mb-8">
            {[
              { icon: '🛒', label: '쇼핑몰 · 상품 상세', rec: 'SSR', desc: 'SEO + 실시간 재고' },
              { icon: '📰', label: '뉴스 · 블로그', rec: 'SSG', desc: '내용 고정 + 초고속' },
              { icon: '📊', label: '대시보드 · 관리자', rec: 'CSR', desc: '로그인 후 동적 데이터' },
              { icon: '📄', label: '소개 · 랜딩 페이지', rec: 'SSG', desc: '내용 고정 + 저비용' },
              { icon: '💬', label: '채팅 · 실시간 앱', rec: 'CSR', desc: 'WebSocket + 동적 UI' },
              { icon: '🔍', label: '검색 결과 페이지', rec: 'SSR', desc: 'SEO + 쿼리별 결과' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border bg-card p-4">
                <div className="text-lg mb-2">{item.icon}</div>
                <div className="text-xs font-medium mb-1">{item.label}</div>
                <div className="text-[10px] text-muted-foreground mb-2">{item.desc}</div>
                <Badge variant="secondary" className="text-[10px]">{item.rec} 권장</Badge>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Next.js 코드 예시 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Next.js App Router 코드 예시</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Next.js App Router에서는 fetch() 옵션 하나로 SSR / SSG를 전환할 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">app/posts/[id]/page.tsx</span>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {nextjsExample}
              </pre>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Card className="max-w-2xl mt-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-3">Next.js App Router 핵심 규칙</h3>
              <div className="space-y-2">
                {[
                  { rule: "'use client' 없음 → 서버 컴포넌트 (SSR/SSG)", good: true },
                  { rule: "'use client' 있음 → 클라이언트 컴포넌트 (CSR)", good: true },
                  { rule: "fetch({ cache: 'no-store' }) → 매 요청마다 SSR", good: true },
                  { rule: "fetch({ next: { revalidate: 60 } }) → ISR (60초 캐시)", good: true },
                  { rule: "fetch() 기본값 → SSG (빌드 시 캐시)", good: true },
                ].map((item) => (
                  <div key={item.rule} className="flex items-start gap-2 text-xs">
                    <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                    <code className="font-mono text-muted-foreground">{item.rule}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>
    </div>
  );
}
