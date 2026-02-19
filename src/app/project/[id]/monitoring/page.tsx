'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HealthContent } from '@/components/project/health-content';
import { AuditContent } from '@/components/project/audit-content';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export default function MonitoringPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const { locale } = useLocaleStore();
  const defaultTab = searchParams.get('tab') || 'health';

  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList>
        <TabsTrigger value="health">{t(locale, 'project.monitoringHealth')}</TabsTrigger>
        <TabsTrigger value="audit">{t(locale, 'project.monitoringAudit')}</TabsTrigger>
      </TabsList>
      <TabsContent value="health">
        <HealthContent projectId={projectId} />
      </TabsContent>
      <TabsContent value="audit">
        <AuditContent projectId={projectId} />
      </TabsContent>
    </Tabs>
  );
}
