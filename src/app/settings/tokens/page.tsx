'use client';

import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { Key } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export default function TokensPage() {
  const { locale } = useLocaleStore();

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-bold mb-5">{t(locale, 'account.apiTokensTab')}</h2>
      <EmptyState
        icon={Key}
        title={locale === 'ko' ? 'API 토큰 관리' : 'API Token Management'}
        description={t(locale, 'account.comingSoon')}
      />
    </div>
  );
}
