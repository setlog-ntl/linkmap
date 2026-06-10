'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

const agentLoop = [
  { step: '인지', emoji: '👁️', desc: '사용자 요청과 현재 상태를 파악' },
  { step: '계획', emoji: '📋', desc: '목표 달성을 위한 단계를 수립' },
  { step: '실행', emoji: '⚡', desc: '도구를 사용하여 작업 수행' },
  { step: '평가', emoji: '🔍', desc: '결과를 확인하고 필요 시 수정' },
];

const mcpConcepts = [
  { role: 'Host', desc: '사용자 세션을 관리하는 앱 (예: Claude Desktop)', emoji: '🖥️' },
  { role: 'Client', desc: '서버와의 개별 연결을 담당', emoji: '🔌' },
  { role: 'Server', desc: 'AI가 사용할 도구, 리소스, 프롬프트를 제공', emoji: '🗄️' },
];

const codingTools = [
  {
    name: 'Claude Code',
    approach: '에이전트 퍼스트',
    interface: '터미널/CLI, VS Code/JetBrains 확장',
    strength: '자율적 파일 탐색, 코드 수정, 명령 실행. 터미널 기반의 자율 실행과 토큰 효율에 강점.',
    bestFor: '대규모 리팩토링, 아키텍처 변경, 복잡한 디버깅',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
  },
  {
    name: 'Cursor',
    approach: 'IDE 퍼스트',
    interface: 'VS Code 포크, AI 통합 IDE',
    strength: '탭 자동완성, 멀티모델 채팅, Composer로 다중 파일 편집.',
    bestFor: '일상적 코딩(80%), 빠른 기능 구현',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    name: 'GitHub Copilot',
    approach: '자동완성 중심',
    interface: 'VS Code/JetBrains 확장',
    strength: 'GitHub 생태계 통합, 코드 자동완성, PR 요약.',
    bestFor: 'GitHub 워크플로우 중심의 팀 개발',
    badge: 'bg-gray-100 dark:bg-gray-900/60 text-gray-700 dark:text-gray-300',
  },
];

const vibeCodingStats = [
  { stat: '47억 달러', label: '바이브코딩 시장 규모' },
  { stat: '92%', label: 'AI 코딩 도구 사용 개발자' },
  { stat: '41%', label: 'AI가 생성한 코드 비율' },
  { stat: '63%', label: '비개발자 바이브코더' },
];

export function AiTrendsContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">AI 트렌드</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          2026년 AI 생태계의 핵심 트렌드 — AI 에이전트, MCP, 코딩 에이전트, 바이브코딩의 진화를 살펴봅니다.
        </p>
      </ScrollReveal>

      {/* AI 에이전트 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">AI 에이전트 (Agentic AI)</h2>
          <p className="text-xs text-muted-foreground mb-4 max-w-2xl leading-relaxed">
            사용자가 목표만 제시하면, 스스로 계획을 세우고 도구를 사용하며 목표를 달성하는 자율적 AI 시스템입니다.
            기존 챗봇이 &quot;한 번에 한 질문에 답하는 안내데스크&quot;라면, AI 에이전트는 &quot;목표를 말하면 알아서 처리하는 개인 비서&quot;입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="overflow-x-auto pb-2 mb-4">
            <div className="flex items-stretch gap-0 min-w-max">
              {agentLoop.map((s, i) => (
                <div key={s.step} className="flex items-stretch">
                  <div className="rounded-xl border p-4 w-36 flex flex-col items-center text-center gap-2 bg-card">
                    <div className="text-2xl">{s.emoji}</div>
                    <div className="text-xs font-bold">{s.step}</div>
                    <div className="text-[10px] text-muted-foreground leading-relaxed">{s.desc}</div>
                  </div>
                  {i < agentLoop.length - 1 && (
                    <div className="flex items-center px-1">
                      <svg className="w-5 h-4 text-muted-foreground/40" viewBox="0 0 20 16" fill="none">
                        <path d="M0 8h14m0 0-5-4m5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {/* 반복 화살표 */}
              <div className="flex items-center px-1">
                <svg className="w-5 h-4 text-primary/60" viewBox="0 0 20 16" fill="none">
                  <path d="M0 8h14m0 0-5-4m5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="rounded-xl border border-dashed p-4 w-28 flex flex-col items-center text-center gap-2 bg-muted/30">
                <div className="text-2xl">🔁</div>
                <div className="text-xs font-bold text-muted-foreground">반복</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* MCP */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">MCP (Model Context Protocol)</h2>
          <p className="text-xs text-muted-foreground mb-4 max-w-2xl leading-relaxed">
            AI 앱이 외부 시스템(데이터베이스, API, 파일 등)과 통신하는 방식을 표준화한 프로토콜입니다.
            <strong className="text-foreground"> &quot;AI의 USB-C 포트&quot;</strong>에 비유할 수 있습니다 — 다양한 도구를 하나의 규격으로 AI에 연결합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mb-4">
            {mcpConcepts.map((c) => (
              <div key={c.role} className="rounded-xl border p-4 bg-card text-center">
                <div className="text-xl mb-2">{c.emoji}</div>
                <div className="text-xs font-semibold mb-1">{c.role}</div>
                <div className="text-[10px] text-muted-foreground">{c.desc}</div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">채택 현황:</strong> OpenAI, Google DeepMind, Zed, Sourcegraph 등 주요 업체들이 MCP를 채택했습니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 코딩 에이전트 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-4">코딩 에이전트</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-4 max-w-3xl mb-6">
            {codingTools.map((t) => (
              <Card key={t.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {t.name}
                    <Badge variant="secondary" className={`text-[10px] ${t.badge}`}>{t.approach}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    <div className="text-xs"><strong>인터페이스:</strong> <span className="text-muted-foreground">{t.interface}</span></div>
                    <div className="text-xs"><strong>강점:</strong> <span className="text-muted-foreground">{t.strength}</span></div>
                    <div className="text-xs"><strong>적합:</strong> <span className="text-muted-foreground">{t.bestFor}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-3xl">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">트렌드:</strong> 많은 개발자가 일상 코딩의 80%는 Cursor로, 깊은 분석과 대규모 작업은 Claude Code로 병행 사용합니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 바이브코딩 진화 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">바이브코딩의 진화</h2>
          <p className="text-xs text-muted-foreground mb-4 max-w-2xl leading-relaxed">
            2026년 바이브코딩은 &quot;에이전틱 엔지니어링&quot;으로 진화 중입니다. 단순히 &quot;만들어줘&quot;에서 &quot;이런 구조로 만들어줘, 내가 검토할게&quot;로 발전했습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mb-6">
            {vibeCodingStats.map((s) => (
              <div key={s.label} className="rounded-xl border p-4 bg-card text-center">
                <div className="text-lg font-bold text-primary mb-1">{s.stat}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">다음 단계:</strong>{' '}
              바이브코딩을 실제로 시작하고 싶다면{' '}
              <Link href="/guides/ai-tools" prefetch={false} className="text-primary hover:underline">AI 도구 활용 가이드</Link>에서 도구 선택과 실전 워크플로우를 확인하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
