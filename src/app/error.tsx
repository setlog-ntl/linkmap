'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">오류가 발생했습니다</h1>
        <p className="text-muted-foreground mb-6">
          죄송합니다. 예기치 않은 오류가 발생했습니다.
          <br />
          문제가 계속되면 새로고침하거나 나중에 다시 시도해주세요.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            홈으로
          </Button>
          <Button onClick={() => reset()}>
            다시 시도
          </Button>
        </div>
      </div>
    </div>
  );
}
