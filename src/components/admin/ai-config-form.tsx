'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Bot, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { AiAssistantConfig } from '@/types';

const AVAILABLE_MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', description: '빠르고 경제적' },
  { value: 'gpt-4o', label: 'GPT-4o', description: '고성능' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: '이전 세대' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: '가장 경제적' },
];

const DEFAULT_SYSTEM_PROMPT = `You are a helpful code assistant integrated into a web-based code editor.
The user is editing a website file. Your job is to help them modify their code.

Rules:
- When the user asks you to modify code, respond with the COMPLETE modified file content wrapped in a code block using triple backticks.
- If the user asks a question (not a modification), answer concisely.
- Always respond in the same language as the user's message (Korean if Korean, English if English).
- Keep explanations brief and focused.
- When providing code, always provide the FULL file content, not just the changed parts.`;

export default function AiConfigForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<AiAssistantConfig | null>(null);

  // Form state
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [model, setModel] = useState('gpt-4o-mini');
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [isActive, setIsActive] = useState(true);

  const loadConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/ai-config');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
          setSystemPrompt(data.config.system_prompt);
          setModel(data.config.model);
          setTemperature(Number(data.config.temperature));
          setMaxTokens(data.config.max_tokens);
          setIsActive(data.config.is_active);
        }
      } else if (res.status === 403) {
        toast.error('관리자 권한이 필요합니다');
      }
    } catch {
      toast.error('설정을 불러오는데 실패했습니다');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/ai-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_prompt: systemPrompt,
          model,
          temperature,
          max_tokens: maxTokens,
          is_active: isActive,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || '저장에 실패했습니다');
        return;
      }

      const data = await res.json();
      setConfig(data.config);
      toast.success('AI 설정이 저장되었습니다');
    } catch {
      toast.error('저장에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    setModel('gpt-4o-mini');
    setTemperature(0.3);
    setMaxTokens(4096);
    setIsActive(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI 어시스턴트 설정
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            사이트 편집기 AI 챗봇의 동작을 설정합니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          {config && (
            <Badge variant="outline" className="text-xs">
              마지막 수정: {new Date(config.updated_at).toLocaleString('ko-KR')}
            </Badge>
          )}
        </div>
      </div>

      {/* System Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">시스템 프롬프트</CardTitle>
          <CardDescription>
            AI가 응답할 때 따르는 기본 지침입니다. 파일 경로와 내용은 자동으로 추가됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={12}
            className="font-mono text-sm"
            placeholder="시스템 프롬프트를 입력하세요..."
          />
          <p className="text-xs text-muted-foreground mt-2">
            {systemPrompt.length}자 / 런타임에 파일 경로·내용이 자동 추가됩니다
          </p>
        </CardContent>
      </Card>

      {/* Model & Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">모델 설정</CardTitle>
          <CardDescription>
            사용할 OpenAI 모델과 생성 파라미터를 설정합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Model Select */}
          <div className="space-y-2">
            <Label htmlFor="model">모델</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="모델 선택" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label} — {m.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">온도 (Temperature)</Label>
              <span className="text-sm font-mono text-muted-foreground">{temperature.toFixed(2)}</span>
            </div>
            <Input
              id="temperature"
              type="range"
              min={0}
              max={2}
              step={0.05}
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              낮을수록 일관된 응답, 높을수록 창의적 응답 (코드 수정에는 0.1~0.5 권장)
            </p>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <Label htmlFor="max-tokens">최대 토큰 수</Label>
            <Input
              id="max-tokens"
              type="number"
              min={256}
              max={128000}
              step={256}
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value, 10) || 4096)}
            />
            <p className="text-xs text-muted-foreground">
              응답의 최대 길이 (일반적으로 4096~8192 권장)
            </p>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>설정 활성화</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                비활성화하면 기본 하드코딩된 설정이 사용됩니다
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? '저장 중...' : '설정 저장'}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-1" />
          기본값으로 초기화
        </Button>
      </div>
    </div>
  );
}
