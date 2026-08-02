'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Network, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useLinkDetectedServices, type DetectedService } from '@/lib/queries/oneclick';

interface DetectedServicesProps {
  deployId: string;
  projectId: string | null;
  services: DetectedService[];
  /** 이미 서비스맵에 담은 것 — 새로고침해도 다시 제안하지 않게 서버가 기록해 둔다 */
  alreadyLinked?: string[];
}

/**
 * "이 사이트가 쓰는 서비스" — 배포 결과에서 감지된 것을 보여주고, 고른 것만 서비스맵에 담는다.
 *
 * 자동으로 담지 않는 이유: 서비스맵은 사용자가 자기 서비스 구조를 스스로 그리는 곳이라
 * 추측으로 채우면 신뢰를 잃는다. 여기서는 "이런 걸 쓰고 계시네요"까지만 하고 선택은 맡긴다.
 */
export function DetectedServices({
  deployId,
  projectId,
  services,
  alreadyLinked = [],
}: DetectedServicesProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(services.filter((s) => !alreadyLinked.includes(s.slug)).map((s) => s.slug)),
  );
  const [justLinked, setJustLinked] = useState<string[]>([]);
  const link = useLinkDetectedServices(deployId);

  if (services.length === 0 || !projectId) return null;

  const done = new Set([...alreadyLinked, ...justLinked]);
  const remaining = services.filter((s) => !done.has(s.slug));
  if (remaining.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-brand-green">
        <Check className="h-3.5 w-3.5" />
        서비스맵에 담았어요
      </div>
    );
  }

  const toggle = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const chosen = remaining.filter((s) => selected.has(s.slug));

  const handleAdd = async () => {
    try {
      const result = await link.mutateAsync(chosen.map((s) => s.slug));
      setJustLinked((prev) => [...prev, ...chosen.map((s) => s.slug)]);
      const count = result.added.length;
      toast.success(
        count > 0
          ? `${count}개 서비스를 서비스맵에 담았어요`
          : '이미 서비스맵에 담겨 있어요',
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '서비스맵에 추가하지 못했습니다');
    }
  };

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-2.5">
      <div className="flex items-center gap-1.5">
        <Network className="h-3.5 w-3.5 text-brand-blue" />
        <p className="text-xs font-medium">이 사이트가 쓰는 서비스</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {remaining.map((s) => {
          const on = selected.has(s.slug);
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => toggle(s.slug)}
              aria-pressed={on}
              title={`발견 위치: ${s.foundIn.join(', ')}`}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                on
                  ? 'bg-brand-blue/10 border-brand-blue/40 text-brand-blue'
                  : 'bg-transparent border-border text-muted-foreground hover:border-brand-blue/30'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          담아두면 환경변수·상태 확인을 한곳에서 관리할 수 있어요
        </p>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs shrink-0"
          disabled={chosen.length === 0 || link.isPending}
          onClick={handleAdd}
        >
          {link.isPending ? (
            <><Loader2 className="h-3 w-3 mr-1 animate-spin" />담는 중</>
          ) : (
            <><Plus className="h-3 w-3 mr-1" />서비스맵에 담기{chosen.length > 0 && ` (${chosen.length})`}</>
          )}
        </Button>
      </div>

      {done.size > 0 && (
        <Badge variant="secondary" className="text-[11px]">
          {done.size}개 담김
        </Badge>
      )}
    </div>
  );
}
