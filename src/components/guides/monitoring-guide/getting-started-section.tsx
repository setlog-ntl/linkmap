'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const freeCombo = [
  { name: 'Sentry', role: '에러 추적', free: '월 5,000 이벤트', emoji: '🐛' },
  { name: 'Google Analytics', role: '웹 분석', free: '완전 무료', emoji: '📊' },
  { name: 'Vercel Analytics', role: '웹 성능', free: 'Hobby 무료', emoji: '⚡' },
];

const adoptionSteps = [
  {
    step: 1,
    title: '1단계: 에러 추적부터',
    when: '서비스 배포 직후',
    desc: 'Sentry를 먼저 설치하세요. 프로덕션에서 발생하는 에러를 자동으로 잡아줍니다. npm install @sentry/nextjs 한 줄이면 시작됩니다.',
    tools: ['Sentry'],
    priority: '필수',
    priorityColor: 'text-red-500',
  },
  {
    step: 2,
    title: '2단계: 웹 분석 추가',
    when: '사용자 유입 시작 시',
    desc: 'GA4를 추가하여 사용자가 어디서 오는지, 어떤 페이지를 많이 보는지 파악합니다. 데이터 기반 의사결정의 시작입니다.',
    tools: ['Google Analytics (GA4)'],
    priority: '권장',
    priorityColor: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    step: 3,
    title: '3단계: 피처 플래그 도입',
    when: '팀이 커지거나 A/B 테스트 필요 시',
    desc: '새 기능을 전체 공개하기 전에 10%의 사용자에게만 먼저 공개하고 반응을 확인합니다. 위험한 배포를 안전하게 만들어줍니다.',
    tools: ['LaunchDarkly', 'Vercel Feature Flags'],
    priority: '선택',
    priorityColor: 'text-blue-500',
  },
];

const decisionGuide = [
  {
    question: '사이드 프로젝트를 처음 배포했나요?',
    answer: 'Sentry만 설치하세요',
    emoji: '🐛',
    reason: '무료 플랜으로 에러를 자동 감지합니다. 10분이면 설치 완료.',
  },
  {
    question: '사용자가 늘어나기 시작했나요?',
    answer: 'Sentry + GA4 조합',
    emoji: '📊',
    reason: '에러 추적 + 사용자 행동 분석으로 데이터 기반 개선이 가능합니다.',
  },
  {
    question: '팀으로 서비스를 운영하나요?',
    answer: '3가지 모두 도입',
    emoji: '🚩',
    reason: '에러 추적 + 분석 + 피처 플래그로 안정적이고 과학적인 운영이 가능합니다.',
  },
];

export function GettingStartedSection() {
  return (
    <section id="getting-started" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">시작하기</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          처음부터 모든 도구를 도입할 필요는 없습니다.
          서비스 성장 단계에 맞춰 점진적으로 추가하세요.
        </p>
      </ScrollReveal>

      {/* 무료 조합 추천 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">무료로 시작하는 추천 조합</h3>
        <div className="flex items-center gap-0 mb-8 max-w-2xl overflow-x-auto pb-2">
          {freeCombo.map((tool, i) => (
            <div key={tool.name} className="flex items-center">
              <div className="rounded-xl border bg-card shadow-sm p-4 w-44 text-center">
                <div className="text-2xl mb-1">{tool.emoji}</div>
                <div className="text-xs font-bold">{tool.name}</div>
                <div className="text-[10px] text-muted-foreground">{tool.role}</div>
                <div className="text-[10px] text-green-600 dark:text-green-400 mt-1 font-medium">{tool.free}</div>
              </div>
              {i < freeCombo.length - 1 && (
                <div className="px-1 shrink-0">
                  <svg className="w-5 h-4 text-muted-foreground/40" viewBox="0 0 20 16" fill="none">
                    <path d="M0 8h14m0 0-5-4m5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 단계별 도입 가이드 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">단계별 도입 가이드</h3>
        <div className="space-y-4 max-w-3xl mb-10">
          {adoptionSteps.map((s) => (
            <div key={s.step} className="rounded-xl border bg-card shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {s.step}
                </span>
                <span className="font-bold text-sm">{s.title}</span>
                <Badge variant="secondary" className="text-[9px]">{s.when}</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{s.desc}</p>
              <div className="flex items-center gap-3 pt-3 border-t">
                <div className="flex gap-1">
                  {s.tools.map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-mono">{t}</span>
                  ))}
                </div>
                <div className="text-[10px]">
                  <span className="text-muted-foreground">우선순위: </span>
                  <span className={`font-semibold ${s.priorityColor}`}>{s.priority}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 나에게 맞는 조합은? */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">나에게 맞는 조합은?</h3>
        <div className="max-w-2xl space-y-3 mb-6">
          {decisionGuide.map((item) => (
            <div key={item.question} className="rounded-lg border bg-card shadow-sm p-4">
              <div className="text-sm font-medium mb-2">Q. {item.question}</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm font-bold text-primary">{item.answer}</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.reason}</p>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">결론:</strong> 처음 시작한다면 <strong className="text-foreground">Sentry 하나만</strong> 설치하세요.
            무료이고 10분이면 끝납니다. 나머지는 서비스가 성장하면서 하나씩 추가하면 됩니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
