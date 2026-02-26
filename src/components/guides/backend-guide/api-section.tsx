'use client';

import { useState } from 'react';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const requestExample = `// 브라우저(프론트엔드)에서 API 호출
const response = await fetch('/api/users/123', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer my-token',
  },
});

const user = await response.json();
// → { id: 123, name: '홍길동', email: '...' }`;

const responseExample = `// 서버(백엔드)에서 응답 처리
// GET /api/users/123

export async function GET(request) {
  const user = await db.query(
    'SELECT * FROM users WHERE id = 123'
  );

  return Response.json(user);
  // 200 OK + JSON 데이터 반환
}`;

const methods = [
  { method: 'GET', color: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300', desc: '데이터 조회', example: '사용자 정보 가져오기' },
  { method: 'POST', color: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300', desc: '새 데이터 생성', example: '새 게시글 작성' },
  { method: 'PUT', color: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300', desc: '데이터 수정', example: '프로필 정보 업데이트' },
  { method: 'DELETE', color: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300', desc: '데이터 삭제', example: '게시글 삭제' },
];

export function ApiSection() {
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('request');

  return (
    <section id="api" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">API란?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          API(Application Programming Interface)는 프론트엔드와 백엔드가 대화하는 방법입니다.
          프론트가 &ldquo;이 데이터 줘&rdquo;라고 요청하면 백엔드가 처리해서 돌려주는 약속된 창구입니다.
        </p>
      </ScrollReveal>

      {/* 요청 응답 사이클 도식 */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-2xl mb-10">
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="grid grid-cols-3 text-center text-xs font-medium border-b bg-muted/30">
              <div className="p-3">🖥️ 브라우저 (프론트)</div>
              <div className="p-3 border-x">🌐 인터넷</div>
              <div className="p-3">⚙️ 서버 (백엔드)</div>
            </div>
            {/* 요청 흐름 */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 text-sm">
                <div className="px-3 py-1.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-mono whitespace-nowrap">
                  GET /api/users/123
                </div>
                <div className="flex-1 flex items-center">
                  <div className="flex-1 h-px bg-border" />
                  <svg className="w-4 h-3 text-primary shrink-0" viewBox="0 0 16 12" fill="none">
                    <path d="M0 6h12m0 0-4-3m4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="px-3 py-1.5 rounded bg-muted text-xs text-muted-foreground">
                  요청 처리 중…
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 ml-1">① 요청 (Request)</div>
            </div>
            {/* 응답 흐름 */}
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="px-3 py-1.5 rounded bg-muted text-xs text-muted-foreground">
                  화면에 표시
                </div>
                <div className="flex-1 flex items-center">
                  <svg className="w-4 h-3 text-green-500 shrink-0" viewBox="0 0 16 12" fill="none">
                    <path d="M16 6H4m0 0 4-3M4 6l4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="px-3 py-1.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-mono whitespace-nowrap">
                  200 OK + JSON
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 text-right mr-1">② 응답 (Response)</div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* HTTP 메서드 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">HTTP 메서드 4가지</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-2xl">
          {methods.map((m) => (
            <div key={m.method} className="flex items-center gap-3 rounded-lg border p-3">
              <Badge className={`font-mono text-xs w-16 justify-center shrink-0 ${m.color}`} variant="secondary">
                {m.method}
              </Badge>
              <div>
                <div className="text-sm font-medium">{m.desc}</div>
                <div className="text-xs text-muted-foreground">{m.example}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 코드 예시 */}
      <ScrollReveal delay={0.2}>
        <div className="max-w-2xl">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setActiveTab('request')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'request' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              요청 코드 (프론트)
            </button>
            <button
              onClick={() => setActiveTab('response')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'response' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              응답 코드 (백엔드)
            </button>
          </div>
          <div className="rounded-lg border bg-muted/50">
            <div className="px-4 py-2 border-b">
              <span className="text-xs text-muted-foreground font-mono">
                {activeTab === 'request' ? 'frontend/components/UserProfile.tsx' : 'app/api/users/[id]/route.ts'}
              </span>
            </div>
            <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {activeTab === 'request' ? requestExample : responseExample}
            </pre>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
