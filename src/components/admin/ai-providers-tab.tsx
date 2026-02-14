'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Key, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useAiProviders, useUpdateAiProvider } from '@/lib/queries/ai-config';

const PROVIDER_INFO: Record<string, { description: string; docsUrl: string }> = {
  openai: { description: 'GPT 시리즈 모델 (GPT-4o, o1 등)', docsUrl: 'https://platform.openai.com/docs' },
  anthropic: { description: 'Claude 시리즈 모델', docsUrl: 'https://docs.anthropic.com' },
  google: { description: 'Gemini 시리즈 모델', docsUrl: 'https://ai.google.dev/docs' },
};

export default function AiProvidersTab() {
  const { data: providers, isLoading } = useAiProviders();
  const updateMutation = useUpdateAiProvider();

  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  const handleToggle = async (slug: string, enabled: boolean) => {
    try {
      await updateMutation.mutateAsync({ slug, is_enabled: enabled });
      toast.success(`${slug} ${enabled ? '활성화' : '비활성화'}됨`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '변경에 실패했습니다');
    }
  };

  const handleSaveKey = async (slug: string) => {
    const key = apiKeys[slug];
    if (!key) {
      toast.error('API 키를 입력하세요');
      return;
    }
    setSavingSlug(slug);
    try {
      await updateMutation.mutateAsync({ slug, api_key: key });
      setApiKeys((prev) => ({ ...prev, [slug]: '' }));
      toast.success('API 키가 저장되었습니다');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '저장에 실패했습니다');
    } finally {
      setSavingSlug(null);
    }
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-48" /><Skeleton className="h-48" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">모델 / 제공자 설정</h2>
        <p className="text-sm text-muted-foreground">
          AI 제공자를 활성화하고 API 키를 설정합니다
        </p>
      </div>

      <div className="grid gap-4">
        {(providers || []).map((provider) => {
          const info = PROVIDER_INFO[provider.slug] || { description: '', docsUrl: '' };
          const models = (provider.available_models as Array<{ id: string; name: string; description: string }>) || [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const hasKey = (provider as any).has_api_key;

          return (
            <Card key={provider.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {provider.name}
                      {provider.is_enabled && (
                        <Badge variant="default" className="text-xs">활성</Badge>
                      )}
                      {hasKey && (
                        <Badge variant="outline" className="text-xs">
                          <Key className="h-3 w-3 mr-1" />
                          키 설정됨
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {info.description}
                      {info.docsUrl && (
                        <a
                          href={info.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs text-primary hover:underline"
                        >
                          문서 <ExternalLink className="h-3 w-3 ml-0.5" />
                        </a>
                      )}
                    </CardDescription>
                  </div>
                  <Switch
                    checked={provider.is_enabled}
                    onCheckedChange={(v) => handleToggle(provider.slug, v)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* API Key Input */}
                <div className="space-y-2">
                  <Label>API 키</Label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={apiKeys[provider.slug] || ''}
                      onChange={(e) =>
                        setApiKeys((prev) => ({ ...prev, [provider.slug]: e.target.value }))
                      }
                      placeholder={hasKey ? '••••••••••••(새 키를 입력하면 교체)' : 'API 키를 입력하세요'}
                    />
                    <Button
                      onClick={() => handleSaveKey(provider.slug)}
                      disabled={savingSlug === provider.slug || !apiKeys[provider.slug]}
                    >
                      {savingSlug === provider.slug ? '저장 중...' : '저장'}
                    </Button>
                  </div>
                </div>

                {/* Available Models */}
                <div className="space-y-2">
                  <Label>사용 가능한 모델</Label>
                  <div className="flex flex-wrap gap-2">
                    {models.map((m) => (
                      <Badge key={m.id} variant="secondary" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        {m.name}
                        <span className="text-muted-foreground ml-1">({m.description})</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
