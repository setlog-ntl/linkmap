'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Flag } from 'lucide-react';

const conceptSteps = [
  { emoji: '🚀', label: '기능 개발 완료', desc: '새 결제 UI를 만들었습니다' },
  { emoji: '🚩', label: '플래그로 감싸기', desc: 'if (flag.newPaymentUI) 조건 추가' },
  { emoji: '📊', label: '10% 롤아웃', desc: '사용자 10%에게만 먼저 공개' },
  { emoji: '✅', label: '문제 없으면 100%', desc: '에러율 정상 → 전체 공개' },
];

const useCases = [
  {
    name: '점진적 롤아웃',
    emoji: '📈',
    desc: '새 기능을 한 번에 전체 공개하지 않고, 10% → 30% → 50% → 100%로 점진적으로 확대합니다. 문제가 발생하면 즉시 0%로 롤백할 수 있습니다.',
    example: '새 결제 UI를 10% 사용자에게 먼저 테스트',
    risk: '낮음',
    riskColor: 'text-green-500',
  },
  {
    name: 'A/B 테스트',
    emoji: '🔬',
    desc: '사용자를 A/B 그룹으로 나누어 다른 버전을 보여주고 어떤 버전이 더 좋은 성과를 내는지 데이터로 비교합니다.',
    example: '버튼 색상 A(파란색) vs B(초록색) — 클릭률 비교',
    risk: '없음',
    riskColor: 'text-green-500',
  },
  {
    name: '킬 스위치',
    emoji: '🔴',
    desc: '특정 기능에 심각한 버그가 발생했을 때, 재배포 없이 대시보드에서 즉시 기능을 끌 수 있습니다.',
    example: '결제 시스템 에러 발생 → 즉시 이전 결제 UI로 전환',
    risk: '제거',
    riskColor: 'text-green-500',
  },
  {
    name: '베타 테스트',
    emoji: '🧪',
    desc: '특정 사용자 그룹(VIP, 내부 팀, 베타 신청자)에게만 새 기능을 공개하여 피드백을 수집합니다.',
    example: '프리미엄 사용자에게만 AI 추천 기능 공개',
    risk: '최소',
    riskColor: 'text-green-500',
  },
];

const toolComparison = [
  { label: '가격', launchDarkly: '14일 무료 → 유료', vercel: 'Pro 포함', custom: '무료 (직접 구현)' },
  { label: 'SDK', launchDarkly: 'JS, React, Node 등 25+', vercel: 'Next.js 전용', custom: '직접 구현' },
  { label: '타겟팅', launchDarkly: '매우 세밀', vercel: 'Edge 미들웨어', custom: '기본적' },
  { label: '대시보드', launchDarkly: '전용 대시보드', vercel: 'Vercel 통합', custom: '없음 (DB 직접)' },
  { label: '설정 난이도', launchDarkly: '중간', vercel: '쉬움', custom: '높음' },
  { label: '추천 상황', launchDarkly: '대규모 팀·서비스', vercel: 'Next.js + Vercel', custom: '학습·소규모' },
];

const implementationApproach = [
  {
    level: '입문',
    title: '환경변수 플래그',
    desc: '.env에 NEXT_PUBLIC_NEW_FEATURE=true를 추가하고 코드에서 분기합니다. 가장 간단하지만 변경 시 재배포가 필요합니다.',
    pros: ['설정 초간단', '외부 의존성 없음'],
    cons: ['변경 시 재배포 필요', '사용자별 타겟팅 불가'],
  },
  {
    level: '중급',
    title: 'DB 기반 플래그',
    desc: '플래그 값을 DB에 저장하고 API로 읽어옵니다. 재배포 없이 변경 가능하지만 직접 구현해야 합니다.',
    pros: ['재배포 없이 변경', '커스텀 로직 자유'],
    cons: ['직접 구현 필요', 'API 호출 지연'],
  },
  {
    level: '고급',
    title: '전용 서비스 (LaunchDarkly / Vercel)',
    desc: '전문 피처 플래그 서비스를 사용합니다. 세밀한 타겟팅, 실시간 전환, A/B 테스트가 모두 가능합니다.',
    pros: ['세밀한 타겟팅', '실시간 전환', 'A/B 테스트 내장'],
    cons: ['비용 발생 (또는 Vercel Pro 필요)', '학습 곡선'],
  },
];

export function FeatureFlagsContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Flag className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">피처 플래그</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          코드를 배포하되, 기능의 ON/OFF를 원격으로 제어합니다.
          점진적 롤아웃과 A/B 테스트로 안전한 배포와 데이터 기반 의사결정을 가능하게 합니다.
        </p>
      </ScrollReveal>

      {/* 피처 플래그 개념 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">피처 플래그란?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            피처 플래그(Feature Flag)는 코드 안에 &quot;스위치&quot;를 넣어두고,
            서버에서 원격으로 기능을 켜고 끄는 기술입니다. 재배포 없이 기능을 제어할 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-8">
            <div className="rounded-xl border bg-card shadow-sm p-6">
              <div className="flex items-center justify-between gap-2">
                {conceptSteps.map((step, i) => (
                  <div key={step.label} className="flex items-center">
                    <div className="flex flex-col items-center text-center gap-1.5 flex-1 min-w-[70px]">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-muted flex items-center justify-center text-2xl sm:text-3xl">
                        {step.emoji}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold">{step.label}</div>
                      <div className="text-[10px] text-muted-foreground">{step.desc}</div>
                    </div>
                    {i < conceptSteps.length - 1 && (
                      <div className="shrink-0 mx-1">
                        <svg className="w-8 h-5 sm:w-12 sm:h-5 text-primary" viewBox="0 0 48 20" fill="none">
                          <path d="M0 10h40m0 0-8-5m8 5-8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-5">
                <div className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-1 rounded-full inline-block">
                  문제 발생 시 대시보드에서 즉시 OFF — 재배포 불필요!
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-2xl rounded-xl border bg-card p-5 mb-6">
            <div className="text-xs text-muted-foreground leading-relaxed">
              💡 <strong className="text-foreground">비유:</strong> 피처 플래그는 집의 &quot;조명 스위치&quot;와 같습니다.
              전기 공사(배포)는 이미 끝났지만, 스위치(플래그)를 올려야 불(기능)이 켜집니다.
              문제가 있으면 스위치만 내리면 됩니다.
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 활용 사례 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">활용 사례</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            피처 플래그는 단순한 ON/OFF를 넘어 다양한 상황에서 활용됩니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mb-8">
          {useCases.map((uc, idx) => (
            <ScrollReveal key={uc.name} delay={idx * 0.08}>
              <div className="rounded-xl border bg-card shadow-sm p-5 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{uc.emoji}</span>
                  <span className="font-bold text-sm">{uc.name}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{uc.desc}</p>
                <div className="mt-auto space-y-2 pt-3 border-t">
                  <div className="text-[10px]">
                    <span className="text-muted-foreground">예시: </span>
                    <span className="font-medium">{uc.example}</span>
                  </div>
                  <div className="text-[10px]">
                    <span className="text-muted-foreground">배포 위험: </span>
                    <span className={`font-semibold ${uc.riskColor}`}>{uc.risk}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 도구 비교 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-4">도구 비교</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl overflow-x-auto mb-8">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">항목</th>
                  <th className="text-left py-2 px-3 font-semibold">LaunchDarkly</th>
                  <th className="text-left py-2 px-3 font-semibold">Vercel Flags</th>
                  <th className="text-left py-2 px-3 font-semibold">직접 구현</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {toolComparison.map((row) => (
                  <tr key={row.label} className="border-b">
                    <td className="py-2 px-3 font-medium text-foreground">{row.label}</td>
                    <td className="py-2 px-3">{row.launchDarkly}</td>
                    <td className="py-2 px-3">{row.vercel}</td>
                    <td className="py-2 px-3">{row.custom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* 구현 접근법 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">단계별 구현 접근법</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            프로젝트 규모에 맞는 수준부터 시작하세요.
          </p>
        </ScrollReveal>

        <div className="space-y-4 max-w-3xl mb-8">
          {implementationApproach.map((approach, idx) => (
            <ScrollReveal key={approach.level} delay={idx * 0.08}>
              <div className="rounded-xl border bg-card shadow-sm p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-[9px]">{approach.level}</Badge>
                  <span className="font-bold text-sm">{approach.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{approach.desc}</p>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div>
                    <div className="text-[10px] font-semibold text-green-600 dark:text-green-400 mb-1">장점</div>
                    <div className="space-y-1">
                      {approach.pros.map((pro) => (
                        <div key={pro} className="text-[10px] text-muted-foreground flex items-start gap-1">
                          <span className="text-green-500 shrink-0">+</span>
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-red-500 mb-1">단점</div>
                    <div className="space-y-1">
                      {approach.cons.map((con) => (
                        <div key={con} className="text-[10px] text-muted-foreground flex items-start gap-1">
                          <span className="text-red-400 shrink-0">-</span>
                          <span>{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.25}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">결론:</strong> 처음에는{' '}
              <strong className="text-foreground">환경변수 플래그</strong>로 시작하세요.
              팀이 커지고 A/B 테스트가 필요해지면 Vercel Feature Flags(Next.js 사용 시) 또는
              LaunchDarkly를 도입하면 됩니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
