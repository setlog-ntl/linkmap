'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Map as MapIcon } from 'lucide-react';

const ServiceMapShared = dynamic(
  () => import('@/components/service-map/shared-map-client'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[calc(100vh-4rem)] min-h-[500px] rounded-lg" />,
  }
);

export default function SharedMapPage() {
  const params = useParams();
  const token = params.token as string;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 맵 영역 */}
      <div className="flex-1 min-h-0">
        <ServiceMapShared shareToken={token} />
      </div>

      {/* CTA 배너 */}
      <div className="border-t bg-card px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground min-w-0">
          <MapIcon className="h-4 w-4 text-brand-blue shrink-0" />
          <span className="truncate">
            <span className="hidden sm:inline">이 서비스맵은 </span>
            <span className="font-semibold text-foreground">Linkmap</span>
            <span className="hidden sm:inline">으로 만들어졌습니다</span>
          </span>
        </div>
        <Button asChild size="sm" className="shrink-0 text-xs sm:text-sm">
          <Link href="/signup" prefetch={false}>
            <span className="sm:hidden">시작하기</span>
            <span className="hidden sm:inline">무료로 시작하기</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
