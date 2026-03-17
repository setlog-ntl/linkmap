'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { GitBranch, TreePine, Shield, Layers } from 'lucide-react';

const concepts = [
  {
    icon: TreePine,
    title: '나무 가지처럼',
    desc: '브랜치(branch)는 코드의 갈래길입니다. 원본(main)은 그대로 두고, 새 가지를 만들어 실험합니다.',
    color: 'green',
  },
  {
    icon: Shield,
    title: 'main = 배포용 코드',
    desc: '실제 서비스에 나가는 안정적인 코드. 직접 수정하지 않고, 검증된 코드만 머지합니다.',
    color: 'blue',
  },
  {
    icon: Layers,
    title: 'feature = 작업용 사본',
    desc: '새 기능이나 버그 수정을 위한 임시 공간. 작업이 끝나면 main에 합칩니다.',
    color: 'purple',
  },
];

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  green: {
    bg: 'bg-green-100 dark:bg-green-900/40',
    icon: 'text-green-600 dark:text-green-400',
    border: 'border-green-200/50 dark:border-green-800/30',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200/50 dark:border-blue-800/30',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/40',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200/50 dark:border-purple-800/30',
  },
};

const commands = [
  { cmd: 'git branch', desc: '브랜치 목록 확인' },
  { cmd: 'git branch feature/login', desc: '새 브랜치 생성' },
  { cmd: 'git checkout -b feature/login', desc: '생성 + 이동을 한 번에' },
  { cmd: 'git switch feature/login', desc: '브랜치 전환 (최신 명령어)' },
  { cmd: 'git merge feature/login', desc: '현재 브랜치에 합치기' },
];

export function BranchConceptSection() {
  return (
    <section id="branch-concept" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-600 dark:text-green-400 mb-2 tracking-wide uppercase">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Concept
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">브랜치란?</h2>
          <p className="text-muted-foreground max-w-2xl">
            코드를 나무 가지처럼 분리해서 관리하는 Git의 핵심 기능입니다.
            원본에 영향 없이 실험하고, 완성되면 합칩니다.
          </p>
        </div>
      </ScrollReveal>

      {/* 개념 카드 */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {concepts.map((c) => {
            const Icon = c.icon;
            const colors = colorMap[c.color];
            return (
              <Card key={c.title} className={colors.border}>
                <CardContent className="pt-6">
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <h3 className="font-semibold mb-1">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollReveal>

      {/* 브랜치 다이어그램 (CSS) */}
      <ScrollReveal delay={0.15}>
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-primary" />
            브랜치 분기 시각화
          </h3>
          <div className="rounded-xl border bg-card p-6 overflow-x-auto">
            <div className="min-w-[400px] space-y-3">
              {/* main */}
              <div className="flex items-center gap-2">
                <span className="w-24 text-xs font-mono font-semibold text-green-600 dark:text-green-400 text-right">main</span>
                <div className="flex items-center gap-1 flex-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="contents">
                      <div className="w-4 h-4 rounded-full bg-green-500 shrink-0" />
                      {i < 7 && <div className="h-0.5 w-8 bg-green-300 dark:bg-green-700" />}
                    </div>
                  ))}
                </div>
              </div>
              {/* feature 분기 */}
              <div className="flex items-center gap-2">
                <span className="w-24 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 text-right">feature/a</span>
                <div className="flex items-center gap-1 flex-1">
                  <div className="w-8 h-0.5" /> {/* offset */}
                  <div className="w-8 h-0.5" />
                  <div className="w-4 h-4 rounded-full bg-blue-500 shrink-0" />
                  <div className="h-0.5 w-8 bg-blue-300 dark:bg-blue-700" />
                  <div className="w-4 h-4 rounded-full bg-blue-500 shrink-0" />
                  <div className="h-0.5 w-8 bg-blue-300 dark:bg-blue-700" />
                  <div className="w-4 h-4 rounded-full bg-blue-500 shrink-0" />
                </div>
              </div>
              {/* hotfix 분기 */}
              <div className="flex items-center gap-2">
                <span className="w-24 text-xs font-mono font-semibold text-red-600 dark:text-red-400 text-right">hotfix/bug</span>
                <div className="flex items-center gap-1 flex-1">
                  <div className="w-8 h-0.5" />
                  <div className="w-8 h-0.5" />
                  <div className="w-8 h-0.5" />
                  <div className="w-8 h-0.5" />
                  <div className="w-4 h-4 rounded-full bg-red-500 shrink-0" />
                  <div className="h-0.5 w-8 bg-red-300 dark:bg-red-700" />
                  <div className="w-4 h-4 rounded-full bg-red-500 shrink-0" />
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground text-center">
              main에서 분기하여 작업 후, 완료되면 다시 main에 합칩니다
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 기본 명령어 */}
      <ScrollReveal delay={0.2}>
        <div>
          <h3 className="text-lg font-semibold mb-4">기본 명령어</h3>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium w-56">명령어</th>
                  <th className="px-4 py-3 text-left font-medium">설명</th>
                </tr>
              </thead>
              <tbody>
                {commands.map((row) => (
                  <tr key={row.cmd} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-mono text-xs text-primary bg-muted/30">
                      {row.cmd}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
