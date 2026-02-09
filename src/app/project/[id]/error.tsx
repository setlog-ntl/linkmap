'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Project error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-bold mb-2">프로젝트를 불러올 수 없습니다</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        프로젝트 데이터를 가져오는 중 오류가 발생했습니다.
      </p>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/dashboard">대시보드로</Link>
        </Button>
        <Button onClick={() => reset()}>다시 시도</Button>
      </div>
    </div>
  );
}
