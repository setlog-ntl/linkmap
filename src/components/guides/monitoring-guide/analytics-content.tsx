'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

const analyticsTools = [
  {
    name: 'Google Analytics (GA4)',
    tagline: '가장 많이 쓰는 무료 분석 도구',
    pros: ['완전 무료', '풍부한 리포트와 대시보드', 'Google Ads / Search Console 연동', '커스텀 이벤트 추적'],
    cons: ['쿠키 사용 (GDPR 동의 배너 필요)', '스크립트 크기 ~45KB', '학습 곡선 높음 (GA4 인터페이스)'],
    bestFor: '대부분의 웹 서비스',
    privacy: '쿠키 기반 — EU 대상 시 동의 배너 필수',
    free: '완전 무료',
    color: 'border-orange-200 dark:border-orange-800',
    highlight: true,
  },
  {
    name: 'Plausible',
    tagline: '프라이버시 우선, 심플한 분석',
    pros: ['쿠키 불필요 (GDPR 완벽 준수)', '1KB 미만 초경량 스크립트', '직관적이고 깔끔한 대시보드', '오픈소스 (셀프호스팅 가능)'],
    cons: ['유료 (월 $9~)', 'GA4 대비 기능 제한', '커스텀 리포트 제한적'],
    bestFor: 'EU 대상 서비스, 프라이버시 중시',
    privacy: '쿠키 없음 — 동의 배너 불필요',
    free: '월 $9~ (셀프호스팅 무료)',
    color: 'border-indigo-200 dark:border-indigo-800',
    highlight: false,
  },
  {
    name: 'Vercel Analytics',
    tagline: 'Next.js 네이티브 성능 분석',
    pros: ['번들에 포함 (추가 스크립트 없음)', 'Core Web Vitals 자동 측정', 'Vercel 대시보드 통합', '설정 1줄이면 끝'],
    cons: ['Vercel 배포 전용', '트래픽 분석은 기본적', 'Pro 플랜부터 상세 데이터'],
    bestFor: 'Vercel에 배포한 Next.js 앱',
    privacy: '쿠키 없음 — 프라이버시 친화적',
    free: 'Hobby 무료 (제한적)',
    color: 'border-neutral-200 dark:border-neutral-700',
    highlight: false,
  },
];

const comparisonTable = [
  { label: '가격', ga4: '무료', plausible: '월 $9~', vercel: 'Hobby 무료' },
  { label: '스크립트 크기', ga4: '~45KB', plausible: '<1KB', vercel: '번들 포함' },
  { label: '쿠키 사용', ga4: '사용', plausible: '미사용', vercel: '미사용' },
  { label: 'GDPR 동의 배너', ga4: '필요', plausible: '불필요', vercel: '불필요' },
  { label: '이벤트 트래킹', ga4: '무제한', plausible: '커스텀 이벤트', vercel: '기본적' },
  { label: '실시간 대시보드', ga4: '있음', plausible: '있음', vercel: '있음' },
  { label: '학습 곡선', ga4: '높음', plausible: '낮음', vercel: '매우 낮음' },
];

const eventTrackingExamples = [
  { event: '회원가입 완료', category: '전환', why: '가입 퍼널의 최종 단계. 전환율 측정의 핵심 지표.' },
  { event: '결제 버튼 클릭', category: '전환', why: '결제 의도를 가진 사용자 수를 파악합니다.' },
  { event: 'CTA 버튼 클릭', category: '참여', why: '랜딩 페이지의 CTA 효과를 측정합니다.' },
  { event: '검색 실행', category: '참여', why: '사용자가 무엇을 찾는지 파악하여 콘텐츠를 개선합니다.' },
  { event: '에러 페이지 노출', category: '에러', why: '404 등 에러 페이지에 도달하는 사용자 비율을 추적합니다.' },
];

export function AnalyticsContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">웹 분석</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          사용자가 어디서 왔는지, 어떤 페이지를 보는지, 어디서 이탈하는지 데이터로 파악합니다.
          GA4, Plausible, Vercel Analytics를 비교하고 이벤트 트래킹 기초를 다룹니다.
        </p>
      </ScrollReveal>

      {/* 도구 비교 카드 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">분석 도구 비교</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            프로젝트 특성과 프라이버시 요구사항에 따라 적합한 도구가 다릅니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl">
          {analyticsTools.map((tool, idx) => (
            <ScrollReveal key={tool.name} delay={idx * 0.08}>
              <div className={`rounded-xl border p-5 h-full flex flex-col ${tool.color} ${tool.highlight ? 'ring-2 ring-primary/20' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{tool.name}</span>
                  {tool.highlight && (
                    <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary">추천</Badge>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mb-3">{tool.tagline}</p>

                <div className="space-y-3 mb-3">
                  <div>
                    <div className="text-[10px] font-semibold text-green-600 dark:text-green-400 mb-1">장점</div>
                    <div className="space-y-1">
                      {tool.pros.map((pro) => (
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
                      {tool.cons.map((con) => (
                        <div key={con} className="text-[10px] text-muted-foreground flex items-start gap-1">
                          <span className="text-red-400 shrink-0">-</span>
                          <span>{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t space-y-1">
                  <div className="text-[10px]">
                    <span className="text-muted-foreground">최적: </span>
                    <span className="font-medium">{tool.bestFor}</span>
                  </div>
                  <div className="text-[10px]">
                    <span className="text-muted-foreground">프라이버시: </span>
                    <span className="font-medium">{tool.privacy}</span>
                  </div>
                  <div className="text-[10px]">
                    <span className="text-muted-foreground">무료: </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">{tool.free}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 한눈에 비교표 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-4">한눈에 비교</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl overflow-x-auto mb-8">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">항목</th>
                  <th className="text-left py-2 px-3 font-semibold">GA4</th>
                  <th className="text-left py-2 px-3 font-semibold">Plausible</th>
                  <th className="text-left py-2 px-3 font-semibold">Vercel Analytics</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {comparisonTable.map((row) => (
                  <tr key={row.label} className="border-b">
                    <td className="py-2 px-3 font-medium text-foreground">{row.label}</td>
                    <td className="py-2 px-3">{row.ga4}</td>
                    <td className="py-2 px-3">{row.plausible}</td>
                    <td className="py-2 px-3">{row.vercel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* 이벤트 트래킹 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">이벤트 트래킹 기초</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            페이지뷰만으로는 부족합니다. 사용자의 특정 행동(클릭, 가입, 결제)을 추적하는
            &quot;이벤트 트래킹&quot;으로 더 깊은 인사이트를 얻을 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl overflow-x-auto mb-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">이벤트</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">카테고리</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">추적 이유</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {eventTrackingExamples.map((e) => (
                  <tr key={e.event} className="border-b">
                    <td className="py-2 px-3 font-medium text-foreground">{e.event}</td>
                    <td className="py-2 px-3">
                      <Badge variant="secondary" className="text-[9px]">{e.category}</Badge>
                    </td>
                    <td className="py-2 px-3">{e.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">팁:</strong> 처음부터 모든 것을 추적하지 마세요.
              핵심 전환 이벤트 3~5개만 먼저 설정하고, 데이터를 보면서 필요한 이벤트를 추가하세요.
              &quot;회원가입 완료&quot;와 &quot;결제 완료&quot;는 거의 모든 서비스에서 필수입니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 프라이버시 고려 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">프라이버시 고려 사항</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            웹 분석 도구 선택 시 프라이버시 규정을 반드시 고려해야 합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-3 mb-6">
            <div className="rounded-lg border bg-card shadow-sm p-4">
              <div className="font-bold text-sm mb-2">🇪🇺 EU 대상 서비스 (GDPR)</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                GA4를 사용하면 쿠키 동의 배너가 필수입니다. 사용자가 거부하면 데이터를 수집할 수 없습니다.
                Plausible이나 Vercel Analytics는 쿠키를 사용하지 않으므로 동의 배너 없이 사용 가능합니다.
              </p>
            </div>
            <div className="rounded-lg border bg-card shadow-sm p-4">
              <div className="font-bold text-sm mb-2">🇰🇷 한국 서비스 (개인정보보호법)</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                한국도 쿠키 사용 시 동의가 필요합니다. 개인정보처리방침에 분석 도구 사용을 명시하고,
                수집하는 데이터의 종류와 목적을 기재해야 합니다.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">결론:</strong> 한국 사용자 대상이라면{' '}
              <strong className="text-foreground">GA4</strong>가 무료이고 기능이 풍부하여 가장 추천합니다.
              EU 사용자도 있다면 <strong className="text-foreground">Plausible</strong>을 고려하세요.
              Vercel에 배포했다면 <strong className="text-foreground">Vercel Analytics</strong>를 추가로 켜두면 성능 데이터를 무료로 얻을 수 있습니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
