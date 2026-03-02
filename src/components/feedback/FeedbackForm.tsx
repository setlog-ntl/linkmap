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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateFeedback } from '@/lib/queries/feedback';
import type { FeatureRequestCategory } from '@/types/feedback';

interface FeedbackFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FeedbackForm({ onSuccess, onCancel }: FeedbackFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FeatureRequestCategory>('feature');

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
      { title: title.trim(), description: description.trim(), category },
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
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
