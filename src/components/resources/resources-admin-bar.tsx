'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Pencil, Plus, Settings2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

/**
 * 공개 자료 페이지 위에 뜨는 관리자 전용 진입점.
 *
 * /resources·/resources/[slug]는 ISR로 캐시되는 서버 컴포넌트라 요청자의 로그인 상태를
 * 알 수 없다. 그래서 관리자 판정은 브라우저에서 한다 — 서버 렌더 결과는 항상 null이고,
 * 하이드레이션 후 본인 profiles.is_admin을 읽어 관리자에게만 나타난다.
 * (header.tsx가 공개 페이지에서 프로필을 읽는 방식과 동일)
 */
export function ResourcesAdminBar({ editHref }: { editHref?: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) return;
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        if (!cancelled) setIsAdminUser(data?.is_admin === true);
      } catch {
        // 비로그인·세션 만료는 정상 경로 — 관리자 바를 숨긴 채로 둔다
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  if (!isAdminUser) return null;

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-dashed border-brand-blue/40 bg-brand-blue/5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-2 text-brand-blue break-keep sm:items-center">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" />
        <span>
          <span className="font-semibold">관리자 모드</span> — 자료를 추가하거나 설정을 바꿀 수
          있습니다. 저장한 내용은 1분 내 공개 페이지에 반영됩니다.
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        {editHref && (
          <Button asChild size="sm" variant="outline">
            <Link href={editHref} prefetch={false}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              이 자료 편집
            </Link>
          </Button>
        )}
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/resources" prefetch={false}>
            <Settings2 className="mr-1.5 h-3.5 w-3.5" />
            자료 관리
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/admin/resources/new" prefetch={false}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            새 자료 추가
          </Link>
        </Button>
      </div>
    </div>
  );
}
