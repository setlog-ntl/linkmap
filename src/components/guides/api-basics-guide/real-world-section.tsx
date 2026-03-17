'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';

const codeExamples = [
  {
    title: 'Next.js에서 API 호출하기 (fetch)',
    desc: 'Next.js 서버 컴포넌트에서 외부 API를 호출하는 기본 패턴입니다.',
    code: `// app/page.tsx (서버 컴포넌트)
export default async function Page() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}`,
    notes: '서버 컴포넌트에서는 async/await를 직접 사용할 수 있습니다.',
  },
  {
    title: 'Supabase 클라이언트로 데이터 조회',
    desc: 'Supabase는 REST API를 자동 생성해주므로, 클라이언트 라이브러리로 간편하게 호출합니다.',
    code: `import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// 사용자 목록 가져오기
const { data, error } = await supabase
  .from('profiles')
  .select('id, name, email')
  .order('created_at', { ascending: false });`,
    notes: 'Supabase 클라이언트가 내부적으로 REST API를 호출합니다.',
  },
  {
    title: '환경변수로 API URL 관리하기',
    desc: '개발/프로덕션 환경마다 다른 API URL을 사용해야 할 때 환경변수를 활용합니다.',
    code: `// .env.local
API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_URL=http://localhost:3000/api

// .env.production
API_URL=https://myapp.com/api
NEXT_PUBLIC_API_URL=https://myapp.com/api

// 사용 예시
const res = await fetch(\`\${process.env.API_URL}/users\`);`,
    notes: 'NEXT_PUBLIC_ 접두사가 있으면 브라우저에서도 접근 가능합니다. 비밀 키는 절대 NEXT_PUBLIC_을 붙이지 마세요.',
  },
];

export function RealWorldSection() {
  return (
    <section id="real-world" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">실전 활용</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          실제 프로젝트에서 API를 어떻게 사용하는지 코드 예시와 함께 살펴봅니다.
        </p>
      </ScrollReveal>

      <div className="space-y-6 max-w-3xl">
        {codeExamples.map((ex, idx) => (
          <ScrollReveal key={ex.title} delay={idx * 0.1}>
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="p-5">
                <h3 className="text-sm font-bold mb-1">{ex.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">{ex.desc}</p>
              </div>
              <div className="bg-muted/50 border-t px-5 py-4 overflow-x-auto">
                <pre className="text-[11px] font-mono leading-relaxed text-muted-foreground whitespace-pre">
                  {ex.code}
                </pre>
              </div>
              <div className="px-5 py-3 border-t">
                <p className="text-[10px] text-muted-foreground">
                  💡 {ex.notes}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* 다음 단계 안내 */}
      <ScrollReveal delay={0.3}>
        <div className="mt-10 p-4 rounded-xl border bg-primary/5 max-w-2xl">
          <h3 className="text-sm font-bold mb-2">다음 단계로</h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>API의 기본 개념을 이해했다면, 다음 가이드에서 더 깊이 알아보세요:</p>
            <ul className="space-y-1 ml-4">
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">→</span>
                <span><strong className="text-foreground">HTTP 요청 보내기</strong> — fetch와 axios로 실제 요청을 보내는 방법</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">→</span>
                <span><strong className="text-foreground">에러 핸들링</strong> — 에러를 우아하게 처리하는 패턴</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">→</span>
                <span><strong className="text-foreground">API 인증 방식</strong> — API Key, Token, OAuth 비교</span>
              </li>
            </ul>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
