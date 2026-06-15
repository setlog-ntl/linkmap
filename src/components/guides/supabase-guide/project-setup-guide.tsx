'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'signup', label: '가입 + 프로젝트 생성' },
  { id: 'envvars', label: '3개 환경변수' },
  { id: 'install', label: 'SDK 설치' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function SupabaseProjectSetupGuide() {
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
            <Badge variant="secondary">Supabase</Badge>
            <Badge variant="outline">시작하기</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            프로젝트 생성 + 환경변수 설정
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Supabase 계정을 만들고 프로젝트를 생성한 후,
            Next.js에서 필요한 3개의 환경변수(URL, ANON_KEY, SERVICE_ROLE_KEY)를 설정하는 방법을 설명합니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>설정 약 5분</span>
            <span>·</span>
            <span>무료 플랜 (프로젝트 2개)</span>
            <span>·</span>
            <span>
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                supabase.com
              </a>
            </span>
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
          <h2 className="text-2xl font-bold mb-4">Supabase 프로젝트란?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Supabase 프로젝트는 PostgreSQL 데이터베이스, 인증 시스템, 스토리지, 실시간 구독이 하나로 묶인
            독립 인스턴스입니다. 각 프로젝트는 고유한 URL과 API 키를 가지며, 개발/스테이징/프로덕션 환경별로
            별도 프로젝트를 만드는 것이 권장됩니다.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'URL', desc: 'NEXT_PUBLIC_SUPABASE_URL\n프로젝트 고유 주소' },
              { label: 'ANON KEY', desc: 'NEXT_PUBLIC_SUPABASE_ANON_KEY\n클라이언트 공개 키 (RLS 적용)' },
              { label: 'SERVICE ROLE', desc: 'SUPABASE_SERVICE_ROLE_KEY\n서버 전용 키 (RLS 우회)' },
            ].map((m) => (
              <Card key={m.label} className="bg-card shadow-sm">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm font-mono">{m.label}</p>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{m.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 가입 + 프로젝트 생성 */}
        <section id="signup">
          <h2 className="text-2xl font-bold mb-4">가입 및 프로젝트 생성</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. 계정 가입</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>
                  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">
                    supabase.com
                  </a>에 접속 후 <strong>Start your project</strong> 클릭
                </li>
                <li>GitHub 계정으로 간편 가입 권장 (이메일로도 가능)</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. 새 프로젝트 생성</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>대시보드 좌측 <strong>New project</strong> 클릭</li>
                <li>
                  조직 선택 (없으면 <strong>New organization</strong>)
                </li>
                <li>프로젝트 이름 입력 (영문 소문자, 하이픈 권장)</li>
                <li>
                  <strong>Database Password</strong> 생성 — 안전한 곳에 저장
                  (나중에 직접 DB 연결 시 필요)
                </li>
                <li>
                  리전 선택: 한국 사용자는 <strong>Northeast Asia (Seoul)</strong> 권장
                </li>
                <li>
                  플랜 선택: <strong>Free</strong>로 시작 (프로젝트 2개, 500MB DB 무료)
                </li>
                <li><strong>Create new project</strong> 클릭 후 1~2분 대기</li>
              </ol>
            </div>
          </div>
        </section>

        {/* 3개 환경변수 */}
        <section id="envvars">
          <h2 className="text-2xl font-bold mb-4">3개 환경변수 복사</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">API 키 위치</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>Supabase 대시보드 → 해당 프로젝트 선택</li>
                <li>좌측 메뉴 <strong>Project Settings</strong> (톱니바퀴 아이콘)</li>
                <li><strong>API</strong> 탭 선택</li>
                <li>URL과 두 개의 키를 복사</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">.env.local에 등록</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# .env.local

# 클라이언트 공개 (NEXT_PUBLIC_ 접두사 필요)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# 서버 전용 — 절대 NEXT_PUBLIC_ 접두사 붙이지 마세요
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...`}
              </pre>
            </div>

            <Card className="bg-card shadow-sm border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">SERVICE_ROLE_KEY 주의</p>
                <p className="text-sm text-muted-foreground">
                  <code className="bg-muted px-1 rounded text-xs">SERVICE_ROLE_KEY</code>는 RLS(Row Level Security)를
                  우회하는 슈퍼 키입니다. 클라이언트에 절대 노출하면 안 됩니다.
                  서버 API Route나 서버 컴포넌트에서만 사용하고,
                  절대 <code className="bg-muted px-1 rounded text-xs">NEXT_PUBLIC_</code> 접두사를 붙이지 마세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SDK 설치 */}
        <section id="install">
          <h2 className="text-2xl font-bold mb-4">SDK 설치 및 클라이언트 초기화</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">패키지 설치</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`npm install @supabase/supabase-js @supabase/ssr`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">브라우저 클라이언트 (클라이언트 컴포넌트용)</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">서버 클라이언트 (서버 컴포넌트·API Route용)</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서는 쿠키 설정 불가 — 무시
          }
        },
      },
    },
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
                title: '❌ SERVICE_ROLE_KEY를 클라이언트에 노출',
                bad: 'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=eyJ...',
                good: 'SUPABASE_SERVICE_ROLE_KEY=eyJ...\n# NEXT_PUBLIC 없이 — 서버 전용',
                desc: 'SERVICE_ROLE_KEY는 RLS를 우회합니다. NEXT_PUBLIC_을 붙이면 브라우저에 노출되어 모든 사용자가 전체 DB에 접근할 수 있게 됩니다.',
              },
              {
                title: '❌ 프로덕션 DB로 개발',
                bad: '# 개발, 스테이징, 프로덕션 모두 같은 Supabase 프로젝트 사용',
                good: '# 환경별 별도 프로젝트 사용\n# 개발: dev-my-app.supabase.co\n# 프로덕션: my-app.supabase.co',
                desc: '개발 중 실수로 프로덕션 데이터를 수정하거나 삭제할 수 있습니다. 환경별로 Supabase 프로젝트를 분리하세요.',
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
