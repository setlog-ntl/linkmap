'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateCustomService, useUpdateCustomService, useCatalogServices } from '@/lib/queries/services';
import type { Service, ServiceCategory } from '@/types';

const EMOJI_PRESETS = ['🔧', '⚙️', '🌐', '📦', '🔒', '💳', '📊', '🤖', '📧', '💾', '🔍', '🚀', '🗄️', '📡', '🔑', '🎯'];

const CATEGORY_OPTIONS = [
  { value: 'other', label: '기타' },
  { value: 'auth', label: '인증' },
  { value: 'database', label: '데이터베이스' },
  { value: 'deploy', label: '배포' },
  { value: 'email', label: '이메일' },
  { value: 'payment', label: '결제' },
  { value: 'storage', label: '스토리지' },
  { value: 'monitoring', label: '모니터링' },
  { value: 'ai', label: 'AI' },
  { value: 'social_login', label: '소셜 로그인' },
];

interface CreateCustomServiceDialogProps {
  mode: 'create' | 'edit';
  service?: Service;
  trigger: ReactNode;
  onSuccess?: (service: Service) => void;
}

export function CreateCustomServiceDialog({
  mode,
  service,
  trigger,
  onSuccess,
}: CreateCustomServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(service?.name ?? '');
  const [category, setCategory] = useState<ServiceCategory>(service?.category ?? 'other');
  const [description, setDescription] = useState(service?.description ?? '');
  const [iconEmoji, setIconEmoji] = useState(service?.icon_emoji ?? '🔧');
  const [websiteUrl, setWebsiteUrl] = useState(service?.website_url ?? '');
  const [docsUrl, setDocsUrl] = useState(service?.docs_url ?? '');

  const createMutation = useCreateCustomService();
  const updateMutation = useUpdateCustomService();
  const { data: catalogServices } = useCatalogServices();
  const isPending = createMutation.isPending || updateMutation.isPending;

  // 이름으로 글로벌 서비스 매칭 감지 (생성 모드에서만)
  const matchedGlobal = useMemo(() => {
    if (mode !== 'create' || !name.trim() || !catalogServices) return null;
    const nameLower = name.trim().toLowerCase();
    return catalogServices.find(
      (s) => !s.is_custom && s.name.toLowerCase() === nameLower
    ) ?? null;
  }, [mode, name, catalogServices]);

  const resetForm = () => {
    if (mode === 'create') {
      setName('');
      setCategory('other');
      setDescription('');
      setIconEmoji('🔧');
      setWebsiteUrl('');
      setDocsUrl('');
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen && mode === 'edit' && service) {
      setName(service.name);
      setCategory(service.category as ServiceCategory);
      setDescription(service.description ?? '');
      setIconEmoji(service.icon_emoji ?? '🔧');
      setWebsiteUrl(service.website_url ?? '');
      setDocsUrl(service.docs_url ?? '');
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('서비스 이름을 입력해주세요');
      return;
    }

    const payload = {
      name: name.trim(),
      category,
      description: description.trim() || undefined,
      icon_emoji: iconEmoji || undefined,
      website_url: websiteUrl.trim() || undefined,
      docs_url: docsUrl.trim() || undefined,
    };

    try {
      if (mode === 'edit' && service) {
        const result = await updateMutation.mutateAsync({ id: service.id, ...payload });
        toast.success('커스텀 서비스가 수정되었습니다');
        onSuccess?.(result.service);
      } else {
        const result = await createMutation.mutateAsync(payload);
        toast.success('커스텀 서비스가 생성되었습니다');
        onSuccess?.(result.service);
        resetForm();
      }
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '오류가 발생했습니다');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? '커스텀 서비스 수정' : '커스텀 서비스 추가'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? '서비스 정보를 수정합니다'
              : '카탈로그에 없는 서비스를 직접 등록합니다'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 이모지 선택 */}
          <div className="space-y-2">
            <Label>아이콘</Label>
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_PRESETS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIconEmoji(emoji)}
                  className={`h-8 w-8 rounded-md text-base flex items-center justify-center border transition-colors ${
                    iconEmoji === emoji
                      ? 'border-primary bg-primary/10'
                      : 'border-transparent hover:bg-muted'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* 이름 */}
          <div className="space-y-2">
            <Label htmlFor="custom-service-name">이름 *</Label>
            <Input
              id="custom-service-name"
              placeholder="예: 사내 인증 API"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
            {matchedGlobal && (
              <div className="flex items-center gap-2 rounded-md bg-amber-500/10 border border-amber-500/20 px-3 py-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-xs text-amber-700 dark:text-amber-300">
                  카탈로그에 유사한 서비스 &quot;{matchedGlobal.name}&quot;이(가) 있습니다
                </span>
              </div>
            )}
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <Label>카테고리</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ServiceCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <Label htmlFor="custom-service-desc">설명</Label>
            <Textarea
              id="custom-service-desc"
              placeholder="서비스에 대한 간단한 설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={2}
            />
          </div>

          {/* URL 필드 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="custom-service-website">웹사이트</Label>
              <Input
                id="custom-service-website"
                placeholder="https://..."
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                type="url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-service-docs">문서</Label>
              <Input
                id="custom-service-docs"
                placeholder="https://..."
                value={docsUrl}
                onChange={(e) => setDocsUrl(e.target.value)}
                type="url"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !name.trim()}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'edit' ? '수정' : '생성'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
