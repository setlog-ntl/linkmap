'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';

const checkoutFlow = [
  { step: 1, label: '고객이 결제 버튼 클릭', detail: '프론트엔드에서 API 호출' },
  { step: 2, label: '서버에서 Checkout Session 생성', detail: 'Stripe API로 세션 생성' },
  { step: 3, label: 'Stripe 결제 페이지로 리다이렉트', detail: '고객이 카드 정보 입력' },
  { step: 4, label: '결제 완료 후 success_url로 이동', detail: '성공/실패 페이지 표시' },
  { step: 5, label: '웹훅으로 결제 확인', detail: '서버에서 주문 상태 업데이트' },
];

const paymentIntentConcept = [
  {
    name: 'Checkout Session',
    desc: 'Stripe가 제공하는 결제 페이지를 사용합니다. UI를 직접 만들 필요가 없어 가장 빠르게 시작할 수 있습니다.',
    difficulty: '쉬움',
    useCase: '빠른 MVP, 단순 결제',
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    badge: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
  {
    name: 'Payment Intent + Elements',
    desc: '결제 UI를 직접 구성합니다. 카드 입력 폼을 내 사이트 디자인에 맞게 커스터마이징할 수 있습니다.',
    difficulty: '중간',
    useCase: '커스텀 UI가 필요한 서비스',
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    name: 'Stripe Billing (구독)',
    desc: '정기결제(구독)를 위한 기능입니다. 고객 포털, 프로모션 코드, 청구서 자동 발송 등을 제공합니다.',
    difficulty: '중간~복잡',
    useCase: 'SaaS 구독, 멤버십',
    color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
  },
];

const testCards = [
  { number: '4242 4242 4242 4242', result: '결제 성공', desc: '가장 많이 사용하는 테스트 카드' },
  { number: '4000 0000 0000 9995', result: '잔액 부족', desc: 'insufficient_funds 에러 발생' },
  { number: '4000 0000 0000 0002', result: '카드 거절', desc: 'card_declined 에러 발생' },
  { number: '4000 0025 0000 3155', result: '3D Secure 인증', desc: '3DS 인증 팝업 표시' },
  { number: '4000 0000 0000 3220', result: '3D Secure 실패', desc: '3DS 인증 실패 시나리오' },
];

const checkoutSessionCode = `// app/api/checkout/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { priceId } = await req.json();

  // 1. Checkout Session 생성
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',          // 'subscription' for recurring
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,       // Stripe Dashboard에서 만든 Price ID
        quantity: 1,
      },
    ],
    success_url: \`\${process.env.NEXT_PUBLIC_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.NEXT_PUBLIC_URL}/payment/cancel\`,
  });

  // 2. 클라이언트에 세션 URL 반환
  return NextResponse.json({ url: session.url });
}`;

const clientCode = `// components/checkout-button.tsx
'use client';

export function CheckoutButton({ priceId }: { priceId: string }) {
  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });
    const { url } = await res.json();

    // Stripe 결제 페이지로 이동
    window.location.href = url;
  };

  return (
    <button onClick={handleCheckout}>
      결제하기
    </button>
  );
}`;

const envVars = [
  { key: 'STRIPE_SECRET_KEY', value: 'sk_test_...', desc: '서버 전용 Secret Key (절대 클라이언트 노출 금지)' },
  { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', value: 'pk_test_...', desc: '클라이언트용 Publishable Key' },
  { key: 'STRIPE_WEBHOOK_SECRET', value: 'whsec_...', desc: '웹훅 시그니처 검증용 Secret' },
];

export function StripeContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Stripe 결제 연동</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          Stripe는 글로벌 No.1 결제 플랫폼입니다. Checkout Session으로 빠르게 시작하고,
          Payment Intent로 커스텀 UI를 구성하는 방법까지 알아봅니다.
        </p>
      </ScrollReveal>

      {/* Checkout 흐름 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Stripe Checkout 흐름</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            가장 간단한 방법입니다. Stripe가 제공하는 결제 페이지로 고객을 보내면 됩니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-8">
            <div className="space-y-3">
              {checkoutFlow.map((item) => (
                <div key={item.step} className="flex items-start gap-3 text-xs rounded border bg-card px-4 py-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] flex items-center justify-center shrink-0 font-bold">
                    {item.step}
                  </span>
                  <div>
                    <div className="font-medium text-sm text-foreground">{item.label}</div>
                    <div className="text-muted-foreground mt-0.5">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Payment Intent 개념 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">결제 방식 3가지</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            프로젝트 요구사항에 따라 적합한 방식을 선택하세요. 초보자는 Checkout Session부터 시작하는 것을 추천합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl">
            {paymentIntentConcept.map((item) => (
              <div key={item.name} className={`rounded-xl border p-5 ${item.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-sm">{item.name}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
                <div className="space-y-1 pt-3 border-t border-current/10">
                  <div className="text-[10px]">
                    <span className="text-muted-foreground">난이도: </span>
                    <Badge variant="secondary" className={`text-[9px] ${item.badge}`}>{item.difficulty}</Badge>
                  </div>
                  <div className="text-[10px]">
                    <span className="text-muted-foreground">용도: </span>
                    <span className="font-medium">{item.useCase}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 테스트 카드 번호 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">테스트 카드 번호</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            테스트 모드에서 사용할 수 있는 카드 번호입니다. 만료일은 미래 날짜 아무거나, CVC는 아무 3자리를 입력하세요.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl overflow-x-auto mb-8">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">카드 번호</th>
                  <th className="text-left py-2 px-3 font-semibold">결과</th>
                  <th className="text-left py-2 px-3 font-semibold">설명</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {testCards.map((card) => (
                  <tr key={card.number} className="border-b">
                    <td className="py-2 px-3">
                      <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">{card.number}</code>
                    </td>
                    <td className="py-2 px-3 font-medium text-foreground">{card.result}</td>
                    <td className="py-2 px-3">{card.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* Next.js 연동 코드 예시 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Next.js 연동 코드</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Stripe Checkout Session을 사용한 가장 기본적인 연동 예시입니다.
          </p>
        </ScrollReveal>

        {/* 환경변수 */}
        <ScrollReveal delay={0.1}>
          <h3 className="text-sm font-semibold mb-3">환경변수 설정</h3>
          <div className="space-y-2 max-w-2xl mb-8">
            {envVars.map((v) => (
              <div key={v.key} className="flex items-start gap-3 text-xs rounded border bg-card px-3 py-2">
                <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px] shrink-0">{v.key}</code>
                <span className="text-muted-foreground">{v.desc}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* 서버 코드 */}
        <ScrollReveal delay={0.15}>
          <h3 className="text-sm font-semibold mb-3">서버 API 라우트</h3>
          <div className="max-w-2xl mb-8">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">app/api/checkout/route.ts</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {checkoutSessionCode}
              </pre>
            </div>
          </div>
        </ScrollReveal>

        {/* 클라이언트 코드 */}
        <ScrollReveal delay={0.2}>
          <h3 className="text-sm font-semibold mb-3">클라이언트 버튼</h3>
          <div className="max-w-2xl mb-8">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">components/checkout-button.tsx</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {clientCode}
              </pre>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">다음 단계:</strong> 결제 완료 후 주문 상태를 업데이트하려면
              <strong className="text-foreground"> 웹훅</strong>을 반드시 구현하세요. 결제 성공 페이지만으로는 결제 확인이 불완전합니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
