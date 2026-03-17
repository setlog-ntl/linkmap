'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Webhook } from 'lucide-react';

const pushVsPull = [
  {
    type: 'Pull (폴링)',
    emoji: '🔄',
    desc: '주기적으로 "새 데이터 있어?" 하고 물어보는 방식입니다. 대부분의 요청이 "없음"으로 돌아오므로 비효율적입니다.',
    analogy: '5분마다 우체통 확인하러 나가기',
    pros: ['구현이 단순', '서버 장애에 강함'],
    cons: ['불필요한 요청 많음', '실시간성 부족', '서버 부하 증가'],
    tagColor: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
  },
  {
    type: 'Push (웹훅)',
    emoji: '🔔',
    desc: '이벤트가 발생하면 즉시 알려주는 방식입니다. 필요할 때만 요청이 오므로 효율적이고 실시간입니다.',
    analogy: '택배 도착하면 초인종이 울리는 것',
    pros: ['실시간 반응', '불필요한 요청 없음', '서버 부하 최소'],
    cons: ['엔드포인트 필요', '시그니처 검증 필수', '재시도 로직 고려'],
    tagColor: 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
  },
];

const signatureCode = `// Next.js API Route — 웹훅 수신 엔드포인트
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-webhook-signature');

  // 1. 시그니처 검증 (위조 방지)
  const expected = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  if (signature !== expected) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }

  // 2. 이벤트 처리
  const event = JSON.parse(body);

  switch (event.type) {
    case 'payment.completed':
      // 결제 완료 처리
      break;
    case 'user.created':
      // 신규 가입 처리
      break;
  }

  // 3. 빠르게 200 응답 (타임아웃 방지)
  return NextResponse.json({ received: true });
}`;

const debugTools = [
  {
    name: 'RequestBin',
    url: 'https://requestbin.com',
    desc: '웹훅 요청을 받아서 내용을 보여주는 임시 엔드포인트를 생성합니다.',
    useFor: '실제 웹훅 데이터 구조 확인',
  },
  {
    name: 'Webhook.site',
    url: 'https://webhook.site',
    desc: '실시간으로 들어오는 웹훅 요청을 확인할 수 있는 무료 도구입니다.',
    useFor: '헤더, 바디, 시그니처 확인',
  },
  {
    name: 'ngrok',
    url: 'https://ngrok.com',
    desc: '로컬 서버를 외부에서 접근 가능하게 만드는 터널링 도구입니다.',
    useFor: '로컬 개발 환경에서 웹훅 테스트',
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
          <h1 className="text-2xl md:text-3xl font-bold">웹훅(Webhook)</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          이벤트가 발생하면 즉시 알려주는 자동화의 핵심 메커니즘.
          Push vs Pull의 차이를 이해하고, 안전한 웹훅 수신 엔드포인트를 만드는 방법을 배웁니다.
        </p>
      </ScrollReveal>

      {/* Push vs Pull */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Push vs Pull: 데이터를 받는 두 가지 방법</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            외부 서비스에서 데이터를 가져오는 방법은 크게 두 가지입니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {pushVsPull.map((item, idx) => (
            <ScrollReveal key={item.type} delay={idx * 0.1}>
              <div className={`rounded-xl border p-5 h-full flex flex-col ${item.tagColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{item.emoji}</span>
                  <div className="font-bold text-sm">{item.type}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.desc}</p>
                <div className="rounded-lg bg-background/40 p-2 mb-3 text-xs text-muted-foreground">
                  💡 비유: {item.analogy}
                </div>
                <div className="space-y-2 mt-auto">
                  <div>
                    <div className="text-[10px] font-semibold text-green-600 dark:text-green-400 mb-1">장점</div>
                    <div className="flex flex-wrap gap-1">
                      {item.pros.map((p) => (
                        <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-green-100/60 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-red-500 mb-1">단점</div>
                    <div className="flex flex-wrap gap-1">
                      {item.cons.map((c) => (
                        <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-red-100/60 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 웹훅 수신 엔드포인트 만들기 + 시그니처 검증 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">웹훅 수신 엔드포인트 만들기</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm">
            웹훅을 받으려면 외부에서 접근 가능한 API 엔드포인트가 필요합니다.
            가장 중요한 것은 <strong className="text-foreground">시그니처 검증</strong>입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl">
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/50">
                <Badge variant="secondary" className="text-[10px]">
                  app/api/webhook/route.ts
                </Badge>
                <span className="text-[10px] text-muted-foreground">Next.js API Route</span>
              </div>
              <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
                <code className="text-muted-foreground">{signatureCode}</code>
              </pre>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-3xl">
            <p className="text-xs text-muted-foreground">
              🔒 <strong className="text-foreground">보안 필수:</strong> 시그니처 검증 없이 웹훅을 처리하면
              누구나 가짜 요청을 보내 시스템을 조작할 수 있습니다.
              <code className="text-[10px] bg-background/60 px-1 rounded font-mono mx-1">WEBHOOK_SECRET</code>은
              반드시 환경변수로 관리하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 디버깅 도구 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">웹훅 디버깅 도구</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            웹훅 개발 시 실제 어떤 데이터가 오는지 확인하기 어려울 수 있습니다.
            이 도구들을 활용하세요.
          </p>
        </ScrollReveal>

        <div className="space-y-3 max-w-2xl">
          {debugTools.map((tool, idx) => (
            <ScrollReveal key={tool.name} delay={idx * 0.08}>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold">{tool.name}</span>
                  <Badge variant="secondary" className="text-[10px]">{tool.useFor}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{tool.desc}</p>
                <code className="text-[10px] font-mono text-primary">{tool.url}</code>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
