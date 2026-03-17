'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Webhook } from 'lucide-react';

const whyWebhook = [
  {
    title: '비동기 결제 확인',
    desc: '가상계좌 입금, 3D Secure 인증 완료 등은 고객이 결제 페이지를 떠난 후에 발생합니다. 웹훅만이 이 이벤트를 실시간으로 수신할 수 있습니다.',
    icon: '⏳',
  },
  {
    title: '안정적인 결제 확인',
    desc: '고객이 결제 후 브라우저를 닫거나, 네트워크가 끊겨 success_url로 이동하지 못할 수 있습니다. 웹훅은 이런 상황에서도 결제 완료를 보장합니다.',
    icon: '🛡️',
  },
  {
    title: '분쟁/환불 알림',
    desc: '고객이 카드사에 분쟁(차지백)을 제기하거나, 관리자가 환불을 처리하면 웹훅으로 알림을 받습니다.',
    icon: '⚖️',
  },
  {
    title: '구독 상태 변경',
    desc: '정기결제 성공/실패, 구독 취소, 카드 만료 등 구독 라이프사이클 이벤트를 웹훅으로 처리합니다.',
    icon: '🔄',
  },
];

const signatureSteps = [
  {
    step: 1,
    title: '요청 수신',
    desc: 'PG사가 내 서버의 웹훅 URL로 POST 요청을 보냅니다.',
    icon: '📩',
  },
  {
    step: 2,
    title: '시그니처 추출',
    desc: '요청 헤더에서 시그니처 값을 추출합니다. (Stripe: Stripe-Signature, 토스: 요청 본문의 secret)',
    icon: '🔍',
  },
  {
    step: 3,
    title: '시그니처 계산',
    desc: '웹훅 시크릿 키와 요청 본문으로 시그니처를 직접 계산합니다. (HMAC-SHA256)',
    icon: '🧮',
  },
  {
    step: 4,
    title: '비교 및 검증',
    desc: '추출한 시그니처와 계산한 시그니처가 일치하면 정상 요청, 불일치하면 위조된 요청입니다.',
    icon: '✅',
  },
];

const idempotencyExplain = [
  {
    scenario: '웹훅 없이',
    problem: '결제 완료 이벤트가 2번 전달되면 포인트가 2번 적립됨',
    icon: '❌',
    color: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
  },
  {
    scenario: '멱등성 처리 후',
    problem: '이벤트 ID로 중복 여부를 확인하여 1번만 처리됨',
    icon: '✅',
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
  },
];

const retryPolicy = [
  { attempt: '1차', timing: '즉시', desc: '최초 전송' },
  { attempt: '2차', timing: '5분 후', desc: '1차 실패 시' },
  { attempt: '3차', timing: '30분 후', desc: '2차 실패 시' },
  { attempt: '4차', timing: '2시간 후', desc: '3차 실패 시' },
  { attempt: '5차', timing: '24시간 후', desc: '4차 실패 시 (최종)' },
];

const stripeWebhookCode = `// app/api/webhook/stripe/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  // 1. 시그니처 검증
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // 2. 멱등성 체크 (이벤트 ID로 중복 확인)
  // const exists = await checkEventProcessed(event.id);
  // if (exists) return NextResponse.json({ received: true });

  // 3. 이벤트 타입별 처리
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      // 주문 상태를 "결제 완료"로 업데이트
      // await updateOrderStatus(session.metadata?.orderId, 'PAID');
      break;
    }
    case 'payment_intent.payment_failed': {
      // 결제 실패 처리
      break;
    }
    case 'charge.refunded': {
      // 환불 처리
      break;
    }
  }

  // 4. 이벤트 처리 완료 기록
  // await markEventProcessed(event.id);

  return NextResponse.json({ received: true });
}`;

const tossWebhookCode = `// app/api/webhook/toss/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const webhookSecret = process.env.TOSS_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const parsed = JSON.parse(body);

  // 1. 시그니처 검증 (토스페이먼츠 방식)
  // 토스는 웹훅 시크릿과 요청 본문으로 HMAC 검증
  // 실제 구현은 토스페이먼츠 공식 문서 참고

  // 2. 멱등성 체크
  // const exists = await checkEventProcessed(parsed.eventId);
  // if (exists) return NextResponse.json({ success: true });

  // 3. 이벤트 타입별 처리
  switch (parsed.eventType) {
    case 'PAYMENT_STATUS_CHANGED': {
      const { paymentKey, status, orderId } = parsed.data;
      if (status === 'DONE') {
        // 결제 완료 처리
        // await updateOrderStatus(orderId, 'PAID');
      }
      break;
    }
    case 'VIRTUAL_ACCOUNT_DEPOSIT_CALLBACK': {
      // 가상계좌 입금 확인
      break;
    }
  }

  // 4. 이벤트 처리 완료 기록
  // await markEventProcessed(parsed.eventId);

  return NextResponse.json({ success: true });
}`;

const bestPractices = [
  {
    title: '빠르게 200 응답',
    desc: '웹훅 처리는 3~5초 내에 200 응답을 반환해야 합니다. 시간이 오래 걸리는 작업은 큐에 넣고 비동기로 처리하세요.',
    icon: '⚡',
  },
  {
    title: '멱등성 키 저장',
    desc: '처리한 이벤트 ID를 DB에 저장하여 중복 처리를 방지하세요. 간단하게는 unique 제약 조건으로 구현 가능합니다.',
    icon: '🔑',
  },
  {
    title: '실패 시 로깅',
    desc: '웹훅 처리 실패 시 상세 로그를 남기세요. PG사 대시보드에서 웹훅 재전송도 가능합니다.',
    icon: '📝',
  },
  {
    title: '타임아웃 설정',
    desc: '웹훅 엔드포인트에 적절한 타임아웃을 설정하세요. 외부 API 호출이 실패해도 웹훅 자체는 200을 반환해야 합니다.',
    icon: '⏱️',
  },
];

export function WebhookContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Webhook className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">결제 웹훅 처리</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          웹훅은 결제 시스템의 핵심입니다. PG사가 결제 상태 변경을 실시간으로 내 서버에 알려주는 메커니즘으로,
          안정적인 결제 처리를 위해 반드시 구현해야 합니다.
        </p>
      </ScrollReveal>

      {/* 웹훅이 필요한 이유 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">웹훅이 필요한 이유</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-8">
            {whyWebhook.map((item) => (
              <div key={item.title} className="rounded-lg border bg-card p-4">
                <div className="text-xl mb-2">{item.icon}</div>
                <div className="text-sm font-semibold mb-1">{item.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-2xl rounded-xl border bg-card p-5 mb-8">
            <div className="grid grid-cols-3 gap-4 text-center text-xs mb-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">🏦</div>
                <div className="font-medium">PG사</div>
                <div className="text-[10px] text-muted-foreground">결제 상태 변경 감지</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">📨</div>
                <div className="font-medium text-primary">웹훅 전송</div>
                <div className="text-[10px] text-muted-foreground">POST 요청</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">🖥️</div>
                <div className="font-medium">내 서버</div>
                <div className="text-[10px] text-muted-foreground">주문 상태 업데이트</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              PG사가 결제 상태 변경을 감지하면, 내 서버의 웹훅 URL로 POST 요청을 보냅니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 시그니처 검증 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">시그니처 검증</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            웹훅 요청이 실제 PG사에서 온 것인지 확인하는 과정입니다.
            <strong className="text-foreground"> 검증 없이 처리하면 가짜 결제 이벤트에 속을 수 있습니다.</strong>
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mb-8">
            {signatureSteps.map((item) => (
              <Card key={item.step}>
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
      </section>

      {/* 멱등성 처리 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">멱등성 처리</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            <strong className="text-foreground">멱등성(Idempotency)</strong>이란 같은 요청을 여러 번 보내도
            결과가 동일한 성질입니다. 네트워크 문제로 같은 웹훅이 여러 번 전달될 수 있으므로 반드시 처리해야 합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-8">
            {idempotencyExplain.map((item) => (
              <div key={item.scenario} className={`rounded-xl border p-5 ${item.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-bold text-sm">{item.scenario}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.problem}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl mb-8">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">구현 방법:</strong> 이벤트 ID를 DB에 저장하고,
              웹훅 수신 시 이미 처리한 이벤트인지 먼저 확인합니다.
              <code className="text-[10px] font-mono bg-muted px-1 rounded ml-1">
                CREATE UNIQUE INDEX ON webhook_events(event_id)
              </code>
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 재시도 로직 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">재시도 정책</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            내 서버가 200 응답을 반환하지 않으면 PG사가 자동으로 재시도합니다.
            재시도 정책은 PG사마다 다르지만 일반적으로 아래와 같습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl overflow-x-auto mb-8">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">시도</th>
                  <th className="text-left py-2 px-3 font-semibold">타이밍</th>
                  <th className="text-left py-2 px-3 font-semibold">비고</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {retryPolicy.map((row) => (
                  <tr key={row.attempt} className="border-b">
                    <td className="py-2 px-3 font-medium text-foreground">{row.attempt}</td>
                    <td className="py-2 px-3">{row.timing}</td>
                    <td className="py-2 px-3">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* 코드 예시 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">웹훅 코드 예시</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h3 className="text-sm font-semibold mb-3">Stripe 웹훅</h3>
          <div className="max-w-2xl mb-8">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">app/api/webhook/stripe/route.ts</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {stripeWebhookCode}
              </pre>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <h3 className="text-sm font-semibold mb-3">토스페이먼츠 웹훅</h3>
          <div className="max-w-2xl mb-8">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">app/api/webhook/toss/route.ts</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {tossWebhookCode}
              </pre>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 베스트 프랙티스 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">웹훅 베스트 프랙티스</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-6">
            {bestPractices.map((item) => (
              <div key={item.title} className="rounded-lg border bg-card p-4">
                <div className="text-xl mb-2">{item.icon}</div>
                <div className="text-sm font-semibold mb-1">{item.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">핵심 요약:</strong> 웹훅 처리의 3대 원칙 —
              <strong className="text-foreground"> (1) 시그니처 검증</strong>,
              <strong className="text-foreground"> (2) 멱등성 처리</strong>,
              <strong className="text-foreground"> (3) 빠른 200 응답</strong>.
              이 세 가지만 지키면 안정적인 결제 시스템을 운영할 수 있습니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
