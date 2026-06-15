'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';
import { useCreateFeedback } from '@/lib/queries/feedback';
import { getPageContext, formatPageContext } from '@/lib/utils/page-context';
import { PageTreePicker } from './PageTreePicker';
import type { FeatureRequestCategory } from '@/types/feedback';

interface FeedbackFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FeedbackForm({ onSuccess, onCancel }: FeedbackFormProps) {
  const pathname = usePathname();
  const autoDetectedKey = formatPageContext(getPageContext(pathname));

  const [pageContext, setPageContext] = useState(autoDetectedKey);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FeatureRequestCategory>('feature');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { mutate: createFeedback, isPending } = useCreateFeedback();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 5) {
      toast.error('제목은 5자 이상이어야 합니다');
      return;
    }
    if (description.trim().length < 10) {
      toast.error('내용은 10자 이상이어야 합니다');
      return;
    }

    createFeedback(
      {
        title: title.trim(),
        description: description.trim(),
        category,
        is_anonymous: isAnonymous,
        page_context: pageContext,
      },
      {
        onSuccess: () => {
          toast.success('요청이 등록되었습니다');
          onSuccess?.();
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : '등록 실패');
        },
      }
    );
  };

  return (
    <Card className="border-brand-blue/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">새 요청 작성</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 대상 페이지 */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              피드백 대상 페이지
              {pageContext === autoDetectedKey && (
                <span className="ml-1 text-brand-blue">자동 감지됨</span>
              )}
            </Label>
            <PageTreePicker
              value={pageContext}
              onChange={setPageContext}
              currentPageKey={autoDetectedKey}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="feedback-title">제목</Label>
            <Input
              id="feedback-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="요청 제목을 입력하세요 (5~100자)"
              maxLength={100}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="feedback-description">내용</Label>
            <Textarea
              id="feedback-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상세한 내용을 입력해주세요 (10~2000자)"
              rows={4}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">{description.length}/2000</p>
          </div>

          <div className="space-y-1.5">
            <Label>카테고리</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as FeatureRequestCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feature">기능 추가</SelectItem>
                <SelectItem value="bug">버그 신고</SelectItem>
                <SelectItem value="improvement">개선 요청</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 익명/공개 토글 */}
          <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div className="space-y-0.5">
              <Label htmlFor="feedback-anonymous" className="text-sm font-medium cursor-pointer">
                익명으로 작성
              </Label>
              <p className="text-xs text-muted-foreground">
                {isAnonymous ? '작성자 정보가 표시되지 않습니다' : '프로필 이름이 함께 표시됩니다'}
              </p>
            </div>
            <Switch
              id="feedback-anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>

          {/* 베니핏 안내 */}
          <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 px-4 py-3">
            <Gift className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              서비스 개선에 도움이 되는 의견을 주시면 감사의 의미로
              <span className="font-semibold"> 프리미엄 기능 이용권</span>이나
              <span className="font-semibold"> 쿠폰 등의 혜택</span>을 드릴 수 있습니다.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                취소
              </Button>
            )}
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? '등록 중...' : '요청 등록'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
