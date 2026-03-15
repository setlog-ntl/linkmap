'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'secrets', label: 'wrangler secret' },
  { id: 'kv', label: 'KV 네임스페이스' },
  { id: 'vars', label: '환경변수 vs 시크릿' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function CloudflareSecretsGuide() {
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
            <Badge variant="outline">보안</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            환경변수 + 시크릿 관리
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Cloudflare Workers에서 API 키, DB 비밀번호 같은 민감 정보를 안전하게 관리하는 방법을 설명합니다.
            wrangler secret으로 시크릿을 등록하고 KV 네임스페이스로 데이터를 저장하는 방법을 다룹니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>설정 약 10분</span>
            <span>·</span>
            <span>Wrangler CLI 필요</span>
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
          <h2 className="text-2xl font-bold mb-4">Workers의 설정값 관리 방법</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Cloudflare Workers에서 설정값을 관리하는 세 가지 방법이 있습니다.
            민감도에 따라 올바른 방법을 선택하는 것이 중요합니다.
          </p>
          <div className="grid sm:grid-cols-1 gap-4">
            {[
              {
                label: '[vars] in wrangler.toml',
                desc: '공개 환경변수. Git에 커밋됨. 민감정보 절대 금지.',
                color: 'border-amber-200 dark:border-amber-800',
              },
              {
                label: 'wrangler secret put',
                desc: 'API 키·비밀번호 등 민감 정보. 암호화 저장. wrangler.toml에 기록되지 않음.',
                color: 'border-green-200 dark:border-green-800',
              },
              {
                label: 'KV Storage',
                desc: '런타임 중 읽고 쓰는 키-값 데이터. 세션 캐시, 설정값 저장 등에 활용.',
                color: 'border-blue-200 dark:border-blue-800',
              },
            ].map((m) => (
              <Card key={m.label} className={`bg-card shadow-sm ${m.color}`}>
                <CardContent className="p-4">
                  <p className="font-semibold text-sm font-mono">{m.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* wrangler secret */}
        <section id="secrets">
          <h2 className="text-2xl font-bold mb-4">wrangler secret으로 시크릿 관리</h2>
          <p className="text-muted-foreground text-sm mb-4">
            시크릿은 Cloudflare 서버에 암호화되어 저장되며, Workers 코드에서는
            일반 환경변수처럼 접근합니다.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">시크릿 등록</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# 대화형으로 값 입력 (입력 내용이 화면에 표시되지 않음)
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Enter a secret value: ****************************

npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put ENCRYPTION_KEY

# 등록된 시크릿 목록 확인
npx wrangler secret list`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Workers 코드에서 접근</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// Workers 런타임에서 환경변수처럼 접근
export default {
  async fetch(request: Request, env: Env) {
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
    // ...
  }
}

// TypeScript 타입 정의
interface Env {
  SUPABASE_SERVICE_ROLE_KEY: string
  OPENAI_API_KEY: string
  ENCRYPTION_KEY: string
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Next.js App Router에서 접근 (process.env)</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// @opennextjs/cloudflare 사용 시 서버 컴포넌트·API Route에서
// process.env로 접근 가능
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // 시크릿으로 등록된 값
)`}
              </pre>
            </div>
          </div>
        </section>

        {/* KV 네임스페이스 */}
        <section id="kv">
          <h2 className="text-2xl font-bold mb-4">KV 네임스페이스</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Workers KV는 전 세계에서 읽기에 최적화된 키-값 저장소입니다.
            세션 데이터, 설정 캐시, 속도 제한 카운터 등에 활용합니다.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">KV 네임스페이스 생성</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# 프로덕션용 KV 생성
npx wrangler kv:namespace create CACHE

# 출력 예:
# Add the following to your configuration file:
# [[kv_namespaces]]
# binding = "CACHE"
# id = "abcdef1234567890abcdef1234567890"

# 로컬 개발용 KV 생성 (preview)
npx wrangler kv:namespace create CACHE --preview`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">wrangler.toml에 KV 바인딩 추가</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# wrangler.toml
[[kv_namespaces]]
binding = "CACHE"
id = "abcdef1234567890abcdef1234567890"
preview_id = "preview1234567890abcdef1234567890"  # 로컬 개발용`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">KV 사용 예시</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`// KV에 값 저장 (TTL 선택사항)
await env.CACHE.put('user:123', JSON.stringify({ name: '홍길동' }), {
  expirationTtl: 3600,  // 1시간 후 자동 만료
})

// KV에서 값 읽기
const raw = await env.CACHE.get('user:123')
const user = raw ? JSON.parse(raw) : null

// KV 값 삭제
await env.CACHE.delete('user:123')`}
              </pre>
            </div>
          </div>
        </section>

        {/* 환경변수 vs 시크릿 비교 */}
        <section id="vars">
          <h2 className="text-2xl font-bold mb-4">환경변수 vs 시크릿 비교</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">항목</th>
                  <th className="text-left p-3 font-medium">wrangler.toml [vars]</th>
                  <th className="text-left p-3 font-medium">wrangler secret</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { item: '민감정보 저장', vars: '금지', secret: '권장' },
                  { item: 'Git 커밋 여부', vars: '커밋됨', secret: '커밋 안 됨' },
                  { item: '암호화 저장', vars: '없음', secret: 'Cloudflare 암호화' },
                  { item: '대시보드 열람', vars: '가능', secret: '불가 (등록만 가능)' },
                  { item: '사용 예', vars: 'NEXT_PUBLIC_APP_URL', secret: 'SUPABASE_SERVICE_ROLE_KEY' },
                ].map((r) => (
                  <tr key={r.item} className="hover:bg-muted/50">
                    <td className="p-3 font-medium">{r.item}</td>
                    <td className="p-3 text-muted-foreground">{r.vars}</td>
                    <td className="p-3 text-muted-foreground">{r.secret}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 주의사항 */}
        <section id="pitfalls">
          <h2 className="text-2xl font-bold mb-4">자주 하는 실수</h2>
          <div className="space-y-4">
            {[
              {
                title: '❌ 시크릿을 wrangler.toml [vars]에 하드코딩',
                bad: '# wrangler.toml (Git에 커밋됨!)\n[vars]\nOPENAI_API_KEY = "sk-proj-..."',
                good: '# wrangler.toml — 공개 값만\n[vars]\nAPP_NAME = "my-app"\n\n# 시크릿은 별도 등록\nnpx wrangler secret put OPENAI_API_KEY',
                desc: 'wrangler.toml은 Git에 커밋됩니다. API 키를 여기에 넣으면 GitHub에 노출됩니다.',
              },
              {
                title: '❌ KV preview_id 미설정 시 로컬 개발 오류',
                bad: '[[kv_namespaces]]\nbinding = "CACHE"\nid = "abcdef..."  # preview_id 없음\n# npx wrangler dev 시 오류',
                good: '[[kv_namespaces]]\nbinding = "CACHE"\nid = "abcdef..."\npreview_id = "preview..."  # 로컬 개발용 별도 네임스페이스',
                desc: '로컬 개발과 프로덕션 KV를 분리하세요. preview_id가 없으면 wrangler dev 실행 시 오류가 발생합니다.',
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
