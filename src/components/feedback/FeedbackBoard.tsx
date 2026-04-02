'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FeedbackFilters } from './FeedbackFilters';
import { FeedbackCard } from './FeedbackCard';
import { FeedbackForm } from './FeedbackForm';
import { useFeedbackList } from '@/lib/queries/feedback';
import type { FeatureRequestCategory, FeatureRequestStatus, FeedbackSortOrder } from '@/types/feedback';

interface FeedbackBoardProps {
  isLoggedIn: boolean;
}

export function FeedbackBoard({ isLoggedIn }: FeedbackBoardProps) {
  const [category, setCategory] = useState<FeatureRequestCategory | undefined>();
  const [status, setStatus] = useState<FeatureRequestStatus | undefined>();
  const [sort, setSort] = useState<FeedbackSortOrder>('votes');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const LIMIT = 20;

  const { data, isLoading, isError } = useFeedbackList({
    category,
    status,
    sort,
    page,
    limit: LIMIT,
  });

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  const handleFilterChange = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">기능 요청</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            새로운 기능을 제안하거나 버그를 신고해주세요
          </p>
        </div>
        <Button
          onClick={() => {
            if (!isLoggedIn) {
              window.location.href = '/login';
              return;
            }
            setShowForm(true);
          }}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          요청 작성
        </Button>
      </div>

      {/* 작성 폼 */}
      {showForm && isLoggedIn && (
        <FeedbackForm onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
      )}

      {/* 필터 */}
      <FeedbackFilters
        category={category}
        status={status}
        sort={sort}
        onCategoryChange={(v) => handleFilterChange(() => setCategory(v))}
        onStatusChange={(v) => handleFilterChange(() => setStatus(v))}
        onSortChange={(v) => handleFilterChange(() => setSort(v))}
      />

      {/* 목록 */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-muted-foreground">
          목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </div>
      ) : data?.items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          아직 등록된 요청이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {data?.items.map((item) => (
            <FeedbackCard key={item.id} item={item} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            이전
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
