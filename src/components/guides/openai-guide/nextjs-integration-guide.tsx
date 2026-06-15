'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'install', label: '패키지 설치' },
  { id: 'api-route', label: 'API 라우트' },
  { id: 'streaming', label: '스트리밍' },
  { id: 'ai-sdk', label: 'Vercel AI SDK' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function NextjsIntegrationGuide() {
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
      <section className="py-12 md:py-20 border-b">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">OpenAI</Badge>
            <Badge variant="outline">Next.js</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Next.js 연동 + 스트리밍
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            OpenAI API를 Next.js App Router의 API Route에 연결하는 방법을 설명합니다.
            일반 요청과 스트리밍 응답 구현, Vercel AI SDK를 활용한 간편한 AI 기능 구현까지 다룹니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>설정 약 7분</span>
            <span>·</span>
            <span>API 키 설정 선행 필요</span>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none [mask-image:linear-gradient(to_right,black_85%,transparent)] md:[mask-image:none]">
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
          <h2 className="text-2xl font-bold mb-4">아키텍처: 왜 API Route를 사용하나요?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            OpenAI API 키는 서버에서만 접근해야 합니다. Next.js의 API Route(서버)에서 OpenAI를 호출하고,
            클라이언트(브라우저)는 이 API Route를 통해 간접적으로 AI 기능을 사용합니다.
          </p>
          <div className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
            <p className="text-muted-foreground">브라우저 → (fetch) → API Route → (OpenAI SDK) → OpenAI API</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {[
              { label: 'API Route', desc: '서버에서 실행. OPENAI_API_KEY 접근 가능. 보안 안전' },
              { label: '클라이언트 컴포넌트', desc: 'API Route를 fetch로 호출. 키는 절대 포함하지 않음' },
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

        {/* 패키지 설치 */}
        <section id="install">
          <h2 className="text-2xl font-bold mb-4">패키지 설치</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">공식 OpenAI SDK</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`npm install openai`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Vercel AI SDK (선택사항 — 스트리밍 편의 기능)</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`npm install ai @ai-sdk/openai`}
              </pre>
            </div>
          </div>
        </section>

        {/* API 라우트 */}
        <section id="api-route">
          <h2 className="text-2xl font-bold mb-4">API Route 작성</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">기본 채팅 API</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// src/app/api/chat/route.ts
import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI()
// process.env.OPENAI_API_KEY 자동 인식

export async function POST(req: NextRequest) {
  const body = await req.json() as { message: string }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: '당신은 친절한 도우미입니다. 한국어로 답변해주세요.',
      },
      { role: 'user', content: body.message },
    ],
    max_tokens: 1024,
  })

  return Response.json({
    content: completion.choices[0].message.content,
    usage: completion.usage,
  })
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">클라이언트에서 호출</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`'use client'

async function askQuestion(message: string) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  if (!res.ok) throw new Error('API 호출 실패')

  const data = await res.json() as { content: string }
  return data.content
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* 스트리밍 */}
        <section id="streaming">
          <h2 className="text-2xl font-bold mb-4">스트리밍 응답 구현</h2>
          <p className="text-muted-foreground text-sm mb-4">
            스트리밍을 사용하면 ChatGPT처럼 응답이 토큰 단위로 실시간 출력됩니다.
            긴 응답을 기다리는 대신 첫 토큰부터 바로 표시할 수 있어 UX가 크게 개선됩니다.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">서버: 스트리밍 API Route</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// src/app/api/chat/stream/route.ts
import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI()

export async function POST(req: NextRequest) {
  const body = await req.json() as { message: string }

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: body.message }],
    stream: true,
    max_tokens: 1024,
  })

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? ''
        if (text) controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">클라이언트: 스트리밍 읽기</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`'use client'

import { useState } from 'react'

export function StreamingChat() {
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(message: string) {
    setLoading(true)
    setAnswer('')

    const res = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) return

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      setAnswer((prev) => prev + decoder.decode(value))
    }

    setLoading(false)
  }

  return (
    <div>
      <p className="whitespace-pre-wrap">{answer}</p>
      {loading && <span className="animate-pulse">...</span>}
    </div>
  )
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Vercel AI SDK */}
        <section id="ai-sdk">
          <h2 className="text-2xl font-bold mb-4">Vercel AI SDK로 간편하게 구현</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Vercel AI SDK는 스트리밍, 멀티모달, 도구 호출 등 복잡한 AI 기능을 추상화한 라이브러리입니다.
            Next.js와의 통합이 최적화되어 있어 초보자도 쉽게 사용할 수 있습니다.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">서버: streamText 사용</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// src/app/api/chat/route.ts
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: '당신은 친절한 도우미입니다.',
    messages,
    maxTokens: 1024,
  })

  return result.toDataStreamResponse()
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">클라이언트: useChat 훅 사용</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`'use client'

import { useChat } from 'ai/react'

export function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role === 'user' ? '나' : 'AI'}:</strong>
          <p>{m.content}</p>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="메시지 입력..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>전송</button>
      </form>
    </div>
  )
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* 주의사항 */}
        <section id="pitfalls">
          <h2 className="text-2xl font-bold mb-4">자주 하는 실수</h2>
          <div className="space-y-4">
            {[
              {
                title: '❌ 클라이언트 컴포넌트에서 직접 OpenAI 호출',
                bad: `'use client'
import OpenAI from 'openai'
// 이 코드는 API 키를 브라우저에 노출합니다!
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })`,
                good: `'use client'
// 클라이언트에서는 자신의 API Route만 호출
const res = await fetch('/api/chat', { method: 'POST', ... })`,
                desc: 'OpenAI SDK를 클라이언트 컴포넌트에서 직접 사용하면 API 키가 브라우저에 노출됩니다. 반드시 API Route에서만 사용하세요.',
              },
              {
                title: '❌ max_tokens 미설정으로 비용 폭증',
                bad: `await openai.chat.completions.create({
  model: 'gpt-4o',
  messages,
  // max_tokens 없음 → 모델 최대 길이까지 응답
})`,
                good: `await openai.chat.completions.create({
  model: 'gpt-4o',
  messages,
  max_tokens: 1024,  // 반드시 설정
})`,
                desc: 'max_tokens를 설정하지 않으면 모델이 최대 길이까지 응답합니다. 짧은 답변이어도 불필요한 토큰이 발생할 수 있습니다.',
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
