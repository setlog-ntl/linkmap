'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const hostingTypes = [
  {
    name: '전통 서버',
    emoji: '🖥️',
    subtitle: 'VPS / 전용 서버',
    desc: '물리적인 서버 컴퓨터(또는 가상 서버)를 빌려 직접 운영합니다. 높은 자유도, 높은 관리 부담.',
    examples: ['AWS EC2', 'DigitalOcean', 'Vultr'],
    difficulty: '복잡',
    cost: '월 $5~',
    tag: '고급 사용자',
    color: 'border-gray-200 dark:border-gray-700',
    tagColor: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
  },
  {
    name: 'PaaS',
    emoji: '🚀',
    subtitle: 'Platform as a Service',
    desc: '서버 관리 없이 코드만 올리면 알아서 배포해줍니다. Git push 하나로 배포 완료.',
    examples: ['Heroku', 'Railway', 'Render'],
    difficulty: '쉬움',
    cost: '무료~월 $7',
    tag: '바이브 코딩 추천',
    color: 'border-green-200 dark:border-green-800',
    tagColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
  {
    name: '엣지/서버리스',
    emoji: '⚡',
    subtitle: 'Edge / Serverless',
    desc: '서버가 없고, 요청이 올 때만 함수가 실행됩니다. 전 세계 데이터센터에서 가장 가까운 곳에서 응답.',
    examples: ['Vercel', 'Cloudflare Workers', 'Netlify'],
    difficulty: '중간',
    cost: '무료~',
    tag: 'Next.js 최적',
    color: 'border-blue-200 dark:border-blue-800',
    tagColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    name: 'CDN',
    emoji: '🌍',
    subtitle: 'Content Delivery Network',
    desc: '전 세계 수백 개 서버에 파일을 복사해두고, 사용자와 가장 가까운 서버에서 응답합니다.',
    examples: ['Cloudflare', 'AWS CloudFront', 'Fastly'],
    difficulty: '자동 제공',
    cost: '무료 포함',
    tag: '정적 파일 최적화',
    color: 'border-purple-200 dark:border-purple-800',
    tagColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
  },
];

export function ServerHostingSection() {
  return (
    <section id="server-hosting" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">서버 · 호스팅 · CDN이란?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          내 코드가 24시간 돌아가려면 항상 켜져 있는 컴퓨터(서버)가 필요합니다.
          서버를 직접 사거나, 빌리거나, 서비스로 쓸 수 있습니다.
        </p>
      </ScrollReveal>

      {/* 서버란? */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-2xl mb-8">
          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold mb-3">서버란?</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💻</span>
                <div>
                  <div className="font-medium text-sm">내 컴퓨터</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    끄면 꺼짐. 집 밖에서 접속 불가.
                    개발·테스트 용도.
                  </div>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 호스팅 종류 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">호스팅 유형 비교</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {hostingTypes.map((h) => (
            <div key={h.name} className={`rounded-xl border p-5 ${h.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{h.emoji}</span>
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
                  <span key={ex} className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border font-mono">
                    {ex}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-[10px] text-muted-foreground">
                <span>난이도: {h.difficulty}</span>
                <span>비용: {h.cost}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* CDN 동작 원리 도식 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">CDN이 속도를 높이는 방법</h3>
        <div className="max-w-2xl rounded-xl border bg-card p-5">
          <div className="grid grid-cols-3 gap-4 text-center text-xs mb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">👤</div>
              <div className="font-medium">서울 사용자</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">⚡</div>
              <div className="font-medium text-primary">서울 CDN 엣지</div>
              <div className="text-muted-foreground">5ms</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">🖥️</div>
              <div className="font-medium">원본 서버 (미국)</div>
              <div className="text-muted-foreground text-red-500">없이 응답</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            CDN이 없으면: 서울 → 미국 서버 왕복 (<strong>~200ms</strong>)<br />
            CDN이 있으면: 서울 → 서울 엣지 서버 (<strong>~5ms</strong>) — 40배 빠름
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
