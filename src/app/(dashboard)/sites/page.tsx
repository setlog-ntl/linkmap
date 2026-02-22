'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import { Rocket, Monitor } from 'lucide-react';
import { OneclickPageClient } from '@/components/oneclick/oneclick-page-client';
import { MySitesClient } from '@/components/my-sites/my-sites-client';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export default function SitesPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'new';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { locale } = useLocaleStore();

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t(locale, 'nav.sites')}</h1>
        <p className="text-muted-foreground mt-1">
          {locale === 'ko'
            ? '템플릿을 선택해 사이트를 배포하고, 배포된 사이트를 관리하세요.'
            : 'Deploy sites from templates and manage your deployed sites.'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="new" className="gap-2">
            <Rocket className="h-4 w-4" />
            {locale === 'ko' ? '새 사이트 만들기' : 'Create New Site'}
          </TabsTrigger>
          <TabsTrigger value="manage" className="gap-2">
            <Monitor className="h-4 w-4" />
            {locale === 'ko' ? '내 사이트' : 'My Sites'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <OneclickPageClient isAuthenticated={true} />
        </TabsContent>

        <TabsContent value="manage">
          <MySitesClient />
        </TabsContent>
      </Tabs>
    </div>
  );
}
