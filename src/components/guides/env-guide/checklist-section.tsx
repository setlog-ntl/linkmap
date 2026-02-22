'use client';

import { useCallback, useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, Rocket } from 'lucide-react';

const STORAGE_KEY = 'linkmap-env-guide-checklist';

const checkItems = [
  { id: 0, label: '.env.local이 .gitignore에 포함되어 있다' },
  { id: 1, label: 'GitHub에 .env 파일이 올라가지 않았다' },
  { id: 2, label: 'NEXT_PUBLIC_ 접두사를 올바르게 사용했다' },
  { id: 3, label: '프로덕션 키와 개발 키를 구분해서 사용한다' },
  { id: 4, label: '배포 서비스에 환경변수를 전부 등록했다' },
  { id: 5, label: 'API 키에 사용량 제한(Rate Limit)을 설정했다' },
  { id: 6, label: '키를 카톡/슬랙/이메일로 보내지 않았다' },
  { id: 7, label: '주기적으로 키를 교체(rotate)할 계획이 있다' },
];

export function ChecklistSection() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCompleted(new Set(JSON.parse(saved)));
      }
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
      if (checked === true) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const progressPercent = (completed.size / checkItems.length) * 100;
  const allDone = completed.size === checkItems.length;

  return (
    <section id="checklist" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">바이브 코더 체크리스트</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          배포 전에 아래 항목을 모두 확인하세요. 진행 상황은 자동으로 저장됩니다.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="max-w-2xl">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                보안 체크
              </span>
              <span className="font-medium">
                {completed.size} / {checkItems.length} 완료
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Checklist */}
          <Card className="border">
            <CardContent className="pt-4 space-y-1">
              {checkItems.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 py-2.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={completed.has(item.id)}
                    onCheckedChange={(checked) => toggle(item.id, checked)}
                  />
                  <span
                    className={`text-sm ${
                      completed.has(item.id) ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* 축하 카드 */}
          {allDone && (
            <Card className="mt-4 border-green-500/50 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Rocket className="h-5 w-5" />
                  모든 항목을 완료했습니다!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  환경변수 보안 기본기를 모두 갖추었습니다. 이제 안심하고 배포하세요!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}
