'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { GitBranch, Code2, Upload, GitPullRequest, GitMerge } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: GitBranch,
    title: 'main에서 분기',
    cmd: 'git checkout -b feature/login',
    detail: 'main 브랜치에서 새 feature 브랜치를 만듭니다.',
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    badge: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400',
  },
  {
    step: 2,
    icon: Code2,
    title: '기능 개발',
    cmd: 'git add . && git commit -m "feat: 로그인 UI"',
    detail: '코드를 작성하고 의미 단위로 커밋합니다.',
    color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    step: 3,
    icon: Upload,
    title: 'Push',
    cmd: 'git push -u origin feature/login',
    detail: '로컬 브랜치를 GitHub 원격 저장소에 업로드합니다.',
    color: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
  },
  {
    step: 4,
    icon: GitPullRequest,
    title: 'PR 생성',
    cmd: 'GitHub 웹 UI에서 "New Pull Request"',
    detail: '코드 리뷰를 요청하고, 변경사항을 설명합니다.',
    color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
  },
  {
    step: 5,
    icon: GitMerge,
    title: '리뷰 후 머지',
    cmd: 'GitHub에서 "Merge Pull Request"',
    detail: '리뷰가 통과되면 main에 합치고, feature 브랜치를 삭제합니다.',
    color: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
  },
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 tracking-wide uppercase">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Workflow
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Feature Branch Workflow</h2>
          <p className="text-muted-foreground max-w-2xl">
            가장 기본적인 Git 워크플로우입니다. 5단계를 반복하면 어떤 프로젝트든 안전하게 관리할 수 있습니다.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.step} className={`relative overflow-hidden border ${s.color}`}>
                <CardContent className="pt-6">
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold mb-3 ${s.badge}`}>
                    Step {s.step}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-background/80 border flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold mb-1.5">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{s.detail}</p>
                  <code className="block text-[11px] font-mono bg-muted/50 rounded px-2 py-1.5 text-muted-foreground break-all">
                    {s.cmd}
                  </code>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollReveal>

      {/* 전체 흐름 요약 */}
      <ScrollReveal delay={0.2}>
        <div className="mt-8 rounded-xl border bg-card p-6">
          <h3 className="text-sm font-semibold mb-4">전체 명령어 흐름</h3>
          <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs leading-relaxed space-y-1">
            <div className="text-muted-foreground"># 1. 새 브랜치 생성</div>
            <div className="text-primary">git checkout -b feature/login</div>
            <div className="text-muted-foreground mt-2"># 2. 코드 수정 후 커밋</div>
            <div className="text-primary">git add .</div>
            <div className="text-primary">git commit -m &quot;feat: 로그인 기능 추가&quot;</div>
            <div className="text-muted-foreground mt-2"># 3. 원격에 푸시</div>
            <div className="text-primary">git push -u origin feature/login</div>
            <div className="text-muted-foreground mt-2"># 4. GitHub에서 PR 생성 → 리뷰 → 머지</div>
            <div className="text-muted-foreground mt-2"># 5. 로컬 main 업데이트</div>
            <div className="text-primary">git checkout main</div>
            <div className="text-primary">git pull origin main</div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
