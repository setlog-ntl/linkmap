'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const providers = [
  {
    name: 'Anthropic',
    color: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    models: [
      { name: 'Claude Opus 4.6', context: '1M', price: '$5 / $25', strength: '최고 수준 추론, 코딩 1위' },
      { name: 'Claude Sonnet 4.6', context: '1M', price: '$3 / $15', strength: '성능/비용 균형' },
      { name: 'Claude Haiku 4.5', context: '200K', price: '$1 / $5', strength: '최고 속도' },
    ],
  },
  {
    name: 'OpenAI',
    color: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
    models: [
      { name: 'GPT-5.4', context: '1M', price: '$2.50 / $15', strength: '범용 최고 수준' },
      { name: 'o3', context: '200K', price: '$2 / $16', strength: '추론 특화' },
      { name: 'o4-mini', context: '200K', price: '$1.10 / $4.40', strength: '경제적 추론' },
    ],
  },
  {
    name: 'Google',
    color: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    models: [
      { name: 'Gemini 2.5 Pro', context: '1M', price: '$1.25 / $10', strength: '멀티모달 강점' },
      { name: 'Gemini 2.5 Flash', context: '1M', price: '$0.30 / $2.50', strength: '초고속, 가성비' },
    ],
  },
  {
    name: 'Meta / DeepSeek',
    color: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
    models: [
      { name: 'Llama 4 Scout', context: '10M', price: '$0.11 / $0.34', strength: '오픈소스, 최대 컨텍스트' },
      { name: 'DeepSeek V3.2', context: '128K', price: '$0.28 / $0.42', strength: '오픈소스, 극강 가성비' },
    ],
  },
];

const recommendations = [
  { situation: '처음 AI를 써보는 경우', models: 'ChatGPT 또는 Claude', reason: '무료 티어, 사용 쉬움' },
  { situation: '코딩/개발 작업', models: 'Claude Opus 4.6 또는 Claude Code', reason: '코딩 벤치마크 1위' },
  { situation: '비용 최소화', models: 'DeepSeek V3.2 또는 Gemini Flash', reason: '가격 대비 성능 최고' },
  { situation: '긴 문서 분석', models: 'Gemini 2.5 Pro 또는 Llama 4', reason: '1M~10M 토큰 컨텍스트' },
  { situation: '프라이버시 중요', models: 'Llama 4 (자체 호스팅)', reason: '오픈소스, 데이터 외부 전송 없음' },
  { situation: '빠른 응답 필요', models: 'Gemini Flash 또는 Claude Haiku', reason: '최고 속도' },
];

export function AiModelsSection() {
  return (
    <section id="ai-models" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">AI 모델 지형도</h2>
        <p className="text-muted-foreground mb-4 max-w-2xl leading-relaxed text-sm">
          2026년 주요 AI 모델을 제공사별로 비교합니다. 가격은 입력/출력 기준 100만 토큰당 USD입니다.
        </p>
        <p className="text-[10px] text-muted-foreground mb-8">마지막 업데이트: 2026-04-15</p>
      </ScrollReveal>

      {/* 제공사별 모델 카드 */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mb-10">
          {providers.map((p) => (
            <Card key={p.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge variant="secondary" className={`text-[10px] ${p.color}`}>{p.name}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {p.models.map((m) => (
                    <div key={m.name} className="rounded border bg-muted/30 px-3 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">{m.name}</span>
                        <span className="text-[10px] text-muted-foreground">{m.context}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{m.strength}</span>
                        <span className="text-[10px] font-mono text-primary">{m.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollReveal>

      {/* 상황별 추천 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">상황별 모델 선택 가이드</h3>
        <div className="space-y-2 max-w-2xl">
          {recommendations.map((r) => (
            <div key={r.situation} className="flex items-start gap-3 text-xs rounded-lg border bg-card px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm mb-0.5">{r.situation}</div>
                <span className="text-muted-foreground">{r.models}</span>
              </div>
              <Badge variant="outline" className="text-[10px] shrink-0">{r.reason}</Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">트렌드:</strong> AI 모델 비용이 급격히 하락 중입니다. 작년 $500/월이던 서비스가 올해 $50로 가능해졌습니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
