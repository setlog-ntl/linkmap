'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Plus, Pencil, Trash2, Save, Star } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { useAiPersonas, useCreateAiPersona, useUpdateAiPersona, useDeleteAiPersona } from '@/lib/queries/ai-config';
import type { AiPersona } from '@/types';

const AVATAR_COLORS = [
  '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B',
  '#EF4444', '#EC4899', '#6366F1', '#14B8A6',
];

const AVATAR_ICONS = [
  'bot', 'brain', 'code', 'palette', 'shield',
  'sparkles', 'zap', 'heart', 'star', 'rocket',
];

type PersonaFormData = {
  name: string;
  name_ko: string;
  description: string;
  system_prompt: string;
  avatar_icon: string;
  avatar_color: string;
  is_default: boolean;
  is_active: boolean;
  provider: string;
  model: string;
  temperature: string;
  max_tokens: string;
};

const emptyForm: PersonaFormData = {
  name: '',
  name_ko: '',
  description: '',
  system_prompt: '',
  avatar_icon: 'bot',
  avatar_color: '#8B5CF6',
  is_default: false,
  is_active: true,
  provider: '',
  model: '',
  temperature: '',
  max_tokens: '',
};

export default function AiPersonasTab() {
  const { data: personas, isLoading } = useAiPersonas();
  const createMutation = useCreateAiPersona();
  const updateMutation = useUpdateAiPersona();
  const deleteMutation = useDeleteAiPersona();

  const { locale } = useLocaleStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PersonaFormData>(emptyForm);

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (p: AiPersona) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      name_ko: p.name_ko || '',
      description: p.description || '',
      system_prompt: p.system_prompt,
      avatar_icon: p.avatar_icon,
      avatar_color: p.avatar_color,
      is_default: p.is_default,
      is_active: p.is_active,
      provider: p.provider || '',
      model: p.model || '',
      temperature: p.temperature != null ? String(p.temperature) : '',
      max_tokens: p.max_tokens != null ? String(p.max_tokens) : '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.system_prompt) {
      toast.error('이름과 시스템 프롬프트는 필수입니다');
      return;
    }

    const providerValue = form.provider as 'openai' | 'anthropic' | 'google' | '';
    const data = {
      name: form.name,
      name_ko: form.name_ko || null,
      description: form.description || null,
      system_prompt: form.system_prompt,
      avatar_icon: form.avatar_icon,
      avatar_color: form.avatar_color,
      is_default: form.is_default,
      is_active: form.is_active,
      provider: providerValue || null,
      model: form.model || null,
      temperature: form.temperature ? Number(form.temperature) : null,
      max_tokens: form.max_tokens ? Number(form.max_tokens) : null,
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...data });
        toast.success('페르소나가 수정되었습니다');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('페르소나가 생성되었습니다');
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '저장에 실패했습니다');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    toast.success('페르소나가 삭제되었습니다');
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-32" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">페르소나 관리</h2>
          <p className="text-sm text-muted-foreground">
            AI 어시스턴트의 성격, 전문분야, 파라미터를 페르소나별로 설정합니다
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-1" />
              페르소나 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? '페르소나 수정' : '새 페르소나'}</DialogTitle>
              <DialogDescription>AI 어시스턴트의 성격과 동작을 정의합니다</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>이름 (EN)</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Code Expert" />
                </div>
                <div className="space-y-2">
                  <Label>이름 (KO)</Label>
                  <Input value={form.name_ko} onChange={(e) => setForm({ ...form, name_ko: e.target.value })} placeholder="코드 전문가" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>설명</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="이 페르소나의 역할..." />
              </div>

              {/* Avatar */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>아이콘</Label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setForm({ ...form, avatar_icon: icon })}
                        className={`px-3 py-1 rounded text-xs border ${form.avatar_icon === icon ? 'border-primary bg-primary/10' : 'border-border'}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>색상</Label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setForm({ ...form, avatar_color: color })}
                        className={`w-8 h-8 rounded-full border-2 ${form.avatar_color === color ? 'border-foreground' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>시스템 프롬프트</Label>
                <Textarea
                  value={form.system_prompt}
                  onChange={(e) => setForm({ ...form, system_prompt: e.target.value })}
                  rows={8}
                  className="font-mono text-sm"
                  placeholder="이 페르소나의 시스템 프롬프트..."
                />
              </div>

              {/* Model Override */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>제공자 오버라이드</Label>
                  <Select value={form.provider || 'none'} onValueChange={(v) => setForm({ ...form, provider: v === 'none' ? '' : v })}>
                    <SelectTrigger><SelectValue placeholder="글로벌 기본값 사용" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">글로벌 기본값</SelectItem>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>모델 오버라이드</Label>
                  <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="글로벌 기본값" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>온도</Label>
                  <Input type="number" min={0} max={2} step={0.1} value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} placeholder="글로벌 기본값" />
                </div>
                <div className="space-y-2">
                  <Label>최대 토큰</Label>
                  <Input type="number" min={256} max={128000} step={256} value={form.max_tokens} onChange={(e) => setForm({ ...form, max_tokens: e.target.value })} placeholder="글로벌 기본값" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                  <Label>활성화</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_default} onCheckedChange={(v) => setForm({ ...form, is_default: v })} />
                  <Label>기본 페르소나</Label>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                <Save className="h-4 w-4 mr-1" />
                {createMutation.isPending || updateMutation.isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Persona List */}
      {(!personas || personas.length === 0) ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            아직 페르소나가 없습니다. 첫 번째 페르소나를 추가해보세요.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {personas.map((p) => (
            <Card key={p.id} className={!p.is_active ? 'opacity-60' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: p.avatar_color }}
                    >
                      {p.avatar_icon.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {p.name_ko || p.name}
                        {p.is_default && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {p.name_ko ? p.name : ''} {p.provider && `· ${p.provider}`} {p.model && `· ${p.model}`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={p.is_active ? 'default' : 'secondary'} className="text-xs">
                      {p.is_active ? '활성' : '비활성'}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      }
                      title={t(locale, 'common.deleteConfirmTitle')}
                      description={t(locale, 'common.deleteConfirmDesc')}
                      confirmLabel={t(locale, 'common.delete')}
                      cancelLabel={t(locale, 'common.cancel')}
                      variant="destructive"
                      onConfirm={() => handleDelete(p.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {p.description_ko || p.description || p.system_prompt.slice(0, 100) + '...'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
