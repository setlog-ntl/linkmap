'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  useMyCustomServices,
  useDeleteCustomService,
  useCustomServiceMatches,
  useMigrateCustomService,
} from '@/lib/queries/services';
import { CreateCustomServiceDialog } from '@/components/service/create-custom-service-dialog';
import {
  Key, Plus, Wrench, Pencil, Trash2,
  AlertTriangle, ArrowRightLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export default function DeveloperPage() {
  const { locale } = useLocaleStore();
  const { data: customServices, isLoading: customLoading } = useMyCustomServices();
  const { data: matches } = useCustomServiceMatches();
  const deleteMutation = useDeleteCustomService();
  const migrateMutation = useMigrateCustomService();

  const matchMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    if (matches) { for (const m of matches) { map.set(m.customService.id, { id: m.globalService.id, name: m.globalService.name }); } }
    return map;
  }, [matches]);

  const categoryLabels: Record<string, string> = {
    auth: '인증', social_login: '소셜 로그인', database: '데이터베이스', deploy: '배포',
    email: '이메일', payment: '결제', storage: '스토리지', monitoring: '모니터링', ai: 'AI', other: '기타',
  };

  const handleDelete = async (id: string, name: string) => {
    try { await deleteMutation.mutateAsync(id); toast.success(`"${name}" ${t(locale, 'developer.deleteSuccess')}`); } catch { toast.error(t(locale, 'developer.deleteFailed')); }
  };

  const handleMigrate = async (customId: string, globalId: string, globalName: string) => {
    try {
      await migrateMutation.mutateAsync({ customServiceId: customId, globalServiceId: globalId });
      toast.success(`"${globalName}" ${t(locale, 'developer.migrateSuccess')}`);
    } catch (err) { toast.error(err instanceof Error ? err.message : t(locale, 'developer.migrateFailed')); }
  };

  if (customLoading) {
    return <div className="max-w-3xl"><Skeleton className="h-5 w-48 mb-5" /><Skeleton className="h-44 rounded-xl mb-8" /><Skeleton className="h-36 rounded-xl" /></div>;
  }

  return (
    <div className="max-w-3xl space-y-10">
      {/* API Tokens */}
      <section>
        <h2 className="text-lg font-bold mb-2">{t(locale, 'account.apiTokensTab')}</h2>
        <p className="text-[13px] text-muted-foreground mb-5">{t(locale, 'account.developerDesc')}</p>
        <EmptyState
          icon={Key}
          title={t(locale, 'developer.apiTokenTitle')}
          description={t(locale, 'account.comingSoon')}
        />
      </section>

      {/* Custom Services */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">{t(locale, 'developer.customServicesTitle')}</h2>
          <CreateCustomServiceDialog mode="create" trigger={<Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Plus className="h-4 w-4" /></Button>} />
        </div>
        <p className="text-[13px] text-muted-foreground mb-5">
          {t(locale, 'developer.customServicesDesc')}
        </p>

        {!customServices || customServices.length === 0 ? (
          <EmptyState icon={Wrench} title={t(locale, 'developer.emptyTitle')}
            description={t(locale, 'developer.emptyDesc')} />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
            {customServices.map((svc) => {
              const matched = matchMap.get(svc.id);
              return (
                <div key={svc.id}>
                  {matched && (
                    <div className="flex items-center justify-between gap-3 px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20">
                      <div className="flex items-center gap-2 min-w-0">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="text-[13px] text-amber-700 dark:text-amber-300 truncate">
                          {`"${matched.name}" ${t(locale, 'developer.matchBanner')}`}
                        </span>
                      </div>
                      <ConfirmDialog
                        title={t(locale, 'developer.migrateTitle')}
                        description={`"${svc.name}" → "${matched.name}" — ${t(locale, 'developer.migrateDesc')}`}
                        confirmLabel={t(locale, 'developer.migrateConfirm')} cancelLabel={t(locale, 'common.cancel')}
                        onConfirm={() => handleMigrate(svc.id, matched.id, matched.name)}
                        trigger={<Button variant="outline" size="sm" className="h-7 text-xs border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15 shrink-0" disabled={migrateMutation.isPending}>
                          <ArrowRightLeft className="h-3 w-3 mr-1.5" />{t(locale, 'developer.migrateConfirm')}
                        </Button>}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-9 w-9 rounded-lg bg-muted/60 flex items-center justify-center text-lg shrink-0">{svc.icon_emoji || '⚙️'}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-medium truncate">{svc.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-muted-foreground">{categoryLabels[svc.category] || svc.category}</span>
                          <span className="text-[11px] text-muted-foreground/50">{new Date(svc.created_at).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <CreateCustomServiceDialog mode="edit" service={svc} trigger={<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></Button>} />
                      <ConfirmDialog
                        title={t(locale, 'developer.deleteTitle')}
                        description={`"${svc.name}" — ${t(locale, 'developer.deleteConfirmDesc')}`}
                        confirmLabel={t(locale, 'common.delete')} cancelLabel={t(locale, 'common.cancel')} variant="destructive"
                        onConfirm={() => handleDelete(svc.id, svc.name)}
                        trigger={<Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
