'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, KeyRound, UserX } from 'lucide-react';

const securityProblems = [
  {
    icon: KeyRound,
    title: '시크릿 노출',
    description: 'AI가 생성한 코드에 API 키나 비밀번호를 직접 넣어두는 경우가 많습니다. 이 코드를 GitHub에 올리면 전 세계에 공개됩니다.',
    example: 'GitHub에 API 키가 포함된 코드 push → 봇이 자동 스캔 → 수 분 내 악용 시작',
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
  },
  {
    icon: ShieldAlert,
    title: '입력 검증 누락',
    description: 'AI는 기능 구현에 집중하고 입력값 검증을 생략하는 경향이 있습니다. 악의적인 사용자가 비정상 데이터를 보내면 시스템이 뚫릴 수 있습니다.',
    example: '사용자 입력을 그대로 DB 쿼리에 사용 → SQL Injection으로 전체 데이터 유출',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
  },
  {
    icon: UserX,
    title: '인증 우회',
    description: 'AI 코드에서 인증 체크 로직을 빠뜨리거나, 조건문을 반대로 작성하는 실수가 발생합니다. 로그인하지 않은 사용자가 관리자 기능에 접근할 수 있습니다.',
    example: 'if (user) return error → if (!user) return error로 반전되어야 하는데 실수',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
  },
];

export function WhySecuritySection() {
  return (
    <section id="why-security" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">왜 보안이 중요한가?</h2>
        <p className="text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          AI가 생성한 코드는 <strong className="text-foreground">기능적으로는 잘 동작</strong>하지만,
          보안 관점에서는 취약점을 가지고 있는 경우가 많습니다.
          AI는 &quot;동작하는 코드&quot;를 만들지만 &quot;안전한 코드&quot;를 보장하지 않습니다.
        </p>
      </ScrollReveal>

      {/* AI 코드의 보안 문제점 3가지 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">AI 코드에서 자주 발생하는 보안 문제 3가지</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl">
          {securityProblems.map((problem) => (
            <Card key={problem.title} className={`${problem.bgColor} border`}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <problem.icon className={`h-5 w-5 ${problem.color}`} />
                  <CardTitle className="text-sm">{problem.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {problem.description}
                </p>
                <div className="rounded-lg bg-background/60 p-2 border">
                  <p className="text-[10px] text-muted-foreground">
                    <strong className="text-foreground">시나리오:</strong> {problem.example}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollReveal>

      {/* 실제 사고 사례 */}
      <ScrollReveal delay={0.15}>
        <div className="max-w-2xl mb-10">
          <h3 className="text-lg font-semibold mb-3">실제 사고 사례</h3>
          <div className="rounded-xl border bg-card shadow-sm p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">💸</span>
              <div>
                <div className="font-bold text-sm mb-2">GitHub에 AWS 키 커밋 → 하루 만에 수백만 원 과금</div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  개발자가 AWS API 키를 코드에 직접 넣고 GitHub에 push했습니다.
                  봇이 자동으로 공개 저장소를 스캔하여 키를 탈취했고,
                  수 분 만에 수십 개의 EC2 인스턴스가 생성되어 암호화폐 채굴에 사용되었습니다.
                  하루 만에 수백만 원의 요금이 청구되었습니다.
                </p>
                <div className="rounded-lg bg-muted/50 p-3 border">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">교훈:</strong> API 키는 절대 코드에 직접 넣지 않고,
                    환경변수(.env)로 관리합니다. .gitignore에 .env를 반드시 추가하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* AI 코드를 무조건 신뢰하면 안 되는 이유 */}
      <ScrollReveal delay={0.2}>
        <div className="max-w-2xl">
          <div className="rounded-xl border bg-card shadow-sm p-5">
            <h3 className="text-sm font-bold mb-2">AI 코드를 무조건 신뢰하면 안 되는 이유</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">1.</span>
                <span>AI는 <strong className="text-foreground">&quot;동작하는 코드&quot;</strong>를 우선시합니다. 보안은 부가 요구사항으로 취급됩니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">2.</span>
                <span>학습 데이터에 <strong className="text-foreground">오래된 보안 패턴</strong>이 포함되어 있을 수 있습니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">3.</span>
                <span>AI는 <strong className="text-foreground">프로젝트의 전체 맥락</strong>을 모릅니다. 인증 흐름, 권한 체계 등은 개발자가 직접 설계해야 합니다.</span>
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">결론:</strong> AI가 만든 코드는 &quot;초안&quot;입니다.
                보안 리뷰는 항상 사람이 직접 해야 합니다.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
