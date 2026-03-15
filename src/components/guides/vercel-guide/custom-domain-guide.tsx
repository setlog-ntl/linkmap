'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'add-domain', label: '도메인 추가' },
  { id: 'dns', label: 'DNS 설정' },
  { id: 'ssl', label: 'SSL 확인' },
  { id: 'redirect', label: '리다이렉트' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function VercelCustomDomainGuide() {
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
            <Badge variant="secondary">Vercel</Badge>
            <Badge variant="outline">도메인</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            커스텀 도메인 연결
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Vercel에 커스텀 도메인을 연결하고 DNS 레코드를 설정하는 방법을 설명합니다.
            SSL 자동 발급과 www → 루트 도메인 리다이렉트 설정도 함께 다룹니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>설정 약 5분 (DNS 전파 최대 48시간)</span>
            <span>·</span>
            <span>도메인 구매 선행 필요</span>
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
          <h2 className="text-2xl font-bold mb-4">커스텀 도메인이 필요한 이유</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Vercel이 기본 제공하는 URL(your-app.vercel.app)도 사용 가능하지만,
            브랜드와 신뢰도를 위해 커스텀 도메인(my-app.com) 연결을 권장합니다.
            Vercel은 Let&apos;s Encrypt를 통해 커스텀 도메인에도 SSL 인증서를 자동으로 발급합니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Vercel 기본 URL', desc: 'your-app.vercel.app (무료, 즉시 사용)' },
              { label: '커스텀 도메인', desc: 'my-app.com (도메인 구매 필요, 브랜딩)' },
              { label: '자동 HTTPS', desc: 'Let\'s Encrypt 인증서 자동 발급·갱신' },
              { label: 'www → apex 리다이렉트', desc: 'www.my-app.com → my-app.com 자동 처리' },
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

        {/* 도메인 추가 */}
        <section id="add-domain">
          <h2 className="text-2xl font-bold mb-4">Vercel에 도메인 추가</h2>
          <div className="space-y-4">
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 leading-relaxed">
              <li>Vercel 대시보드 → 해당 프로젝트 선택</li>
              <li><strong>Settings</strong> 탭 → <strong>Domains</strong></li>
              <li>도메인 입력 (예: my-app.com) 후 <strong>Add</strong></li>
              <li>
                Vercel이 두 가지 옵션을 제안합니다:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-xs">
                  <li><strong>Add my-app.com + www.my-app.com</strong> → 둘 다 추가, www는 루트로 리다이렉트</li>
                  <li><strong>Add my-app.com only</strong> → 루트 도메인만 추가</li>
                </ul>
              </li>
              <li>권장: 첫 번째 옵션 선택 (www 포함)</li>
              <li>Vercel이 제공하는 DNS 레코드 확인 (다음 단계에서 사용)</li>
            </ol>
          </div>
        </section>

        {/* DNS 설정 */}
        <section id="dns">
          <h2 className="text-2xl font-bold mb-4">DNS 레코드 설정</h2>
          <p className="text-muted-foreground text-sm mb-4">
            도메인 등록 업체(가비아, 후이즈, Cloudflare 등)의 DNS 관리 페이지에서
            Vercel이 제공한 레코드를 추가합니다.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">루트 도메인 (A 레코드)</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# 루트 도메인 (apex domain)
Type:  A
Name:  @ (또는 빈칸)
Value: 76.76.21.21
TTL:   Auto 또는 3600`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">www 서브도메인 (CNAME 레코드)</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# www 서브도메인
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
TTL:   Auto 또는 3600`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Cloudflare DNS를 사용하는 경우</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Cloudflare를 거치는 경우 CNAME 대신 AAAA 레코드 또는 Cloudflare의 프록시 설정에 따라 다를 수 있습니다.
                Vercel 대시보드의 Domains 탭에서 현재 상태를 확인하세요.
              </p>
              <Card className="bg-card shadow-sm border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm mb-1">Cloudflare + Vercel 주의사항</p>
                  <p className="text-sm text-muted-foreground">
                    Cloudflare의 프록시(주황 구름) 기능을 활성화하면 Vercel의 SSL과 충돌할 수 있습니다.
                    Vercel을 직접 사용하는 경우 DNS-only(회색 구름)로 설정하거나 Cloudflare SSL 모드를 Full (Strict)로 설정하세요.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold mb-2">DNS 전파 확인</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# 터미널에서 DNS 전파 확인
nslookup my-app.com

# 또는
dig my-app.com

# 76.76.21.21이 반환되면 성공`}
              </pre>
            </div>
          </div>
        </section>

        {/* SSL 확인 */}
        <section id="ssl">
          <h2 className="text-2xl font-bold mb-4">SSL 자동 발급 확인</h2>
          <p className="text-muted-foreground text-sm mb-4">
            DNS 전파가 완료되면 Vercel이 자동으로 Let&apos;s Encrypt SSL 인증서를 발급합니다.
            보통 수 분 내에 완료됩니다.
          </p>
          <div className="space-y-4">
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
              <li>Vercel 대시보드 → Settings → Domains</li>
              <li>도메인 옆 상태 확인: Valid Configuration이 되면 완료</li>
              <li>브라우저에서 https://my-app.com 접속 시 자물쇠 아이콘 확인</li>
            </ol>
            <Card className="bg-card shadow-sm border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">SSL 인증서 갱신</p>
                <p className="text-sm text-muted-foreground">
                  Vercel이 Let&apos;s Encrypt 인증서를 자동으로 갱신합니다.
                  만료 걱정 없이 HTTPS를 유지할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 리다이렉트 */}
        <section id="redirect">
          <h2 className="text-2xl font-bold mb-4">리다이렉트 설정</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">www → 루트 도메인 리다이렉트</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Vercel 대시보드에서 도메인 추가 시 자동으로 설정됩니다.
                www.my-app.com 접속 시 my-app.com으로 자동 리다이렉트됩니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">vercel.json으로 커스텀 리다이렉트</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// vercel.json
{
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    },
    {
      "source": "/blog/:slug",
      "destination": "/posts/:slug",
      "permanent": false
    }
  ]
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Next.js next.config.ts로 리다이렉트</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,  // 308 (영구)
      },
    ]
  },
}

export default config`}
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
                title: '❌ DNS 전파 전에 HTTPS 접속 시도',
                bad: '# DNS 레코드 추가 직후\n# https://my-app.com → SSL 오류 (아직 인증서 발급 전)',
                good: '# DNS 전파 + Vercel SSL 발급 완료 대기\n# Vercel 대시보드에서 "Valid Configuration" 확인 후 접속',
                desc: 'DNS 전파(수 분~48시간)가 완료되어야 Vercel이 SSL 인증서를 발급합니다. 너무 빨리 접속하면 SSL 오류가 납니다.',
              },
              {
                title: '❌ 도메인 추가 후 Supabase Redirect URL 미업데이트',
                bad: '# Supabase Redirect URL: localhost:3000/auth/callback만 등록\n# 커스텀 도메인으로 로그인 시 리다이렉트 오류',
                good: '# Supabase Authentication → URL Configuration\n# https://my-app.com/auth/callback 추가',
                desc: '커스텀 도메인을 연결했다면 Supabase Auth의 Site URL과 Redirect URLs도 업데이트해야 소셜 로그인이 정상 동작합니다.',
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
