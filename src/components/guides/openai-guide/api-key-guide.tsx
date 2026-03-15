'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'signup', label: '가입 + 키 발급' },
  { id: 'envlocal', label: '.env.local 등록' },
  { id: 'billing', label: '요금 설정' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function OpenAIApiKeyGuide() {
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
            <Badge variant="outline">API 키</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            API 키 발급 + 설정
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            OpenAI 콘솔에서 API 키를 발급하고, Next.js 프로젝트의 .env.local에 등록하는 방법을 설명합니다.
            요금 한도 설정까지 완료해야 예상치 못한 비용을 방지할 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>설정 약 5분</span>
            <span>·</span>
            <span>신용카드 필요 (유료)</span>
            <span>·</span>
            <span>
              <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                platform.openai.com
              </a>
            </span>
          </div>
        </div>
      </section>

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
          <h2 className="text-2xl font-bold mb-4">OpenAI API 키란?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            OpenAI API 키는 GPT-4o, DALL-E, Whisper 등 OpenAI 모델에 접근하기 위한 인증 토큰입니다.
            키는 생성 시 한 번만 표시되므로 즉시 안전한 곳에 저장해야 합니다.
            키를 분실하면 새로 발급해야 합니다.
          </p>
          <Card className="bg-card shadow-sm border-amber-200 dark:border-amber-800">
            <CardContent className="p-4">
              <p className="font-semibold text-sm mb-1">유료 서비스 안내</p>
              <p className="text-sm text-muted-foreground">
                OpenAI API는 사용량 기반 유료 서비스입니다. 신용카드를 등록하고 선불로 크레딧을 구매해야 합니다.
                최소 $5부터 충전 가능하며 초보자는 $10 정도로 시작하면 충분합니다.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 가입 + 키 발급 */}
        <section id="signup">
          <h2 className="text-2xl font-bold mb-4">가입 및 API 키 발급</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. 계정 가입</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>
                  <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="underline">
                    platform.openai.com
                  </a>에 접속
                </li>
                <li>
                  <strong>Sign Up</strong>으로 계정 생성 (Google, Microsoft 계정으로 간편 가입 가능)
                </li>
                <li>이메일 인증 완료</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. API 키 생성</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>
                  로그인 후{' '}
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">
                    platform.openai.com/api-keys
                  </a>로 이동
                </li>
                <li>
                  <strong>Create new secret key</strong> 클릭
                </li>
                <li>키 이름 입력 (예: My Project) 후 <strong>Create secret key</strong></li>
                <li>
                  <strong>생성된 키를 즉시 복사</strong>
                  — 창을 닫으면 다시 볼 수 없습니다
                </li>
              </ol>
            </div>

            <Card className="bg-card shadow-sm border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">Project vs Organization API 키</p>
                <p className="text-sm text-muted-foreground">
                  Project API 키는 특정 프로젝트에만 권한이 제한됩니다 (권장).
                  Organization 레벨 키보다 범위가 좁아 보안에 유리합니다.
                  프로젝트를 먼저 생성한 뒤 해당 프로젝트에서 키를 발급하세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* .env.local 등록 */}
        <section id="envlocal">
          <h2 className="text-2xl font-bold mb-4">.env.local에 등록</h2>
          <p className="text-muted-foreground text-sm mb-4">
            API 키는 서버에서만 사용해야 합니다.
            <strong className="text-destructive"> 절대 NEXT_PUBLIC_ 접두사를 붙이지 마세요.</strong>
            브라우저 번들에 포함되어 키가 노출됩니다.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">환경변수 등록</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# .env.local

# 서버 전용 — NEXT_PUBLIC_ 접두사 절대 금지
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">.gitignore 확인</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# .gitignore에 아래 항목이 있는지 반드시 확인
.env.local
.env*.local`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">SDK 설치</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# 공식 OpenAI Node.js SDK
npm install openai

# 또는 Vercel AI SDK (스트리밍 편의 기능 포함)
npm install ai @ai-sdk/openai`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">기본 사용 확인</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// src/app/api/test/route.ts
import OpenAI from 'openai'

const openai = new OpenAI()
// OPENAI_API_KEY 환경변수 자동 인식

export async function GET() {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: '안녕하세요!' }],
    max_tokens: 100,
  })

  return Response.json({
    content: completion.choices[0].message.content,
  })
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* 요금 설정 */}
        <section id="billing">
          <h2 className="text-2xl font-bold mb-4">요금 및 한도 설정</h2>
          <p className="text-muted-foreground text-sm mb-4">
            예상치 못한 비용을 방지하기 위해 월 한도와 알림을 설정합니다.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">크레딧 충전</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>
                  <a href="https://platform.openai.com/settings/organization/billing" target="_blank" rel="noopener noreferrer" className="underline">
                    Billing 설정
                  </a>으로 이동
                </li>
                <li>신용카드 등록 후 <strong>Add to credit balance</strong>로 크레딧 충전</li>
                <li>초보자는 $10으로 충분 (gpt-4o-mini 기준 수천~수만 회 요청 가능)</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">월 한도 설정</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>Billing → <strong>Limits</strong> 탭으로 이동</li>
                <li><strong>Set a monthly budget</strong>에 월 최대 비용 입력 (예: $10)</li>
                <li>이메일 알림 한도 설정 (예: $8에서 알림)</li>
                <li><strong>Save</strong> 클릭</li>
              </ol>
            </div>

            <div className="overflow-x-auto">
              <h3 className="font-semibold mb-2">모델별 대략적인 비용</h3>
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">모델</th>
                    <th className="text-left p-3 font-medium">입력</th>
                    <th className="text-left p-3 font-medium">출력</th>
                    <th className="text-left p-3 font-medium">추천 용도</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { model: 'gpt-4o-mini', input: '$0.15/1M', output: '$0.60/1M', use: '초보자 시작, 저비용' },
                    { model: 'gpt-4o', input: '$2.50/1M', output: '$10.00/1M', use: '고성능 범용' },
                    { model: 'o1-mini', input: '$3.00/1M', output: '$12.00/1M', use: '추론 특화' },
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
          </div>
        </section>

        {/* 주의사항 */}
        <section id="pitfalls">
          <h2 className="text-2xl font-bold mb-4">자주 하는 실수</h2>
          <div className="space-y-4">
            {[
              {
                title: '❌ NEXT_PUBLIC_으로 API 키 등록',
                bad: 'NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-...\n# 브라우저 번들에 포함되어 키 노출',
                good: 'OPENAI_API_KEY=sk-proj-...\n# 서버(API Route)에서만 접근 가능',
                desc: 'NEXT_PUBLIC_ 접두사는 브라우저에서도 읽을 수 있도록 번들에 포함됩니다. OpenAI API 키는 절대로 이 방식으로 설정하면 안 됩니다.',
              },
              {
                title: '❌ API 키를 생성 후 저장하지 않음',
                bad: '# 키 생성 후 창을 닫음\n# 다시 볼 방법이 없음 → 새 키를 발급해야 함',
                good: '# 생성 즉시 .env.local에 붙여넣기\n# 또는 비밀번호 관리자에 저장',
                desc: 'OpenAI API 키는 생성 시 한 번만 전체 값이 표시됩니다. 창을 닫으면 앞 몇 글자만 확인할 수 있습니다.',
              },
              {
                title: '❌ 월 한도 없이 사용',
                bad: '# 무한 루프나 버그로 수천 번 API 호출\n# 예상치 못한 청구서 도착',
                good: '# Billing → Limits에서 월 한도 설정\n# 예: $10 한도, $8에서 알림',
                desc: '코드 버그로 API가 무한 반복 호출될 수 있습니다. 반드시 월 한도를 설정하고 알림을 켜두세요.',
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
