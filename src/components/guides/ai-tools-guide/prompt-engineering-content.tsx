'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PenTool } from 'lucide-react';

const promptStructure = [
  {
    part: '역할 지정',
    desc: 'AI에게 전문가 역할을 부여',
    example: '"너는 Next.js와 Supabase 전문 시니어 개발자야."',
    color: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    part: '맥락 제공',
    desc: '프로젝트 상황을 설명',
    example: '"React + Tailwind + shadcn/ui를 사용하는 프로젝트야."',
    color: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
  },
  {
    part: '구체적 요구사항',
    desc: '원하는 것을 명확히',
    example: '"이메일과 비밀번호로 로그인하는 폼을 만들어줘. 유효성 검사 포함."',
    color: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
  {
    part: '출력 형식',
    desc: '결과물의 형태를 지정',
    example: '"TypeScript로 작성하고, 컴포넌트 파일과 훅을 분리해줘."',
    color: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
  },
];

const beforeAfter = [
  {
    before: '로그인 만들어줘',
    after: 'Next.js App Router에서 Supabase Auth를 사용해 이메일/비밀번호 로그인 폼을 만들어줘.\n- React Hook Form + Zod로 유효성 검사\n- 로딩 상태와 에러 메시지 표시\n- shadcn/ui Card 컴포넌트 사용\n- TypeScript strict mode',
    improvement: '기술 스택, 유효성 검사, UI 라이브러리, 에러 처리를 모두 명시',
  },
  {
    before: 'API 만들어줘',
    after: 'Next.js App Router의 Route Handler로 TODO 항목 CRUD API를 만들어줘.\n- GET /api/todos: 로그인한 사용자의 할 일 목록 반환\n- POST /api/todos: 새 할 일 생성 (title 필수, Zod safeParse)\n- 인증: Supabase getUser()로 확인, 미인증 시 401\n- 에러 응답: src/lib/api/errors.ts 헬퍼 사용',
    improvement: 'HTTP 메서드, 엔드포인트, 인증 방식, 에러 처리 패턴을 구체적으로 명시',
  },
  {
    before: '대시보드 페이지 만들어줘',
    after: '관리자 대시보드 페이지를 만들어줘.\n- 상단: 총 사용자 수, 오늘 가입 수, 활성 프로젝트 수 (3개 통계 카드)\n- 중간: 최근 7일 가입자 추이 차트 (recharts AreaChart)\n- 하단: 최근 활동 로그 테이블 (5건)\n- 반응형: 모바일에서 카드 1열, 태블릿 2열, 데스크톱 3열',
    improvement: '레이아웃 구조, 사용할 라이브러리, 반응형 기준을 명확하게 설명',
  },
];

const ruleFileExamples = [
  {
    file: 'CLAUDE.md',
    desc: 'Claude Code가 자동으로 읽는 프로젝트 규칙 파일',
    content: `# Project Rules
- TypeScript strict mode, no any
- Use shadcn/ui + Tailwind
- API routes: getUser() → Zod safeParse → logic
- Korean-first UI`,
  },
  {
    file: '.cursorrules',
    desc: 'Cursor가 자동으로 읽는 프로젝트 규칙 파일',
    content: `You are a Next.js expert.
Stack: React 19, Tailwind, shadcn/ui, Supabase
Always use TypeScript, no any type.
Use server components by default.`,
  },
];

export function PromptEngineeringContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <PenTool className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">프롬프트 엔지니어링</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          같은 AI라도 프롬프트 품질에 따라 결과가 크게 달라집니다.
          좋은 프롬프트의 구조를 익히고, 프로젝트 규격 문서로 일관성을 유지하세요.
        </p>
      </ScrollReveal>

      {/* 좋은 프롬프트의 구조 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">좋은 프롬프트의 4가지 요소</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-8">
            {promptStructure.map((item, idx) => (
              <Card key={item.part}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge variant="secondary" className={`text-[10px] ${item.color}`}>
                      {idx + 1}
                    </Badge>
                    {item.part}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.desc}</p>
                  <div className="rounded border bg-muted/50 px-3 py-2">
                    <p className="text-[10px] font-mono text-muted-foreground">{item.example}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Before / After 프롬프트 비교 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Before / After 비교</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            같은 요청이라도 프롬프트를 구체적으로 작성하면 결과가 완전히 달라집니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-6 max-w-2xl mb-8">
            {beforeAfter.map((item, idx) => (
              <div key={idx} className="rounded-xl border bg-card overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                  {/* Before */}
                  <div className="p-4">
                    <Badge variant="secondary" className="text-[10px] bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 mb-2">
                      Before
                    </Badge>
                    <div className="rounded border bg-muted/50 px-3 py-2 mt-2">
                      <p className="text-xs font-mono text-muted-foreground whitespace-pre-line">{item.before}</p>
                    </div>
                  </div>
                  {/* After */}
                  <div className="p-4">
                    <Badge variant="secondary" className="text-[10px] bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 mb-2">
                      After
                    </Badge>
                    <div className="rounded border bg-muted/50 px-3 py-2 mt-2">
                      <p className="text-[10px] font-mono text-muted-foreground whitespace-pre-line leading-relaxed">{item.after}</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 bg-muted/30 border-t">
                  <p className="text-[10px] text-muted-foreground">
                    <span className="text-primary font-medium">개선 포인트:</span> {item.improvement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 프로젝트 규격 문서 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">프로젝트 규격 문서</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            매번 같은 규칙을 반복 설명하는 대신, 규격 문서를 만들면 AI가 자동으로 읽어 일관된 코드를 생성합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-4 max-w-2xl">
            {ruleFileExamples.map((rf) => (
              <div key={rf.file} className="rounded-lg border bg-card">
                <div className="px-4 py-3 border-b flex items-center gap-2">
                  <code className="text-xs font-mono font-bold text-primary">{rf.file}</code>
                  <span className="text-[10px] text-muted-foreground">{rf.desc}</span>
                </div>
                <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {rf.content}
                </pre>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">핵심:</strong> 규격 문서는 &quot;AI에게 주는 온보딩 문서&quot;입니다.
              프로젝트 규칙, 기술 스택, 코딩 컨벤션을 적어두면 AI가 매번 일관된 코드를 만들어 줍니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
