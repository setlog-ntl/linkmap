'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet } from 'lucide-react';

const tossFeatures = [
  {
    title: '한국 결제 수단 통합',
    desc: '카드, 계좌이체, 가상계좌, 카카오페이, 네이버페이, 토스페이 등 한국 소비자가 사용하는 모든 결제 수단을 하나의 SDK로 제공합니다.',
    icon: '🇰🇷',
  },
  {
    title: '결제 위젯 UI',
    desc: '결제 수단 선택부터 결제 완료까지의 UI를 위젯으로 제공합니다. 디자인 커스터마이징도 가능합니다.',
    icon: '🎨',
  },
  {
    title: '한국어 문서',
    desc: '공식 문서가 한국어로 제공되어 초보자도 쉽게 따라할 수 있습니다. 샘플 코드와 테스트 환경도 충실합니다.',
    icon: '📖',
  },
  {
    title: '빠른 정산',
    desc: '기본 D+2 정산 (영업일 기준 2일 후 입금). 매출 규모에 따라 협의 가능합니다.',
    icon: '⚡',
  },
];

const widgetFlow = [
  { step: 1, label: '결제 위젯 초기화', detail: 'clientKey로 SDK 로드', env: '클라이언트' },
  { step: 2, label: '결제 수단 렌더링', detail: '카드/간편결제/계좌이체 선택 UI', env: '클라이언트' },
  { step: 3, label: '결제 요청', detail: 'requestPayment() 호출', env: '클라이언트' },
  { step: 4, label: '결제 승인 요청', detail: 'paymentKey, orderId, amount 검증', env: '서버' },
  { step: 5, label: '결제 완료', detail: '주문 상태 업데이트', env: '서버' },
];

const billingKeyFlow = [
  {
    step: 1,
    title: '빌링키 발급',
    desc: '고객이 카드 정보를 입력하면 토스페이먼츠가 빌링키(암호화 토큰)를 발급합니다. 실제 카드 번호는 저장되지 않습니다.',
    icon: '🔑',
  },
  {
    step: 2,
    title: '빌링키 저장',
    desc: '발급받은 빌링키를 내 서버 DB에 저장합니다. 이후 결제 시 이 키를 사용합니다.',
    icon: '💾',
  },
  {
    step: 3,
    title: '정기 결제 실행',
    desc: '결제일이 되면 서버에서 빌링키로 자동 결제를 요청합니다. 고객 추가 인증이 필요하지 않습니다.',
    icon: '🔄',
  },
  {
    step: 4,
    title: '결과 처리',
    desc: '결제 성공/실패 결과를 처리합니다. 실패 시 재시도 로직과 고객 알림을 구현하세요.',
    icon: '📊',
  },
];

const virtualAccountFlow = [
  { step: '1', text: '고객이 가상계좌 결제 선택', color: 'text-blue-500' },
  { step: '2', text: '토스페이먼츠가 일회용 계좌번호 발급', color: 'text-purple-500' },
  { step: '3', text: '고객이 해당 계좌로 입금 (은행 앱/ATM)', color: 'text-orange-500' },
  { step: '4', text: '토스페이먼츠가 입금 확인 웹훅 전송', color: 'text-green-500' },
  { step: '5', text: '내 서버에서 주문 상태를 "결제 완료"로 변경', color: 'text-green-600' },
];

const widgetCode = `// components/toss-payment.tsx
'use client';

import { useEffect, useRef } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

export function TossPayment({ orderId, amount, orderName }: {
  orderId: string;
  amount: number;
  orderName: string;
}) {
  const paymentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey: 'ANONYMOUS' });

      await widgets.setAmount({ currency: 'KRW', value: amount });
      await widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'DEFAULT',
      });
    }
    init();
  }, [amount]);

  return <div id="payment-method" ref={paymentRef} />;
}`;

const confirmCode = `// app/api/toss/confirm/route.ts
import { NextResponse } from 'next/server';

const secretKey = process.env.TOSS_SECRET_KEY!;

export async function POST(req: Request) {
  const { paymentKey, orderId, amount } = await req.json();

  // 1. 서버에서 금액 검증 (클라이언트 값을 그대로 믿지 않음)
  // const order = await getOrder(orderId);
  // if (order.amount !== amount) return error;

  // 2. 토스페이먼츠에 결제 승인 요청
  const res = await fetch(
    'https://api.tosspayments.com/v1/payments/confirm',
    {
      method: 'POST',
      headers: {
        Authorization: \`Basic \${Buffer.from(secretKey + ':').toString('base64')}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  // 3. 주문 상태 업데이트
  // await updateOrderStatus(orderId, 'PAID');

  return NextResponse.json(data);
}`;

export function TossContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">토스페이먼츠 결제 연동</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          토스페이먼츠는 한국 시장에 최적화된 PG사입니다. 카카오페이, 네이버페이 등 한국 간편결제와
          가상계좌까지 하나의 SDK로 제공합니다.
        </p>
      </ScrollReveal>

      {/* 토스페이먼츠 특성 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">토스페이먼츠 특성</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-8">
            {tossFeatures.map((item) => (
              <div key={item.title} className="rounded-lg border bg-card p-4">
                <div className="text-xl mb-2">{item.icon}</div>
                <div className="text-sm font-semibold mb-1">{item.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 결제 위젯 흐름 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">결제 위젯 흐름</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            토스페이먼츠의 결제 위젯을 사용하면 결제 수단 선택 UI를 직접 만들 필요가 없습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-8">
            <div className="space-y-3">
              {widgetFlow.map((item) => (
                <div key={item.step} className="flex items-start gap-3 text-xs rounded border bg-card px-4 py-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] flex items-center justify-center shrink-0 font-bold">
                    {item.step}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">{item.label}</div>
                    <div className="text-muted-foreground mt-0.5">{item.detail}</div>
                  </div>
                  <Badge variant="secondary" className="text-[9px] shrink-0">{item.env}</Badge>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 빌링키 (정기결제) */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">빌링키 (정기결제)</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            빌링키는 고객의 카드 정보를 암호화한 토큰입니다. 구독 서비스처럼 매월 자동 결제가 필요할 때 사용합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mb-8">
            {billingKeyFlow.map((item) => (
              <Card key={item.step} className="border-blue-200/50 dark:border-blue-800/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span>Step {item.step}. {item.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl mb-8">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">주의:</strong> 빌링키는 실제 카드 번호가 아니라 암호화된 토큰입니다.
              그래도 내 DB에 저장할 때는 <strong className="text-foreground">암호화하여 보관</strong>하고,
              빌링키 삭제(구독 해지) API도 반드시 구현하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 가상계좌 흐름 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">가상계좌 결제 흐름</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            가상계좌는 &quot;무통장 입금&quot;의 온라인 버전입니다. 결제 요청과 실제 입금이 분리되어 있어
            <strong className="text-foreground"> 웹훅이 필수</strong>입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl rounded-xl border bg-card p-5 mb-8">
            <div className="space-y-3">
              {virtualAccountFlow.map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className={`text-sm font-bold shrink-0 ${item.color}`}>{item.step}.</span>
                  <span className="text-xs text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t">
              <p className="text-[10px] text-muted-foreground">
                <strong className="text-foreground">핵심:</strong> 가상계좌는 입금 전까지 &quot;대기&quot; 상태입니다.
                입금 확인은 반드시 <strong className="text-foreground">웹훅</strong>으로 처리하세요 (폴링 금지).
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 코드 예시 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">연동 코드 예시</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h3 className="text-sm font-semibold mb-3">결제 위젯 (클라이언트)</h3>
          <div className="max-w-2xl mb-8">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">components/toss-payment.tsx</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {widgetCode}
              </pre>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <h3 className="text-sm font-semibold mb-3">결제 승인 (서버)</h3>
          <div className="max-w-2xl mb-8">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">app/api/toss/confirm/route.ts</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {confirmCode}
              </pre>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">중요:</strong> 결제 승인 API에서 <strong className="text-foreground">금액을 반드시 서버에서 검증</strong>하세요.
              클라이언트에서 보낸 amount를 그대로 사용하면 결제 금액 위변조 공격에 취약합니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
