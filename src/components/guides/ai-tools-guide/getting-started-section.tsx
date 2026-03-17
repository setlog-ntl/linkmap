'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MousePointerClick, FolderPlus, PenTool } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: MousePointerClick,
    title: 'AI 도구 선택',
    detail: '아래 추천 조합 중 하나를 선택해 설치하세요. 처음이라면 Cursor가 가장 쉽습니다.',
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    step: 2,
    icon: FolderPlus,
    title: '첫 프로젝트 만들기',
    detail: 'AI에게 "Next.js 프로젝트를 만들어줘"라고 요청하세요. 폴더 구조부터 설정까지 자동으로 해줍니다.',
    color: 'border-purple-200 dark:border-purple-800',
  },
  {
    step: 3,
    icon: PenTool,
    title: '프롬프트 작성 연습',
    detail: '간단한 기능부터 시작하세요. "할 일 목록 앱을 만들어줘" 같은 작은 프로젝트가 좋습니다.',
    color: 'border-green-200 dark:border-green-800',
  },
];

const combos = [
  {
    title: '초보자 추천',
    tools: ['Cursor', 'Claude'],
    reason: 'Cursor는 설치만 하면 바로 AI 코딩이 가능하고, Claude는 긴 맥락을 잘 이해해 프로젝트 전체를 도와줍니다.',
    badge: '가장 쉬움',
    badgeColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  {
    title: '실무 개발자',
    tools: ['VS Code', 'Copilot', 'ChatGPT'],
    reason: 'VS Code의 풍부한 확장 생태계에 Copilot 자동 완성과 ChatGPT 디버깅을 조합합니다.',
    badge: '생산성',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  {
    title: '파워 유저',
    tools: ['Cursor', 'Claude Code', 'Anthropic API'],
    reason: 'Cursor로 파일 단위, Claude Code로 프로젝트 전체 작업, API로 앱에 AI 기능을 직접 넣습니다.',
    badge: '풀스택 AI',
    badgeColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
];

export function GettingStartedSection() {
  return (
    <section id="getting-started" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">시작하기</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          바이브코딩을 시작하는 3단계입니다. 도구 선택부터 첫 프로젝트까지 30분이면 충분합니다.
        </p>
      </ScrollReveal>

      {/* 3 step cards */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mb-10">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.step} className={s.color}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-bold">
                      {s.step}
                    </span>
                    <Icon className="h-4 w-4 text-primary" />
                    {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollReveal>

      {/* 추천 조합 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">추천 조합</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
          {combos.map((combo) => (
            <div key={combo.title} className={`rounded-xl border bg-card p-5 ${combo.borderColor}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-sm">{combo.title}</span>
                <Badge variant="secondary" className={`text-[10px] ${combo.badgeColor}`}>
                  {combo.badge}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {combo.tools.map((tool) => (
                  <span key={tool} className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded">
                    {tool}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{combo.reason}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-4xl">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">다음 단계:</strong> 도구를 설치했다면
            <strong className="text-foreground"> 프롬프트 엔지니어링</strong> 가이드에서 AI에게 좋은 지시를 내리는 방법을 배우세요.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
