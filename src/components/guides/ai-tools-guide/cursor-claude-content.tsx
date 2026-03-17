'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Terminal } from 'lucide-react';

const cursorSteps = [
  {
    step: 1,
    title: '설치',
    detail: 'cursor.com에서 다운로드 후 설치. VS Code 설정/확장을 자동으로 가져올 수 있습니다.',
  },
  {
    step: 2,
    title: '설정',
    detail: 'Settings → Models에서 사용할 AI 모델 선택 (Claude Sonnet 추천). .cursorrules 파일로 프로젝트 규칙 설정.',
  },
  {
    step: 3,
    title: '사용',
    detail: 'Cmd+K (인라인 편집), Cmd+L (채팅), Tab (자동 완성). 코드를 선택한 후 Cmd+K로 수정 요청도 가능.',
  },
];

const claudeCodeSteps = [
  {
    step: 1,
    title: '설치',
    detail: 'npm install -g @anthropic-ai/claude-code 실행. Node.js 18 이상 필요.',
  },
  {
    step: 2,
    title: '설정',
    detail: '프로젝트 폴더에서 claude 명령어 실행. CLAUDE.md 파일에 프로젝트 규칙을 작성.',
  },
  {
    step: 3,
    title: '사용',
    detail: '터미널에서 자연어로 작업 지시. 멀티 파일 편집, 테스트 실행, git 작업까지 자동 처리.',
  },
];

const workflowSteps = [
  {
    step: 1,
    icon: '📁',
    title: '파일 생성',
    detail: 'AI에게 새 기능의 파일 구조를 요청합니다.\n"TODO API의 route.ts와 타입 파일을 만들어줘"',
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    step: 2,
    icon: '💬',
    title: 'AI 요청',
    detail: '구체적인 기능 구현을 요청합니다.\n프롬프트에 기술 스택과 패턴을 명시.',
    color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
  },
  {
    step: 3,
    icon: '👀',
    title: '코드 리뷰',
    detail: 'AI가 생성한 코드를 확인합니다.\n이해 안 되는 부분은 "이 코드 설명해줘".',
    color: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
  },
  {
    step: 4,
    icon: '✅',
    title: '커밋',
    detail: '동작을 확인한 후 git commit.\nAI에게 커밋 메시지 작성도 맡길 수 있음.',
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    badge: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
];

const comparison = [
  { feature: '동작 방식', cursor: '에디터 내장 AI', claude: '터미널 기반 에이전트' },
  { feature: '강점', cursor: '파일 단위 편집, 자동 완성', claude: '멀티 파일, 리팩토링, 복잡한 작업' },
  { feature: '인터페이스', cursor: 'GUI (에디터)', claude: 'CLI (터미널)' },
  { feature: '적합한 작업', cursor: 'UI 컴포넌트, 단일 파일 수정', claude: '아키텍처 변경, 대규모 리팩토링' },
  { feature: '가격', cursor: '무료~$20/월', claude: '사용량 기반' },
];

export function CursorClaudeContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Cursor / Claude Code 활용법</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          AI 코딩 도구의 양대 산맥인 Cursor와 Claude Code.
          설치부터 실전 워크플로우까지 단계별로 안내합니다.
        </p>
      </ScrollReveal>

      {/* Cursor 설치 + 설정 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Cursor 시작하기</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            VS Code를 기반으로 AI를 내장한 코드 에디터입니다. 기존 VS Code 사용자라면 전환이 매우 쉽습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-3 max-w-xl mb-8">
            {cursorSteps.map((s) => (
              <div key={s.step} className="flex items-start gap-3 text-xs rounded-lg border bg-card px-4 py-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">
                  {s.step}
                </span>
                <div>
                  <div className="font-semibold text-sm mb-0.5">{s.title}</div>
                  <span className="text-muted-foreground leading-relaxed">{s.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Claude Code 설치 + 설정 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Claude Code 시작하기</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            터미널에서 동작하는 AI 코딩 에이전트입니다. 프로젝트 전체를 이해하고 여러 파일을 동시에 수정할 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-3 max-w-xl mb-8">
            {claudeCodeSteps.map((s) => (
              <div key={s.step} className="flex items-start gap-3 text-xs rounded-lg border bg-card px-4 py-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">
                  {s.step}
                </span>
                <div>
                  <div className="font-semibold text-sm mb-0.5">{s.title}</div>
                  <span className="text-muted-foreground leading-relaxed">{s.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-xl mb-8">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b">
                <span className="text-xs text-muted-foreground font-mono">터미널</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap text-muted-foreground">{`# 설치
npm install -g @anthropic-ai/claude-code

# 프로젝트 폴더에서 실행
cd my-project
claude

# 예시 작업 지시
> "src/app/api/todos/route.ts에 CRUD API를 만들어줘.
   Supabase를 사용하고, Zod로 입력 검증해줘."

> "전체 프로젝트에서 console.log를 찾아서 제거해줘."

> "이 PR의 변경사항을 리뷰해줘."
`}</pre>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Cursor vs Claude Code 비교 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Cursor vs Claude Code 비교</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl overflow-x-auto mb-8">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">구분</th>
                  <th className="text-left py-2 px-3 font-semibold">
                    <Badge variant="secondary" className="text-[9px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">Cursor</Badge>
                  </th>
                  <th className="text-left py-2 px-3 font-semibold">
                    <Badge variant="secondary" className="text-[9px] bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">Claude Code</Badge>
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b">
                    <td className="py-2 px-3 font-medium text-foreground">{row.feature}</td>
                    <td className="py-2 px-3">{row.cursor}</td>
                    <td className="py-2 px-3">{row.claude}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* 실전 워크플로우 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">실전 워크플로우</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            AI 코딩 도구를 사용한 일반적인 개발 흐름입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="overflow-x-auto pb-2 mb-8">
            <div className="flex items-stretch gap-0 min-w-max">
              {workflowSteps.map((s, i) => (
                <div key={s.step} className="flex items-stretch">
                  <div className={`rounded-xl border p-4 w-40 flex flex-col items-center text-center gap-2 ${s.color}`}>
                    <div className="text-2xl">{s.icon}</div>
                    <div className="text-xs font-bold leading-tight">{s.title}</div>
                    <div className="text-[10px] text-muted-foreground leading-relaxed whitespace-pre-line flex-1">{s.detail}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-auto ${s.badge}`}>
                      Step {s.step}
                    </span>
                  </div>
                  {i < workflowSteps.length - 1 && (
                    <div className="flex items-center px-0.5">
                      <svg className="w-5 h-4 text-muted-foreground/40" viewBox="0 0 20 16" fill="none">
                        <path d="M0 8h14m0 0-5-4m5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">실전 팁:</strong> Cursor로 UI 컴포넌트를 빠르게 만들고,
              Claude Code로 API 라우트나 리팩토링 같은 복잡한 작업을 처리하면 가장 효율적입니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
