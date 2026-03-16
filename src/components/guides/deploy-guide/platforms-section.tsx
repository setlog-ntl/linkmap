'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const platforms = [
  {
    name: 'Vercel',
    emoji: '▲',
    tagline: 'Next.js 제작사가 만든 배포 플랫폼',
    desc: 'Next.js 프로젝트를 가장 쉽고 빠르게 배포할 수 있습니다. GitHub 연결 후 push하면 자동 배포되고, PR마다 Preview URL이 자동 생성됩니다.',
    pros: ['Next.js 최적화 (제작사)', '자동 배포 + Preview URL', 'Edge Functions 지원', '도메인 연결 매우 쉬움'],
    cons: ['서버리스 함수 10초 제한 (무료)', '상용 플랜 다소 비쌈'],
    bestFor: 'Next.js 프로젝트, 프론트엔드 중심 앱',
    free: '100GB 대역폭/월, 빌드 6000분/월',
    color: 'border-neutral-200 dark:border-neutral-700',
    highlight: true,
  },
  {
    name: 'Cloudflare Pages',
    emoji: '☁️',
    tagline: '전 세계 300개 이상 엣지 서버',
    desc: '글로벌 엣지 네트워크에서 배포됩니다. Workers와 연계하면 풀스택 앱도 가능하고, 무료 한도가 매우 넉넉합니다.',
    pros: ['무료 한도 매우 넉넉', '전 세계 엣지 배포', 'Workers 연계 풀스택', '무료 SSL + 무제한 대역폭'],
    cons: ['Next.js 지원 제한적', '설정이 Vercel보다 복잡'],
    bestFor: '서버리스 풀스택, 글로벌 서비스, 비용 절감',
    free: '무제한 대역폭, 빌드 500회/월',
    color: 'border-orange-200 dark:border-orange-800',
    highlight: false,
  },
  {
    name: 'Railway',
    emoji: '🚂',
    tagline: '백엔드 서버 배포의 새로운 표준',
    desc: '서버 앱(Express, FastAPI 등) 배포에 최적화되어 있습니다. Docker 지원으로 어떤 서버 앱이든 배포 가능하고, DB도 함께 배포할 수 있습니다.',
    pros: ['Docker 지원 (어떤 앱이든 배포)', 'DB 함께 배포 가능', 'CLI로 빠른 배포', '실시간 로그 확인'],
    cons: ['무료 크레딧 적음 ($5/월)', '프론트엔드 전용이면 과한 선택'],
    bestFor: '백엔드 API 서버, Docker 기반 앱',
    free: '무료 $5 크레딧/월',
    color: 'border-purple-200 dark:border-purple-800',
    highlight: false,
  },
  {
    name: 'Netlify',
    emoji: '💚',
    tagline: '정적 사이트 + JAMstack의 원조',
    desc: '정적 사이트 배포에 최적화되어 있습니다. 폼 처리, 서버리스 함수, Identity(인증) 등 다양한 기능이 내장되어 있습니다.',
    pros: ['정적 사이트 최적화', '폼, 함수, 인증 내장', 'Git 기반 자동 배포', '무료 플랜 충분'],
    cons: ['Next.js SSR 지원 불완전', '빌드 시간 제한 (무료 300분/월)'],
    bestFor: '블로그, 포트폴리오, 정적 사이트',
    free: '100GB 대역폭/월, 빌드 300분/월',
    color: 'border-emerald-200 dark:border-emerald-800',
    highlight: false,
  },
];

const comparisonTable = [
  { label: '무료 대역폭', vercel: '100GB/월', cloudflare: '무제한', railway: '$5 크레딧', netlify: '100GB/월' },
  { label: '무료 빌드', vercel: '6000분/월', cloudflare: '500회/월', railway: '크레딧 내', netlify: '300분/월' },
  { label: 'Next.js 지원', vercel: '⭐ 최고', cloudflare: '△ 제한적', railway: '○ Docker로 가능', netlify: '△ 일부 제한' },
  { label: 'Docker 지원', vercel: '✕', cloudflare: '✕', railway: '⭐ 최고', netlify: '✕' },
  { label: '커스텀 도메인', vercel: '무료', cloudflare: '무료', railway: '무료', netlify: '무료' },
  { label: 'Preview 배포', vercel: '자동', cloudflare: '자동', railway: '수동', netlify: '자동' },
  { label: '서버리스 함수', vercel: '○', cloudflare: '⭐ Workers', railway: '해당 없음', netlify: '○' },
];

const decisionGuide = [
  {
    question: 'Next.js 프로젝트인가요?',
    answer: 'Vercel',
    emoji: '▲',
    reason: 'Next.js 제작사이므로 가장 잘 지원합니다.',
  },
  {
    question: '백엔드 서버(Express, FastAPI 등)인가요?',
    answer: 'Railway',
    emoji: '🚂',
    reason: 'Docker 지원으로 어떤 서버 앱이든 배포 가능합니다.',
  },
  {
    question: '비용을 최소화하고 싶나요?',
    answer: 'Cloudflare Pages',
    emoji: '☁️',
    reason: '무제한 대역폭과 넉넉한 무료 한도를 제공합니다.',
  },
  {
    question: '정적 사이트(블로그, 포트폴리오)인가요?',
    answer: 'Netlify',
    emoji: '💚',
    reason: '정적 사이트에 최적화된 기능이 내장되어 있습니다.',
  },
];

export function PlatformsSection() {
  return (
    <section id="platforms" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">배포 플랫폼 비교</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          어떤 플랫폼을 사용할지 결정하는 것은 중요합니다.
          프로젝트 유형에 따라 최적의 플랫폼이 다르니 비교해보세요.
        </p>
      </ScrollReveal>

      {/* 플랫폼 카드 */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-4xl">
          {platforms.map((p) => (
            <div key={p.name} className={`rounded-xl border p-5 bg-card shadow-sm ${p.color} ${p.highlight ? 'ring-2 ring-primary/20' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold">{p.emoji}</span>
                <span className="font-bold text-sm">{p.name}</span>
                {p.highlight && (
                  <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary">추천</Badge>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mb-3">{p.tagline}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.desc}</p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-[10px] font-semibold text-green-600 dark:text-green-400 mb-1">장점</div>
                  <div className="space-y-1">
                    {p.pros.map((pro) => (
                      <div key={pro} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <span className="text-green-500 shrink-0">+</span>
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-red-500 mb-1">단점</div>
                  <div className="space-y-1">
                    {p.cons.map((con) => (
                      <div key={con} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <span className="text-red-400 shrink-0">-</span>
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t space-y-1">
                <div className="text-[10px]">
                  <span className="text-muted-foreground">최적: </span>
                  <span className="font-medium">{p.bestFor}</span>
                </div>
                <div className="text-[10px]">
                  <span className="text-muted-foreground">무료: </span>
                  <span className="text-green-600 dark:text-green-400 font-medium">{p.free}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 비교표 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">한눈에 비교</h3>
        <div className="max-w-4xl overflow-x-auto mb-10">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">항목</th>
                <th className="text-left py-2 px-3 font-semibold">▲ Vercel</th>
                <th className="text-left py-2 px-3 font-semibold">☁️ Cloudflare</th>
                <th className="text-left py-2 px-3 font-semibold">🚂 Railway</th>
                <th className="text-left py-2 px-3 font-semibold">💚 Netlify</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {comparisonTable.map((row) => (
                <tr key={row.label} className="border-b">
                  <td className="py-2 px-3 font-medium text-foreground">{row.label}</td>
                  <td className="py-2 px-3">{row.vercel}</td>
                  <td className="py-2 px-3">{row.cloudflare}</td>
                  <td className="py-2 px-3">{row.railway}</td>
                  <td className="py-2 px-3">{row.netlify}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>

      {/* 나에게 맞는 플랫폼은? */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">🤔 나에게 맞는 플랫폼은?</h3>
        <div className="max-w-2xl space-y-3 mb-6">
          {decisionGuide.map((item) => (
            <div key={item.question} className="rounded-lg border bg-card shadow-sm p-4">
              <div className="text-sm font-medium mb-2">Q. {item.question}</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm font-bold text-primary">{item.answer}</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.reason}</p>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">결론:</strong> 처음 시작한다면 <strong className="text-foreground">Vercel</strong>을
            추천합니다. Next.js와 궁합이 가장 좋고, 설정이 가장 간단합니다.
            나중에 비용이나 성능 최적화가 필요하면 Cloudflare로 전환해도 됩니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
