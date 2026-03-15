'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Atom } from 'lucide-react';

const reactConcepts = [
  {
    name: '컴포넌트 (Component)',
    desc: 'UI를 독립적인 조각으로 나눈 것. 재사용 가능한 레고 블록입니다.',
    example: `function Greeting({ name }) {
  return <h1>안녕하세요, {name}님!</h1>;
}

// 사용
<Greeting name="홍길동" />`,
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    name: 'Props (프롭스)',
    desc: '컴포넌트에 데이터를 전달하는 방법. 함수의 매개변수와 같습니다.',
    example: `// props를 받는 카드 컴포넌트
function Card({ title, description, badge }) {
  return (
    <div>
      <span>{badge}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}`,
    color: 'border-green-200 dark:border-green-800',
  },
  {
    name: 'State (상태)',
    desc: '컴포넌트 내부에서 변하는 데이터. useState 훅으로 관리합니다.',
    example: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      클릭 수: {count}
    </button>
  );
}`,
    color: 'border-purple-200 dark:border-purple-800',
  },
  {
    name: 'useEffect (사이드 이펙트)',
    desc: '컴포넌트가 렌더링된 후 실행될 작업을 정의합니다. API 호출, 이벤트 등록 등.',
    example: `import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]); // userId 변경 시 재실행

  return <div>{user?.name}</div>;
}`,
    color: 'border-orange-200 dark:border-orange-800',
  },
];

const appRouterConcepts = [
  {
    name: '파일 기반 라우팅',
    icon: '📁',
    desc: '폴더 구조가 곧 URL 구조입니다.',
    example: `app/
  page.tsx          → /
  about/
    page.tsx        → /about
  blog/
    [id]/
      page.tsx      → /blog/123`,
  },
  {
    name: '서버 컴포넌트',
    icon: '🖥️',
    desc: "기본값. 서버에서 실행되어 HTML을 반환합니다. 'use client' 없이 작성.",
    example: `// app/products/page.tsx
// 서버 컴포넌트 (기본값)
export default async function Products() {
  // 서버에서 직접 DB 조회 가능
  const products = await db.products.findMany();
  return <ul>{products.map(p => <li>{p.name}</li>)}</ul>;
}`,
  },
  {
    name: '클라이언트 컴포넌트',
    icon: '🌐',
    desc: "첫 줄에 'use client'를 추가합니다. useState, useEffect, 이벤트 핸들러 사용 가능.",
    example: `'use client';
// 클라이언트 컴포넌트
import { useState } from 'react';

export function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '♥' : '♡'} 좋아요
    </button>
  );
}`,
  },
  {
    name: 'layout.tsx',
    icon: '📐',
    desc: '여러 페이지가 공유하는 레이아웃. 네비게이션, 사이드바 등에 사용.',
    example: `// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Nav />       {/* 모든 페이지에 공통 */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}`,
  },
];

const projectStructure = `my-app/
├── app/                    # 페이지 · 레이아웃 (App Router)
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 홈 페이지 (/)
│   ├── about/
│   │   └── page.tsx        # /about
│   └── api/
│       └── route.ts        # API 엔드포인트
├── components/             # 재사용 가능한 컴포넌트
│   ├── ui/                 # shadcn/ui 컴포넌트
│   └── Button.tsx
├── lib/                    # 유틸리티, 헬퍼 함수
├── public/                 # 정적 파일 (이미지 등)
└── package.json`;

export function ReactNextjsContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Atom className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">React / Next.js 기초</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          React는 UI를 만드는 라이브러리이고, Next.js는 React를 더 강력하게 만드는 풀스택 프레임워크입니다.
          핵심 개념만 이해해도 AI가 생성한 코드를 읽고 수정할 수 있습니다.
        </p>
      </ScrollReveal>

      {/* React 핵심 개념 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-2">React 핵심 개념 4가지</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            이 4가지만 이해해도 React 코드의 90%를 읽을 수 있습니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reactConcepts.map((concept, idx) => (
            <ScrollReveal key={concept.name} delay={idx * 0.08}>
              <div className={`rounded-xl border p-5 h-full flex flex-col ${concept.color}`}>
                <h3 className="font-bold text-sm mb-2">{concept.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{concept.desc}</p>
                <div className="rounded-md border bg-background/60 flex-1">
                  <pre className="p-3 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">{concept.example}</pre>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Next.js App Router 개념 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-2">Next.js App Router 개념</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Next.js 13+ App Router의 핵심 개념입니다. Linkmap도 이 구조로 만들어졌습니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {appRouterConcepts.map((concept, idx) => (
            <ScrollReveal key={concept.name} delay={idx * 0.08}>
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span>{concept.icon}</span>
                    {concept.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{concept.desc}</p>
                  <div className="rounded-md border bg-muted/50">
                    <pre className="p-3 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">{concept.example}</pre>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 프로젝트 구조 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">표준 프로젝트 구조</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            AI가 생성한 Next.js 프로젝트의 일반적인 폴더 구조입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-lg">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">프로젝트 폴더 구조</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed">{projectStructure}</pre>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 서버 vs 클라이언트 결정 기준 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">서버 vs 클라이언트 컴포넌트 선택</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl rounded-lg border bg-card overflow-hidden">
            <div className="grid grid-cols-2 divide-x">
              <div className="p-4">
                <div className="text-xs font-bold text-green-600 dark:text-green-400 mb-3">서버 컴포넌트 사용</div>
                <div className="space-y-2">
                  {[
                    'DB에서 데이터 직접 가져올 때',
                    'API 시크릿 키를 사용할 때',
                    'SEO가 중요한 페이지',
                    '상호작용이 없는 정적 콘텐츠',
                  ].map((item) => (
                    <div key={item} className="flex gap-1.5 text-[10px] text-muted-foreground">
                      <span className="text-green-500 shrink-0">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-3">&apos;use client&apos; 추가</div>
                <div className="space-y-2">
                  {[
                    'onClick, onChange 등 이벤트 핸들러',
                    'useState, useEffect 사용 시',
                    '브라우저 API (window, localStorage)',
                    '실시간으로 바뀌는 UI',
                  ].map((item) => (
                    <div key={item} className="flex gap-1.5 text-[10px] text-muted-foreground">
                      <span className="text-blue-500 shrink-0">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-4 max-w-2xl p-4 rounded-lg border bg-muted/30">
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="text-[10px] shrink-0 mt-0.5">팁</Badge>
              <p className="text-xs text-muted-foreground leading-relaxed">
                AI가 생성한 코드에서 &apos;use client&apos;가 없는 컴포넌트는 서버 컴포넌트입니다.
                useState나 onClick이 필요하다면 파일 첫 줄에 &apos;use client&apos;를 추가하세요.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
