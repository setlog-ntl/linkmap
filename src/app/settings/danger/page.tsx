'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export default function DangerPage() {
  const router = useRouter();
  const { locale } = useLocaleStore();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-bold mb-5 text-red-600 dark:text-red-400">
        {t(locale, 'account.dangerZone')}
      </h2>
      <div className="rounded-xl border border-red-300/40 dark:border-red-500/30 bg-red-50/50 dark:bg-red-950/20 divide-y divide-red-200/40 dark:divide-red-500/20">
        {/* Logout */}
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <p className="text-[15px] font-semibold text-foreground">{t(locale, 'account.logout')}</p>
            <p className="text-[13px] text-muted-foreground mt-0.5">{t(locale, 'account.logoutDesc')}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300/60 dark:border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/15"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t(locale, 'account.logout')}
          </Button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <p className="text-[15px] font-semibold text-foreground">{t(locale, 'account.deleteAccount')}</p>
            <p className="text-[13px] text-muted-foreground mt-0.5">{t(locale, 'account.deleteAccountDesc')}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300/60 dark:border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/15"
            onClick={() => toast.info(t(locale, 'account.comingSoon'))}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {t(locale, 'account.deleteAccount')}
          </Button>
        </div>
      </div>
    </div>
  );
}
