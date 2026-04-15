'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';

const rcafParts = [
  { part: 'R — Role (역할)', desc: 'AI에게 전문가 역할을 부여합니다.', example: '"너는 경험 많은 웹 개발자야"', color: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300' },
  { part: 'C — Context (맥락)', desc: '현재 상황과 배경을 설명합니다.', example: '"React로 만든 쇼핑몰 프로젝트에서"', color: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300' },
  { part: 'A — Action (작업)', desc: '구체적으로 해야 할 일을 지정합니다.', example: '"장바구니 기능을 구현해줘"', color: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300' },
  { part: 'F — Format (형식)', desc: '원하는 출력 형태를 지정합니다.', example: '"TypeScript 코드로, 주석 포함해서"', color: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300' },
];

const commonMistakes = [
  { mistake: '너무 모호함', bad: '"코드 고쳐줘"', good: '"이 함수의 null 체크 에러를 수정해줘"' },
  { mistake: '맥락 부족', bad: '"로그인 만들어줘"', good: '"Supabase Auth를 사용하는 Next.js 로그인 페이지"' },
  { mistake: '한 번에 너무 많이', bad: '"풀스택 앱 만들어줘"', good: '단계별로 나눠서 요청' },
  { mistake: '형식 미지정', bad: '"설명해줘"', good: '"표 형식으로 비교해줘"' },
];

const promptTechniques = [
  {
    name: '제로샷 (Zero-shot)',
    desc: '예시 없이 직접 지시하는 방법입니다.',
    example: '다음 리뷰의 감성을 "긍정", "부정", "중립" 중 하나로 분류해줘:\n"이 제품 정말 좋아요! 배송도 빨랐어요."',
    when: 'AI가 이미 충분히 이해할 수 있는 간단한 작업에 적합',
  },
  {
    name: '퓨샷 (Few-shot)',
    desc: '예시를 포함하여 원하는 패턴을 보여주는 방법입니다.',
    example: '리뷰: "배송이 너무 늦어요" → 부정\n리뷰: "그냥 그래요" → 중립\n리뷰: "완전 강추합니다!" → 긍정\n\n리뷰: "포장이 찢어져 왔는데 제품은 괜찮아요" → ?',
    when: '형식이 중요하거나, AI가 원하는 패턴을 정확히 따르길 원할 때',
  },
  {
    name: '체인 오브 쏘트 (CoT)',
    desc: '"단계별로 생각해줘"라고 요청하여 추론 과정을 보여주게 하는 기법입니다.',
    example: '이 문제를 단계별로 생각해서 풀어줘:\n\n월 사용자 1000명, 사용자당 API 50회,\n호출당 1000 토큰 → Claude Sonnet 기준 월 비용은?',
    when: '산술, 상식 추론, 논리 문제에서 정확도를 높이고 싶을 때',
  },
];

const promptTypes = [
  {
    type: '시스템 프롬프트',
    who: '앱 개발자 (사용자에게 보이지 않음)',
    role: 'AI의 성격, 규칙, 제한 사항 정의',
    persist: '모든 대화에 걸쳐 유지',
    analogy: '직원에게 주는 "업무 매뉴얼"',
  },
  {
    type: '유저 프롬프트',
    who: '최종 사용자',
    role: '구체적인 질문이나 요청',
    persist: '매 메시지마다 변경',
    analogy: '직원에게 던지는 "개별 질문"',
  },
];

export function PromptBasicsContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">프롬프트 기초</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          같은 AI라도 프롬프트 품질에 따라 결과가 크게 달라집니다. 좋은 프롬프트의 구조와 핵심 기법을 배웁니다.
        </p>
      </ScrollReveal>

      {/* RCAF 프레임워크 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">좋은 프롬프트의 4가지 요소 (RCAF)</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-8">
            {rcafParts.map((p, idx) => (
              <Card key={p.part}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge variant="secondary" className={`text-[10px] ${p.color}`}>{idx + 1}</Badge>
                    {p.part}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{p.desc}</p>
                  <div className="rounded border bg-muted/50 px-3 py-2">
                    <p className="text-[10px] font-mono text-muted-foreground">{p.example}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 흔한 실수 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-4">흔한 실수와 개선법</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-3 max-w-2xl mb-8">
            {commonMistakes.map((m) => (
              <div key={m.mistake} className="rounded-xl border bg-card overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                  <div className="p-4">
                    <Badge variant="secondary" className="text-[10px] bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 mb-2">
                      Before
                    </Badge>
                    <div className="rounded border bg-muted/50 px-3 py-2 mt-2">
                      <p className="text-xs font-mono text-muted-foreground">{m.bad}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="text-[10px] bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 mb-2">
                      After
                    </Badge>
                    <div className="rounded border bg-muted/50 px-3 py-2 mt-2">
                      <p className="text-xs font-mono text-muted-foreground">{m.good}</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 bg-muted/30 border-t">
                  <p className="text-[10px] text-muted-foreground">
                    <span className="text-primary font-medium">실수:</span> {m.mistake}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 프롬프트 기법 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-4">핵심 프롬프트 기법</h2>
        </ScrollReveal>

        {promptTechniques.map((t, idx) => (
          <ScrollReveal key={t.name} delay={0.1 + idx * 0.05}>
            <div className="mb-6 max-w-2xl">
              <h3 className="text-sm font-semibold mb-2">{t.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{t.desc}</p>
              <div className="rounded border bg-muted/50 px-4 py-3 mb-2">
                <p className="text-[10px] font-mono text-muted-foreground whitespace-pre-line leading-relaxed">{t.example}</p>
              </div>
              <p className="text-[10px] text-muted-foreground">
                <strong className="text-foreground">적합한 상황:</strong> {t.when}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </section>

      {/* 시스템 vs 유저 프롬프트 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-4">시스템 프롬프트 vs 유저 프롬프트</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            {promptTypes.map((p) => (
              <Card key={p.type}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{p.type}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs"><strong>설정자:</strong> <span className="text-muted-foreground">{p.who}</span></div>
                  <div className="text-xs"><strong>역할:</strong> <span className="text-muted-foreground">{p.role}</span></div>
                  <div className="text-xs"><strong>지속성:</strong> <span className="text-muted-foreground">{p.persist}</span></div>
                  <div className="rounded border bg-muted/50 px-3 py-2 mt-2">
                    <p className="text-[10px] text-muted-foreground">
                      <strong className="text-foreground">비유:</strong> {p.analogy}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">다음 단계:</strong>{' '}
              코딩에 특화된 프롬프트 작성법과 규격 문서(CLAUDE.md, .cursorrules) 활용법은{' '}
              <Link href="/guides/ai-tools/prompt-engineering" prefetch={false} className="text-primary hover:underline">프롬프트 엔지니어링 가이드</Link>를 참고하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
