'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { AlertTriangle, GitMerge, GitBranch, CheckCircle2, Bot, ArrowRight } from 'lucide-react';

const mergeVsRebase = [
  {
    aspect: '동작 방식',
    merge: '두 브랜치를 합치는 새 커밋 생성',
    rebase: '커밋을 떼어서 다른 브랜치 위에 다시 붙임',
  },
  {
    aspect: '히스토리',
    merge: '분기 이력이 보존됨 (그래프 형태)',
    rebase: '직선형 히스토리 (깔끔)',
  },
  {
    aspect: '안전성',
    merge: '안전 (기존 커밋 변경 없음)',
    rebase: '주의 필요 (커밋 해시가 변경됨)',
  },
  {
    aspect: '충돌 해결',
    merge: '한 번에 해결',
    rebase: '커밋마다 해결해야 할 수 있음',
  },
  {
    aspect: '초보자 추천',
    merge: '추천',
    rebase: '비추천 (경험 쌓은 후)',
  },
];

const scenarios = [
  {
    title: 'AI가 전체 파일을 덮어쓴 경우',
    icon: Bot,
    steps: [
      'git diff로 변경 범위 확인',
      'VS Code의 3-way merge 에디터 사용',
      '필요한 변경만 선택적으로 수락 (Accept Current / Accept Incoming)',
      '테스트 후 커밋',
    ],
    tip: 'AI가 파일 전체를 재작성하면 diff가 매우 길어집니다. 이런 경우 AI에게 "변경할 부분만 수정해줘"라고 요청하는 것이 좋습니다.',
  },
  {
    title: '같은 컴포넌트를 동시에 수정한 경우',
    icon: GitBranch,
    steps: [
      'conflict markers를 확인',
      '두 변경사항 모두 필요한지 판단',
      '필요한 코드를 수동으로 조합',
      'markers 완전히 제거 후 커밋',
    ],
    tip: '자주 충돌하는 파일은 작은 단위로 나누는 것을 고려하세요.',
  },
];

export function ConflictContent() {
  return (
    <div className="py-8 space-y-12">
      <h1 className="text-3xl md:text-4xl font-bold">충돌 해결</h1>

      {/* 충돌 발생 원리 */}
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">충돌은 왜 발생할까?</h2>
        <p className="text-muted-foreground max-w-2xl mb-6">
          두 브랜치에서 같은 파일의 같은 줄을 다르게 수정하면,
          Git이 어느 쪽을 택해야 할지 모르기 때문에 충돌이 발생합니다.
        </p>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <div className="text-center">
              <div className="rounded-lg border px-4 py-2 bg-blue-50 dark:bg-blue-950/30 mb-1">
                <span className="text-xs font-mono">feature-a</span>
              </div>
              <div className="text-xs text-muted-foreground">3번 줄: 파란색</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90 sm:rotate-0" />
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">충돌!</span>
            </div>
            <div className="text-center">
              <div className="rounded-lg border px-4 py-2 bg-purple-50 dark:bg-purple-950/30 mb-1">
                <span className="text-xs font-mono">feature-b</span>
              </div>
              <div className="text-xs text-muted-foreground">3번 줄: 빨간색</div>
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground mt-4">
            같은 파일의 같은 줄을 다르게 수정하면 Git이 자동으로 합칠 수 없습니다
          </div>
        </div>
      </ScrollReveal>

      {/* Conflict Markers */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-xl font-bold mb-4">Conflict Markers 읽는 법</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-lg bg-muted/50 p-4 font-mono text-sm leading-loose overflow-x-auto">
              <div className="text-red-500 font-semibold">{'<<<<<<< HEAD'}</div>
              <div className="text-blue-600 dark:text-blue-400">const color = &apos;blue&apos;; {'  '}
                <span className="text-muted-foreground font-sans text-xs">{'<-- 현재 브랜치 (내 코드)'}</span>
              </div>
              <div className="text-amber-500 font-semibold">{'======='}</div>
              <div className="text-purple-600 dark:text-purple-400">const color = &apos;red&apos;; {'  '}
                <span className="text-muted-foreground font-sans text-xs">{'<-- 들어오는 브랜치 (상대 코드)'}</span>
              </div>
              <div className="text-red-500 font-semibold">{'>>>>>>> feature-b'}</div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <Badge variant="secondary" className="shrink-0 font-mono text-xs">{'<<<'}</Badge>
                <span className="text-muted-foreground">충돌 시작, 여기부터 현재 브랜치(HEAD)의 코드</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Badge variant="secondary" className="shrink-0 font-mono text-xs">{'==='}</Badge>
                <span className="text-muted-foreground">구분선, 아래부터 들어오는 브랜치의 코드</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Badge variant="secondary" className="shrink-0 font-mono text-xs">{'>>>'}</Badge>
                <span className="text-muted-foreground">충돌 끝, 들어오는 브랜치 이름 표시</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* merge vs rebase */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <GitMerge className="w-5 h-5 text-primary" />
          merge vs rebase 비교
        </h3>
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium w-28">비교 항목</th>
                <th className="px-4 py-3 text-left font-medium">
                  <span className="inline-flex items-center gap-1">
                    <GitMerge className="w-3.5 h-3.5" /> merge
                  </span>
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  <span className="inline-flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5" /> rebase
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {mergeVsRebase.map((row) => (
                <tr key={row.aspect} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium bg-muted/30">{row.aspect}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.merge}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.rebase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            초보자 추천: merge
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            히스토리가 보존되어 문제가 생겼을 때 원인을 추적하기 쉽습니다.
            rebase는 Git에 익숙해진 후 사용하세요.
          </p>
        </div>
      </ScrollReveal>

      {/* 실전 시나리오 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          실전 시나리오
        </h3>
        <div className="space-y-4">
          {scenarios.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.title} className="border-amber-200/50 dark:border-amber-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="w-5 h-5 text-amber-500" />
                    {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {s.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-300 shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-muted-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <span className="font-semibold">Tip: </span>
                    <span className="text-muted-foreground">{s.tip}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollReveal>

      {/* 충돌 해결 명령어 */}
      <ScrollReveal delay={0.25}>
        <h3 className="text-xl font-bold mb-4">충돌 해결 명령어</h3>
        <div className="rounded-xl border bg-card p-6">
          <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs leading-relaxed space-y-1">
            <div className="text-muted-foreground"># 1. main의 최신 변경사항 가져오기</div>
            <div className="text-primary">git checkout main</div>
            <div className="text-primary">git pull origin main</div>
            <div className="text-muted-foreground mt-2"># 2. feature 브랜치에서 main을 머지</div>
            <div className="text-primary">git checkout feature/login</div>
            <div className="text-primary">git merge main</div>
            <div className="text-muted-foreground mt-2"># 3. 충돌 발생 시 파일을 열어 수동 해결</div>
            <div className="text-muted-foreground"># VS Code에서 &quot;Accept Current&quot; / &quot;Accept Incoming&quot; / &quot;Accept Both&quot; 선택</div>
            <div className="text-muted-foreground mt-2"># 4. 해결 후 커밋</div>
            <div className="text-primary">git add .</div>
            <div className="text-primary">git commit -m &quot;fix: merge conflict 해결&quot;</div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
