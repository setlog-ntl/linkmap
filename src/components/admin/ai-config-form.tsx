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
import { Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { AiAssistantConfig } from '@/types';

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

  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [model, setModel] = useState('gpt-4o-mini');
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [isActive, setIsActive] = useState(true);
  const [topP, setTopP] = useState<number | ''>('');
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [responseLang, setResponseLang] = useState('auto');
  const [defaultProvider, setDefaultProvider] = useState('openai');
  const [customInstructions, setCustomInstructions] = useState('');

  const loadConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/ai-config');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          const c = data.config;
          setConfig(c);
          setSystemPrompt(c.system_prompt);
          setModel(c.model);
          setTemperature(Number(c.temperature));
          setMaxTokens(c.max_tokens);
          setIsActive(c.is_active);
          setTopP(c.top_p != null ? Number(c.top_p) : '');
          setFrequencyPenalty(Number(c.frequency_penalty) || 0);
          setPresencePenalty(Number(c.presence_penalty) || 0);
          setResponseLang(c.response_language || 'auto');
          setDefaultProvider(c.default_provider || 'openai');
          setCustomInstructions(c.custom_instructions || '');
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
          top_p: topP === '' ? null : topP,
          frequency_penalty: frequencyPenalty,
          presence_penalty: presencePenalty,
          response_language: responseLang,
          default_provider: defaultProvider,
          custom_instructions: customInstructions || null,
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
    setTopP('');
    setFrequencyPenalty(0);
    setPresencePenalty(0);
    setResponseLang('auto');
    setDefaultProvider('openai');
    setCustomInstructions('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {config && (
        <div className="flex justify-end">
          <Badge variant="outline" className="text-xs">
            마지막 수정: {new Date(config.updated_at).toLocaleString('ko-KR')}
          </Badge>
        </div>
      )}

      {/* System Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">시스템 프롬프트</CardTitle>
          <CardDescription>
            AI가 응답할 때 따르는 기본 지침입니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={10}
            className="font-mono text-sm"
            placeholder="시스템 프롬프트를 입력하세요..."
          />
          <p className="text-xs text-muted-foreground mt-2">{systemPrompt.length}자</p>
        </CardContent>
      </Card>

      {/* Custom Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">커스텀 지침</CardTitle>
          <CardDescription>
            시스템 프롬프트에 추가로 적용할 사용자 지침
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            rows={4}
            className="font-mono text-sm"
            placeholder="추가 지침을 입력하세요... (선택사항)"
          />
        </CardContent>
      </Card>

      {/* Model & Advanced Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">기본 모델 설정</CardTitle>
          <CardDescription>
            기본 제공자, 모델, 생성 파라미터를 설정합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>기본 제공자</Label>
              <Select value={defaultProvider} onValueChange={setDefaultProvider}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="google">Google AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>기본 모델</Label>
              <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="gpt-4o-mini" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>온도 (Temperature)</Label>
                <span className="text-sm font-mono text-muted-foreground">{temperature.toFixed(2)}</span>
              </div>
              <Input
                type="range" min={0} max={2} step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label>최대 토큰 수</Label>
              <Input
                type="number" min={256} max={128000} step={256}
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value, 10) || 4096)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Top P</Label>
                <span className="text-sm font-mono text-muted-foreground">{topP === '' ? '-' : topP}</span>
              </div>
              <Input
                type="range" min={0} max={1} step={0.05}
                value={topP === '' ? 1 : topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Frequency Penalty</Label>
                <span className="text-sm font-mono text-muted-foreground">{frequencyPenalty.toFixed(1)}</span>
              </div>
              <Input
                type="range" min={-2} max={2} step={0.1}
                value={frequencyPenalty}
                onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Presence Penalty</Label>
                <span className="text-sm font-mono text-muted-foreground">{presencePenalty.toFixed(1)}</span>
              </div>
              <Input
                type="range" min={-2} max={2} step={0.1}
                value={presencePenalty}
                onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Response Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>응답 언어</Label>
              <Select value={responseLang} onValueChange={setResponseLang}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">자동 (사용자 언어 따름)</SelectItem>
                  <SelectItem value="ko">한국어</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>설정 활성화</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  비활성화하면 기본 하드코딩된 설정이 사용됩니다
                </p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
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
