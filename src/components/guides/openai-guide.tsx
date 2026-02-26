'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'setup', label: 'API 키 설정' },
  { id: 'integration', label: 'Next.js 연동' },
  { id: 'streaming', label: '스트리밍' },
  { id: 'cost', label: '비용 관리' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function OpenAIGuide() {
  const [activeSection, setActiveSection] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    for (const el of els) observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div>
      {/* Hero */}
      <section className="py-12 md:py-20 border-b">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">AI</Badge>
            <Badge variant="outline">beginner</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            OpenAI 연동 가이드
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            GPT-4o, DALL-E, Whisper, 임베딩 등 OpenAI API를 Next.js 프로젝트에 안전하게
            연동하는 방법을 단계별로 설명합니다. API 키 보안부터 스트리밍, 비용 관리까지
            실무에서 꼭 필요한 내용만 담았습니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>⏱ 설정 약 30분</span>
            <span>·</span>
            <span>💳 수익 공유 방식</span>
            <span>·</span>
            <span>🔗 <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">platform.openai.com</a></span>
          </div>
        </div>
      </section>

      {/* Sticky nav */}
      <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === s.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-3xl py-10 space-y-16">

        {/* 개요 */}
        <section id="overview">
          <h2 className="text-2xl font-bold mb-4">OpenAI란?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            OpenAI는 GPT-4o(텍스트), DALL-E 3(이미지), Whisper(음성→텍스트), text-embedding-3(벡터 검색) 등
            다양한 AI 모델을 REST API로 제공하는 플랫폼입니다. 단일 API 키로 모든 모델을 사용할 수 있어
            Next.js 프로젝트에 AI 기능을 빠르게 추가할 수 있습니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'GPT-4o', desc: '텍스트·이미지 이해, 채팅, 코드 생성' },
              { label: 'text-embedding-3', desc: '시맨틱 검색, 유사도 분석, RAG' },
              { label: 'DALL-E 3', desc: '텍스트 → 이미지 생성' },
              { label: 'Whisper', desc: '음성 → 텍스트 변환' },
            ].map((m) => (
              <Card key={m.label} className="bg-card shadow-sm">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm">{m.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* API 키 설정 */}
        <section id="setup">
          <h2 className="text-2xl font-bold mb-4">API 키 설정</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. API 키 발급</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a>에서
                로그인 후 <strong>Create new secret key</strong>를 클릭합니다.
                키는 생성 시 한 번만 표시되므로 <strong>즉시 복사</strong>해 안전한 곳에 저장하세요.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. 환경변수 등록</h3>
              <p className="text-muted-foreground text-sm mb-3">
                <strong className="text-destructive">절대 <code>NEXT_PUBLIC_</code> 접두사를 사용하지 마세요.</strong>{' '}
                브라우저에 키가 노출됩니다.
              </p>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# .env.local
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. SDK 설치</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono">
{`npm install openai`}
              </pre>
            </div>
          </div>
        </section>

        {/* Next.js 연동 */}
        <section id="integration">
          <h2 className="text-2xl font-bold mb-4">Next.js 연동</h2>
          <p className="text-muted-foreground text-sm mb-4">
            OpenAI 클라이언트는 <strong>서버 컴포넌트 또는 API Route</strong>에서만 사용해야 합니다.
            <code>new OpenAI()</code>는 환경변수 <code>OPENAI_API_KEY</code>를 자동으로 읽습니다.
          </p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// src/app/api/chat/route.ts
import OpenAI from 'openai'

const openai = new OpenAI()
// process.env.OPENAI_API_KEY 자동 인식

export async function POST(req: Request) {
  const { message } = await req.json()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: message }],
    max_tokens: 1024,
  })

  return Response.json({
    content: completion.choices[0].message.content,
  })
}`}
          </pre>
          <p className="text-muted-foreground text-sm mt-3">
            클라이언트에서는 이 API Route를 <code>fetch('/api/chat', ...)</code>으로 호출합니다.
          </p>
        </section>

        {/* 스트리밍 */}
        <section id="streaming">
          <h2 className="text-2xl font-bold mb-4">스트리밍 응답</h2>
          <p className="text-muted-foreground text-sm mb-4">
            긴 응답은 <code>stream: true</code>로 토큰 단위 실시간 출력이 가능합니다.
            ChatGPT처럼 타이핑 효과를 구현할 때 사용합니다.
          </p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// src/app/api/chat/route.ts (스트리밍 버전)
import OpenAI from 'openai'

const openai = new OpenAI()

export async function POST(req: Request) {
  const { message } = await req.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: message }],
    stream: true,
    max_tokens: 1024,
  })

  // ReadableStream으로 클라이언트에 전달
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? ''
        controller.enqueue(new TextEncoder().encode(text))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}`}
          </pre>
        </section>

        {/* 비용 관리 */}
        <section id="cost">
          <h2 className="text-2xl font-bold mb-4">비용 관리</h2>
          <div className="space-y-4">
            <Card className="bg-card shadow-sm border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-2">⚠️ max_tokens 반드시 설정</p>
                <p className="text-sm text-muted-foreground">
                  설정하지 않으면 모델이 최대 길이까지 응답하여 예상치 못한 비용이 발생합니다.
                  일반 챗봇은 <code>1024</code>, 긴 문서 생성은 <code>4096</code>으로 제한하세요.
                </p>
              </CardContent>
            </Card>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">모델</th>
                    <th className="text-left p-3 font-medium">입력 (1M 토큰)</th>
                    <th className="text-left p-3 font-medium">출력 (1M 토큰)</th>
                    <th className="text-left p-3 font-medium">용도</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { model: 'gpt-4o', input: '$2.50', output: '$10.00', use: '고성능 범용' },
                    { model: 'gpt-4o-mini', input: '$0.15', output: '$0.60', use: '저비용 범용' },
                    { model: 'o1-mini', input: '$3.00', output: '$12.00', use: '추론 특화' },
                    { model: 'text-embedding-3-small', input: '$0.02', output: '—', use: '벡터 임베딩' },
                  ].map((r) => (
                    <tr key={r.model} className="hover:bg-muted/50">
                      <td className="p-3 font-mono text-xs">{r.model}</td>
                      <td className="p-3">{r.input}</td>
                      <td className="p-3">{r.output}</td>
                      <td className="p-3 text-muted-foreground">{r.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted-foreground">
              * 가격은 변동될 수 있습니다.{' '}
              <a href="https://openai.com/pricing" target="_blank" rel="noopener noreferrer" className="underline">
                openai.com/pricing
              </a>에서 최신 정보를 확인하세요.
            </p>
          </div>
        </section>

        {/* 주의사항 */}
        <section id="pitfalls">
          <h2 className="text-2xl font-bold mb-4">자주 하는 실수</h2>
          <div className="space-y-4">
            {[
              {
                title: '❌ API 키를 클라이언트에 노출',
                bad: 'NEXT_PUBLIC_OPENAI_API_KEY=sk-...',
                good: 'OPENAI_API_KEY=sk-...  (NEXT_PUBLIC 없이)',
                desc: 'NEXT_PUBLIC_ 접두사를 붙이면 브라우저 번들에 키가 포함됩니다. 반드시 서버(API Route)에서만 OpenAI를 호출하세요.',
              },
              {
                title: '❌ max_tokens 미설정',
                bad: "openai.chat.completions.create({ model: 'gpt-4o', messages })",
                good: "openai.chat.completions.create({ model: 'gpt-4o', messages, max_tokens: 1024 })",
                desc: '토큰 제한 없이 호출하면 긴 응답으로 인해 비용이 폭증할 수 있습니다.',
              },
              {
                title: '❌ Rate Limit(429) 미처리',
                bad: 'await openai.chat.completions.create(...) // 오류 시 그냥 throw',
                good: '지수 백오프 + 재시도 로직 또는 openai 라이브러리의 자동 재시도 설정 사용',
                desc: '높은 트래픽에서는 429 오류가 발생합니다. SDK의 maxRetries 옵션을 활용하세요.',
              },
            ].map((p) => (
              <Card key={p.title} className="bg-card shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-destructive font-medium mb-1">나쁜 예</p>
                      <pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{p.bad}</pre>
                    </div>
                    <div>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">좋은 예</p>
                      <pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{p.good}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
