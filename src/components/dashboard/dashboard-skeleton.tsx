'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Desktop: 3-column grid */}
      <div className="hidden md:grid grid-cols-[1fr_260px_1fr] gap-4">
        {/* Frontend column */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>

        {/* Center project card */}
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-5">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-40" />
            <div className="grid w-full grid-cols-3 gap-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </CardContent>
        </Card>

        {/* Backend column */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
      </div>

      {/* Devtools row */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-5 w-20 mb-3" />
            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile skeleton */}
      <div className="md:hidden space-y-3">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 flex-1 rounded-full" />
          ))}
        </div>
        <Card>
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-14 w-14 rounded-xl mx-auto" />
            <Skeleton className="h-5 w-32 mx-auto" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
