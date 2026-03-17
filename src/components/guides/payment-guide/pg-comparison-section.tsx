'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const pgProviders = [
  {
    name: 'Stripe',
    icon: '💜',
    tagline: '글로벌 No.1 결제 플랫폼',
    desc: '전 세계 195개국, 135개 통화를 지원하는 글로벌 결제 플랫폼입니다. API 설계가 우수하고 개발자 문서가 업계 최고 수준입니다.',
    pros: ['뛰어난 API 설계 & 문서', '글로벌 결제 지원 (135개 통화)', 'Checkout 페이지 제공', '강력한 테스트 모드'],
    cons: ['한국 간편결제 미지원', '수수료 2.9% + 30원 (해외 기준)', '한국어 지원 제한적'],
    fee: '2.9% + ₩400',
    bestFor: '글로벌 SaaS, 해외 결제가 필요한 서비스',
    color: 'border-purple-200 dark:border-purple-800',
    highlight: false,
  },
  {
    name: '토스페이먼츠',
    icon: '🔵',
    tagline: '한국 No.1 PG사',
    desc: '한국 소비자에게 익숙한 모든 결제 수단을 지원합니다. 카카오페이, 네이버페이, 토스페이 등 간편결제와 가상계좌까지 한 번에 연동 가능합니다.',
    pros: ['한국 간편결제 모두 지원', '결제 위젯 UI 제공', '빌링키(정기결제) 지원', '가상계좌, 계좌이체 지원'],
    cons: ['해외 결제 지원 제한적', '글로벌 서비스에는 부적합', 'Stripe 대비 API 복잡도 높음'],
    fee: '카드 2.5%~ / 간편결제 3.3%~',
    bestFor: '국내 서비스, 한국 소비자 대상 커머스',
    color: 'border-blue-200 dark:border-blue-800',
    highlight: true,
  },
];

const comparisonTable = [
  { label: '본사', stripe: '미국 (샌프란시스코)', toss: '한국 (서울)' },
  { label: '카드 수수료', stripe: '2.9% + ₩400', toss: '2.5%~3.0%' },
  { label: '해외 결제', stripe: '135개 통화 지원', toss: '제한적' },
  { label: '간편결제', stripe: 'Apple Pay, Google Pay', toss: '카카오/네이버/토스페이' },
  { label: '가상계좌', stripe: '미지원 (한국)', toss: '지원' },
  { label: '정기결제', stripe: 'Stripe Billing', toss: '빌링키 방식' },
  { label: '개발 문서', stripe: '영어 (업계 최고)', toss: '한국어 (우수)' },
  { label: '테스트 모드', stripe: '별도 API 키', toss: '별도 API 키' },
  { label: 'SDK', stripe: 'Node, Python, Ruby 등', toss: 'JavaScript, Java' },
  { label: '정산 주기', stripe: 'D+2 (미국) / D+7 (한국)', toss: 'D+2~D+7 (협의)' },
];

const recommendations = [
  {
    scenario: '한국 소비자 대상 쇼핑몰/SaaS',
    recommend: '토스페이먼츠',
    icon: '🔵',
    reason: '카카오페이, 네이버페이 등 한국 간편결제가 필수입니다.',
  },
  {
    scenario: '글로벌 SaaS (해외 고객 포함)',
    recommend: 'Stripe',
    icon: '💜',
    reason: '135개 통화와 195개국 결제를 하나의 API로 처리합니다.',
  },
  {
    scenario: '국내 + 해외 모두 대응',
    recommend: '둘 다 사용',
    icon: '🔗',
    reason: '국내는 토스페이먼츠, 해외는 Stripe로 분리하는 것이 최적입니다.',
  },
  {
    scenario: '개인 프로젝트 / MVP',
    recommend: 'Stripe',
    icon: '💜',
    reason: '설정이 간단하고 테스트 모드가 우수합니다. Checkout 페이지로 빠르게 시작 가능합니다.',
  },
];

export function PgComparisonSection() {
  return (
    <section id="pg-comparison" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">PG사 비교: Stripe vs 토스페이먼츠</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          프로젝트의 타겟 시장에 따라 적합한 PG사가 다릅니다.
          각각의 특징을 비교하고 나에게 맞는 PG사를 선택하세요.
        </p>
      </ScrollReveal>

      {/* PG사 카드 */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-4xl">
          {pgProviders.map((p) => (
            <div key={p.name} className={`rounded-xl border p-5 bg-card shadow-sm ${p.color} ${p.highlight ? 'ring-2 ring-primary/20' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold">{p.icon}</span>
                <span className="font-bold text-sm">{p.name}</span>
                {p.highlight && (
                  <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary">국내 추천</Badge>
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
                  <span className="text-muted-foreground">수수료: </span>
                  <span className="font-medium">{p.fee}</span>
                </div>
                <div className="text-[10px]">
                  <span className="text-muted-foreground">최적: </span>
                  <span className="font-medium">{p.bestFor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 비교표 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">한눈에 비교</h3>
        <div className="max-w-3xl overflow-x-auto mb-10">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">항목</th>
                <th className="text-left py-2 px-3 font-semibold">💜 Stripe</th>
                <th className="text-left py-2 px-3 font-semibold">🔵 토스페이먼츠</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {comparisonTable.map((row) => (
                <tr key={row.label} className="border-b">
                  <td className="py-2 px-3 font-medium text-foreground">{row.label}</td>
                  <td className="py-2 px-3">{row.stripe}</td>
                  <td className="py-2 px-3">{row.toss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>

      {/* 상황별 추천 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">상황별 추천</h3>
        <div className="max-w-2xl space-y-3 mb-6">
          {recommendations.map((item) => (
            <div key={item.scenario} className="rounded-lg border bg-card shadow-sm p-4">
              <div className="text-sm font-medium mb-2">Q. {item.scenario}</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-bold text-primary">{item.recommend}</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.reason}</p>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">결론:</strong> 한국 서비스라면 <strong className="text-foreground">토스페이먼츠</strong>,
            글로벌 서비스라면 <strong className="text-foreground">Stripe</strong>이 정답입니다.
            둘 다 테스트 모드가 있으니 직접 연동해보고 결정하세요.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
