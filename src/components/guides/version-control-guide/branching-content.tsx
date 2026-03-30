'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { GitBranch, Workflow, Zap, CheckCircle2 } from 'lucide-react';

const strategies = [
  {
    name: 'Git Flow',
    icon: Workflow,
    desc: 'main, develop, feature, release, hotfix 5개 브랜치를 체계적으로 관리합니다.',
    pros: ['명확한 릴리스 주기', '핫픽스 분리 가능', '대규모 팀에 적합'],
    cons: ['브랜치가 많아 복잡', '배포 속도가 느림'],
    best: '정기 릴리스가 있는 팀 (2주 스프린트 등)',
    color: 'blue',
  },
  {
    name: 'GitHub Flow',
    icon: GitBranch,
    desc: 'main과 feature 브랜치만 사용하는 단순한 전략입니다.',
    pros: ['단순하고 배우기 쉬움', '빠른 배포 가능', '1인/소규모 팀에 적합'],
    cons: ['릴리스 관리가 어려움', '스테이징 환경이 별도 필요'],
    best: '1인 개발, 소규모 팀, 지속 배포(CD)',
    color: 'green',
  },
  {
    name: 'Trunk Based',
    icon: Zap,
    desc: '모든 개발자가 main(trunk)에 직접 커밋하거나, 아주 짧은 브랜치를 사용합니다.',
    pros: ['가장 빠른 배포', '머지 충돌 최소화', '피처 플래그와 궁합'],
    cons: ['높은 테스트 커버리지 필요', '경험 있는 팀에 적합'],
    best: '숙련된 팀, CI/CD 완비, 피처 플래그 사용 시',
    color: 'purple',
  },
];

const colorMap: Record<string, { bg: string; border: string; badge: string }> = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200/50 dark:border-blue-800/30',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200/50 dark:border-green-800/30',
    badge: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200/50 dark:border-purple-800/30',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
  },
};

const namingConventions = [
  { prefix: 'feature/', example: 'feature/login-form', desc: '새 기능 개발' },
  { prefix: 'fix/', example: 'fix/search-crash', desc: '버그 수정' },
  { prefix: 'hotfix/', example: 'hotfix/security-patch', desc: '긴급 수정 (프로덕션)' },
  { prefix: 'ai/', example: 'ai/refactor-api', desc: 'AI가 생성한 코드' },
  { prefix: 'chore/', example: 'chore/update-deps', desc: '잡일 (의존성 업데이트 등)' },
  { prefix: 'docs/', example: 'docs/readme-update', desc: '문서 수정' },
];

export function BranchingContent() {
  return (
    <div className="py-8 space-y-12">
      <h1 className="text-3xl md:text-4xl font-bold">브랜치 전략</h1>

      {/* 전략 비교 */}
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">브랜치 전략 3가지 비교</h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          프로젝트 규모와 팀 상황에 맞는 전략을 선택하세요.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {strategies.map((s) => {
            const Icon = s.icon;
            const colors = colorMap[s.color];
            return (
              <Card key={s.name} className={colors.border}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg">{s.name}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1.5">장점</div>
                    <ul className="space-y-1">
                      {s.pros.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5">단점</div>
                    <ul className="space-y-1">
                      {s.cons.map((c) => (
                        <li key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`rounded-lg px-3 py-2 ${colors.bg}`}>
                    <div className="text-xs font-semibold mb-0.5">추천 상황</div>
                    <div className="text-sm text-muted-foreground">{s.best}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollReveal>

      {/* 추천 */}
      <ScrollReveal delay={0.15}>
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              어떤 전략을 쓸까?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <Badge className="mb-2">1인 개발</Badge>
                <p className="text-sm text-muted-foreground">
                  <strong>GitHub Flow</strong>를 추천합니다. main + feature 브랜치만 사용해 간단합니다.
                  AI 코드는 <code className="text-primary">ai/</code> 접두사로 분리하세요.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <Badge className="mb-2">팀 개발</Badge>
                <p className="text-sm text-muted-foreground">
                  <strong>Git Flow</strong>를 추천합니다. develop 브랜치에서 기능을 통합하고,
                  릴리스 주기에 맞춰 main에 배포합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* 네이밍 컨벤션 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-xl font-bold mb-4">브랜치 네이밍 컨벤션</h3>
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium w-28">접두사</th>
                <th className="px-4 py-3 text-left font-medium w-52">예시</th>
                <th className="px-4 py-3 text-left font-medium">용도</th>
              </tr>
            </thead>
            <tbody>
              {namingConventions.map((row) => (
                <tr key={row.prefix} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-mono text-xs text-primary font-semibold">
                    {row.prefix}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {row.example}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>
    </div>
  );
}
