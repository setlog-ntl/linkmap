'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent } from '@/components/ui/card';
import { Coins } from 'lucide-react';
import Link from 'next/link';
import {
  GuideTLDR,
  AnalogyBox,
  GuideCallout,
  CommonMistakes,
} from '@/components/guides/common';

const tokenFacts = [
  { label: '토큰이란?', value: '단어 조각', desc: 'AI가 글을 처리하는 최소 단위. 영어는 보통 1단어 ≈ 1~2토큰, 한국어는 글자당 토큰을 더 많이 써요(영어의 2~3배).' },
  { label: '입력 토큰', value: '내가 보낸 글', desc: '프롬프트 + 지금까지의 대화 내용 전부. 대화가 길수록 매 요청마다 비용이 커져요.' },
  { label: '출력 토큰', value: 'AI가 쓴 답', desc: '보통 입력보다 5~10배 비싸요. 답을 짧게 시키는 것만으로도 비용이 크게 줄어요.' },
];

const saveTactics = [
  {
    title: '① 모델 다운시프트',
    desc: '쉬운 작업(분류·요약·간단한 답변)은 저렴한 모델(Haiku·Flash·nano)로, 어려운 추론만 고성능 모델로. 작업마다 모델을 바꾸는 것만으로 비용이 절반 이하로 줄 수 있어요.',
  },
  {
    title: '② max_tokens 상한 설정',
    desc: '출력 길이를 제한하면 "답이 끝없이 길어지는" 비용 폭탄을 막아요. 챗봇은 1024, 긴 문서는 4096 정도로 시작하세요.',
  },
  {
    title: '③ 프롬프트 캐싱',
    desc: '매번 똑같이 들어가는 긴 지시문·문서는 캐싱하면 그 부분 비용이 최대 90% 저렴해져요. 시스템 프롬프트 같은 고정 내용을 앞쪽에 두는 게 핵심.',
  },
  {
    title: '④ 컨텍스트(대화 길이) 관리',
    desc: '대화가 길어지면 매 요청에 과거 내용이 전부 다시 들어가 비용이 누적돼요. 필요 없는 이전 내용은 잘라내거나 요약해서 넘기세요.',
  },
  {
    title: '⑤ 배치 처리',
    desc: '급하지 않은 대량 작업은 배치 API로 처리하면 보통 50% 할인돼요(여러 LLM 제공사 공통).',
  },
];

const mistakes = [
  {
    mistake: 'max_tokens를 설정하지 않아 답이 끝없이 길어져 요금이 폭증했어요.',
    fix: '모든 호출에 max_tokens 상한을 두세요. 길이를 제한하면 비용이 예측 가능해져요.',
    code: "// 예: 챗봇 응답 길이 제한\nmax_tokens: 1024",
  },
  {
    mistake: '모든 작업에 가장 비싼 모델을 써서 단순 분류에도 큰 비용이 나갔어요.',
    fix: '작업 난이도에 맞춰 모델을 고르세요. 분류·요약은 저가 모델로 충분한 경우가 많아요.',
  },
  {
    mistake: '대화가 길어지는데 과거 내용을 계속 통째로 보내 비용이 눈덩이처럼 커졌어요.',
    fix: '오래된 대화는 요약하거나 잘라내고, 꼭 필요한 맥락만 전달하세요.',
  },
  {
    mistake: '사용량 알림·한도를 안 걸어두고 방치해 청구서를 보고 놀랐어요.',
    fix: '제공사 콘솔에서 월 사용 한도(usage limit)와 알림을 미리 설정하세요.',
  },
];

export function CostSavingContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Coins className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">AI 비용 관리 · 토큰 절약</h1>
        </div>
        <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          AI API는 쓴 만큼만 돈을 내요. 토큰과 요금 구조를 이해하고, 비용 폭탄을 막는
          5가지 방법을 초보자 눈높이로 정리했습니다.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <GuideTLDR
          level="입문"
          readingTime="6분"
          points={[
            'AI 요금은 "토큰"(단어 조각) 개수로 매겨져요 — 출력 토큰이 입력보다 훨씬 비싸요.',
            '가장 큰 절약은 "작업에 맞는 저렴한 모델 고르기"와 "max_tokens 상한 두기"예요.',
            '대화가 길어질수록 비용이 누적돼요 — 오래된 맥락은 잘라내거나 요약하세요.',
          ]}
          youCanDo="예상치 못한 요금 폭탄을 막고, 같은 작업을 더 싸게 처리할 수 있어요."
        />
      </ScrollReveal>

      {/* 토큰·요금 구조 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-4">토큰과 요금의 구조</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <AnalogyBox
            concept="토큰 요금"
            analogy="택시 미터기"
            className="mb-5 max-w-2xl"
          >
            <span className="text-muted-foreground">
              택시가 거리만큼 요금을 매기듯, AI는 주고받은 글의 양(토큰)만큼 요금을 매겨요.
              멀리 갈수록(=글이 길수록) 비싸지고, 돌아오는 길(=AI의 답)이 더 비싼 미터기예요.
            </span>
          </AnalogyBox>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid gap-3 sm:grid-cols-3 max-w-3xl">
            {tokenFacts.map((f) => (
              <Card key={f.label} className="bg-card shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="font-semibold text-sm mb-1">{f.value}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <GuideCallout variant="warning" className="mt-5 max-w-2xl">
            <strong>한국어 주의:</strong> 한국어는 영어보다 토큰을 2~3배 더 써요. 같은 내용이라도
            한국어로 길게 주고받으면 비용이 더 빨리 올라갑니다.
          </GuideCallout>
        </ScrollReveal>
      </section>

      {/* 비용 절약 5가지 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-4">비용을 줄이는 5가지 방법</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="space-y-3 max-w-2xl">
            {saveTactics.map((t) => (
              <div key={t.title} className="rounded-lg border bg-card px-4 py-3">
                <div className="font-semibold text-sm mb-1">{t.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 흔한 실수 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <div className="max-w-2xl">
            <CommonMistakes items={mistakes} title="비용 관련 흔한 실수" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">다음 단계:</strong>{' '}
              어떤 모델이 가성비가 좋은지 비교하려면{' '}
              <Link href="/guides/ai-basics/models" prefetch={false} className="text-primary hover:underline">AI 모델 비교</Link>를,
              API 연동 실전은{' '}
              <Link href="/guides/ai-tools/ai-api" prefetch={false} className="text-primary hover:underline">AI API 연동 기초</Link>를 참고하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
