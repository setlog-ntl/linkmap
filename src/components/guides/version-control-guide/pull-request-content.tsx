'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { GitPullRequest, FileText, Eye, CheckCircle2, Globe, ArrowRight } from 'lucide-react';

const prSteps = [
  {
    step: 1,
    title: 'feature 브랜치를 Push',
    desc: 'git push -u origin feature/login으로 원격에 업로드합니다.',
  },
  {
    step: 2,
    title: 'GitHub에서 "Compare & Pull Request" 클릭',
    desc: 'Push 직후 GitHub 저장소 페이지에 노란 배너가 나타납니다.',
  },
  {
    step: 3,
    title: 'PR 제목과 설명 작성',
    desc: '무엇을, 왜 변경했는지 간결하게 설명합니다.',
  },
  {
    step: 4,
    title: '리뷰어 지정 (선택)',
    desc: '팀원이 있으면 코드 리뷰를 요청합니다. 1인 개발이면 셀프 리뷰.',
  },
  {
    step: 5,
    title: '"Create Pull Request" 클릭',
    desc: 'PR이 생성되고, Vercel이 연동되어 있으면 Preview URL이 자동 생성됩니다.',
  },
];

const goodPrTips = [
  {
    icon: FileText,
    title: '제목은 Conventional Commits',
    desc: 'feat: 로그인 기능 추가, fix: 검색 오류 수정 형식으로 작성하면 변경 유형이 명확합니다.',
    example: 'feat: 구글 OAuth 로그인 구현',
  },
  {
    icon: Eye,
    title: '설명에는 왜(Why)를 포함',
    desc: '무엇을 바꿨는지보다 왜 바꿨는지가 중요합니다. 스크린샷이나 GIF를 첨부하면 더 좋습니다.',
    example: '## 변경 이유\n사용자 로그인 전환율을 높이기 위해 소셜 로그인을 추가합니다.',
  },
  {
    icon: CheckCircle2,
    title: '변경 범위를 작게',
    desc: '한 PR에 하나의 기능만 담으세요. 300줄 이상이면 리뷰가 어렵습니다.',
    example: '변경 파일 5개 이하, 코드 변경 300줄 이하 권장',
  },
];

export function PullRequestContent() {
  return (
    <div className="py-8 space-y-12">
      <h1 className="text-3xl md:text-4xl font-bold">PR과 코드 리뷰</h1>

      {/* PR이란? */}
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Pull Request란?</h2>
        <p className="text-muted-foreground max-w-2xl mb-6">
          &quot;내 코드를 main에 합쳐주세요&quot;라는 요청입니다.
          코드 변경사항을 팀원(또는 미래의 나)이 리뷰할 수 있는 공간이기도 합니다.
        </p>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <div className="flex items-center gap-2 rounded-lg border px-4 py-2 bg-blue-50 dark:bg-blue-950/30">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm font-mono">feature/login</span>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90 sm:rotate-0" />
            <div className="rounded-lg border-2 border-dashed border-primary/50 px-4 py-2 bg-primary/5">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Pull Request</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">코드 리뷰 + 토론</div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90 sm:rotate-0" />
            <div className="flex items-center gap-2 rounded-lg border px-4 py-2 bg-green-50 dark:bg-green-950/30">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-mono">main</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* PR 생성 단계 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-xl font-bold mb-4">PR 생성 단계 (GitHub 웹 UI)</h3>
        <div className="space-y-3">
          {prSteps.map((s) => (
            <div key={s.step} className="flex items-start gap-4 rounded-xl border bg-card p-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {s.step}
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-0.5">{s.title}</h4>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 좋은 PR 작성법 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-xl font-bold mb-4">좋은 PR 작성법</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goodPrTips.map((tip) => {
            const Icon = tip.icon;
            return (
              <Card key={tip.title}>
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{tip.desc}</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">예시</div>
                    <div className="text-xs font-mono whitespace-pre-wrap">{tip.example}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Preview 배포 */}
      <ScrollReveal delay={0.2}>
        <Card className="border-emerald-200/50 dark:border-emerald-800/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-emerald-500" />
              Preview 배포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Vercel이 GitHub과 연동되어 있으면, PR을 생성할 때마다 자동으로 Preview URL이 생성됩니다.
              머지 전에 실제 동작을 확인할 수 있어 매우 유용합니다.
            </p>
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-muted-foreground">PR마다 고유한 URL 자동 생성</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-muted-foreground">push할 때마다 자동 재배포</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-muted-foreground">PR이 닫히면 Preview도 자동 삭제</span>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-lg border bg-card">
              <div className="text-xs text-muted-foreground mb-1">Preview URL 예시</div>
              <code className="text-sm font-mono text-primary">
                https://my-app-git-feature-login-username.vercel.app
              </code>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}
