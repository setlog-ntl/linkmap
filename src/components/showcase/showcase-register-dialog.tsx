'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, X, Plus, ImagePlus, Trash2 } from 'lucide-react';
import { SHOWCASE_CATEGORIES, type ShowcaseCategory } from '@/types/core';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ShowcaseRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    description: string;
    tags: string[];
    category: ShowcaseCategory | undefined;
    image_url: string | null;
  }) => void;
  isLoading?: boolean;
  mode?: 'register' | 'edit';
  initialData?: {
    description?: string | null;
    tags?: string[];
    category?: ShowcaseCategory | null;
    image_url?: string | null;
  };
}

export function ShowcaseRegisterDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  mode = 'register',
  initialData,
}: ShowcaseRegisterDialogProps) {
  const [description, setDescription] = useState(initialData?.description || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState<ShowcaseCategory | undefined>(
    initialData?.category || undefined
  );
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && tags.length < 5 && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('PNG, JPG, WebP, GIF 파일만 업로드할 수 있습니다');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB 이하여야 합니다');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/showcase/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '업로드 실패');
      }

      setImageUrl(data.url);
      toast.success('이미지가 업로드되었습니다');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '이미지 업로드 실패');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    onSubmit({ description, tags, category, image_url: imageUrl });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'register' ? '쇼케이스 등록' : '쇼케이스 정보 수정'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'register'
              ? '사이트를 쇼케이스 갤러리에 공개합니다. 추가 정보를 입력하면 더 많은 사람들이 찾을 수 있습니다.'
              : '쇼케이스에 표시되는 정보를 수정합니다.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Showcase Image */}
          <div className="space-y-2">
            <Label>대표 이미지 (선택)</Label>
            {imageUrl ? (
              <div className="relative rounded-lg border overflow-hidden group">
                <img
                  src={imageUrl}
                  alt="쇼케이스 미리보기"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
              >
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <ImagePlus className="h-6 w-6" />
                )}
                <span className="text-xs">
                  {uploading ? '업로드 중...' : '클릭하여 이미지 업로드 (PNG, JPG, WebP, GIF / 5MB)'}
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>카테고리</Label>
            <div className="flex flex-wrap gap-2">
              {SHOWCASE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(category === cat.value ? undefined : cat.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                    category === cat.value
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="showcase-desc">설명 (선택)</Label>
            <Textarea
              id="showcase-desc"
              placeholder="사이트에 대한 간단한 소개를 작성해주세요..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/500
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>태그 (최대 5개)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="태그 입력 후 Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={30}
                disabled={tags.length >= 5}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || uploading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'register' ? '등록하기' : '수정하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
