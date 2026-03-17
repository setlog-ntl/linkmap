'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Bot, Shield, Eye, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';

const reasons = [
  {
    icon: Shield,
    title: 'main 보호',
    desc: 'AI가 생성한 코드가 예상과 다를 수 있습니다. 별도 브랜치에서 먼저 확인하면 배포 코드가 안전합니다.',
  },
  {
    icon: Eye,
    title: '변경 범위 확인',
    desc: 'AI는 한 번에 많은 파일을 수정할 수 있습니다. PR로 변경 범위를 시각적으로 확인할 수 있습니다.',
  },
  {
    icon: RotateCcw,
    title: '쉬운 롤백',
    desc: 'AI 코드가 마음에 들지 않으면 브랜치를 버리면 됩니다. main은 전혀 영향받지 않습니다.',
  },
];

const checkpoints = [
  '불필요한 파일이 변경되지 않았는지 확인',
  '.env나 시크릿이 하드코딩되지 않았는지 검사',
  'console.log가 남아있지 않은지 확인',
  '기존 코드 스타일과 일관성 확인',
  'TypeScript 타입 에러 없는지 확인',
  '빌드(npm run build)가 성공하는지 확인',
];

export function AiBranchSection() {
  return (
    <section id="ai-branch" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2 tracking-wide uppercase">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            AI + Git
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">AI 코드 브랜치 관리</h2>
          <p className="text-muted-foreground max-w-2xl">
            AI 도구(Cursor, Claude Code 등)가 생성한 코드를 안전하게 관리하는 패턴입니다.
          </p>
        </div>
      </ScrollReveal>

      {/* 이유 3가지 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-orange-500" />
          별도 브랜치에서 관리하는 이유
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {reasons.map((r) => {
            const Icon = r.icon;
            return (
              <Card key={r.title} className="border-orange-200/50 dark:border-orange-800/30">
                <CardContent className="pt-6">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold mb-1">{r.title}</h3>
                  <p className="text-sm text-muted-foreground">{r.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollReveal>

      {/* 실전 패턴 */}
      <ScrollReveal delay={0.15}>
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4">실전 패턴: 브랜치 네이밍</h3>
          <div className="rounded-xl border bg-card p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="font-mono text-xs">ai/login-form</Badge>
                <span className="text-sm text-muted-foreground">AI로 로그인 폼 생성</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="font-mono text-xs">ai/refactor-api</Badge>
                <span className="text-sm text-muted-foreground">AI로 API 리팩토링</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="font-mono text-xs">ai/fix-typescript</Badge>
                <span className="text-sm text-muted-foreground">AI로 타입 에러 수정</span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              <code className="text-primary">ai/</code> 접두사를 사용하면 AI가 생성한 코드임을 한눈에 알 수 있습니다.
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 리뷰 체크포인트 */}
      <ScrollReveal delay={0.2}>
        <Card className="border-amber-200/50 dark:border-amber-800/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              AI 코드 리뷰 체크포인트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {checkpoints.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </ScrollReveal>
    </section>
  );
}
