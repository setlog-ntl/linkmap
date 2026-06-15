'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'wrangler', label: 'Wrangler 설치' },
  { id: 'create', label: '프로젝트 생성' },
  { id: 'wrangler-toml', label: 'wrangler.toml 설정' },
  { id: 'deploy', label: '배포' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function CloudflareWorkersGuide() {
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
            <Badge variant="secondary">Cloudflare</Badge>
            <Badge variant="outline">Workers</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Workers 배포 설정
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Cloudflare Workers는 전 세계 엣지 서버에서 실행되는 서버리스 런타임입니다.
            Wrangler CLI로 Next.js 앱을 Workers에 배포하는 방법을 단계별로 설명합니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>설정 약 15분</span>
            <span>·</span>
            <span>무료 10만 요청/일</span>
            <span>·</span>
            <span>
              <a href="https://workers.cloudflare.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                workers.cloudflare.com
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
          <h2 className="text-2xl font-bold mb-4">Cloudflare Workers란?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Workers는 V8 엔진 기반의 엣지 런타임으로, 전 세계 300개+ 위치에서 코드를 실행합니다.
            콜드 스타트가 없고 응답 시간이 매우 빠릅니다.
            Next.js 앱은 <code className="bg-muted px-1.5 py-0.5 rounded text-xs">@opennextjs/cloudflare</code>를 통해 Workers에 최적화 배포할 수 있습니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Edge Runtime', desc: '전 세계 300개+ 위치에서 실행 — 지연 최소화' },
              { label: '무료 10만 요청/일', desc: '소규모 프로젝트는 무료로 충분' },
              { label: 'KV Storage', desc: '키-값 저장소로 세션·캐시 관리' },
              { label: 'Durable Objects', desc: '상태를 유지하는 서버리스 객체' },
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

        {/* Wrangler 설치 */}
        <section id="wrangler">
          <h2 className="text-2xl font-bold mb-4">Wrangler CLI 설치</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Wrangler는 Cloudflare Workers를 관리하는 공식 CLI 도구입니다.
          </p>
          <div className="space-y-4">
            <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# npm으로 전역 설치
npm install -g wrangler

# 버전 확인
wrangler --version

# Cloudflare 계정 로그인
wrangler login
# 브라우저가 열리고 Cloudflare 계정 인증 페이지로 이동합니다`}
            </pre>
            <Card className="bg-card shadow-sm border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">로그인 후 계정 ID 확인</p>
                <pre className="bg-muted rounded p-2 text-xs font-mono">
{`wrangler whoami
# 이메일과 Account ID가 출력됩니다`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 프로젝트 생성 */}
        <section id="create">
          <h2 className="text-2xl font-bold mb-4">Next.js + Workers 프로젝트 설정</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">기존 Next.js 프로젝트에 적용</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# @opennextjs/cloudflare 설치
npm install @opennextjs/cloudflare

# open-next.config.ts 생성
cat > open-next.config.ts << 'EOF'
import type { OpenNextConfig } from "@opennextjs/cloudflare"

const config: OpenNextConfig = {}

export default config
EOF`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">package.json scripts 추가</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`{
  "scripts": {
    "dev": "next dev",
    "build": "next build --webpack",
    "build:cf": "opennextjs-cloudflare build",
    "deploy": "opennextjs-cloudflare deploy",
    "preview": "opennextjs-cloudflare preview"
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* wrangler.toml 설정 */}
        <section id="wrangler-toml">
          <h2 className="text-2xl font-bold mb-4">wrangler.toml 설정</h2>
          <p className="text-muted-foreground text-sm mb-4">
            프로젝트 루트에 <code className="bg-muted px-1.5 py-0.5 rounded text-xs">wrangler.toml</code> 파일을 생성합니다.
            (또는 <code className="bg-muted px-1.5 py-0.5 rounded text-xs">wrangler.jsonc</code>)
          </p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# wrangler.toml

name = "my-app"          # Workers 이름 (대시보드에 표시됨)
main = ".open-next/worker.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"

# KV 네임스페이스 (캐시용, 선택사항)
# [[kv_namespaces]]
# binding = "CACHE"
# id = "your-kv-namespace-id"

[vars]
# 공개 환경변수 (민감정보 금지)
NEXT_PUBLIC_APP_URL = "https://my-app.com"`}
          </pre>

          <Card className="bg-card shadow-sm border-amber-200 dark:border-amber-800 mt-4">
            <CardContent className="p-4">
              <p className="font-semibold text-sm mb-1">민감 정보는 wrangler secret으로 관리</p>
              <p className="text-sm text-muted-foreground">
                API 키, DB 비밀번호 등 민감한 값은 wrangler.toml의 [vars]가 아닌
                <code className="bg-muted px-1 rounded text-xs ml-1">wrangler secret put</code>으로 등록하세요.
                자세한 내용은 환경변수 + 시크릿 관리 가이드를 참고하세요.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 배포 */}
        <section id="deploy">
          <h2 className="text-2xl font-bold mb-4">Workers 배포</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">배포 명령</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# 1. Cloudflare Workers 용 빌드
npm run build:cf

# 2. Workers에 배포
npm run deploy

# 또는 한 번에 (wrangler 직접 사용)
npx wrangler deploy`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">로컬 미리보기</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# Workers 런타임으로 로컬에서 미리보기
npm run preview

# 또는
npx wrangler dev --local`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">배포 후 확인</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>배포 완료 시 콘솔에 Workers URL 출력 (예: https://my-app.username.workers.dev)</li>
                <li>Cloudflare 대시보드 → Workers &amp; Pages → 배포된 Worker 확인</li>
                <li>커스텀 도메인 연결은 대시보드 → Settings → Triggers → Custom Domains에서 설정</li>
              </ol>
            </div>
          </div>
        </section>

        {/* 주의사항 */}
        <section id="pitfalls">
          <h2 className="text-2xl font-bold mb-4">자주 하는 실수</h2>
          <div className="space-y-4">
            {[
              {
                title: '❌ npm run build 대신 npm run build:cf 사용 안 함',
                bad: 'npm run build\nnpx wrangler deploy\n# Node.js 전용 빌드 결과물 → Workers 배포 실패',
                good: 'npm run build:cf\nnpx wrangler deploy\n# @opennextjs/cloudflare로 Workers 최적화 빌드',
                desc: 'Cloudflare Workers는 Node.js와 다른 런타임입니다. 반드시 build:cf 명령으로 빌드해야 합니다.',
              },
              {
                title: '❌ Windows에서 build:cf 실행',
                bad: 'npm run build:cf\n# Windows NTFS 콜론(:) 파일명 문제로 실패',
                good: '# WSL(Windows Subsystem for Linux)에서 실행\nnpm run build:cf',
                desc: 'build:cf는 콜론(:)이 포함된 파일명을 생성합니다. Windows NTFS는 이를 지원하지 않으므로 WSL에서 실행하세요.',
              },
              {
                title: '❌ 환경변수를 wrangler.toml [vars]에 민감 정보 포함',
                bad: '# wrangler.toml\n[vars]\nSUPABASE_SERVICE_ROLE_KEY = "eyJhbG..."  # 위험!',
                good: '# wrangler secret으로 안전하게 등록\nnpx wrangler secret put SUPABASE_SERVICE_ROLE_KEY',
                desc: 'wrangler.toml은 Git에 커밋됩니다. 민감한 값은 반드시 wrangler secret put으로 별도 등록하세요.',
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
