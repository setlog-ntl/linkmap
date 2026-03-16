'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';

const comparisons = [
  {
    category: 'IP 주소',
    icon: '🔢',
    analogy: '위도·경도 좌표',
    example: '37.5665° N, 126.9780° E',
    desc: '컴퓨터가 이해하는 숫자 주소',
    color: 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700',
  },
  {
    category: '도메인 이름',
    icon: '🏷️',
    analogy: '건물 이름',
    example: '서울시청',
    desc: '사람이 기억하기 쉬운 이름',
    color: 'bg-primary/5 border-primary/20',
  },
];

const rentalConcept = [
  { step: '1', emoji: '🔍', text: '원하는 이름이 있는지 확인 (중복 불가)', detail: '전 세계에서 단 하나만 존재' },
  { step: '2', emoji: '💳', text: '도메인 등록 업체에서 구매(임대)', detail: '보통 1년 단위, 연 1~3만원' },
  { step: '3', emoji: '🔄', text: '매년 갱신하면 계속 사용 가능', detail: '갱신 안 하면 다른 사람이 가져갈 수 있음' },
];

export function DomainBasicsSection() {
  return (
    <section id="domain-basics" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">도메인이란?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          도메인은 인터넷에서 내 사이트를 찾아가기 위한 <strong className="text-foreground">주소(이름)</strong>입니다.
          모든 웹사이트에는 컴퓨터가 이해하는 숫자 주소(IP)가 있지만,
          사람이 기억하기 어려워서 쉬운 이름을 붙여 사용합니다.
        </p>
      </ScrollReveal>

      {/* IP vs 도메인 비교 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">IP 주소 vs 도메인 이름</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mb-10">
          {comparisons.map((c) => (
            <div key={c.category} className={`rounded-xl border p-5 ${c.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{c.icon}</span>
                <span className="font-bold text-sm">{c.category}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{c.desc}</p>
              <div className="space-y-2">
                <div className="rounded-lg bg-muted/50 p-2">
                  <div className="text-[10px] text-muted-foreground mb-0.5">컴퓨터 세계</div>
                  <code className="text-xs font-mono font-medium">
                    {c.category === 'IP 주소' ? '142.250.80.14' : 'google.com'}
                  </code>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <div className="text-[10px] text-muted-foreground mb-0.5">실생활 비유</div>
                  <div className="text-xs font-medium">{c.analogy}: {c.example}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-2xl p-3 rounded-lg bg-muted/50 border mb-10">
          <p className="text-xs text-muted-foreground">
            💡 집주소가 &quot;서울시 중구 세종대로 110&quot;이라면, 도메인은 &quot;서울시청&quot;이라는 이름표와 같습니다.
            둘 다 같은 곳을 가리키지만, 이름이 기억하기 훨씬 쉽죠.
          </p>
        </div>
      </ScrollReveal>

      {/* 도메인 = 임대 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">도메인은 구매가 아닌 &quot;임대&quot;</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          도메인은 영구 소유가 아니라, 기간제 임대 방식으로 사용합니다.
          마치 가게 간판 자리를 빌리는 것과 비슷합니다.
        </p>
        <div className="space-y-3 max-w-2xl">
          {rentalConcept.map((r) => (
            <div key={r.step} className="flex items-start gap-3 rounded-lg border bg-card p-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-lg">{r.emoji}</span>
              </div>
              <div>
                <div className="text-sm font-medium mb-0.5">
                  <span className="text-primary font-bold mr-1.5">Step {r.step}</span>
                  {r.text}
                </div>
                <div className="text-xs text-muted-foreground">{r.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-2xl mt-4 p-3 rounded-lg bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
          <p className="text-xs text-muted-foreground">
            ⚠️ <strong className="text-foreground">자동 갱신을 꼭 설정하세요!</strong> 갱신을 깜빡하면 도메인이 만료되어 다른 사람이 구매할 수 있습니다.
            도메인 탈취(Domain Hijacking) 피해를 방지하려면 자동 갱신 + 잠금(Transfer Lock)을 활성화하세요.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
