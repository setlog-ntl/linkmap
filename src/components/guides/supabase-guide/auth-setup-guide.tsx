'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'providers', label: '소셜 로그인 설정' },
  { id: 'site-url', label: 'Site URL 설정' },
  { id: 'middleware', label: '미들웨어' },
  { id: 'callback', label: '콜백 라우트' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function SupabaseAuthSetupGuide() {
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
            <Badge variant="outline">인증</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            인증(Auth) 설정
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Supabase Auth로 소셜 로그인(Google, Kakao)을 설정하고, Site URL, Redirect URL,
            Next.js 미들웨어까지 완성하는 방법을 설명합니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>설정 약 7분</span>
            <span>·</span>
            <span>프로젝트 설정 선행 필요</span>
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
          <h2 className="text-2xl font-bold mb-4">Supabase Auth 지원 인증 방식</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Supabase Auth는 다양한 인증 방식을 지원합니다. 소셜 로그인 설정 시
            각 소셜 플랫폼에서 OAuth 클라이언트를 만들어 Supabase에 연결해야 합니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Email + Password', desc: '이메일·비밀번호 로그인. 이메일 인증 포함' },
              { label: 'Magic Link', desc: '이메일로 링크를 보내 비밀번호 없이 로그인' },
              { label: 'Google OAuth', desc: 'Google 계정으로 소셜 로그인' },
              { label: 'Kakao OAuth', desc: '카카오 계정으로 소셜 로그인 (OIDC)' },
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

        {/* 소셜 로그인 설정 */}
        <section id="providers">
          <h2 className="text-2xl font-bold mb-4">소셜 로그인 설정</h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-3">Google 로그인 설정</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed mb-3">
                <li>
                  <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">
                    Google Cloud Console
                  </a>에서 프로젝트 생성
                </li>
                <li>APIs &amp; Services → OAuth 동의 화면 설정</li>
                <li>APIs &amp; Services → 사용자 인증 정보 → OAuth 2.0 클라이언트 ID 생성</li>
                <li>
                  승인된 리다이렉션 URI에 Supabase 콜백 URL 추가:
                  <code className="block bg-muted rounded p-2 mt-1 text-xs font-mono">
                    https://xxxxxxxxxxxx.supabase.co/auth/v1/callback
                  </code>
                </li>
                <li>발급된 Client ID와 Client Secret을 복사</li>
                <li>
                  Supabase 대시보드 → Authentication → Providers → Google 활성화 후 입력
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Kakao 로그인 설정 (OIDC)</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed mb-3">
                <li>
                  <a href="https://developers.kakao.com" target="_blank" rel="noopener noreferrer" className="underline">
                    Kakao Developers
                  </a>에서 앱 생성
                </li>
                <li>제품 설정 → 카카오 로그인 활성화</li>
                <li>Redirect URI 추가:
                  <code className="block bg-muted rounded p-2 mt-1 text-xs font-mono">
                    https://xxxxxxxxxxxx.supabase.co/auth/v1/callback
                  </code>
                </li>
                <li>보안 → Client Secret 생성</li>
                <li>앱 키 → REST API 키 복사</li>
                <li>
                  Supabase 대시보드 → Authentication → Providers →{' '}
                  <strong>Add a Custom Provider</strong> 클릭
                </li>
                <li>
                  OIDC 방식으로 설정:
                  <pre className="bg-muted rounded-lg p-3 mt-2 text-xs font-mono overflow-x-auto">
{`Issuer URL: https://kauth.kakao.com
Client ID: (Kakao REST API 키)
Client Secret: (Kakao Client Secret)`}
                  </pre>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">클라이언트 코드로 소셜 로그인</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`'use client'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Google 로그인
async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: \`\${window.location.origin}/auth/callback\`,
    },
  })
}

// Kakao 로그인
async function signInWithKakao() {
  await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: \`\${window.location.origin}/auth/callback\`,
    },
  })
}

// 로그아웃
async function signOut() {
  await supabase.auth.signOut()
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Site URL 설정 */}
        <section id="site-url">
          <h2 className="text-2xl font-bold mb-4">Site URL + Redirect URL 설정</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Supabase Auth는 보안을 위해 허용된 URL로만 리다이렉트합니다. 반드시 설정해야 로그인 후 앱으로 돌아올 수 있습니다.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">설정 위치</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>Supabase 대시보드 → Authentication → URL Configuration</li>
                <li>
                  <strong>Site URL</strong>: 프로덕션 URL 입력
                  (예: <code className="bg-muted px-1 rounded text-xs">https://my-app.com</code>)
                </li>
                <li>
                  <strong>Redirect URLs</strong>에 아래 URL들 추가:
                </li>
              </ol>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto mt-3">
{`# 로컬 개발
http://localhost:3000/auth/callback

# Vercel 프리뷰 (와일드카드)
https://*.vercel.app/auth/callback

# 프로덕션
https://my-app.com/auth/callback`}
              </pre>
            </div>
          </div>
        </section>

        {/* 미들웨어 */}
        <section id="middleware">
          <h2 className="text-2xl font-bold mb-4">Next.js 미들웨어 설정</h2>
          <p className="text-muted-foreground text-sm mb-4">
            미들웨어는 모든 요청에서 Supabase 세션을 갱신합니다.
            로그인 상태에 따라 페이지를 보호하거나 리다이렉트할 때 사용합니다.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">src/middleware.ts</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  )

  // 세션 갱신 (반드시 호출)
  const { data: { user } } = await supabase.auth.getUser()

  // 보호된 라우트 — 미로그인 시 /login으로 리다이렉트
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* 콜백 라우트 */}
        <section id="callback">
          <h2 className="text-2xl font-bold mb-4">Auth 콜백 라우트</h2>
          <p className="text-muted-foreground text-sm mb-4">
            소셜 로그인 후 Supabase가 이 URL로 리다이렉트합니다.
            code를 세션으로 교환하고 사용자를 앱으로 보냅니다.
          </p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// src/app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(\`\${origin}\${next}\`)
    }
  }

  // 오류 시 로그인 페이지로
  return NextResponse.redirect(\`\${origin}/login?error=auth_failed\`)
}`}
          </pre>
        </section>

        {/* 주의사항 */}
        <section id="pitfalls">
          <h2 className="text-2xl font-bold mb-4">자주 하는 실수</h2>
          <div className="space-y-4">
            {[
              {
                title: '❌ getSession() 대신 getUser() 사용 안 함',
                bad: `// 서버에서 getSession()은 위조될 수 있음
const { data: { session } } = await supabase.auth.getSession()
if (!session) return 401`,
                good: `// 서버에서는 반드시 getUser()로 검증
const { data: { user } } = await supabase.auth.getUser()
if (!user) return 401`,
                desc: 'getSession()은 쿠키를 그대로 신뢰합니다. 서버에서 사용자를 검증할 때는 반드시 getUser()를 사용하세요. getUser()는 Supabase 서버와 통신하여 검증합니다.',
              },
              {
                title: '❌ Redirect URL 미등록으로 로그인 후 리다이렉트 실패',
                bad: '# Supabase에서 localhost:3000/auth/callback 미등록\n# → redirect_uri_mismatch 오류',
                good: '# Supabase Authentication → URL Configuration\n# http://localhost:3000/auth/callback 추가',
                desc: '소셜 로그인 콜백 URL이 Supabase Redirect URLs에 등록되지 않으면 "redirect_uri_mismatch" 오류가 발생합니다.',
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
