'use client';

import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FeatureRequestCategory, FeatureRequestStatus, FeedbackSortOrder } from '@/types/feedback';

interface FeedbackFiltersProps {
  category?: FeatureRequestCategory;
  status?: FeatureRequestStatus;
  sort: FeedbackSortOrder;
  onCategoryChange: (v: FeatureRequestCategory | undefined) => void;
  onStatusChange: (v: FeatureRequestStatus | undefined) => void;
  onSortChange: (v: FeedbackSortOrder) => void;
}

const CATEGORIES: { value: FeatureRequestCategory; label: string }[] = [
  { value: 'feature', label: '기능 추가' },
  { value: 'bug', label: '버그 신고' },
  { value: 'improvement', label: '개선 요청' },
];

const STATUSES: { value: FeatureRequestStatus; label: string }[] = [
  { value: 'pending', label: '검토 대기' },
  { value: 'in_review', label: '검토 중' },
  { value: 'planned', label: '계획됨' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'completed', label: '완료' },
  { value: 'rejected', label: '거절됨' },
];

export function FeedbackFilters({
  category,
  status,
  sort,
  onCategoryChange,
  onStatusChange,
  onSortChange,
}: FeedbackFiltersProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
      {/* 카테고리 필터 */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant={!category ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onCategoryChange(undefined)}
        >
          전체
        </Badge>
        {CATEGORIES.map((c) => (
          <Badge
            key={c.value}
            variant={category === c.value ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onCategoryChange(c.value)}
          >
            {c.label}
          </Badge>
        ))}
      </div>

      {/* 모바일: 전체 너비로 쌓기 / md 이상: 우측 정렬 */}
      <div className="flex items-center gap-2 md:ml-auto">
        {/* 상태 필터 */}
        <Select
          value={status ?? 'all'}
          onValueChange={(v) => onStatusChange(v === 'all' ? undefined : (v as FeatureRequestStatus))}
        >
          <SelectTrigger className="w-full md:w-32 h-8 text-xs">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 정렬 */}
        <Select value={sort} onValueChange={(v) => onSortChange(v as FeedbackSortOrder)}>
          <SelectTrigger className="w-full md:w-28 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="votes">투표순</SelectItem>
            <SelectItem value="newest">최신순</SelectItem>
            <SelectItem value="oldest">오래된순</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
