'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, Loader2, Trash, FlaskConical } from 'lucide-react';
import { toast } from 'sonner';
import { useAiPersonas, useAiProviders, useAiPlayground } from '@/lib/queries/ai-config';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AiPlaygroundTab() {
  const { data: personas } = useAiPersonas();
  const { data: providers } = useAiProviders();
  const playgroundMutation = useAiPlayground();

  const [personaId, setPersonaId] = useState<string>('none');
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-4o-mini');
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [systemPrompt, setSystemPrompt] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [lastMeta, setLastMeta] = useState<{
    usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    response_time_ms: number;
  } | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When persona changes, update model/provider overrides
  useEffect(() => {
    if (personaId === 'none' || !personas) return;
    const persona = personas.find((p) => p.id === personaId);
    if (persona) {
      if (persona.provider) setProvider(persona.provider);
      if (persona.model) setModel(persona.model);
      if (persona.temperature != null) setTemperature(Number(persona.temperature));
      if (persona.max_tokens != null) setMaxTokens(persona.max_tokens);
      setSystemPrompt(persona.system_prompt);
    }
  }, [personaId, personas]);

  // Update models list when provider changes
  const selectedProvider = providers?.find((p) => p.slug === provider);
  const availableModels = (selectedProvider?.available_models as Array<{ id: string; name: string }>) || [];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    try {
      const result = await playgroundMutation.mutateAsync({
        messages: newMessages,
        persona_id: personaId === 'none' ? undefined : personaId,
        provider: provider as 'openai' | 'anthropic' | 'google',
        model,
        temperature,
        max_tokens: maxTokens,
        system_prompt: systemPrompt || undefined,
      });

      setMessages([...newMessages, { role: 'assistant', content: result.reply }]);
      setLastMeta({ usage: result.usage, response_time_ms: result.response_time_ms });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '테스트 실행 실패');
      // Remove the user message on error
      setMessages(messages);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setLastMeta(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          테스트 플레이그라운드
        </h2>
        <p className="text-sm text-muted-foreground">
          페르소나/모델을 선택하고 직접 테스트합니다
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">테스트 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>페르소나</Label>
                <Select value={personaId} onValueChange={setPersonaId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">선택 안 함</SelectItem>
                    {(personas || []).filter((p) => p.is_active).map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name_ko || p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>제공자</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(providers || []).filter((p) => p.is_enabled).map((p) => (
                      <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>모델</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {availableModels.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                    <SelectItem value={model}>{model}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>온도</Label>
                  <span className="text-xs font-mono">{temperature.toFixed(2)}</span>
                </div>
                <Input
                  type="range" min={0} max={2} step={0.05}
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label>최대 토큰</Label>
                <Input
                  type="number" min={256} max={128000} step={256}
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value, 10) || 4096)}
                />
              </div>

              <div className="space-y-2">
                <Label>시스템 프롬프트</Label>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={4}
                  className="font-mono text-xs"
                  placeholder="커스텀 시스템 프롬프트..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Last Response Meta */}
          {lastMeta && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">응답 메타데이터</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">프롬프트 토큰</span>
                  <span>{lastMeta.usage.prompt_tokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">완료 토큰</span>
                  <span>{lastMeta.usage.completion_tokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 토큰</span>
                  <span className="font-bold">{lastMeta.usage.total_tokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">응답 시간</span>
                  <span>{lastMeta.response_time_ms}ms</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Chat */}
        <div className="col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">
                채팅
                <Badge variant="outline" className="ml-2 text-xs">{provider}/{model}</Badge>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={clearChat}>
                <Trash className="h-3 w-3 mr-1" />
                초기화
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-12">
                    메시지를 입력하여 테스트를 시작하세요
                  </p>
                )}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {playgroundMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="메시지를 입력하세요..."
                  disabled={playgroundMutation.isPending}
                />
                <Button onClick={handleSend} disabled={playgroundMutation.isPending || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
