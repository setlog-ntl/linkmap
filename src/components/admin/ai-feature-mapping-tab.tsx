'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAiPersonas } from '@/lib/queries/ai-config';
import { useAiTemplates } from '@/lib/queries/ai-config';
import { useAiFeaturePersonas, useUpdateAiFeaturePersona } from '@/lib/queries/ai-config';
import type { AiFeaturePersona } from '@/types';

const FEATURE_LABELS: Record<string, { ko: string; en: string; desc: string }> = {
  overview_chat: { ko: '개요 AI 채팅', en: 'Overview Chat', desc: '프로젝트 개요에서 사용되는 AI 대화' },
  env_doctor: { ko: 'AI 환경변수 닥터', en: 'Env Doctor', desc: '환경변수 진단 및 분석' },
  map_narrator: { ko: 'AI 아키텍처 분석', en: 'Map Narrator', desc: '서비스맵 분석 및 인사이트' },
  compare_services: { ko: 'AI 서비스 비교', en: 'Service Comparison', desc: '서비스 비교 분석' },
  command: { ko: 'AI 자연어 커맨드', en: 'AI Command', desc: 'AI 자연어 명령어 처리' },
  module_suggest: { ko: 'AI 모듈 추천', en: 'Module Suggest', desc: '모듈 구성 추천' },
};

interface FeatureFormState {
  persona_id: string | null;
  system_prompt_override: string;
  template_ids: string[];
  is_active: boolean;
}

function FeatureCard({ feature }: { feature: AiFeaturePersona }) {
  const { data: personas } = useAiPersonas();
  const { data: templates } = useAiTemplates();
  const updateMutation = useUpdateAiFeaturePersona();
  const label = FEATURE_LABELS[feature.feature_slug];

  const [form, setForm] = useState<FeatureFormState>({
    persona_id: feature.persona_id,
    system_prompt_override: feature.system_prompt_override || '',
    template_ids: feature.template_ids || [],
    is_active: feature.is_active,
  });

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        feature_slug: feature.feature_slug,
        persona_id: form.persona_id,
        system_prompt_override: form.system_prompt_override || null,
        template_ids: form.template_ids,
        is_active: form.is_active,
      });
      toast.success('저장되었습니다');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '저장 실패');
    }
  };

  const toggleTemplate = (id: string) => {
    setForm((prev) => ({
      ...prev,
      template_ids: prev.template_ids.includes(id)
        ? prev.template_ids.filter((t) => t !== id)
        : [...prev.template_ids, id],
    }));
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

        {/* Template multi-select */}
        <div className="space-y-1.5">
          <Label className="text-xs">빠른 액션 템플릿</Label>
          <div className="flex flex-wrap gap-1.5">
            {templates?.map((tmpl) => (
              <Badge
                key={tmpl.id}
                variant={form.template_ids.includes(tmpl.id) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleTemplate(tmpl.id)}
              >
                {tmpl.name}
              </Badge>
            ))}
            {(!templates || templates.length === 0) && (
              <p className="text-xs text-muted-foreground">템플릿이 없습니다</p>
            )}
          </div>
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
      </CardContent>
    </Card>
  );
}

export default function AiFeatureMappingTab() {
  const { data: features, isLoading } = useAiFeaturePersonas();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">기능별 AI 매핑</h3>
        <p className="text-sm text-muted-foreground">
          각 AI 기능에 페르소나와 템플릿을 할당하여 동작을 커스터마이징합니다
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features?.map((f) => (
          <FeatureCard key={f.feature_slug} feature={f} />
        ))}
      </div>
    </div>
  );
}
