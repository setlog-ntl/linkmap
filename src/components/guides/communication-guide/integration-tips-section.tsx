'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, Gauge, FileText } from 'lucide-react';

const tips = [
  {
    icon: KeyRound,
    title: 'API 키 관리',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    items: [
      'API 키는 반드시 환경변수(.env)에 저장하세요',
      '클라이언트(브라우저)에 API 키를 절대 노출하지 마세요',
      '서버 사이드(API Route)에서만 알림 서비스를 호출하세요',
      '프로덕션과 개발 환경의 API 키를 분리하세요',
    ],
    codeExample: `// .env.local
RESEND_API_KEY=re_xxxxxxxxxxxx

// src/app/api/send-email/route.ts
const resend = new Resend(process.env.RESEND_API_KEY);`,
  },
  {
    icon: Gauge,
    title: '발송 제한 (Rate Limit)',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    items: [
      '대부분의 서비스에 무료 플랜 발송 한도가 있습니다',
      '한도 초과 시 429 에러가 발생하므로 재시도 로직을 구현하세요',
      '대량 발송은 큐(Queue)를 사용하여 속도를 조절하세요',
      'Resend 무료: 100건/일, SendGrid 무료: 100건/일',
    ],
    codeExample: `// 간단한 재시도 로직
async function sendWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}`,
  },
  {
    icon: FileText,
    title: '템플릿 관리',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    items: [
      '이메일 템플릿은 코드에서 관리하면 버전 관리가 됩니다',
      'Resend는 React 컴포넌트로 이메일을 작성할 수 있습니다',
      '푸시 알림 제목은 짧고 명확하게 (50자 이내)',
      '다국어 지원이 필요하면 처음부터 템플릿을 분리하세요',
    ],
    codeExample: `// React Email 템플릿 (Resend)
import { Html, Text, Button } from '@react-email/components';

export function WelcomeEmail({ name }) {
  return (
    <Html>
      <Text>{name}님, 환영합니다!</Text>
      <Button href="https://myapp.com">
        시작하기
      </Button>
    </Html>
  );
}`,
  },
];

export function IntegrationTipsSection() {
  return (
    <section id="integration-tips" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">공통 연동 팁</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          어떤 알림 서비스를 사용하든 공통으로 알아야 할 핵심 사항입니다.
          처음부터 올바르게 설정하면 나중에 고생하지 않습니다.
        </p>
      </ScrollReveal>

      <div className="space-y-6 max-w-3xl">
        {tips.map((tip, idx) => (
          <ScrollReveal key={tip.title} delay={idx * 0.1}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tip.bgColor}`}>
                    <tip.icon className={`h-5 w-5 ${tip.color}`} />
                  </div>
                  <CardTitle className="text-base">{tip.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tip.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-primary shrink-0 mt-0.5">&#x2022;</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-lg bg-muted/50 border p-3 overflow-x-auto">
                  <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre leading-relaxed">
                    {tip.codeExample}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.35}>
        <div className="mt-8 p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">핵심 원칙:</strong> 알림은 서버에서 보내고,
            API 키는 환경변수로 관리하며, 발송 한도를 항상 확인하세요.
            이 세 가지만 지키면 대부분의 문제를 예방할 수 있습니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
