'use client';

import { useCallback, useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ListChecks, Rocket, Globe, Key, Activity, Gauge } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { GuideTLDR, GuideCallout } from '@/components/guides/common';

const STORAGE_KEY = 'linkmap-post-deploy-checklist';

interface CheckItem {
  id: number;
  label: string;
  hint?: string;
}

interface CheckCategory {
  title: string;
  icon: LucideIcon;
  items: CheckItem[];
}

const categories: CheckCategory[] = [
  {
    title: '도메인 · HTTPS',
    icon: Globe,
    items: [
      { id: 0, label: '배포된 실제 URL로 접속해 첫 화면이 정상적으로 뜬다' },
      { id: 1, label: '주소창에 자물쇠(🔒)가 보인다 — HTTPS가 적용됐다' },
      { id: 2, label: '커스텀 도메인을 연결했다면 www/비-www 모두 접속된다', hint: 'DNS 전파에 시간이 걸릴 수 있어요' },
    ],
  },
  {
    title: '환경변수',
    icon: Key,
    items: [
      { id: 3, label: '배포 플랫폼에 환경변수를 빠짐없이 등록했다' },
      { id: 4, label: '환경변수를 추가/수정한 뒤 재배포를 트리거했다', hint: '대부분 재배포해야 반영돼요' },
      { id: 5, label: '로그인·결제·AI 등 키가 필요한 기능이 실제로 작동한다' },
    ],
  },
  {
    title: '에러 모니터링',
    icon: Activity,
    items: [
      { id: 6, label: '브라우저 콘솔(F12)에 빨간 에러가 없다' },
      { id: 7, label: '주요 페이지를 직접 클릭해보며 404·500 에러가 없는지 확인했다' },
      { id: 8, label: '에러 추적 도구(Sentry 등) 또는 플랫폼 로그를 확인할 방법이 있다' },
    ],
  },
  {
    title: '성능 · 검색 노출',
    icon: Gauge,
    items: [
      { id: 9, label: '모바일에서 화면이 깨지지 않고 잘 보인다' },
      { id: 10, label: '페이지 제목(title)과 설명(description)이 의도대로 나온다' },
      { id: 11, label: '이미지가 너무 무겁지 않다 — 첫 로딩이 답답하지 않다' },
    ],
  },
];

const allItems = categories.flatMap((c) => c.items);

export function PostDeployChecklistContent() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCompleted(new Set(JSON.parse(saved)));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (completed.size > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [completed]);

  const toggle = useCallback((id: number, checked: boolean | 'indeterminate') => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (checked === true) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const progressPercent = (completed.size / allItems.length) * 100;
  const allDone = completed.size === allItems.length;

  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <ListChecks className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">배포 후 첫 점검</h1>
        </div>
        <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          배포는 끝이 아니라 시작이에요. 사이트가 진짜로 잘 돌아가는지 12가지 항목으로
          빠르게 점검하세요. 진행 상황은 자동 저장됩니다.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <GuideTLDR
          level="입문"
          readingTime="8분"
          points={[
            '"내 컴퓨터에선 됐는데 배포본에선 안 되는" 문제는 대부분 환경변수 때문이에요.',
            '배포 직후엔 실제 URL에서 핵심 기능(로그인·결제·AI)을 직접 눌러봐야 해요.',
            '콘솔 에러·HTTPS·모바일 화면만 확인해도 큰 사고를 막을 수 있어요.',
          ]}
          youCanDo="배포한 사이트가 실제로 잘 작동하는지 스스로 점검할 수 있어요."
        />
      </ScrollReveal>

      {/* 진행률 */}
      <section className="scroll-mt-24 py-8">
        <ScrollReveal>
          <div className="max-w-2xl">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <ListChecks className="h-4 w-4" />
                점검 진행률
              </span>
              <span className="font-medium">
                {completed.size} / {allItems.length} 완료
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </ScrollReveal>

        {/* 카테고리별 체크리스트 */}
        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-4 mt-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card key={cat.title} className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className="h-4 w-4 text-primary" />
                      {cat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 pt-0">
                    {cat.items.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-start gap-3 py-2 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          className="mt-0.5"
                          checked={completed.has(item.id)}
                          onCheckedChange={(checked) => toggle(item.id, checked)}
                        />
                        <span className="text-sm">
                          <span className={completed.has(item.id) ? 'line-through text-muted-foreground' : ''}>
                            {item.label}
                          </span>
                          {item.hint ? (
                            <span className="block text-xs text-muted-foreground mt-0.5">💡 {item.hint}</span>
                          ) : null}
                        </span>
                      </label>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollReveal>

        {allDone && (
          <ScrollReveal delay={0.05}>
            <Card className="mt-4 max-w-2xl border-green-500/50 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Rocket className="h-5 w-5" />
                  점검 완료 — 안심하고 공유하세요!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  핵심 점검을 모두 마쳤습니다. 이제 사이트 주소를 자신 있게 공유해도 좋아요.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}
      </section>

      {/* 문제가 생겼을 때 */}
      <section className="scroll-mt-24 py-8">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-4">점검 중 문제가 보이면?</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <GuideCallout variant="tip" title="가장 흔한 원인부터 확인하세요" className="max-w-2xl">
            <ul className="list-disc list-inside space-y-1">
              <li>기능이 안 됨 → <strong>환경변수</strong>가 배포 플랫폼에 등록·재배포됐는지 먼저 확인</li>
              <li>화면이 안 뜸 → <strong>빌드 로그</strong>에서 빨간 에러 메시지 확인</li>
              <li>요청이 막힘 → 콘솔의 <strong>CORS</strong> 또는 401/403 에러 확인</li>
            </ul>
          </GuideCallout>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">다음 단계:</strong>{' '}
              구체적인 에러 메시지별 해결법은{' '}
              <Link href="/guides/troubleshooting" prefetch={false} className="text-primary hover:underline">흔한 에러 해결 허브</Link>에서,
              환경변수 문제는{' '}
              <Link href="/guides/env" prefetch={false} className="text-primary hover:underline">환경변수 관리 가이드</Link>에서 확인하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
