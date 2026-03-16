'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';

const cdnProviders = [
  {
    name: 'Cloudflare',
    desc: '전 세계 300+ 데이터센터. 무료 플랜에서도 CDN, DDoS 방어, SSL 모두 제공.',
    free: '무제한 대역폭',
    badge: '가장 인기',
    badgeColor: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
  },
  {
    name: 'AWS CloudFront',
    desc: 'Amazon의 CDN. AWS 생태계와 완벽 통합. 세밀한 설정이 가능하지만 설정이 복잡.',
    free: '1TB/월 (12개월)',
    badge: 'AWS 사용자',
    badgeColor: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
  },
  {
    name: 'Fastly',
    desc: '실시간 캐시 퍼지(삭제)가 빠름. 대기업 서비스에서 많이 사용.',
    free: '유료 위주',
    badge: '엔터프라이즈',
    badgeColor: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
  },
  {
    name: 'Vercel Edge Network',
    desc: 'Vercel에 배포하면 자동으로 전 세계 CDN 적용. 별도 설정 불필요.',
    free: 'Vercel 무료 포함',
    badge: 'Next.js 최적',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
];

const edgePlatforms = [
  {
    name: 'Cloudflare Workers',
    desc: '전 세계 300+ 엣지에서 JavaScript/TypeScript 실행. V8 엔진 기반으로 콜드 스타트 거의 없음.',
    free: '100,000 요청/일',
    tag: 'Linkmap 사용 중',
  },
  {
    name: 'Vercel Edge Functions',
    desc: 'Vercel의 엣지 런타임. Next.js 미들웨어와 API Route에서 자동 사용 가능.',
    free: 'Vercel 무료 포함',
    tag: 'Next.js 통합',
  },
  {
    name: 'Deno Deploy',
    desc: 'Deno 런타임 기반 엣지 서버리스. TypeScript 네이티브 지원. 빠른 배포.',
    free: '100,000 요청/일',
    tag: 'Deno/Fresh',
  },
];

export function CdnContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">CDN과 엣지 서버</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          CDN(Content Delivery Network)은 전 세계에 분산된 서버에 콘텐츠를 복사해두고,
          사용자와 가장 가까운 서버에서 응답하여 속도를 극적으로 높이는 기술입니다.
        </p>
      </ScrollReveal>

      {/* CDN이란? */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">CDN이란?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Content Delivery Network(콘텐츠 전송 네트워크)의 줄임말입니다.
            전 세계 수백 개 데이터센터에 파일을 미리 복사해두고,
            사용자에게 가장 가까운 서버에서 응답합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-6">
            <div className="rounded-xl border bg-card shadow-sm p-5">
              <h3 className="font-semibold mb-4 text-sm">💡 실생활 비유</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏭</span>
                  <div>
                    <div className="font-medium">CDN 없이 (공장 직배송)</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      서울에서 미국 공장에 직접 주문.
                      배송 2주 걸림 (= 200ms 지연).
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏪</span>
                  <div>
                    <div className="font-medium">CDN 있으면 (편의점 배치)</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      미리 편의점에 물건을 배치.
                      집 앞 편의점에서 즉시 구매 (= 5ms).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* CDN 없이 vs 있을 때 비교 도식 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">CDN 없이 vs CDN 있을 때</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mb-6">
            {/* CDN 없이 */}
            <div className="rounded-xl border border-red-200 dark:border-red-800 bg-card shadow-sm p-5">
              <div className="text-sm font-semibold mb-4 text-red-600 dark:text-red-400">
                ❌ CDN 없이
              </div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                    👤
                  </div>
                  <div className="text-[10px]">서울 사용자</div>
                </div>
                <div className="flex-1 relative">
                  <div className="border-t-2 border-dashed border-red-300 dark:border-red-700" />
                  <div className="text-[9px] text-red-500 text-center mt-1">
                    태평양 횡단 ~200ms
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                    🖥️
                  </div>
                  <div className="text-[10px]">미국 서버</div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground text-center">
                매번 미국까지 왕복 → 느리고 서버 부하 집중
              </p>
            </div>

            {/* CDN 있을 때 */}
            <div className="rounded-xl border border-green-200 dark:border-green-800 bg-card shadow-sm p-5">
              <div className="text-sm font-semibold mb-4 text-green-600 dark:text-green-400">
                ✅ CDN 있을 때
              </div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                    👤
                  </div>
                  <div className="text-[10px]">서울 사용자</div>
                </div>
                <div className="flex-1 relative">
                  <div className="border-t-2 border-green-400 dark:border-green-600" />
                  <div className="text-[9px] text-green-600 dark:text-green-400 text-center mt-1">
                    서울 엣지 ~5ms
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                    ⚡
                  </div>
                  <div className="text-[10px] text-primary font-medium">서울 CDN</div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground text-center">
                가장 가까운 CDN에서 응답 → 40배 빠름
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* CDN 동작 원리 3단계 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">CDN 동작 원리 3단계</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-4">
            {[
              {
                step: 1,
                emoji: '📤',
                title: '원본 서버에 파일 업로드',
                desc: '개발자가 이미지, CSS, JS 등 파일을 원본 서버(Origin)에 배포합니다. 이 서버가 "진짜" 데이터를 보관합니다.',
              },
              {
                step: 2,
                emoji: '🌐',
                title: '전 세계 엣지 서버에 복제',
                desc: 'CDN이 원본 파일을 전 세계 수백 개 데이터센터(엣지 서버)에 자동으로 복사합니다. 서울, 도쿄, 런던, 뉴욕 등 주요 도시에 배치됩니다.',
              },
              {
                step: 3,
                emoji: '⚡',
                title: '가장 가까운 서버에서 응답',
                desc: '서울 사용자가 접속하면, 미국 원본 서버 대신 서울 엣지 서버가 응답합니다. 물리적 거리가 짧으니 당연히 빠릅니다.',
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border bg-card shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{item.emoji}</span>
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 주요 CDN 제공자 비교 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">주요 CDN 제공자 비교</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            대부분의 호스팅 플랫폼(Vercel, Netlify)은 CDN을 기본 내장하고 있습니다.
            별도로 CDN을 사용하려면 아래 서비스를 참고하세요.
          </p>
        </ScrollReveal>

        <div className="space-y-3 max-w-2xl">
          {cdnProviders.map((provider, idx) => (
            <ScrollReveal key={provider.name} delay={idx * 0.05}>
              <div className="rounded-xl border bg-card shadow-sm p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold">{provider.name}</span>
                  <Badge variant="secondary" className={`text-[10px] ${provider.badgeColor}`}>
                    {provider.badge}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-1">
                  {provider.desc}
                </p>
                <div className="text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">무료 한도:</span> {provider.free}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 엣지 컴퓨팅 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">엣지 컴퓨팅이란?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            CDN은 정적 파일(이미지, CSS)만 전달합니다.
            <strong className="text-foreground"> 엣지 컴퓨팅</strong>은 여기서 한 발 더 나아가,
            CDN 서버에서 <strong className="text-foreground">코드까지 실행</strong>합니다.
            CDN + 서버리스 = 엣지 서버리스입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-6">
            <div className="rounded-xl border bg-card shadow-sm p-5">
              <h3 className="font-semibold mb-3 text-sm">📊 CDN vs 엣지 컴퓨팅 비교</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="font-semibold mb-1">🌍 CDN</div>
                  <div className="text-muted-foreground leading-relaxed">
                    정적 파일(이미지, CSS, JS)을 가까운 서버에서 전달.
                    코드 실행 불가.
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-primary/5">
                  <div className="font-semibold mb-1">⚡ 엣지 컴퓨팅</div>
                  <div className="text-muted-foreground leading-relaxed">
                    가까운 서버에서 코드를 실행하고 결과 응답.
                    API, 인증, 리다이렉트 등 로직 처리 가능.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <h3 className="text-lg font-semibold mb-4">주요 엣지 서버리스 플랫폼</h3>
          <div className="space-y-3 max-w-2xl">
            {edgePlatforms.map((platform) => (
              <div key={platform.name} className="rounded-xl border bg-card shadow-sm p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold">{platform.name}</span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-primary/10 text-primary"
                  >
                    {platform.tag}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-1">
                  {platform.desc}
                </p>
                <div className="text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">무료:</span> {platform.free}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 언제 CDN이 필요한가? */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">언제 CDN이 필요한가?</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  emoji: '🖼️',
                  title: '이미지·정적 파일이 많을 때',
                  desc: '이미지, 동영상, CSS, JS 파일이 많으면 CDN으로 로딩 속도를 크게 개선할 수 있습니다.',
                },
                {
                  emoji: '🌏',
                  title: '글로벌 서비스일 때',
                  desc: '전 세계 사용자가 접속하는 서비스라면, CDN 없이는 먼 지역 사용자의 체감 속도가 크게 느려집니다.',
                },
                {
                  emoji: '🚀',
                  title: 'API 응답 캐싱이 필요할 때',
                  desc: '자주 바뀌지 않는 API 응답을 엣지에서 캐싱하면 서버 부하를 줄이고 응답 속도를 높일 수 있습니다.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border bg-card shadow-sm p-4 text-center">
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-6 max-w-2xl p-4 rounded-lg bg-primary/5 border text-xs text-muted-foreground leading-relaxed">
            💡 <strong className="text-foreground">참고:</strong> Vercel, Netlify, Cloudflare Pages 등
            모던 호스팅 플랫폼은 CDN을 <strong className="text-foreground">기본 내장</strong>하고 있습니다.
            별도로 CDN을 설정할 필요가 없는 경우가 대부분입니다.
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
              q: 'CDN을 쓰면 항상 빨라지나요?',
              a: '정적 파일(이미지, CSS, JS)은 거의 항상 빨라집니다. 다만 실시간으로 바뀌는 데이터(채팅 메시지 등)는 CDN 캐싱의 효과가 적습니다. 이런 경우 엣지 컴퓨팅이나 WebSocket을 사용합니다.',
            },
            {
              q: 'CDN 비용이 비싸지 않나요?',
              a: 'Cloudflare는 무료 플랜에서도 CDN 대역폭이 무제한입니다. Vercel, Netlify도 무료 플랜에 CDN이 포함되어 있어, 소규모~중규모 서비스에서는 추가 비용이 없습니다.',
            },
            {
              q: '엣지 서버리스와 일반 서버리스(Lambda)의 차이는?',
              a: '일반 서버리스(AWS Lambda)는 특정 리전(예: 미국 동부)에서만 실행됩니다. 엣지 서버리스(Cloudflare Workers)는 전 세계 300+ 위치에서 실행되어 어디서든 빠릅니다. 대신 실행 시간/메모리에 더 엄격한 제한이 있습니다.',
            },
            {
              q: '캐시(Cache)란 무엇인가요?',
              a: '자주 요청되는 데이터를 임시 저장해두는 것입니다. CDN의 엣지 서버에 파일을 "캐싱"하면, 원본 서버까지 가지 않고 엣지에서 바로 응답할 수 있습니다. 택배로 비유하면 "미리 집 앞에 물건을 가져다 놓는 것"과 같습니다.',
            },
            {
              q: 'Next.js를 쓰면 CDN이 자동으로 적용되나요?',
              a: 'Vercel이나 Cloudflare Pages에 배포하면 정적 자원(이미지, CSS, JS)에 CDN이 자동 적용됩니다. 별도 설정 없이 전 세계 사용자에게 빠르게 전달됩니다.',
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
