'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, MessageSquare, Cpu } from 'lucide-react';

const categories = [
  {
    title: 'AI 코드 에디터',
    description: '코드를 작성하는 에디터에 AI가 내장된 도구',
    icon: Code,
    color: 'border-blue-200 dark:border-blue-800',
    tools: [
      { name: 'Cursor', feature: 'VS Code 기반, AI 자동 완성 + 채팅', pricing: '무료 / $20/월', badge: '추천' },
      { name: 'Windsurf', feature: 'Codeium 기반, 에이전트 모드 강점', pricing: '무료 / $15/월', badge: undefined },
      { name: 'GitHub Copilot', feature: 'VS Code 확장, 코드 자동 완성 특화', pricing: '무료 / $10/월', badge: undefined },
    ],
  },
  {
    title: 'AI 어시스턴트',
    description: '대화형으로 코드 작성, 설명, 디버깅을 도와주는 AI',
    icon: MessageSquare,
    color: 'border-purple-200 dark:border-purple-800',
    tools: [
      { name: 'Claude', feature: '긴 맥락 이해, 정확한 코드 생성', pricing: '무료 / $20/월', badge: '추천' },
      { name: 'ChatGPT', feature: '범용 AI, 플러그인 생태계', pricing: '무료 / $20/월', badge: undefined },
      { name: 'Gemini', feature: 'Google 통합, 멀티모달', pricing: '무료 / $20/월', badge: undefined },
    ],
  },
  {
    title: 'AI API',
    description: '내 앱에 AI 기능을 직접 연동하는 API',
    icon: Cpu,
    color: 'border-green-200 dark:border-green-800',
    tools: [
      { name: 'OpenAI API', feature: 'GPT-4o, 가장 넓은 생태계', pricing: '사용량 기반', badge: undefined },
      { name: 'Anthropic API', feature: 'Claude 모델, 안전성 강점', pricing: '사용량 기반', badge: undefined },
      { name: 'Google AI', feature: 'Gemini 모델, 무료 티어 넉넉', pricing: '무료 티어 있음', badge: undefined },
    ],
  },
];

export function AiLandscapeSection() {
  return (
    <section id="ai-tools-landscape" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">AI 코딩 도구 지형도</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          AI 코딩 도구는 크게 3가지로 나뉩니다.
          각각의 역할이 다르므로 목적에 맞게 선택하세요.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Card key={cat.title} className={cat.color}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    {cat.title}
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground">{cat.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cat.tools.map((tool) => (
                      <div key={tool.name} className="rounded-lg border bg-background/50 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold">{tool.name}</span>
                          {tool.badge && (
                            <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary">
                              {tool.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed mb-1">{tool.feature}</p>
                        <span className="text-[10px] text-muted-foreground/70">{tool.pricing}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-4xl">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">TIP:</strong> AI 코드 에디터와 AI 어시스턴트는 &quot;코드를 만드는 도구&quot;이고,
            AI API는 &quot;내 앱에 AI 기능을 넣는 도구&quot;입니다. 처음에는 AI 코드 에디터부터 시작하세요.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
