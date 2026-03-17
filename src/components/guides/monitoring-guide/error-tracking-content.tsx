'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const sentrySetupSteps = [
  { step: 1, title: 'Sentry 프로젝트 생성', desc: 'sentry.io에서 무료 계정 생성 후 Next.js 프로젝트를 선택합니다.' },
  { step: 2, title: 'SDK 설치', desc: 'npx @sentry/wizard@latest -i nextjs 명령어로 자동 설정합니다. sentry.client.config.ts, sentry.server.config.ts 파일이 생성됩니다.' },
  { step: 3, title: 'DSN 환경변수 설정', desc: 'Sentry 대시보드에서 DSN 값을 복사하여 SENTRY_DSN 환경변수에 설정합니다. .env.local에 절대 커밋하지 마세요.' },
  { step: 4, title: '에러 테스트', desc: '의도적으로 throw new Error("Sentry test")를 실행하여 Sentry 대시보드에 에러가 수집되는지 확인합니다.' },
];

const errorGroupingConcept = [
  {
    name: '이슈 (Issue)',
    desc: '같은 원인의 에러를 하나로 묶은 그룹입니다. 10명이 같은 버그를 만나면 1개의 이슈 + 10개의 이벤트로 기록됩니다.',
    emoji: '📦',
  },
  {
    name: '이벤트 (Event)',
    desc: '에러가 실제로 발생한 각각의 건입니다. 사용자 환경, 브라우저, OS 등 상세 정보가 포함됩니다.',
    emoji: '📌',
  },
  {
    name: '브레드크럼 (Breadcrumb)',
    desc: '에러 발생 직전 사용자의 행동 기록입니다. "홈 → 결제 페이지 → 쿠폰 입력 → 에러" 같은 경로를 추적합니다.',
    emoji: '🍞',
  },
];

const alertSettings = [
  { type: '신규 이슈', desc: '처음 보는 에러가 발생했을 때', channel: 'Slack / Email', priority: '높음', color: 'text-red-500' },
  { type: '이슈 재발', desc: '해결 처리한 에러가 다시 발생했을 때', channel: 'Slack', priority: '높음', color: 'text-red-500' },
  { type: '에러 급증', desc: '특정 이슈의 이벤트 수가 급격히 증가할 때', channel: 'Slack / PagerDuty', priority: '중간', color: 'text-yellow-500' },
  { type: '성능 저하', desc: '페이지 로딩이 기준치보다 느려졌을 때', channel: 'Email', priority: '낮음', color: 'text-blue-500' },
];

const logRocketFeatures = [
  {
    name: '세션 리플레이',
    desc: '사용자의 화면을 비디오처럼 녹화하여 에러 발생 전후의 행동을 확인합니다. "사용자가 뭘 했는데 에러가 났지?" 질문에 답할 수 있습니다.',
    emoji: '🎬',
  },
  {
    name: '상태 추적',
    desc: 'Redux, Zustand 등 상태 관리 라이브러리의 상태 변화를 시간순으로 기록합니다. 어떤 액션이 문제를 일으켰는지 추적 가능합니다.',
    emoji: '🔄',
  },
  {
    name: '네트워크 탭',
    desc: 'API 요청/응답을 기록하여 네트워크 레벨의 문제를 파악합니다. 어떤 API가 실패했는지, 응답이 느렸는지 확인합니다.',
    emoji: '🌐',
  },
];

export function ErrorTrackingContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">에러 추적</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          프로덕션에서 발생하는 에러를 자동으로 수집하고, 빠르게 원인을 파악하여 수정하는 방법을 알아봅니다.
          Sentry 설치부터 알림 설정, LogRocket 세션 리플레이까지 다룹니다.
        </p>
      </ScrollReveal>

      {/* Sentry 설치/설정 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Sentry 설치하기</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Sentry는 가장 널리 사용되는 에러 추적 도구입니다.
            Next.js 공식 지원으로 설정이 매우 간편합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-3 max-w-2xl mb-8">
            {sentrySetupSteps.map((s) => (
              <div key={s.step} className="rounded-lg border bg-card shadow-sm p-4 flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {s.step}
                </span>
                <div>
                  <div className="font-bold text-sm mb-1">{s.title}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl mb-8">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">팁:</strong> Sentry wizard가 자동으로 설정 파일을
              생성하므로 직접 config를 작성할 필요가 거의 없습니다.
              <code className="text-[10px] bg-muted px-1 rounded font-mono ml-1">npx @sentry/wizard@latest -i nextjs</code> 한 줄이면 됩니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 에러 그룹핑 개념 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">에러 그룹핑 이해하기</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Sentry는 같은 원인의 에러를 자동으로 하나의 이슈(Issue)로 묶어줍니다.
            핵심 개념 3가지를 이해하면 대시보드를 효과적으로 활용할 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mb-6">
            {errorGroupingConcept.map((c) => (
              <div key={c.name} className="rounded-xl border bg-card shadow-sm p-5">
                <div className="text-2xl mb-2">{c.emoji}</div>
                <div className="font-bold text-sm mb-2">{c.name}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-2xl rounded-xl border bg-card p-5 mb-6">
            <div className="text-xs text-muted-foreground leading-relaxed">
              🏠 <strong className="text-foreground">비유:</strong> 아파트 관리실에 민원이 들어올 때,
              &quot;5층 누수&quot;라는 <strong className="text-foreground">이슈</strong> 하나에
              501호, 502호, 503호의 개별 신고가 <strong className="text-foreground">이벤트</strong>로 쌓이는 것과 같습니다.
              각 이벤트의 <strong className="text-foreground">브레드크럼</strong>은 &quot;비가 온 다음 날 → 천장에서 물방울 → 벽지 얼룩&quot; 같은 경위입니다.
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 알림 설정 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">알림 설정</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            에러를 수집만 하고 안 보면 의미가 없습니다. 상황별 알림을 설정하여 중요한 에러를 놓치지 마세요.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl overflow-x-auto mb-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">알림 유형</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">설명</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">채널</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">우선순위</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {alertSettings.map((a) => (
                  <tr key={a.type} className="border-b">
                    <td className="py-2 px-3 font-medium text-foreground">{a.type}</td>
                    <td className="py-2 px-3">{a.desc}</td>
                    <td className="py-2 px-3">
                      <code className="text-[10px] bg-muted px-1 rounded font-mono">{a.channel}</code>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`font-semibold ${a.color}`}>{a.priority}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">팁:</strong> 처음에는 &quot;신규 이슈&quot;와 &quot;이슈 재발&quot;
              알림만 Slack으로 설정하세요. 너무 많은 알림은 오히려 무시하게 됩니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* LogRocket 세션 리플레이 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">LogRocket 세션 리플레이</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Sentry가 &quot;무엇이 에러인지&quot;를 알려준다면,
            LogRocket은 &quot;사용자가 에러를 만나기까지 무엇을 했는지&quot;를 보여줍니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mb-6">
            {logRocketFeatures.map((f) => (
              <div key={f.name} className="rounded-xl border bg-card shadow-sm p-5">
                <div className="text-2xl mb-2">{f.emoji}</div>
                <div className="font-bold text-sm mb-2">{f.name}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-2xl rounded-lg border bg-card p-4 mb-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              🎬 <strong className="text-foreground">Sentry + LogRocket 조합:</strong>{' '}
              Sentry에서 에러를 발견하면, 해당 세션의 LogRocket 리플레이 링크를 바로 열어
              사용자가 에러를 만나기까지의 전체 과정을 비디오로 확인할 수 있습니다.
              이 조합이 가장 강력한 디버깅 워크플로우입니다.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">주의:</strong> LogRocket은 사용자 화면을 녹화하므로
              개인정보 보호에 주의해야 합니다. 비밀번호 입력, 신용카드 번호 등 민감한 필드는
              자동으로 마스킹되지만, 프라이버시 정책을 반드시 검토하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
