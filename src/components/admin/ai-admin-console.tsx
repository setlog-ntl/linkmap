'use client';

import { Bot } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AiConfigForm from './ai-config-form';
import AiPersonasTab from './ai-personas-tab';
import AiProvidersTab from './ai-providers-tab';
import AiGuardrailsTab from './ai-guardrails-tab';
import AiTemplatesTab from './ai-templates-tab';
import AiUsageTab from './ai-usage-tab';
import AiPlaygroundTab from './ai-playground-tab';
import AiFeatureMappingTab from './ai-feature-mapping-tab';

export default function AiAdminConsole() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6" />
          AI 어시스턴트 관리
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI 챗봇의 동작, 모델, 안전 설정을 통합 관리합니다
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="general">일반</TabsTrigger>
          <TabsTrigger value="personas">페르소나</TabsTrigger>
          <TabsTrigger value="models">모델</TabsTrigger>
          <TabsTrigger value="safety">안전</TabsTrigger>
          <TabsTrigger value="templates">템플릿</TabsTrigger>
          <TabsTrigger value="usage">사용량</TabsTrigger>
          <TabsTrigger value="playground">테스트</TabsTrigger>
          <TabsTrigger value="feature-mapping">기능 매핑</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <AiConfigForm />
        </TabsContent>

        <TabsContent value="personas">
          <AiPersonasTab />
        </TabsContent>

        <TabsContent value="models">
          <AiProvidersTab />
        </TabsContent>

        <TabsContent value="safety">
          <AiGuardrailsTab />
        </TabsContent>

        <TabsContent value="templates">
          <AiTemplatesTab />
        </TabsContent>

        <TabsContent value="usage">
          <AiUsageTab />
        </TabsContent>

        <TabsContent value="playground">
          <AiPlaygroundTab />
        </TabsContent>

        <TabsContent value="feature-mapping">
          <AiFeatureMappingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
