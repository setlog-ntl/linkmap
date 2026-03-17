'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const problems = [
  {
    emoji: '🙈',
    title: '사용자가 에러를 먼저 발견',
    desc: '모니터링 없이는 사용자가 "결제가 안 돼요"라고 문의할 때까지 문제를 모릅니다. 이미 이탈한 사용자는 문의조차 하지 않습니다.',
    impact: '이탈률 증가',
    impactColor: 'text-red-500',
    color: 'border-red-200 dark:border-red-800',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
  },
  {
    emoji: '🔍',
    title: '재현 불가능한 버그',
    desc: '"제 환경에서는 잘 되는데요?" — 사용자의 브라우저, OS, 네트워크 상황을 모르면 버그를 재현할 수 없어 수정도 어렵습니다.',
    impact: '디버깅 시간 폭증',
    impactColor: 'text-orange-500',
    color: 'border-orange-200 dark:border-orange-800',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
  },
  {
    emoji: '📊',
    title: '감으로 하는 의사결정',
    desc: '어떤 기능이 인기인지, 사용자가 어디서 이탈하는지 데이터 없이 추측만 하면 잘못된 방향으로 개발 시간을 낭비하게 됩니다.',
    impact: '개발 자원 낭비',
    impactColor: 'text-yellow-600 dark:text-yellow-400',
    color: 'border-yellow-200 dark:border-yellow-800',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
  },
];

const withVsWithout = [
  {
    type: '모니터링 없는 팀',
    emoji: '😰',
    items: [
      '사용자 문의로 에러 발견 (평균 2~3일 후)',
      '"로그 어디 있지?" 서버 접속해서 파일 뒤지기',
      '재현 실패 → 일단 무시 → 다시 발생',
      '배포 후 "잘 되겠지" 하고 퇴근',
    ],
    tagColor: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
  },
  {
    type: '모니터링 있는 팀',
    emoji: '😎',
    items: [
      'Sentry 알림으로 에러 즉시 감지 (5분 내)',
      '스택 트레이스 + 사용자 환경 자동 수집',
      'LogRocket 세션 리플레이로 재현 확인',
      '배포 후 대시보드에서 에러율 실시간 확인',
    ],
    tagColor: 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
  },
];

export function WhyMonitoringSection() {
  return (
    <section id="why-monitoring" className="scroll-mt-24 py-12 md:py-16">
      {/* 모니터링이 필요한 이유 */}
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">왜 모니터링이 필요한가?</h2>
        <p className="text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          <strong className="text-foreground">배포는 끝이 아니라 시작입니다.</strong>{' '}
          서비스가 살아 있는 한, 예상치 못한 에러가 발생하고 사용자 행동은 계속 변합니다.
          모니터링은 이 블랙박스에 눈을 달아주는 작업입니다.
        </p>
        <div className="max-w-2xl mb-10">
          <div className="rounded-lg border bg-card shadow-sm p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              🏥 <strong className="text-foreground">실생활 비유:</strong> 환자(서비스)의 심박수, 혈압, 체온을
              실시간으로 체크하는 모니터가 없다면 의사(개발자)는 환자가 위험해질 때까지 모릅니다.
              모니터링은 서비스의 생체 신호를 측정하는 도구입니다.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 문제 3가지 카드 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">모니터링 없이 운영하면 생기는 문제</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl">
          {problems.map((p) => (
            <div key={p.title} className={`rounded-xl border p-5 ${p.bgColor} ${p.color}`}>
              <div className="text-2xl mb-3">{p.emoji}</div>
              <div className="font-bold text-sm mb-2">{p.title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.desc}</p>
              <div className="pt-3 border-t border-current/10 text-xs">
                <span className="text-muted-foreground">영향: </span>
                <span className={`font-semibold ${p.impactColor}`}>{p.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 비교: 모니터링 있는 팀 vs 없는 팀 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">모니터링 있는 팀 vs 없는 팀</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-3xl">
          {withVsWithout.map((item) => (
            <div key={item.type} className={`rounded-xl border p-5 ${item.tagColor}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{item.emoji}</span>
                <div className="font-bold text-sm">{item.type}</div>
              </div>
              <div className="space-y-2">
                {item.items.map((text, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="w-4 h-4 rounded-full bg-background/50 text-[9px] flex items-center justify-center shrink-0 font-bold">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">핵심:</strong> 모니터링의 목적은
            &quot;사용자보다 먼저 문제를 발견하고, 데이터로 올바른 결정을 내리는 것&quot;입니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
