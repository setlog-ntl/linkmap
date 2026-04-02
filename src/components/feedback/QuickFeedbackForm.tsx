'use client';

import { useState } from 'react';
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
import { useCreateFeedback } from '@/lib/queries/feedback';
import { formatPageContext, type PageContext } from '@/lib/utils/page-context';
import { PageTreePicker } from './PageTreePicker';
import type { FeatureRequestCategory } from '@/types/feedback';

interface QuickFeedbackFormProps {
  defaultPageContext: PageContext;
  onSuccess: () => void;
}

export function QuickFeedbackForm({ defaultPageContext, onSuccess }: QuickFeedbackFormProps) {
  const autoDetectedKey = formatPageContext(defaultPageContext);
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
          toast.success('피드백이 등록되었습니다');
          onSuccess();
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : '등록 실패');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 페이지 컨텍스트 — 트리 피커 */}
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

      {/* 카테고리 */}
      <div className="space-y-1.5">
        <Label>유형</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as FeatureRequestCategory)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feature">기능 요청</SelectItem>
            <SelectItem value="improvement">기능 개선</SelectItem>
            <SelectItem value="bug">버그 신고</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 제목 */}
      <div className="space-y-1.5">
        <Label htmlFor="quick-title">제목</Label>
        <Input
          id="quick-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="간단히 요약해주세요 (5~100자)"
          maxLength={100}
          className="h-9"
        />
      </div>

      {/* 내용 */}
      <div className="space-y-1.5">
        <Label htmlFor="quick-desc">내용</Label>
        <Textarea
          id="quick-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="어떤 점이 불편하거나 필요한지 알려주세요 (10~2000자)"
          rows={3}
          maxLength={2000}
        />
        <p className="text-xs text-muted-foreground text-right">{description.length}/2000</p>
      </div>

      {/* 익명 토글 */}
      <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
        <div className="space-y-0.5">
          <Label htmlFor="quick-anonymous" className="text-sm cursor-pointer">
            익명으로 작성
          </Label>
          <p className="text-xs text-muted-foreground">
            {isAnonymous ? '작성자 정보가 숨겨집니다' : '프로필 이름이 표시됩니다'}
          </p>
        </div>
        <Switch
          id="quick-anonymous"
          checked={isAnonymous}
          onCheckedChange={setIsAnonymous}
        />
      </div>

      {/* 제출 */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? '보내는 중...' : '피드백 보내기'}
      </Button>
    </form>
  );
}
