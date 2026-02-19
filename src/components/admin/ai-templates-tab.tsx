'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { useAiTemplates, useCreateAiTemplate, useUpdateAiTemplate, useDeleteAiTemplate } from '@/lib/queries/ai-config';
import type { AiPromptTemplate } from '@/types';

const CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: 'code', label: '코드' },
  { value: 'design', label: '디자인' },
  { value: 'content', label: '콘텐츠' },
  { value: 'debug', label: '디버그' },
  { value: 'general', label: '일반' },
] as const;

type TemplateForm = {
  name: string;
  name_ko: string;
  description: string;
  description_ko: string;
  category: string;
  prompt_text: string;
  prompt_text_ko: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

const emptyForm: TemplateForm = {
  name: '',
  name_ko: '',
  description: '',
  description_ko: '',
  category: 'general',
  prompt_text: '',
  prompt_text_ko: '',
  icon: 'sparkles',
  sort_order: 0,
  is_active: true,
};

export default function AiTemplatesTab() {
  const { data: templates, isLoading } = useAiTemplates();
  const createMutation = useCreateAiTemplate();
  const updateMutation = useUpdateAiTemplate();
  const deleteMutation = useDeleteAiTemplate();

  const { locale } = useLocaleStore();
  const [filter, setFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TemplateForm>(emptyForm);

  const filtered = filter === 'all'
    ? templates
    : templates?.filter((tmpl) => tmpl.category === filter);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (tmpl: AiPromptTemplate) => {
    setEditingId(tmpl.id);
    setForm({
      name: tmpl.name,
      name_ko: tmpl.name_ko || '',
      description: tmpl.description || '',
      description_ko: tmpl.description_ko || '',
      category: tmpl.category,
      prompt_text: tmpl.prompt_text,
      prompt_text_ko: tmpl.prompt_text_ko || '',
      icon: tmpl.icon,
      sort_order: tmpl.sort_order,
      is_active: tmpl.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.prompt_text) {
      toast.error('이름과 프롬프트는 필수입니다');
      return;
    }

    const data = {
      ...form,
      category: form.category as 'code' | 'design' | 'content' | 'debug' | 'general',
      name_ko: form.name_ko || null,
      description: form.description || null,
      description_ko: form.description_ko || null,
      prompt_text_ko: form.prompt_text_ko || null,
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...data });
        toast.success('템플릿이 수정되었습니다');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('템플릿이 생성되었습니다');
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '저장에 실패했습니다');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    toast.success('템플릿이 삭제되었습니다');
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-32" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            프롬프트 템플릿
          </h2>
          <p className="text-sm text-muted-foreground">
            사용자가 빠르게 선택할 수 있는 프롬프트 템플릿을 관리합니다
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" />
              템플릿 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? '템플릿 수정' : '새 템플릿'}</DialogTitle>
              <DialogDescription>프롬프트 템플릿을 정의합니다</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>이름 (EN)</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Fix Bug" />
                </div>
                <div className="space-y-2">
                  <Label>이름 (KO)</Label>
                  <Input value={form.name_ko} onChange={(e) => setForm({ ...form, name_ko: e.target.value })} placeholder="버그 수정" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>설명 (EN)</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>설명 (KO)</Label>
                  <Input value={form.description_ko} onChange={(e) => setForm({ ...form, description_ko: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>카테고리</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.filter((c) => c.value !== 'all').map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>아이콘</Label>
                  <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="sparkles" />
                </div>
                <div className="space-y-2">
                  <Label>정렬 순서</Label>
                  <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>프롬프트 (EN)</Label>
                <Textarea value={form.prompt_text} onChange={(e) => setForm({ ...form, prompt_text: e.target.value })} rows={4} className="font-mono text-sm" />
              </div>

              <div className="space-y-2">
                <Label>프롬프트 (KO)</Label>
                <Textarea value={form.prompt_text_ko} onChange={(e) => setForm({ ...form, prompt_text_ko: e.target.value })} rows={4} className="font-mono text-sm" />
              </div>

              <Button onClick={handleSave} className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                <Save className="h-4 w-4 mr-1" />
                {createMutation.isPending || updateMutation.isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        {CATEGORIES.map((c) => (
          <Button
            key={c.value}
            variant={filter === c.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(c.value)}
          >
            {c.label}
          </Button>
        ))}
      </div>

      {/* Template Grid */}
      {(!filtered || filtered.length === 0) ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            이 카테고리에 템플릿이 없습니다.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((tmpl) => (
            <Card key={tmpl.id} className={!tmpl.is_active ? 'opacity-60' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{tmpl.name_ko || tmpl.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">{tmpl.category}</Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(tmpl)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      }
                      title={t(locale, 'common.deleteConfirmTitle')}
                      description={t(locale, 'common.deleteConfirmDesc')}
                      confirmLabel={t(locale, 'common.delete')}
                      cancelLabel={t(locale, 'common.cancel')}
                      variant="destructive"
                      onConfirm={() => handleDelete(tmpl.id)}
                    />
                  </div>
                </div>
                <CardDescription className="text-xs">
                  {tmpl.description_ko || tmpl.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-mono line-clamp-2">
                  {tmpl.prompt_text_ko || tmpl.prompt_text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
