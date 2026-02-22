'use client';

import { useState } from 'react';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, Check } from 'lucide-react';

const analogies = [
  {
    emoji: '☕',
    title: '카페 와이파이 비번',
    description: '카페에 가면 와이파이 비번을 물어보죠? 코드(카페)는 누구나 들어올 수 있지만, 실제 서비스를 쓰려면 비밀번호(환경변수)가 필요합니다.',
  },
  {
    emoji: '🏦',
    title: '은행 계좌번호',
    description: '앱을 만들 때 필요한 건 은행 계좌번호와 비슷합니다. 누구나 돈을 보낼 수 있지만, 출금하려면 비밀번호가 필요하죠.',
  },
  {
    emoji: '🔑',
    title: '집 도어락 비번',
    description: '집 설계도(코드)는 공유해도 되지만, 도어락 비번(환경변수)은 절대 공유하면 안 됩니다. 비번이 유출되면 누구나 들어올 수 있어요.',
  },
];

const envExample = `# .env.local 파일 예시

# 공개 키 (브라우저에서 사용)
NEXT_PUBLIC_SUPABASE_URL=https://abc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...공개용...

# 비밀 키 (서버에서만 사용)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...비밀...
OPENAI_API_KEY=sk-proj-...`;

const keyPoints = [
  '환경변수는 코드 밖에 저장하는 비밀 설정값입니다',
  '.env.local 파일에 KEY=VALUE 형태로 작성합니다',
  '환경변수가 없으면 코드가 있어도 앱이 작동하지 않습니다',
];

export function WhatIsEnvSection() {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(envExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="what-is-env" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">환경변수란?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          코드에 직접 적으면 안 되는 비밀 정보를 안전하게 보관하는 방법입니다.
        </p>
      </ScrollReveal>

      {/* 3개 비유 카드 */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {analogies.map((item) => (
            <Card key={item.title} className="border">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollReveal>

      {/* 코드 블록 */}
      <ScrollReveal delay={0.15}>
        <div className="max-w-2xl">
          <div className="relative rounded-lg border bg-muted/50">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="text-xs text-muted-foreground font-mono">.env.local</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={copyCode}
              >
                {copied ? (
                  <><Check className="h-3.5 w-3.5 mr-1" /> 복사됨</>
                ) : (
                  <><Copy className="h-3.5 w-3.5 mr-1" /> 복사</>
                )}
              </Button>
            </div>
            <pre className="p-4 text-sm font-mono overflow-x-auto leading-relaxed">
              {envExample}
            </pre>
          </div>
        </div>
      </ScrollReveal>

      {/* 핵심 포인트 */}
      <ScrollReveal delay={0.2}>
        <div className="mt-8 space-y-3 max-w-2xl">
          {keyPoints.map((point) => (
            <div key={point} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span className="text-sm">{point}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
