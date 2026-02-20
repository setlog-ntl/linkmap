'use client';

import { Settings } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

/** @deprecated Settings page is now a single page — this component is kept for backwards compat */
export function SettingsNav() {
  const { locale } = useLocaleStore();

  return (
    <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
      <Settings className="h-6 w-6" />
      {t(locale, 'account.tab')}
    </h1>
  );
}
