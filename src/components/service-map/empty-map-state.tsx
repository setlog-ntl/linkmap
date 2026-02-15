'use client';

import { Map, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useAddProjectService } from '@/lib/queries/services';
import { useState } from 'react';

// 프리셋 정의 (모두 무료 서비스 위주)
const PRESETS = [
  {
    name: '무료 웹앱',
    description: 'Supabase + Vercel + GitHub',
    emoji: '🌐',
    serviceIds: [
      '10000000-0000-4000-a000-000000000001', // Supabase
      '10000000-0000-4000-a000-000000000003', // Vercel
      '10000000-0000-4000-a000-000000000051', // GitHub
    ],
  },
  {
    name: '무료 풀스택',
    description: 'Supabase + Cloudflare + GitHub + Resend',
    emoji: '🚀',
    serviceIds: [
      '10000000-0000-4000-a000-000000000001', // Supabase
      '10000000-0000-4000-a000-000000000028', // Cloudflare
      '10000000-0000-4000-a000-000000000051', // GitHub
      '10000000-0000-4000-a000-000000000008', // Resend
    ],
  },
  {
    name: 'AI 앱 시작',
    description: 'Supabase + Vercel + GitHub + Google Gemini',
    emoji: '🤖',
    serviceIds: [
      '10000000-0000-4000-a000-000000000001', // Supabase
      '10000000-0000-4000-a000-000000000003', // Vercel
      '10000000-0000-4000-a000-000000000051', // GitHub
      '10000000-0000-4000-a000-000000000053', // Google Gemini
    ],
  },
];

interface EmptyMapStateProps {
  projectId: string;
}

export function EmptyMapState({ projectId }: EmptyMapStateProps) {
  const { setCatalogSidebarOpen } = useServiceMapStore();
  const addService = useAddProjectService(projectId);
  const [loadingPreset, setLoadingPreset] = useState<string | null>(null);

  const handlePreset = async (preset: typeof PRESETS[number]) => {
    setLoadingPreset(preset.name);
    try {
      for (const serviceId of preset.serviceIds) {
        await addService.mutateAsync(serviceId);
      }
    } catch {
      // 에러가 나도 추가된 것까지는 유지
    } finally {
      setLoadingPreset(null);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
      <div className="max-w-md text-center space-y-6 p-8">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Map className="h-8 w-8 text-primary" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">서비스 맵을 시작하세요</h3>
          <p className="text-sm text-muted-foreground">
            프로젝트에 사용할 외부 서비스를 추가하고 연결 관계를 시각화하세요.
          </p>
        </div>

        <Button onClick={() => setCatalogSidebarOpen(true)} size="lg">
          <Sparkles className="mr-2 h-4 w-4" />
          서비스 카탈로그 열기
        </Button>

        <div className="space-y-3 pt-2">
          <p className="text-xs text-muted-foreground font-medium">
            빠른 시작 프리셋
          </p>
          <div className="grid gap-2">
            {PRESETS.map((preset) => (
              <Card
                key={preset.name}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => handlePreset(preset)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <span className="text-2xl">{preset.emoji}</span>
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-sm font-medium">{preset.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {preset.description}
                    </div>
                  </div>
                  {loadingPreset === preset.name && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
