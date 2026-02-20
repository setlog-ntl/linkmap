'use client';

import { useState } from 'react';
import { Save, Loader2, Link2, Plus, Pencil, Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAiPersonas } from '@/lib/queries/ai-config';
import {
  useAiFeaturePersonas,
  useUpdateAiFeaturePersona,
  useAiFeatureQna,
  useCreateAiFeatureQna,
  useUpdateAiFeatureQna,
  useDeleteAiFeatureQna,
  useAiFeaturePresets,
  useApplyAiFeaturePreset,
} from '@/lib/queries/ai-config';
import type { AiFeaturePersona, AiFeatureQna } from '@/types';

const FEATURE_LABELS: Record<string, { ko: string; en: string; desc: string }> = {
  overview_chat: { ko: '개요 AI 채팅', en: 'Overview Chat', desc: '프로젝트 개요에서 사용되는 AI 대화' },
  env_doctor: { ko: 'AI 환경변수 닥터', en: 'Env Doctor', desc: '환경변수 진단 및 분석' },
  map_narrator: { ko: 'AI 아키텍처 분석', en: 'Map Narrator', desc: '서비스맵 분석 및 인사이트' },
  compare_services: { ko: 'AI 서비스 비교', en: 'Service Comparison', desc: '서비스 비교 분석' },
  command: { ko: 'AI 자연어 커맨드', en: 'AI Command', desc: 'AI 자연어 명령어 처리' },
  module_suggest: { ko: 'AI 모듈 추천', en: 'Module Suggest', desc: '모듈 구성 추천' },
};

// ─── Q&A Inline Editor ──────────────────────────────────────────────

interface QnaFormState {
  question: string;
  question_ko: string;
  answer_guide: string;
}

const emptyQnaForm: QnaFormState = { question: '', question_ko: '', answer_guide: '' };

function QnaSection({ featureSlug }: { featureSlug: string }) {
  const { data: qnaList, isLoading } = useAiFeatureQna(featureSlug);
  const createMutation = useCreateAiFeatureQna();
  const updateMutation = useUpdateAiFeatureQna(featureSlug);
  const deleteMutation = useDeleteAiFeatureQna(featureSlug);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<QnaFormState>(emptyQnaForm);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const startEdit = (qna: AiFeatureQna) => {
    setEditingId(qna.id);
    setForm({ question: qna.question, question_ko: qna.question_ko || '', answer_guide: qna.answer_guide });
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyQnaForm);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.question.trim() || !form.answer_guide.trim()) {
      toast.error('질문과 답변 가이드를 모두 입력해주세요');
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          question: form.question,
          question_ko: form.question_ko || null,
          answer_guide: form.answer_guide,
        });
        toast.success('Q&A가 수정되었습니다');
      } else {
        await createMutation.mutateAsync({
          feature_slug: featureSlug,
          question: form.question,
          question_ko: form.question_ko || null,
          answer_guide: form.answer_guide,
          sort_order: (qnaList?.length || 0) + 1,
        });
        toast.success('Q&A가 추가되었습니다');
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyQnaForm);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '저장 실패');
    }
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteMutation.mutateAsync(pendingDeleteId);
      toast.success('Q&A가 삭제되었습니다');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '삭제 실패');
    } finally {
      setPendingDeleteId(null);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-2 border-t pt-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          빠른 Q&A
        </Label>
        <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={startCreate}>
          <Plus className="h-3 w-3" />
          추가
        </Button>
      </div>

      {isLoading && <p className="text-xs text-muted-foreground">불러오는 중...</p>}

      {/* Q&A List */}
      {qnaList?.map((qna) => (
        <div key={qna.id} className="flex items-start gap-2 p-2 rounded-md bg-muted/50 text-xs">
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{qna.question_ko || qna.question}</p>
            <p className="text-muted-foreground truncate mt-0.5">{qna.answer_guide.slice(0, 80)}...</p>
          </div>
          <div className="flex gap-0.5 shrink-0">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => startEdit(qna)}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => setPendingDeleteId(qna.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}

      {!isLoading && (!qnaList || qnaList.length === 0) && !showForm && (
        <p className="text-xs text-muted-foreground">등록된 Q&A가 없습니다</p>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="space-y-2 p-2 rounded-md border bg-background">
          <Input
            placeholder="질문 (English)"
            value={form.question}
            onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
            className="h-7 text-xs"
          />
          <Input
            placeholder="질문 (한국어, 선택)"
            value={form.question_ko}
            onChange={(e) => setForm((p) => ({ ...p, question_ko: e.target.value }))}
            className="h-7 text-xs"
          />
          <Textarea
            placeholder="답변 가이드 (AI가 참고할 지시사항)"
            value={form.answer_guide}
            onChange={(e) => setForm((p) => ({ ...p, answer_guide: e.target.value }))}
            rows={3}
            className="text-xs resize-none"
          />
          <div className="flex gap-1.5">
            <Button size="sm" className="h-7 text-xs flex-1" onClick={handleSubmit} disabled={isMutating}>
              {isMutating && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
              {editingId ? '수정' : '추가'}
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setShowForm(false); setEditingId(null); }}>
              취소
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={!!pendingDeleteId} onOpenChange={(open) => { if (!open) setPendingDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Q&A 삭제</AlertDialogTitle>
            <AlertDialogDescription>이 Q&A를 삭제하시겠습니까?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={(e) => { e.preventDefault(); handleDelete(); }}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Feature Card ───────────────────────────────────────────────────

interface FeatureFormState {
  persona_id: string | null;
  system_prompt_override: string;
  is_active: boolean;
}

function FeatureCard({ feature }: { feature: AiFeaturePersona }) {
  const { data: personas } = useAiPersonas();
  const updateMutation = useUpdateAiFeaturePersona();
  const label = FEATURE_LABELS[feature.feature_slug];

  const [form, setForm] = useState<FeatureFormState>({
    persona_id: feature.persona_id,
    system_prompt_override: feature.system_prompt_override || '',
    is_active: feature.is_active,
  });

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        feature_slug: feature.feature_slug,
        persona_id: form.persona_id,
        system_prompt_override: form.system_prompt_override || null,
        is_active: form.is_active,
      });
      toast.success('저장되었습니다');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '저장 실패');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="h-4 w-4 text-violet-500" />
              {label?.ko || feature.feature_slug}
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {label?.desc || feature.feature_slug}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={form.is_active ? 'default' : 'secondary'} className="text-[10px]">
              {form.is_active ? '활성' : '비활성'}
            </Badge>
            <Switch
              checked={form.is_active}
              onCheckedChange={(checked) => setForm((p) => ({ ...p, is_active: checked }))}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Persona select */}
        <div className="space-y-1.5">
          <Label className="text-xs">페르소나</Label>
          <Select
            value={form.persona_id || '__none__'}
            onValueChange={(v) => setForm((p) => ({ ...p, persona_id: v === '__none__' ? null : v }))}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="기본 설정" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">기본 설정</SelectItem>
              {personas?.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* System prompt override */}
        <div className="space-y-1.5">
          <Label className="text-xs">시스템 프롬프트 오버라이드</Label>
          <Textarea
            value={form.system_prompt_override}
            onChange={(e) => setForm((p) => ({ ...p, system_prompt_override: e.target.value }))}
            placeholder="기능별 추가 지시사항 (선택사항)"
            rows={3}
            className="text-sm resize-none"
          />
        </div>

        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="w-full gap-1.5"
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          저장
        </Button>

        {/* Inline Q&A section */}
        <QnaSection featureSlug={feature.feature_slug} />
      </CardContent>
    </Card>
  );
}

// ─── Preset Bar ─────────────────────────────────────────────────────

function PresetBar() {
  const { data: presets } = useAiFeaturePresets();
  const applyMutation = useApplyAiFeaturePreset();
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const selected = presets?.find((p) => p.key === selectedPreset);

  const handleApply = async () => {
    if (!selectedPreset) return;
    try {
      const result = await applyMutation.mutateAsync(selectedPreset);
      toast.success(`프리셋 "${selected?.name_ko}"이(가) 적용되었습니다 (Q&A ${result.qna_inserted}개)`);
      setSelectedPreset('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '프리셋 적용 실패');
    } finally {
      setConfirmOpen(false);
    }
  };

  if (!presets || presets.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        <Select value={selectedPreset} onValueChange={setSelectedPreset}>
          <SelectTrigger className="h-8 w-[200px] text-sm">
            <SelectValue placeholder="프리셋 선택..." />
          </SelectTrigger>
          <SelectContent>
            {presets.map((p) => (
              <SelectItem key={p.key} value={p.key}>
                {p.name_ko} ({p.qna_count}개 Q&A)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5"
          disabled={!selectedPreset || applyMutation.isPending}
          onClick={() => setConfirmOpen(true)}
        >
          {applyMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          적용
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>프리셋 적용</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{selected?.name_ko}&quot; 프리셋을 적용하면 모든 기능의 시스템 프롬프트와 Q&A가 교체됩니다.
              기존 Q&A는 삭제됩니다. 계속하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); handleApply(); }}>
              {applyMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
              적용
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Main Tab ───────────────────────────────────────────────────────

export default function AiFeatureMappingTab() {
  const { data: features, isLoading } = useAiFeaturePersonas();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">초기화 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">기능별 AI 설정</h3>
          <p className="text-sm text-muted-foreground">
            각 AI 기능에 페르소나와 빠른 Q&A를 설정하여 동작을 커스터마이징합니다
          </p>
        </div>
        <PresetBar />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features?.map((f) => (
          <FeatureCard key={f.feature_slug} feature={f} />
        ))}
      </div>
    </div>
  );
}
