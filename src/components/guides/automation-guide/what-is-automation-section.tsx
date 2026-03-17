'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';

const manualVsAuto = [
  {
    type: '수동 처리 (사람이 직접)',
    emoji: '🧑‍💻',
    steps: ['회원가입 알림 확인', '이메일 앱 열기', '환영 메일 직접 작성', '발송 버튼 클릭', '다음 가입자까지 대기...'],
    risk: '높음',
    riskColor: 'text-red-500',
    desc: '가입자가 생길 때마다 사람이 직접 이메일을 보냅니다. 새벽에 가입하면? 다음 날까지 기다려야 합니다.',
    tagColor: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
  },
  {
    type: '자동 처리 (시스템이 알아서)',
    emoji: '🤖',
    steps: ['회원가입 이벤트 발생', '(자동) 웹훅 트리거', '(자동) 환영 이메일 발송', '(자동) Slack 팀 알림', '끝! 24시간 무중단'],
    risk: '낮음',
    riskColor: 'text-green-500',
    desc: '가입 이벤트가 발생하면 즉시 환영 이메일이 발송됩니다. 새벽이든 주말이든 3초 안에 처리됩니다.',
    tagColor: 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
  },
];

const benefits = [
  {
    title: '시간 절약',
    emoji: '⏱️',
    desc: '반복 작업을 자동화하면 하루 2~3시간을 아낄 수 있습니다. 그 시간에 더 중요한 일을 하세요.',
    stat: '하루 2~3시간 절약',
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    title: '실수 방지',
    emoji: '🛡️',
    desc: '사람은 피곤하면 실수하지만, 자동화된 시스템은 항상 같은 품질로 동작합니다.',
    stat: '휴먼 에러 제거',
    color: 'border-green-200 dark:border-green-800',
  },
  {
    title: '즉시 반응',
    emoji: '⚡',
    desc: '이벤트 발생 후 수 초 내에 처리됩니다. 사용자 경험이 크게 향상됩니다.',
    stat: '응답 시간 < 3초',
    color: 'border-purple-200 dark:border-purple-800',
  },
];

export function WhatIsAutomationSection() {
  return (
    <section id="what-is-automation" className="scroll-mt-24 py-12 md:py-16">
      {/* 자동화란 무엇인가? */}
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">자동화란 무엇인가?</h2>
        <p className="text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          <strong className="text-foreground">자동화(Automation)</strong>란 사람이 반복하던 작업을
          시스템이 대신 처리하도록 만드는 것입니다. &quot;이런 일이 생기면 이렇게 해줘&quot;라는 규칙을
          한 번 설정하면, 이후로는 자동으로 동작합니다.
        </p>
        <div className="max-w-2xl mb-10">
          <div className="rounded-lg border bg-card shadow-sm p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              🏭 <strong className="text-foreground">실생활 비유:</strong> 세탁기에 빨래를 넣고 버튼만 누르면
              세탁 → 헹굼 → 탈수가 자동으로 진행됩니다.
              개발에서의 자동화도 마찬가지입니다 — &quot;이벤트가 발생하면 정해진 순서대로 처리&quot;합니다.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 수동 vs 자동 비교: 회원가입 시 환영 이메일 예시 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-2">예시: 회원가입 시 환영 이메일 보내기</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          같은 작업도 수동과 자동의 차이가 이렇게 큽니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-3xl">
          {manualVsAuto.map((item) => (
            <div key={item.type} className={`rounded-xl border p-5 ${item.tagColor}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <div className="font-bold text-sm">{item.type}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
              <div className="space-y-1.5">
                {item.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-4 h-4 rounded-full bg-background/50 text-[9px] flex items-center justify-center shrink-0 font-bold">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-current/10 text-xs">
                <span className="text-muted-foreground">실수 위험: </span>
                <span className={`font-semibold ${item.riskColor}`}>{item.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 자동화의 장점 3가지 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">자동화의 장점 3가지</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
          {benefits.map((b) => (
            <div key={b.title} className={`rounded-xl border bg-card shadow-sm p-5 ${b.color}`}>
              <div className="text-2xl mb-2">{b.emoji}</div>
              <div className="font-bold text-sm mb-1">{b.title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{b.desc}</p>
              <div className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full inline-block">
                {b.stat}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
