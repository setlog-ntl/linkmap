'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServerCog } from 'lucide-react';

const hostingTypes = [
  {
    name: '정적 호스팅',
    icon: '📄',
    subtitle: 'Static Hosting',
    desc: '미리 빌드된 HTML/CSS/JS 파일을 서버에 올립니다. 서버 처리 없이 파일을 그대로 전송하므로 가장 빠르고 저렴합니다.',
    examples: ['GitHub Pages', 'Netlify', 'Cloudflare Pages'],
    difficulty: '쉬움',
    cost: '무료~',
    tag: 'SSG · 소개 페이지',
    tagColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
    color: 'border-green-200 dark:border-green-800',
    suitable: ['포트폴리오', '블로그', '소개 페이지', '문서 사이트'],
    notSuitable: ['실시간 데이터', '로그인이 필요한 앱'],
  },
  {
    name: '동적 호스팅',
    icon: '⚡',
    subtitle: 'Dynamic Hosting / PaaS',
    desc: '서버가 요청을 받을 때마다 실시간으로 페이지를 생성합니다. SSR, API 라우트 등 서버 기능을 사용할 수 있습니다.',
    examples: ['Vercel', 'Railway', 'Render'],
    difficulty: '중간',
    cost: '무료~월 $7',
    tag: 'SSR · Next.js',
    tagColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    color: 'border-blue-200 dark:border-blue-800',
    suitable: ['Next.js 앱', '로그인 서비스', 'API 서버', '실시간 데이터'],
    notSuitable: ['매우 고트래픽 (비용)', '특수 하드웨어 필요'],
  },
  {
    name: '서버리스 (Serverless)',
    icon: '🌩️',
    subtitle: 'Edge / Serverless Functions',
    desc: '항상 켜진 서버가 없고, 요청이 올 때만 함수가 실행됩니다. 전 세계 엣지 서버에서 실행되어 응답이 빠릅니다.',
    examples: ['Cloudflare Workers', 'Vercel Functions', 'AWS Lambda'],
    difficulty: '중간',
    cost: '무료~',
    tag: '엣지 · 저지연',
    tagColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    color: 'border-purple-200 dark:border-purple-800',
    suitable: ['API 함수', '인증 미들웨어', '글로벌 서비스', 'Next.js on Cloudflare'],
    notSuitable: ['긴 실행 시간이 필요한 작업', '메모리 집약적 작업'],
  },
  {
    name: '전통 서버 (VPS)',
    icon: '🖥️',
    subtitle: 'Virtual Private Server',
    desc: '가상 서버를 빌려 직접 운영합니다. 가장 높은 자유도를 제공하지만 관리 부담도 큽니다.',
    examples: ['AWS EC2', 'DigitalOcean', 'Vultr', 'Hetzner'],
    difficulty: '복잡',
    cost: '월 $5~',
    tag: '고급 · 완전 통제',
    tagColor: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
    color: 'border-gray-200 dark:border-gray-700',
    suitable: ['특수 환경 필요', '고트래픽 대용량', '완전한 서버 제어'],
    notSuitable: ['초보자', '빠른 MVP 개발'],
  },
];

const cdnExplain = [
  { step: '1', text: '서울 사용자가 이미지 요청' },
  { step: '2', text: '원본 서버(미국) 대신 서울 CDN 엣지 서버가 응답' },
  { step: '3', text: '200ms → 5ms로 단축 (40배 빠름)' },
];

const platformRecommend = [
  { name: 'Vercel', useFor: 'Next.js 풀스택 앱', why: 'Next.js 제작사. 설정 없이 최적화 배포', badge: '가장 추천' },
  { name: 'Cloudflare Pages + Workers', useFor: 'Next.js + 엣지 서버리스', why: '전 세계 엣지 + 무료 한도 넉넉', badge: 'Linkmap 사용 중' },
  { name: 'Railway', useFor: 'Node.js, Express, FastAPI', why: '백엔드 서버 앱 배포 최적', badge: '백엔드 서버' },
  { name: 'Netlify', useFor: '정적 사이트, SSG', why: 'GitHub 연동 자동 배포, 무료 한도 크', badge: '정적 사이트' },
];

export function HostingContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <ServerCog className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">서버와 호스팅</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          내 코드가 24시간 돌아가려면 항상 켜져 있는 컴퓨터(서버)가 필요합니다.
          정적 호스팅, 동적 호스팅, 서버리스, CDN의 차이를 이해하면 올바른 플랫폼을 선택할 수 있습니다.
        </p>
      </ScrollReveal>

      {/* 서버란? */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">서버란?</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-8">
            <div className="rounded-xl border bg-card p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💻</span>
                  <div>
                    <div className="font-medium text-sm">내 컴퓨터</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      끄면 멈춤. 집 밖에서 접속 불가.
                      개발·테스트 전용.
                    </div>
                    <code className="text-[10px] font-mono text-muted-foreground">localhost:3000</code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <div className="font-medium text-sm">서버 컴퓨터</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      24시간 365일 켜져 있음.
                      전 세계 어디서든 접속 가능.
                    </div>
                    <code className="text-[10px] font-mono text-muted-foreground">myapp.com</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 호스팅 유형 비교 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">호스팅 유형 4가지</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            프로젝트 특성에 따라 적합한 호스팅 방식이 다릅니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {hostingTypes.map((h, idx) => (
            <ScrollReveal key={h.name} delay={idx * 0.08}>
              <div className={`rounded-xl border p-5 h-full flex flex-col ${h.color}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{h.icon}</span>
                    <div>
                      <div className="font-bold text-sm">{h.name}</div>
                      <div className="text-[10px] text-muted-foreground">{h.subtitle}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`text-[10px] shrink-0 ${h.tagColor}`}>
                    {h.tag}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{h.desc}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {h.examples.map((ex) => (
                    <span key={ex} className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border font-mono">{ex}</span>
                  ))}
                </div>
                <div className="mt-auto space-y-2">
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1">적합한 용도</div>
                    <div className="flex flex-wrap gap-1">
                      {h.suitable.map((s) => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-green-100/60 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 text-[10px] text-muted-foreground pt-2 border-t border-current/10">
                    <span>난이도: {h.difficulty}</span>
                    <span>비용: {h.cost}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CDN 개념 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">CDN이란?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Content Delivery Network — 전 세계에 분산된 서버에 파일을 복사해두고,
            사용자와 가장 가까운 서버에서 응답하여 속도를 높입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl rounded-xl border bg-card p-5 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center text-xs mb-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">👤</div>
                <div className="font-medium">서울 사용자</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">⚡</div>
                <div className="font-medium text-primary">서울 CDN 엣지</div>
                <div className="text-[10px] text-green-600 dark:text-green-400 font-semibold">~5ms</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">🖥️</div>
                <div className="font-medium">원본 서버 (미국)</div>
                <div className="text-[10px] text-red-500">직접 요청 없음</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              CDN 없이: 서울 → 미국 서버 왕복 (<strong className="text-foreground">~200ms</strong>)<br />
              CDN 있음: 서울 → 서울 CDN 엣지 (<strong className="text-green-600 dark:text-green-400">~5ms</strong>) — 40배 빠름
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 플랫폼 추천 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">상황별 추천 플랫폼</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-3 max-w-2xl">
            {platformRecommend.map((p, idx) => (
              <div key={p.name} className="rounded-lg border bg-card p-4 flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold">{p.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{p.badge}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">용도: {p.useFor}</div>
                  <div className="text-xs text-muted-foreground">{p.why}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
