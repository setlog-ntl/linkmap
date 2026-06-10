'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { GuideTLDR } from '@/components/guides/common';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'signup', label: '계정·프로젝트 생성' },
  { id: 'setup', label: '환경변수 설정' },
  { id: 'auth', label: '인증(Auth)' },
  { id: 'database', label: '데이터베이스' },
  { id: 'rls', label: 'RLS 보안' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function SupabaseGuide() {
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
            <Badge variant="secondary">백엔드</Badge>
            <Badge variant="outline">단계별</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Supabase 시작하기
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Supabase는 PostgreSQL 기반의 오픈소스 백엔드 플랫폼으로, 데이터베이스·인증·스토리지·
            실시간 구독을 하나의 서비스로 제공합니다. Next.js 프로젝트에 백엔드를 빠르게
            연결하는 방법을 단계별로 안내합니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>⏱ 설정 약 10분</span>
            <span>·</span>
            <span>💳 무료 플랜 제공 (프로젝트 2개)</span>
            <span>·</span>
            <span>🔗 <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">supabase.com</a></span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mt-6">
        <GuideTLDR
          level="입문"
          readingTime="설정 10분"
          points={[
            'Supabase는 PostgreSQL 기반 BaaS — DB·인증·스토리지를 한 번에 제공해요.',
            'URL·anon 키는 클라이언트용, service_role 키는 서버 전용(절대 노출 금지)이에요.',
            '새 테이블엔 반드시 RLS를 켜세요 — 안 켜면 anon 키를 아는 누구나 데이터에 접근해요.',
          ]}
          youCanDo="백엔드 서버를 직접 안 만들고도 데이터베이스·로그인을 갖춘 앱을 만들 수 있어요."
        />
      </div>

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
          <h2 className="text-2xl font-bold mb-4">Supabase란?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Supabase는 Firebase 대안으로 설계된 오픈소스 Backend as a Service(BaaS)입니다.
            실제 PostgreSQL 데이터베이스를 사용하므로 복잡한 쿼리, RLS(Row Level Security),
            PostgreSQL 확장 기능을 그대로 활용할 수 있습니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Database', desc: 'PostgreSQL + REST/GraphQL API 자동 생성' },
              { label: 'Auth', desc: 'Email, OAuth(Google·GitHub), Magic Link' },
              { label: 'Storage', desc: '이미지·파일 업로드, CDN 제공' },
              { label: 'Realtime', desc: 'WebSocket 기반 DB 변경 실시간 구독' },
              { label: 'Edge Functions', desc: 'Deno 런타임 서버리스 함수' },
              { label: 'RLS', desc: '행 단위 접근 제어로 안전한 데이터 보호' },
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

        {/* 계정·프로젝트 생성 */}
        <section id="signup">
          <h2 className="text-2xl font-bold mb-4">계정 및 프로젝트 생성</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. 계정 가입</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a>에 접속해
                <strong> Start your project</strong>를 클릭합니다. GitHub 계정으로 간편 가입을 권장합니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. 새 프로젝트 생성</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>대시보드에서 <strong>New project</strong> 클릭</li>
                <li>프로젝트 이름 입력 (영문 소문자 권장)</li>
                <li>데이터베이스 비밀번호 설정 (안전한 곳에 보관)</li>
                <li>리전 선택 — 한국 사용자는 <strong>Northeast Asia (Seoul)</strong> 권장</li>
                <li>프로비저닝 완료까지 약 1~2분 대기</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. API 키 복사</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                프로젝트 대시보드 → <strong>Project Settings → API</strong> 메뉴에서
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs mx-1">URL</code>과
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs mx-1">anon public</code> 키를 복사합니다.
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs mx-1">service_role</code> 키는
                서버에서만 사용해야 합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 환경변수 설정 */}
        <section id="setup">
          <h2 className="text-2xl font-bold mb-4">환경변수 설정</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. SDK 설치</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`npm install @supabase/supabase-js @supabase/ssr`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. .env.local 설정</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# 서버 전용 — 절대 NEXT_PUBLIC_ 붙이지 마세요
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. 클라이언트 초기화</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// src/lib/supabase/client.ts (브라우저용)
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

// src/lib/supabase/server.ts (서버 컴포넌트·API Route용)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  )
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* 인증 */}
        <section id="auth">
          <h2 className="text-2xl font-bold mb-4">인증(Auth) 연동</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Supabase Auth는 이메일/비밀번호, OAuth(Google·GitHub·Kakao 등), Magic Link를 지원합니다.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Google OAuth 설정</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed mb-3">
                <li>Supabase 대시보드 → Authentication → Providers → Google 활성화</li>
                <li>Google Cloud Console에서 OAuth 클라이언트 ID 발급</li>
                <li>Supabase에 Client ID, Client Secret 입력</li>
              </ol>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// 클라이언트에서 Google 로그인
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: \`\${window.location.origin}/auth/callback\`,
  },
})`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">현재 사용자 가져오기</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// 서버 컴포넌트 또는 API Route
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  return new Response('Unauthorized', { status: 401 })
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* 데이터베이스 */}
        <section id="database">
          <h2 className="text-2xl font-bold mb-4">데이터베이스 사용</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Supabase는 PostgreSQL을 REST API로 자동 노출합니다. JavaScript SDK로 타입 안전하게 쿼리할 수 있습니다.
          </p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`import { createClient } from '@/lib/supabase/server'

// 조회
const supabase = await createClient()
const { data, error } = await supabase
  .from('posts')
  .select('id, title, created_at')
  .order('created_at', { ascending: false })
  .limit(10)

// 삽입
const { data: post } = await supabase
  .from('posts')
  .insert({ title: '새 글', user_id: user.id })
  .select()
  .single()

// 수정
await supabase
  .from('posts')
  .update({ title: '수정된 제목' })
  .eq('id', postId)
  .eq('user_id', user.id)  // 소유권 확인

// 삭제
await supabase
  .from('posts')
  .delete()
  .eq('id', postId)
  .eq('user_id', user.id)`}
          </pre>
        </section>

        {/* RLS 보안 */}
        <section id="rls">
          <h2 className="text-2xl font-bold mb-4">RLS(Row Level Security) 설정</h2>
          <p className="text-muted-foreground text-sm mb-4">
            RLS는 데이터베이스 행(row) 단위로 접근을 제어합니다.
            <strong className="text-destructive"> 새 테이블 생성 시 반드시 RLS를 활성화</strong>해야 합니다.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">기본 RLS 정책 예시</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`-- 테이블에 RLS 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 본인 데이터만 조회 가능
CREATE POLICY "users can view own posts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);

-- 본인 데이터만 삽입 가능
CREATE POLICY "users can insert own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 데이터만 수정/삭제 가능
CREATE POLICY "users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);`}
              </pre>
            </div>
            <Card className="bg-card shadow-sm border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">⚠️ RLS 없이 테이블을 만들면</p>
                <p className="text-sm text-muted-foreground">
                  anon 키를 아는 누구나 모든 행에 접근할 수 있습니다.
                  Supabase 대시보드 → Table Editor에서 생성 시 <strong>Enable RLS</strong> 옵션을 반드시 체크하세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 주의사항 */}
        <section id="pitfalls">
          <h2 className="text-2xl font-bold mb-4">자주 하는 실수</h2>
          <div className="space-y-4">
            {[
              {
                title: '❌ service_role 키를 클라이언트에 노출',
                bad: 'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=eyJ...',
                good: 'SUPABASE_SERVICE_ROLE_KEY=eyJ...  (서버 전용)',
                desc: 'service_role 키는 RLS를 우회합니다. 절대 브라우저에 노출하지 마세요. 서버 API Route에서만 사용해야 합니다.',
              },
              {
                title: '❌ RLS 없이 테이블 생성',
                bad: 'CREATE TABLE profiles (id UUID, data TEXT);',
                good: 'CREATE TABLE profiles (...);\nALTER TABLE profiles ENABLE ROW LEVEL SECURITY;\nCREATE POLICY ...',
                desc: 'RLS를 활성화하지 않으면 anon 키를 사용하는 누구나 전체 데이터에 접근 가능합니다.',
              },
              {
                title: '❌ 브라우저에서 getSession() 신뢰',
                bad: 'const { data: { session } } = await supabase.auth.getSession()',
                good: 'const { data: { user } } = await supabase.auth.getUser()',
                desc: '서버에서 사용자 검증 시 getSession()은 쿠키 기반으로 위조될 수 있습니다. 서버에서는 반드시 getUser()를 사용하세요.',
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
