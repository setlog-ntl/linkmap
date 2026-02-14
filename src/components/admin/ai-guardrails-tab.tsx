'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, Shield, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAiGuardrails, useUpdateAiGuardrails } from '@/lib/queries/ai-config';
import type { ContentFilterLevel } from '@/types';

const FILTER_LEVELS: { value: ContentFilterLevel; label: string; desc: string }[] = [
  { value: 'off', label: '끔', desc: '필터 없음' },
  { value: 'low', label: '낮음', desc: '최소 필터링' },
  { value: 'medium', label: '보통', desc: '일반적 필터링' },
  { value: 'high', label: '높음', desc: '엄격한 필터링' },
];

const FILTER_CATEGORIES = [
  { key: 'content_filter_hate', label: '혐오 발언' },
  { key: 'content_filter_violence', label: '폭력' },
  { key: 'content_filter_sexual', label: '성적 콘텐츠' },
  { key: 'content_filter_self_harm', label: '자해' },
] as const;

export default function AiGuardrailsTab() {
  const { data: guardrails, isLoading } = useAiGuardrails();
  const updateMutation = useUpdateAiGuardrails();

  const [filters, setFilters] = useState<Record<string, ContentFilterLevel>>({
    content_filter_hate: 'medium',
    content_filter_violence: 'medium',
    content_filter_sexual: 'high',
    content_filter_self_harm: 'high',
  });
  const [deniedTopics, setDeniedTopics] = useState<string[]>([]);
  const [blockedWords, setBlockedWords] = useState<string[]>([]);
  const [maxTurns, setMaxTurns] = useState(50);
  const [maxInputTokens, setMaxInputTokens] = useState(4096);
  const [topicInput, setTopicInput] = useState('');
  const [wordInput, setWordInput] = useState('');

  useEffect(() => {
    if (guardrails) {
      setFilters({
        content_filter_hate: guardrails.content_filter_hate,
        content_filter_violence: guardrails.content_filter_violence,
        content_filter_sexual: guardrails.content_filter_sexual,
        content_filter_self_harm: guardrails.content_filter_self_harm,
      });
      setDeniedTopics(guardrails.denied_topics || []);
      setBlockedWords(guardrails.blocked_words || []);
      setMaxTurns(guardrails.max_conversation_turns);
      setMaxInputTokens(guardrails.max_input_tokens);
    }
  }, [guardrails]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        ...filters,
        denied_topics: deniedTopics,
        blocked_words: blockedWords,
        max_conversation_turns: maxTurns,
        max_input_tokens: maxInputTokens,
      });
      toast.success('가드레일 설정이 저장되었습니다');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '저장에 실패했습니다');
    }
  };

  const addTag = (type: 'topic' | 'word') => {
    const input = type === 'topic' ? topicInput.trim() : wordInput.trim();
    if (!input) return;
    if (type === 'topic') {
      if (!deniedTopics.includes(input)) setDeniedTopics([...deniedTopics, input]);
      setTopicInput('');
    } else {
      if (!blockedWords.includes(input)) setBlockedWords([...blockedWords, input]);
      setWordInput('');
    }
  };

  const removeTag = (type: 'topic' | 'word', value: string) => {
    if (type === 'topic') setDeniedTopics(deniedTopics.filter((t) => t !== value));
    else setBlockedWords(blockedWords.filter((w) => w !== value));
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-48" /><Skeleton className="h-48" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          안전 가드레일
        </h2>
        <p className="text-sm text-muted-foreground">
          AI 응답의 안전성을 제어하는 필터와 제한을 설정합니다
        </p>
      </div>

      {/* Content Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">콘텐츠 필터</CardTitle>
          <CardDescription>각 카테고리별 필터 수준을 설정합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {FILTER_CATEGORIES.map((cat) => (
              <div key={cat.key} className="space-y-2">
                <Label>{cat.label}</Label>
                <Select
                  value={filters[cat.key]}
                  onValueChange={(v: ContentFilterLevel) => setFilters({ ...filters, [cat.key]: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FILTER_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label} — {level.desc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Denied Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">거부 토픽</CardTitle>
          <CardDescription>이 키워드가 포함된 메시지는 거부됩니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag('topic')}
              placeholder="토픽 키워드 입력 후 Enter"
            />
            <Button variant="outline" onClick={() => addTag('topic')}>추가</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {deniedTopics.map((t) => (
              <Badge key={t} variant="destructive" className="text-xs cursor-pointer" onClick={() => removeTag('topic', t)}>
                {t} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blocked Words */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">차단 단어</CardTitle>
          <CardDescription>이 단어가 포함된 메시지는 차단됩니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag('word')}
              placeholder="차단 단어 입력 후 Enter"
            />
            <Button variant="outline" onClick={() => addTag('word')}>추가</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {blockedWords.map((w) => (
              <Badge key={w} variant="outline" className="text-xs cursor-pointer" onClick={() => removeTag('word', w)}>
                {w} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">대화 제한</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>최대 대화 턴</Label>
              <Input
                type="number" min={1} max={200}
                value={maxTurns}
                onChange={(e) => setMaxTurns(parseInt(e.target.value, 10) || 50)}
              />
            </div>
            <div className="space-y-2">
              <Label>최대 입력 토큰</Label>
              <Input
                type="number" min={100} max={128000}
                value={maxInputTokens}
                onChange={(e) => setMaxInputTokens(parseInt(e.target.value, 10) || 4096)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateMutation.isPending}>
        <Save className="h-4 w-4 mr-1" />
        {updateMutation.isPending ? '저장 중...' : '가드레일 저장'}
      </Button>
    </div>
  );
}
