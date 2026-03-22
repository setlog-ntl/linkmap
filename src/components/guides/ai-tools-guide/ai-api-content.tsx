'use client';

import { useState } from 'react';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu } from 'lucide-react';

const apiKeySteps = [
  {
    provider: 'OpenAI',
    steps: [
      'platform.openai.com 접속 → 회원가입',
      'API Keys 페이지에서 "Create new secret key" 클릭',
      '키를 복사해 .env.local에 저장: OPENAI_API_KEY=sk-...',
      '결제 수단 등록 (사용량 기반 과금)',
    ],
    envKey: 'OPENAI_API_KEY',
    color: 'border-green-200 dark:border-green-800',
  },
  {
    provider: 'Anthropic',
    steps: [
      'console.anthropic.com 접속 → 회원가입',
      'API Keys에서 "Create Key" 클릭',
      '키를 복사해 .env.local에 저장: ANTHROPIC_API_KEY=sk-ant-...',
      '결제 수단 등록 (사용량 기반 과금)',
    ],
    envKey: 'ANTHROPIC_API_KEY',
    color: 'border-purple-200 dark:border-purple-800',
  },
  {
    provider: 'Google Gemini',
    steps: [
      'aistudio.google.com 접속 → Google 계정 로그인',
      '"Get API key" → "Create API key" 클릭',
      '키를 복사해 .env.local에 저장: GEMINI_API_KEY=AI...',
      '무료 티어 제공 (분당 15회, 일 1,500회 요청)',
    ],
    envKey: 'GEMINI_API_KEY',
    color: 'border-blue-200 dark:border-blue-800',
  },
];

const pricingTable = [
  { model: 'GPT-4o', provider: 'OpenAI', input: '$2.5', output: '$10', context: '128K', badge: '범용 추천' },
  { model: 'GPT-4o mini', provider: 'OpenAI', input: '$0.15', output: '$0.60', context: '128K', badge: '가성비' },
  { model: 'Claude Sonnet 4', provider: 'Anthropic', input: '$3', output: '$15', context: '200K', badge: '코딩 추천' },
  { model: 'Claude Haiku 3.5', provider: 'Anthropic', input: '$0.80', output: '$4', context: '200K', badge: '가성비' },
  { model: 'Gemini 2.5 Pro', provider: 'Google', input: '$1.25', output: '$10', context: '1M', badge: '고성능' },
  { model: 'Gemini 2.5 Flash', provider: 'Google', input: '$0.15', output: '$0.60', context: '1M', badge: '가성비' },
  { model: 'Gemini 2.0 Flash', provider: 'Google', input: '무료 티어', output: '무료 티어', context: '1M', badge: '입문 추천' },
];

const streamingExamples = {
  openai: {
    label: 'OpenAI',
    file: 'src/app/api/chat/route.ts',
    code: `import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const response = await fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }],
        stream: true,
      }),
    },
  );

  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}`,
  },
  anthropic: {
    label: 'Anthropic',
    file: 'src/app/api/chat/route.ts',
    code: `import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const response = await fetch(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        stream: true,
        messages: [{ role: 'user', content: message }],
      }),
    },
  );

  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}`,
  },
  gemini: {
    label: 'Google Gemini',
    file: 'src/app/api/chat/route.ts',
    code: `import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=\${apiKey}\`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: message }] }],
      }),
    },
  );

  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}`,
  },
} as const;

type StreamingProvider = keyof typeof streamingExamples;

const costTips = [
  {
    title: 'Rate Limiting',
    desc: '사용자당 요청 횟수를 제한합니다. 악의적 사용이나 실수로 인한 과다 비용을 방지합니다.',
    icon: '🚦',
  },
  {
    title: '응답 캐싱',
    desc: '같은 질문에 대한 응답을 캐시합니다. 반복 요청 시 API를 호출하지 않아 비용이 절감됩니다.',
    icon: '💾',
  },
  {
    title: '모델 선택 최적화',
    desc: '간단한 작업은 저렴한 모델(GPT-4o mini, Haiku)을, 복잡한 작업만 고성능 모델을 사용합니다.',
    icon: '🎯',
  },
  {
    title: '사용량 알림 설정',
    desc: 'OpenAI/Anthropic/Google 대시보드에서 월 예산 한도를 설정하세요. 한도 도달 시 자동 차단됩니다.',
    icon: '🔔',
  },
  {
    title: '무료 티어 활용',
    desc: 'Gemini API는 분당 15회, 일 1,500회까지 무료입니다. 프로토타입이나 학습 단계에서 적극 활용하세요.',
    icon: '🎁',
  },
];

export function AiApiContent() {
  const [activeTab, setActiveTab] = useState<StreamingProvider>('openai');
  const activeExample = streamingExamples[activeTab];

  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">AI API 연동 기초</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          내 앱에 AI 기능을 넣으려면 AI API를 연동해야 합니다.
          OpenAI, Anthropic, Google Gemini — 3대 제공사의 API 키 발급부터 비용 비교, 스트리밍 구현까지 안내합니다.
        </p>
      </ScrollReveal>

      {/* API 키 발급 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">API 키 발급</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            AI API를 사용하려면 API 키가 필요합니다. 키는 환경변수로 관리하고 절대 클라이언트에 노출하지 마세요.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mb-8">
            {apiKeySteps.map((provider) => (
              <Card key={provider.provider} className={provider.color}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{provider.provider}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-3">
                    {provider.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0 font-bold mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded border bg-muted/50 px-3 py-2">
                    <code className="text-[10px] font-mono text-muted-foreground">
                      {provider.envKey}={provider.provider === 'Google Gemini' ? 'AI...' : 'sk-...'}
                    </code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 max-w-3xl mb-8">
            <p className="text-xs text-red-700 dark:text-red-300">
              <strong>보안 주의:</strong> API 키를 코드에 직접 작성하거나 GitHub에 올리지 마세요.
              반드시 <code className="font-mono bg-red-100 dark:bg-red-900/40 px-1 rounded">.env.local</code>에 저장하고,
              <code className="font-mono bg-red-100 dark:bg-red-900/40 px-1 rounded">.gitignore</code>에 추가하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 토큰과 비용 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">토큰과 비용 이해</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm">
            AI API는 <strong className="text-foreground">토큰</strong> 단위로 과금됩니다.
            토큰은 대략 한국어 1글자 = 1~2토큰, 영어 1단어 = 1토큰입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl overflow-x-auto mb-8">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">모델</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">제공사</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">입력 (1M토큰)</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">출력 (1M토큰)</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">컨텍스트</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">특징</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {pricingTable.map((row) => (
                  <tr key={row.model} className="border-b">
                    <td className="py-2 px-3 font-medium text-foreground">{row.model}</td>
                    <td className="py-2 px-3">{row.provider}</td>
                    <td className="py-2 px-3 font-mono">{row.input}</td>
                    <td className="py-2 px-3 font-mono">{row.output}</td>
                    <td className="py-2 px-3">{row.context}</td>
                    <td className="py-2 px-3">
                      <Badge variant="secondary" className="text-[9px]">{row.badge}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-2xl mb-8 rounded-lg border bg-card shadow-sm p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">비용 감 잡기:</strong> 간단한 챗봇 앱에서
              하루 100명이 각 5번 대화하면, GPT-4o mini 기준 월 약 $2~5 수준입니다.
              Gemini 2.0 Flash는 무료 티어로 시작할 수 있어 비용 부담 없이 프로토타입을 만들 수 있습니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 스트리밍 응답 기초 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">스트리밍 응답 기초</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            스트리밍을 사용하면 AI 응답이 한 글자씩 실시간으로 표시됩니다.
            ChatGPT처럼 타이핑하는 효과를 구현할 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl mb-8">
            <div className="flex gap-1 mb-2">
              {(Object.keys(streamingExamples) as StreamingProvider[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {streamingExamples[key].label}
                </button>
              ))}
            </div>
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">{activeExample.file}</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {activeExample.code}
              </pre>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 제공사별 비교 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">제공사별 특징 비교</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            어떤 API를 선택해야 할지 고민된다면, 각 제공사의 강점을 비교해보세요.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">OpenAI</div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>- 가장 넓은 생태계, 레퍼런스 풍부</li>
                <li>- GPT-4o: 범용 추천, 이미지 입력 지원</li>
                <li>- Function calling, JSON mode 안정적</li>
                <li>- 단점: 무료 티어 없음</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm font-semibold mb-2 text-purple-600 dark:text-purple-400">Anthropic</div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>- Claude: 코딩·분석·긴 문서에 강점</li>
                <li>- 200K 컨텍스트로 긴 코드 분석 유리</li>
                <li>- 안전성 높은 응답, 환각 적음</li>
                <li>- 단점: 무료 티어 없음</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm font-semibold mb-2 text-blue-600 dark:text-blue-400">Google Gemini</div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>- 무료 티어 제공 (입문·프로토타입 최적)</li>
                <li>- 1M 토큰 컨텍스트 (업계 최대)</li>
                <li>- 멀티모달: 텍스트, 이미지, 오디오, 비디오</li>
                <li>- Google 서비스(Sheets, Docs) 연동 용이</li>
              </ul>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border max-w-3xl">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">추천:</strong> 처음 시작한다면 <strong className="text-foreground">Gemini 무료 티어</strong>로 시작하고,
              프로덕션에서는 용도에 맞는 모델을 선택하세요. 챗봇은 GPT-4o, 코드 분석은 Claude, 멀티모달은 Gemini가 강합니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 비용 관리 팁 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">비용 관리 팁</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            {costTips.map((tip) => (
              <div key={tip.title} className="rounded-lg border bg-card p-4">
                <div className="text-xl mb-2">{tip.icon}</div>
                <div className="text-sm font-semibold mb-1">{tip.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">다음 단계:</strong> API 키를 안전하게 관리하는 방법은
              <strong className="text-foreground"> 환경변수 완전 정복</strong> 가이드에서 더 자세히 다룹니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
