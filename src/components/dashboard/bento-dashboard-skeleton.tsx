'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function BentoDashboardSkeleton() {
  return (
    <div className="space-y-5">
      {/* Row 1: Hero + Health Ring */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-8 rounded-2xl border p-6 space-y-4">
          <div className="flex gap-4">
            <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-4 rounded-2xl border p-5 flex flex-col items-center gap-3">
          <Skeleton className="h-4 w-16 self-start" />
          <Skeleton className="h-[120px] w-[120px] rounded-full" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      </div>

      {/* Row 2: Connection Flow */}
      <div className="hidden md:block">
        <Skeleton className="h-[160px] w-full rounded-2xl" />
      </div>

      {/* Row 3: Layer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border p-4 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 rounded-lg" />
            <Skeleton className="h-8 rounded-lg" />
            <Skeleton className="h-8 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Row 4: Action + Onboarding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>

      {/* Mobile skeleton */}
      <div className="md:hidden space-y-3">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 flex-1 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
