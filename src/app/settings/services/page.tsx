'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { ServiceIcon } from '@/components/ui/service-icon';
import { useProjects } from '@/lib/queries/projects';
import { useGitHubConnections } from '@/lib/queries/github-connections';
import {
  useMyCustomServices,
  useDeleteCustomService,
  useCustomServiceMatches,
  useMigrateCustomService,
} from '@/lib/queries/services';
import { CreateCustomServiceDialog } from '@/components/service/create-custom-service-dialog';
import {
  Layers, Plus, Wrench, Pencil, Trash2,
  AlertTriangle, ArrowRightLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/keys';

function ConnectionTypeBadge({ type, locale }: { type: string; locale: 'ko' | 'en' }) {
  const colors: Record<string, string> = {
    oauth: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/25',
    api_key: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25',
    manual: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-300 border-zinc-500/25',
  };
  const labels: Record<string, string> = {
    oauth: 'account.connectionOAuth',
    api_key: 'account.connectionApiKey',
    manual: 'account.connectionManual',
  };
  const label = labels[type] ? t(locale, labels[type]) : type;
  return <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${colors[type] || colors.manual}`}>{label}</span>;
}

function StatusBadge({ status, locale }: { status: string; locale: 'ko' | 'en' }) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    expired: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/25',
    error: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/25',
    revoked: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-300 border-zinc-500/25',
  };
  const dotColors: Record<string, string> = { active: 'bg-emerald-400', expired: 'bg-yellow-400', error: 'bg-red-400', revoked: 'bg-zinc-400' };
  const label = t(locale, `account.status${status.charAt(0).toUpperCase() + status.slice(1)}`);
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${colors[status] || colors.revoked}`}>
      <span className={`h-2 w-2 rounded-full ${dotColors[status] || 'bg-zinc-400'}`} />
      {label}
    </span>
  );
}

function ServiceRow({ svc, locale, accounts }: {
  svc: { id: string; status: string; service?: { name: string; slug: string; icon_url: string | null; category: string }; projectId: string; projectName: string };
  locale: 'ko' | 'en';
  accounts?: { login: string; avatarUrl: string }[];
}) {
  const [toggling, setToggling] = useState(false);
  const [localStatus, setLocalStatus] = useState(svc.status);
  const queryClient = useQueryClient();
  const isActive = localStatus === 'active';

  const handleToggle = async (checked: boolean) => {
    setToggling(true);
    try {
      const res = await fetch(`/api/account/service-accounts/${svc.id}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: checked ? 'active' : 'revoked' }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Failed'); }
      setLocalStatus(checked ? 'active' : 'revoked');
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    } catch { /* toggle failed */ } finally { setToggling(false); }
  };

  return (
    <div className={`grid grid-cols-[1fr_110px_100px_100px_90px_56px] gap-3 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-muted/40 transition-colors ${!isActive ? 'opacity-40' : ''}`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
          <ServiceIcon serviceId={svc.service?.slug || ''} size={22} />
        </div>
        <span className="text-[14px] font-medium text-foreground truncate">{svc.service?.name || 'Unknown'}</span>
      </div>
      <div className="flex justify-center">
        {accounts && accounts.length > 0 ? (
          <div className="flex items-center gap-1.5">
            <Avatar className="h-5 w-5"><AvatarImage src={accounts[0].avatarUrl} /><AvatarFallback className="text-[9px]">{accounts[0].login.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
            <span className="text-[12px] text-muted-foreground truncate max-w-[80px]">@{accounts[0].login}</span>
          </div>
        ) : <span className="text-[12px] text-muted-foreground/50">&mdash;</span>}
      </div>
      <div className="text-center">
        <Link href={`/project/${svc.projectId}`} className="text-[13px] text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors truncate">{svc.projectName}</Link>
      </div>
      <div className="flex justify-center"><ConnectionTypeBadge type="manual" locale={locale} /></div>
      <div className="flex justify-center"><StatusBadge status={localStatus} locale={locale} /></div>
      <div className="flex justify-center"><Switch checked={isActive} onCheckedChange={handleToggle} disabled={toggling} /></div>
    </div>
  );
}

export default function ServicesPage() {
  const { locale } = useLocaleStore();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: connections } = useGitHubConnections();
  const { data: customServices, isLoading: customLoading } = useMyCustomServices();
  const { data: matches } = useCustomServiceMatches();
  const deleteMutation = useDeleteCustomService();
  const migrateMutation = useMigrateCustomService();

  const allServices = (projects || []).flatMap((project) =>
    (project.project_services || []).map((ps) => ({ ...ps, projectId: project.id, projectName: project.name }))
  );

  const projectAccountMap = useMemo(() => {
    const map: Record<string, { login: string; avatarUrl: string }[]> = {};
    (connections || []).forEach((conn) => {
      if (conn.status !== 'active') return;
      const metadata = conn.oauth_metadata as Record<string, string>;
      const login = metadata?.login || conn.oauth_provider_user_id || '';
      const avatarUrl = metadata?.avatar_url || '';
      (conn.linked_projects || []).forEach((proj) => {
        if (!map[proj.project_id]) map[proj.project_id] = [];
        map[proj.project_id].push({ login, avatarUrl });
      });
    });
    return map;
  }, [connections]);

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
    try { await deleteMutation.mutateAsync(id); toast.success(`"${name}" 서비스가 삭제되었습니다`); } catch { toast.error('삭제에 실패했습니다'); }
  };

  const handleMigrate = async (customId: string, globalId: string, globalName: string) => {
    try {
      await migrateMutation.mutateAsync({ customServiceId: customId, globalServiceId: globalId });
      toast.success(locale === 'ko' ? `"${globalName}" 글로벌 서비스로 전환되었습니다` : `Migrated to global service "${globalName}"`);
    } catch (err) { toast.error(err instanceof Error ? err.message : '전환에 실패했습니다'); }
  };

  if (projectsLoading || customLoading) {
    return <div className="max-w-3xl"><Skeleton className="h-5 w-48 mb-5" /><Skeleton className="h-44 rounded-xl mb-8" /><Skeleton className="h-5 w-40 mb-5" /><Skeleton className="h-36 rounded-xl" /></div>;
  }

  return (
    <div className="max-w-3xl">
      {/* Connected Services */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-2">{t(locale, 'account.allServices')}</h2>
        <p className="text-[13px] text-muted-foreground mb-5">{t(locale, 'account.allServicesDesc')}</p>

        {allServices.length === 0 ? (
          <EmptyState icon={Layers} title={t(locale, 'account.noServices')} description={t(locale, 'account.noServicesDesc')} />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-[1fr_110px_100px_100px_90px_56px] gap-3 px-5 py-3.5 border-b border-border bg-muted/80">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{t(locale, 'account.colService')}</span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-center">{t(locale, 'account.colAccount')}</span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-center">{t(locale, 'account.colProject')}</span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-center">{t(locale, 'account.colConnectionType')}</span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-center">{t(locale, 'account.colStatus')}</span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-center">{t(locale, 'account.colToggle')}</span>
            </div>
            {allServices.map((svc) => <ServiceRow key={svc.id} svc={svc} locale={locale} accounts={projectAccountMap[svc.projectId]} />)}
          </div>
        )}
      </section>

      {/* Custom Services */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">{locale === 'ko' ? '내 커스텀 서비스' : 'My Custom Services'}</h2>
          <CreateCustomServiceDialog mode="create" trigger={<Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Plus className="h-4 w-4" /></Button>} />
        </div>
        <p className="text-[13px] text-muted-foreground mb-5">
          {locale === 'ko' ? '카탈로그에 없는 서비스를 직접 등록하여 프로젝트에 연결할 수 있습니다' : 'Register services not in the catalog and connect them to projects'}
        </p>

        {!customServices || customServices.length === 0 ? (
          <EmptyState icon={Wrench} title={locale === 'ko' ? '등록한 커스텀 서비스가 없습니다' : 'No custom services yet'}
            description={locale === 'ko' ? '서비스 추가 시 카탈로그에 없는 서비스를 직접 등록할 수 있습니다' : 'You can register custom services when adding services to a project'} />
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
                          {locale === 'ko' ? `"${matched.name}"과(와) 유사한 글로벌 서비스가 카탈로그에 있습니다` : `A similar global service "${matched.name}" exists in the catalog`}
                        </span>
                      </div>
                      <ConfirmDialog
                        title={locale === 'ko' ? '글로벌 서비스로 전환' : 'Migrate to Global Service'}
                        description={locale === 'ko' ? `"${svc.name}" 커스텀 서비스를 "${matched.name}" 글로벌 서비스로 전환합니다.` : `Migrate custom service "${svc.name}" to global service "${matched.name}".`}
                        confirmLabel={locale === 'ko' ? '전환' : 'Migrate'} cancelLabel={locale === 'ko' ? '취소' : 'Cancel'}
                        onConfirm={() => handleMigrate(svc.id, matched.id, matched.name)}
                        trigger={<Button variant="outline" size="sm" className="h-7 text-xs border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15 shrink-0" disabled={migrateMutation.isPending}>
                          <ArrowRightLeft className="h-3 w-3 mr-1.5" />{locale === 'ko' ? '전환' : 'Migrate'}
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
                        title={locale === 'ko' ? '커스텀 서비스 삭제' : 'Delete Custom Service'}
                        description={locale === 'ko' ? `"${svc.name}" 서비스를 삭제하시겠습니까?` : `Delete "${svc.name}"?`}
                        confirmLabel={locale === 'ko' ? '삭제' : 'Delete'} cancelLabel={locale === 'ko' ? '취소' : 'Cancel'} variant="destructive"
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
