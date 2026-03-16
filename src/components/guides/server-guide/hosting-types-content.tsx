'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
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

const platformComparison = [
  {
    name: 'Vercel',
    type: '동적 / 서버리스',
    bestFor: 'Next.js 풀스택 앱',
    why: 'Next.js 제작사가 직접 운영. 설정 없이 최적화 배포.',
    badge: '가장 추천',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    name: 'Cloudflare Pages + Workers',
    type: '서버리스 / 엣지',
    bestFor: 'Next.js + 엣지 서버리스',
    why: '전 세계 300+ 엣지 서버. 무료 한도가 매우 넉넉.',
    badge: 'Linkmap 사용 중',
    badgeColor: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
  },
  {
    name: 'Railway',
    type: 'PaaS / 동적',
    bestFor: 'Node.js, Express, FastAPI 백엔드',
    why: '백엔드 서버 앱 배포에 최적. Docker 지원.',
    badge: '백엔드 서버',
    badgeColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
  },
  {
    name: 'Netlify',
    type: '정적 / 서버리스',
    bestFor: '정적 사이트, SSG, Gatsby',
    why: 'GitHub 연동 자동 배포. 폼·함수 내장.',
    badge: '정적 사이트',
    badgeColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
  {
    name: 'GitHub Pages',
    type: '정적',
    bestFor: '개인 블로그, 문서 사이트',
    why: 'GitHub 저장소에서 바로 배포. 완전 무료.',
    badge: '완전 무료',
    badgeColor: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
  },
];

const freePlanComparison = [
  {
    platform: 'Vercel',
    builds: '6,000분/월',
    bandwidth: '100GB/월',
    functions: '100GB-hrs',
    domains: '무제한',
    note: 'Hobby 플랜 (개인용)',
  },
  {
    platform: 'Cloudflare Pages',
    builds: '500회/월',
    bandwidth: '무제한',
    functions: '100,000회/일',
    domains: '무제한',
    note: 'Workers 무료 포함',
  },
  {
    platform: 'Netlify',
    builds: '300분/월',
    bandwidth: '100GB/월',
    functions: '125,000회/월',
    domains: '무제한',
    note: 'Starter 플랜',
  },
  {
    platform: 'Railway',
    builds: '-',
    bandwidth: '-',
    functions: '-',
    domains: '무제한',
    note: '$5 크레딧/월 (Trial)',
  },
  {
    platform: 'GitHub Pages',
    builds: '10회/시간',
    bandwidth: '100GB/월',
    functions: '없음',
    domains: '1개 (.github.io)',
    note: '정적 파일 전용',
  },
];

export function HostingTypesContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <ServerCog className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">호스팅 유형 비교</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          정적 호스팅, 동적 호스팅, 서버리스, VPS — 각 유형의 특징과 적합한 프로젝트를 비교합니다.
          상황에 맞는 최적의 플랫폼을 선택하세요.
        </p>
      </ScrollReveal>

      {/* 호스팅 유형 4가지 상세 */}
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
                    <span
                      key={ex}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border font-mono"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
                <div className="mt-auto space-y-2">
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1">적합한 용도</div>
                    <div className="flex flex-wrap gap-1">
                      {h.suitable.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-green-100/60 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1">부적합한 용도</div>
                    <div className="flex flex-wrap gap-1">
                      {h.notSuitable.map((ns) => (
                        <span
                          key={ns}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-red-100/60 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        >
                          {ns}
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

      {/* 플랫폼 추천 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">상황별 추천 플랫폼</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            어떤 프로젝트를 만드느냐에 따라 최적의 플랫폼이 달라집니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-3 max-w-2xl">
            {platformComparison.map((p) => (
              <div key={p.name} className="rounded-lg border bg-card shadow-sm p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold">{p.name}</span>
                  <Badge variant="secondary" className={`text-[10px] ${p.badgeColor}`}>
                    {p.badge}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  <span className="font-medium text-foreground">유형:</span> {p.type}
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  <span className="font-medium text-foreground">최적 용도:</span> {p.bestFor}
                </div>
                <div className="text-xs text-muted-foreground">{p.why}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 무료 플랜 비교표 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">무료 플랜 비교</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            각 플랫폼의 무료 플랜으로 어디까지 가능한지 한눈에 비교해보세요.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl overflow-x-auto">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden min-w-[600px]">
              {/* 헤더 */}
              <div className="grid grid-cols-6 text-[11px] font-semibold border-b bg-muted/30">
                <div className="p-3">플랫폼</div>
                <div className="p-3 text-center">빌드</div>
                <div className="p-3 text-center">대역폭</div>
                <div className="p-3 text-center">함수 실행</div>
                <div className="p-3 text-center">커스텀 도메인</div>
                <div className="p-3 text-center">비고</div>
              </div>
              {/* 행 */}
              {freePlanComparison.map((row, idx) => (
                <div
                  key={row.platform}
                  className={`grid grid-cols-6 text-[11px] ${
                    idx < freePlanComparison.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className="p-3 font-semibold">{row.platform}</div>
                  <div className="p-3 text-center text-muted-foreground">{row.builds}</div>
                  <div className="p-3 text-center text-muted-foreground">{row.bandwidth}</div>
                  <div className="p-3 text-center text-muted-foreground">{row.functions}</div>
                  <div className="p-3 text-center text-muted-foreground">{row.domains}</div>
                  <div className="p-3 text-center text-muted-foreground">{row.note}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-6 max-w-2xl p-4 rounded-lg bg-primary/5 border text-xs text-muted-foreground leading-relaxed">
            💡 <strong className="text-foreground">초보자 추천:</strong> Vercel 무료 플랜으로 시작하세요.
            Next.js 프로젝트라면 설정 없이 GitHub 연동만으로 자동 배포됩니다.
            트래픽이 커지면 Cloudflare로 이전을 고려해도 좋습니다 (대역폭 무제한).
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-6">자주 묻는 질문</h2>
        </ScrollReveal>
        <div className="space-y-4 max-w-2xl">
          {[
            {
              q: 'Next.js 앱은 어디에 배포해야 하나요?',
              a: 'Vercel이 가장 쉽고 최적화되어 있습니다. Next.js를 만든 회사가 직접 운영하기 때문에 설정이 거의 필요 없습니다. Cloudflare Pages + Workers도 대역폭 무제한이라 좋은 대안입니다.',
            },
            {
              q: '무료 플랜으로 실제 서비스를 운영할 수 있나요?',
              a: '네, 월 방문자 수천~수만 명 수준까지는 무료 플랜으로 충분합니다. 트래픽이 크게 늘어나면 유료 전환을 고려하세요. Vercel과 Cloudflare 모두 무료 플랜이 넉넉합니다.',
            },
            {
              q: '정적 호스팅과 동적 호스팅의 차이는?',
              a: '정적 호스팅은 미리 만들어둔 HTML 파일을 그대로 전달합니다(빠르고 저렴). 동적 호스팅은 요청이 올 때마다 서버에서 HTML을 새로 만들어 응답합니다(로그인, 실시간 데이터 가능).',
            },
            {
              q: 'PaaS와 서버리스의 차이가 뭔가요?',
              a: 'PaaS(Vercel, Railway)는 코드를 올리면 서버가 "항상 켜져서" 대기합니다. 서버리스(Lambda, Workers)는 요청이 올 때만 함수가 깨어나서 실행하고 다시 잠듭니다. 서버리스가 비용 효율적이지만 콜드 스타트(첫 실행 지연)가 있을 수 있습니다.',
            },
          ].map((faq, idx) => (
            <ScrollReveal key={faq.q} delay={idx * 0.05}>
              <div className="rounded-xl border bg-card shadow-sm p-5">
                <h3 className="text-sm font-semibold mb-2">❓ {faq.q}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
