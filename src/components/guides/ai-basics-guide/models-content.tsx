'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';
import Link from 'next/link';

const modelDetails = [
  {
    provider: 'Anthropic (Claude)',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    models: [
      { name: 'Claude Opus 4.6', context: '1M 토큰', maxOutput: '64K', input: '$5.00', output: '$25.00', features: '최고 수준 추론, 코딩 벤치마크(SWE-bench) 1위. 확장된 사고(extended thinking) 지원. 복잡한 분석, 대규모 코드 리팩토링, 보안 감사에 최적.' },
      { name: 'Claude Sonnet 4.6', context: '1M 토큰', maxOutput: '64K', input: '$3.00', output: '$15.00', features: '속도와 지능의 균형. 에이전틱 검색 성능 개선, 토큰 효율적. 일상 코딩, 문서 작성, 분석에 적합.' },
      { name: 'Claude Haiku 4.5', context: '200K 토큰', maxOutput: '8K', input: '$1.00', output: '$5.00', features: '가장 빠른 응답 속도. 간단한 분류, 고객 지원, 빠른 데이터 추출에 적합.' },
    ],
  },
  {
    provider: 'OpenAI (GPT / o 시리즈)',
    badge: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
    models: [
      { name: 'GPT-5.4', context: '1M 토큰', maxOutput: '-', input: '$2.50', output: '$15.00', features: '범용 최고 수준. Standard/Thinking/Pro/Mini/Nano 5가지 변형. 가장 넓은 생태계.' },
      { name: 'o3', context: '200K 토큰', maxOutput: '-', input: '$2.00', output: '$16.00', features: '추론 특화 모델. 내부 사고 토큰이 출력 비용에 포함되어 실제 비용이 5~20배 높을 수 있으므로 주의.' },
      { name: 'o4-mini', context: '200K 토큰', maxOutput: '-', input: '$1.10', output: '$4.40', features: '경제적인 추론 모델. 일상적 추론 작업에 비용 효율적.' },
    ],
  },
  {
    provider: 'Google (Gemini)',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    models: [
      { name: 'Gemini 2.5 Pro', context: '1M 토큰', maxOutput: '-', input: '$1.25', output: '$10.00', features: '멀티모달(텍스트+이미지+동영상) 강점. 긴 문서 분석, 영상 이해에 특히 강함.' },
      { name: 'Gemini 2.5 Flash', context: '1M 토큰', maxOutput: '-', input: '$0.30', output: '$2.50', features: '초고속 처리. 매우 경제적. 빠른 응답이 필요한 챗봇, 간단한 작업에 최적.' },
    ],
  },
  {
    provider: 'Meta (Llama) / DeepSeek',
    badge: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
    models: [
      { name: 'Llama 4 Scout', context: '10M 토큰', maxOutput: '-', input: '$0.11', output: '$0.34', features: '완전 오픈소스. 10M 토큰이라는 압도적 컨텍스트 윈도우. 자체 서버에서 무료 운영 가능.' },
      { name: 'Llama 4 Maverick', context: '10M 토큰', maxOutput: '-', input: '$0.20', output: '$0.60', features: '오픈소스, 높은 성능. 프라이버시 중요 또는 비용 최소화에 적합.' },
      { name: 'DeepSeek V3.2', context: '128K 토큰', maxOutput: '-', input: '$0.28', output: '$0.42', features: '오픈소스. GPT-5.4 성능의 90%를 1/50 가격에. 극강의 가성비.' },
      { name: 'DeepSeek R1', context: '128K 토큰', maxOutput: '-', input: '$0.55', output: '$2.19', features: '추론 특화 오픈소스 모델.' },
    ],
  },
];

const comparisonAxes = [
  { axis: '성능 vs 비용', desc: '프론티어 모델(Opus, GPT-5.4)은 최고 성능이지만 비싸고, 오픈소스(DeepSeek, Llama)는 90% 성능을 1/10 가격에 제공' },
  { axis: '속도 vs 정확도', desc: '빠른 모델(Flash, Haiku)은 간단한 작업에, 느리지만 정확한 모델(Opus, o3)은 복잡한 추론에 적합' },
  { axis: '범용 vs 특화', desc: 'GPT-5.4/Claude Sonnet은 범용 만능, o3/R1은 수학·코딩 추론 특화' },
  { axis: '프라이버시', desc: '클라우드 API는 데이터가 외부로 전송되지만, 오픈소스(Llama)는 자체 서버에서 완전 독립 운영 가능' },
];

export function ModelsContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">AI 모델 비교</h1>
        </div>
        <p className="text-muted-foreground mb-2 max-w-2xl leading-relaxed">
          2026년 주요 AI 모델의 성능, 가격, 특징을 상세히 비교합니다.
        </p>
        <p className="text-[10px] text-muted-foreground mb-8">가격: 100만 토큰당 USD (입력 / 출력) | 마지막 업데이트: 2026-04-15</p>
      </ScrollReveal>

      {/* 제공사별 상세 */}
      {modelDetails.map((provider, idx) => (
        <section key={provider.provider} className="scroll-mt-24 py-8 md:py-12">
          <ScrollReveal delay={idx * 0.05}>
            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <Badge variant="secondary" className={`text-xs ${provider.badge}`}>{provider.provider}</Badge>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={idx * 0.05 + 0.1}>
            <div className="space-y-3 max-w-3xl">
              {provider.models.map((m) => (
                <Card key={m.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>{m.name}</span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-[10px]">{m.context}</Badge>
                        <Badge variant="secondary" className="text-[10px] font-mono">{m.input} / {m.output}</Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.features}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </section>
      ))}

      {/* 선택 기준 축 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-4">모델 선택 시 고려할 축</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="space-y-3 max-w-2xl">
            {comparisonAxes.map((a, i) => (
              <div key={a.axis} className="flex items-start gap-3 text-xs rounded-lg border bg-card px-4 py-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <div className="font-semibold text-sm mb-0.5">{a.axis}</div>
                  <span className="text-muted-foreground leading-relaxed">{a.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">다음 단계:</strong>{' '}
              AI 모델을 실제로 활용하는 도구가 궁금하다면{' '}
              <Link href="/guides/ai-tools" prefetch={false} className="text-primary hover:underline">AI 도구 활용 가이드</Link>를 참고하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
