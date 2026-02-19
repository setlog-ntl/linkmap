'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServicesContent } from '@/components/project/services-content';
import { ConnectionsContent } from '@/components/project/connections-content';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export default function IntegrationsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const { locale } = useLocaleStore();
  const defaultTab = searchParams.get('tab') || 'services';

  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList>
        <TabsTrigger value="services">{t(locale, 'project.integrationsServices')}</TabsTrigger>
        <TabsTrigger value="connections">{t(locale, 'project.integrationsConnections')}</TabsTrigger>
      </TabsList>
      <TabsContent value="services">
        <ServicesContent projectId={projectId} />
      </TabsContent>
      <TabsContent value="connections">
        <ConnectionsContent projectId={projectId} />
      </TabsContent>
    </Tabs>
  );
}
