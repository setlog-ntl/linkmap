'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const concepts = [
  {
    title: 'LLM이란?',
    emoji: '🧠',
    description: '수십억 페이지의 텍스트를 읽은 "초고속 독서가"와 같습니다. 읽은 모든 것의 패턴을 기억하고, 질문하면 그 패턴을 바탕으로 가장 적절한 다음 단어를 예측하며 답을 만들어냅니다.',
    analogy: '핸드폰 키보드의 자동완성이 다음 단어 하나를 추천하듯, LLM은 수백~수천 단어를 연속으로 예측하여 문장을 만듭니다.',
  },
  {
    title: '트랜스포머',
    emoji: '🔗',
    description: 'LLM의 핵심 기술입니다. 이전 모델은 소설을 한 글자씩 순서대로 읽었지만, 트랜스포머는 한 페이지 전체를 동시에 읽고 단어 간 관계를 파악합니다.',
    analogy: '"그 고양이가 매트 위에 앉았다. 그것은 편안해 보였다." — AI는 "그것"이 "고양이"를 가리킨다는 것을 문맥으로 이해합니다.',
  },
];

const tokenExamples = [
  { lang: '영어', example: '"hello" = 1 토큰', ratio: '1 토큰 ≈ 4글자' },
  { lang: '한국어', example: '"안녕하세요" = 3~5 토큰', ratio: '영어 대비 2~3배' },
];

const contextSizes = [
  { model: 'Claude Opus/Sonnet 4.6', size: '1M 토큰', analogy: '소설 약 5권', color: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300' },
  { model: 'GPT-5.4', size: '1M 토큰', analogy: '소설 약 5권', color: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300' },
  { model: 'Gemini 2.5 Pro', size: '1M 토큰', analogy: '소설 약 5권', color: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300' },
  { model: 'Llama 4 Scout', size: '10M 토큰', analogy: '백과사전 수준', color: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300' },
];

const temperatures = [
  { range: '0.0 ~ 0.3', label: '정확한 답변', use: '코드 생성, 사실 확인', emoji: '🎯' },
  { range: '0.3 ~ 0.7', label: '균형 잡힌 답변', use: '일반 대화, 설명', emoji: '⚖️' },
  { range: '0.7 ~ 1.0', label: '창의적 답변', use: '창작, 브레인스토밍', emoji: '🎨' },
];

export function HowAiWorksSection() {
  return (
    <section id="how-ai-works" className="scroll-mt-24 py-12 md:py-16">
      {/* 섹션 제목 */}
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">AI는 어떻게 작동할까?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          AI의 핵심 원리를 쉬운 비유로 이해합니다. 원리를 알면 AI를 더 잘 활용할 수 있습니다.
        </p>
      </ScrollReveal>

      {/* LLM + 트랜스포머 개념 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">핵심 개념</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-3xl">
          {concepts.map((c) => (
            <Card key={c.title}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="text-lg">{c.emoji}</span>
                  {c.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{c.description}</p>
                <div className="rounded border bg-muted/50 px-3 py-2">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">비유:</strong> {c.analogy}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollReveal>

      {/* 토큰 개념 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">토큰이란?</h3>
        <p className="text-xs text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          토큰은 AI가 텍스트를 처리하는 최소 단위입니다. 비용과 속도 모두 토큰 수에 비례하므로, 이 개념을 이해하면 AI 사용 비용을 예측할 수 있습니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mb-4">
          {tokenExamples.map((t) => (
            <div key={t.lang} className="rounded-xl border p-4 bg-card">
              <div className="text-xs font-semibold mb-1">{t.lang}</div>
              <div className="text-sm font-mono text-primary mb-1">{t.example}</div>
              <div className="text-[10px] text-muted-foreground">{t.ratio}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 max-w-xl mb-10">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>한국어 사용자 주의:</strong> 한국어는 영어 대비 2~3배 더 많은 토큰을 소비합니다. 동일한 내용의 프롬프트도 한국어로 작성하면 비용이 2~3배 높아질 수 있습니다.
          </p>
        </div>
      </ScrollReveal>

      {/* 컨텍스트 윈도우 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">컨텍스트 윈도우</h3>
        <p className="text-xs text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          AI가 한 번에 &quot;기억&quot;하고 처리할 수 있는 텍스트의 최대 양입니다. <strong className="text-foreground">책상 크기</strong>에 비유할 수 있습니다 — 책상이 클수록 더 많은 서류를 동시에 펼쳐놓고 참고할 수 있습니다.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mb-10">
          {contextSizes.map((c) => (
            <div key={c.model} className="rounded-xl border p-3 bg-card text-center">
              <Badge variant="secondary" className={`text-[10px] mb-2 ${c.color}`}>{c.size}</Badge>
              <div className="text-xs font-semibold mb-1">{c.model}</div>
              <div className="text-[10px] text-muted-foreground">{c.analogy}</div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Temperature */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">Temperature (온도)</h3>
        <p className="text-xs text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          AI에게 &quot;얼마나 창의적으로 답해줘&quot;를 조절하는 설정값입니다. <strong className="text-foreground">요리사의 자유도</strong>에 비유할 수 있습니다.
        </p>
        <div className="space-y-2 max-w-xl">
          {temperatures.map((t) => (
            <div key={t.range} className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
              <span className="text-lg shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold">{t.label}</span>
                  <Badge variant="outline" className="text-[10px]">{t.range}</Badge>
                </div>
                <span className="text-[10px] text-muted-foreground">{t.use}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border max-w-xl">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">팁:</strong> 대부분의 경우 Temperature 0.0~0.8 사이면 90%의 용도를 커버합니다. 코딩 작업에는 0.0~0.3이 적합합니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
