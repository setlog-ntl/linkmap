'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { ServiceIcon } from '@/components/ui/service-icon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useGitHubConnections,
  useDeleteGitHubConnection,
  useDisconnectGitHubConnection,
  useRenameGitHubConnection,
} from '@/lib/queries/github-connections';
import { useProjects } from '@/lib/queries/projects';
import {
  GitBranch, Pencil, Plus, Check, X,
  ExternalLink, FolderOpen,
  ArrowLeft, Calendar, LogOut, AlertTriangle,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/keys';
import type { GitHubConnection } from '@/types';

// ─── Types ──────────────────────────────────────────────

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  provider: string;
  createdAt: string;
}

// ─── Status & Connection helpers (Stitch palette) ───────

function statusDotColor(status: string): string {
  switch (status) {
    case 'active': return 'bg-emerald-400';
    case 'expired': return 'bg-yellow-400';
    case 'error': return 'bg-red-400';
    case 'revoked': return 'bg-zinc-400';
    default: return 'bg-zinc-400';
  }
}

function StatusBadge({ status, locale }: { status: string; locale: 'ko' | 'en' }) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    expired: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/25',
    error: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/25',
    revoked: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-300 border-zinc-500/25',
  };
  const color = colors[status] || colors.revoked;
  const label = t(locale, `account.status${status.charAt(0).toUpperCase() + status.slice(1)}`);

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${color}`}>
      <span className={`h-2 w-2 rounded-full ${statusDotColor(status)}`} />
      {label}
    </span>
  );
}

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
  const color = colors[type] || colors.manual;
  const label = labels[type] ? t(locale, labels[type]) : type;

  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${color}`}>
      {label}
    </span>
  );
}

// ─── GitHubConnectionCard ───────────────────────────────

function GitHubConnectionCard({ connection }: { connection: GitHubConnection }) {
  const { locale } = useLocaleStore();
  const deleteMutation = useDeleteGitHubConnection();
  const disconnectMutation = useDisconnectGitHubConnection();
  const renameMutation = useRenameGitHubConnection();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(connection.display_name || '');
  const [toggling, setToggling] = useState(false);

  const metadata = connection.oauth_metadata as Record<string, string>;
  const login = metadata?.login || connection.oauth_provider_user_id || 'unknown';
  const avatarUrl = metadata?.avatar_url;
  const hasLinkedRepos = (connection.linked_repos_count ?? 0) > 0;
  const isActive = connection.status === 'active';

  const handleRename = async () => {
    if (!editName.trim()) return;
    try {
      await renameMutation.mutateAsync({ id: connection.id, display_name: editName.trim() });
      toast.success(t(locale, 'account.connectionRenamed'));
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    }
  };

  const handleToggleStatus = async (checked: boolean) => {
    setToggling(true);
    try {
      const res = await fetch(`/api/account/github-connections/${connection.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: checked ? 'active' : 'revoked' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.github.connections });
      toast.success(t(locale, checked ? 'account.statusActive' : 'account.deactivated'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className={`rounded-xl border border-border bg-card text-card-foreground p-5 transition-opacity ${!isActive ? 'opacity-40' : ''}`}>
      {/* Header: avatar + name + toggle + status badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <Avatar className="h-11 w-11 ring-2 ring-border">
            <AvatarImage src={avatarUrl} alt={login} />
            <AvatarFallback className="text-base font-semibold">{login.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              {editing ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-8 text-sm w-44"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename();
                      if (e.key === 'Escape') setEditing(false);
                    }}
                  />
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRename} disabled={renameMutation.isPending}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="font-semibold text-[15px] text-foreground">{connection.display_name || login}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => { setEditName(connection.display_name || login); setEditing(true); }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
            <a
              href={`https://github.com/${login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors mt-0.5"
            >
              @{login}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={isActive}
            onCheckedChange={handleToggleStatus}
            disabled={toggling}
            aria-label={t(locale, 'account.toggleActive')}
          />
          <StatusBadge status={connection.status} locale={locale} />
        </div>
      </div>

      {/* SCOPES */}
      {connection.oauth_scopes && connection.oauth_scopes.length > 0 && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            {t(locale, 'account.scopes')}
          </span>
          {connection.oauth_scopes.map((scope) => (
            <span
              key={scope}
              className="inline-flex text-xs px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono border border-border"
            >
              {scope}
            </span>
          ))}
        </div>
      )}

      {connection.error_message && (
        <p className="text-sm text-red-400 mt-3">{connection.error_message}</p>
      )}

      {/* PROJECTS */}
      {connection.linked_projects && connection.linked_projects.length > 0 && (
        <div className="mt-4 flex items-start gap-2.5">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase pt-0.5">
            Projects
          </span>
          <div className="flex flex-col gap-1.5">
            {connection.linked_projects.map((proj) => (
              <Link
                key={proj.project_id}
                href={`/project/${proj.project_id}`}
                className="inline-flex items-center gap-1.5 text-[13px] text-foreground/80 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{proj.project_name}</span>
                <span className="text-muted-foreground">
                  ({proj.repo_count} {t(locale, 'account.repoCount')})
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Action row: Unlink / Delete Data */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-end gap-5">
        {hasLinkedRepos && (
          <ConfirmDialog
            trigger={
              <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Unlink
              </button>
            }
            title={t(locale, 'account.disconnect')}
            description={t(locale, 'account.disconnectConfirm')}
            confirmLabel={t(locale, 'account.disconnect')}
            cancelLabel={t(locale, 'common.cancel')}
            variant="destructive"
            onConfirm={async () => {
              try {
                await disconnectMutation.mutateAsync(connection.id);
                toast.success(t(locale, 'account.disconnectSuccess'));
              } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Failed');
              }
            }}
          />
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                {hasLinkedRepos ? (
                  <span className="text-[13px] text-muted-foreground/50 cursor-not-allowed">
                    Delete Data
                  </span>
                ) : (
                  <ConfirmDialog
                    trigger={
                      <button className="text-[13px] text-red-400 hover:text-red-300 transition-colors cursor-pointer">
                        Delete Data
                      </button>
                    }
                    title={t(locale, 'account.deleteConnection')}
                    description={t(locale, 'account.deleteConnectionConfirm')}
                    confirmLabel={t(locale, 'common.delete')}
                    cancelLabel={t(locale, 'common.cancel')}
                    variant="destructive"
                    onConfirm={async () => {
                      try {
                        await deleteMutation.mutateAsync(connection.id);
                        toast.success(t(locale, 'account.connectionDeleted'));
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : 'Failed');
                      }
                    }}
                  />
                )}
              </span>
            </TooltipTrigger>
            {hasLinkedRepos && (
              <TooltipContent>
                <p>{t(locale, 'account.deleteBlocked')}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [savingName, setSavingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { locale } = useLocaleStore();
  const { data: connections, isLoading: connectionsLoading } = useGitHubConnections();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('oauth_success') === 'github') {
      toast.success(t(locale, 'account.connectionAdded'));
    }
  }, [searchParams, locale]);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const provider = user.app_metadata?.provider || 'email';
      setProfile({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email || '',
        avatarUrl: user.user_metadata?.avatar_url || '',
        provider: provider.charAt(0).toUpperCase() + provider.slice(1),
        createdAt: user.created_at,
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddGitHub = () => {
    window.location.href = '/api/oauth/github/authorize?flow_context=settings';
  };

  const handleSaveName = async () => {
    if (!nameValue.trim() || !profile) return;
    setSavingName(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameValue.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      setProfile((prev) => prev ? { ...prev, name: nameValue.trim() } : prev);
      toast.success(t(locale, 'account.nameUpdated'));
      setEditingName(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSavingName(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Flatten all project_services across all projects
  const allServices = (projects || []).flatMap((project) =>
    (project.project_services || []).map((ps) => ({
      ...ps,
      projectId: project.id,
      projectName: project.name,
    }))
  );

  // Map projectId → linked GitHub account(s) for account info display
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

  const isLoading = loading || connectionsLoading || projectsLoading;

  if (isLoading) {
    return (
      <div className="container py-10 max-w-3xl mx-auto">
        <Skeleton className="h-5 w-48 mb-8" />
        <Skeleton className="h-28 mb-12 rounded-xl" />
        <Skeleton className="h-5 w-36 mb-5" />
        <Skeleton className="h-44 rounded-xl mb-12" />
        <Skeleton className="h-5 w-40 mb-5" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <div className="container py-10 max-w-3xl mx-auto">
      {/* ── Back Navigation ── */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="h-4 w-4" />
        {t(locale, 'account.backToDashboard')}
      </Link>

      {/* ── 1. Profile Card ── */}
      {profile && (
        <Card className="mb-12 bg-card border-border text-card-foreground">
          <CardContent className="p-7">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar size="lg" className="ring-2 ring-border">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback className="text-xl font-bold bg-muted text-foreground">{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-1 -right-1 text-[9px] px-1.5 py-0 bg-violet-600 border-0 text-white">
                  {profile.provider}
                </Badge>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  {editingName ? (
                    <div className="flex items-center gap-1.5">
                      <Input
                        ref={nameInputRef}
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        className="h-9 text-base w-52 bg-muted border-border"
                        placeholder={t(locale, 'account.namePlaceholder')}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName();
                          if (e.key === 'Escape') setEditingName(false);
                        }}
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleSaveName} disabled={savingName}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setEditingName(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-xl font-bold text-foreground">{profile.name}</h1>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => { setNameValue(profile.name); setEditingName(true); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
                <p className="text-[15px] text-muted-foreground mt-1">{profile.email}</p>
                <p className="text-[13px] text-muted-foreground/70 mt-2 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(profile.createdAt).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 2. GitHub Accounts ── */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">
            GitHub {t(locale, 'account.tab')}
          </h2>
          <Button onClick={handleAddGitHub} size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {!connections || connections.length === 0 ? (
          <EmptyState
            icon={GitBranch}
            title={t(locale, 'account.noGitHubConnections')}
            description={t(locale, 'account.noGitHubConnectionsDesc')}
            action={{ label: t(locale, 'account.addGitHub'), onClick: handleAddGitHub }}
          />
        ) : (
          <div className="space-y-3">
            {connections.map((conn) => (
              <GitHubConnectionCard key={conn.id} connection={conn} />
            ))}
          </div>
        )}
      </section>

      {/* ── 3. Connected Services (all projects) ── */}
      <section className="mb-12">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-foreground">{t(locale, 'account.allServices')}</h2>
          <p className="text-[13px] text-muted-foreground mt-1">{t(locale, 'account.allServicesDesc')}</p>
        </div>

        {allServices.length === 0 ? (
          <EmptyState
            icon={Layers}
            title={t(locale, 'account.noServices')}
            description={t(locale, 'account.noServicesDesc')}
          />
        ) : (
          <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_110px_100px_100px_90px_56px] gap-3 px-5 py-3.5 border-b border-border bg-muted/80 text-foreground">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                {t(locale, 'account.colService')}
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-center">
                {t(locale, 'account.colAccount')}
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-center">
                {t(locale, 'account.colProject')}
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-center">
                {t(locale, 'account.colConnectionType')}
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-center">
                {t(locale, 'account.colStatus')}
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-center">
                {t(locale, 'account.colToggle')}
              </span>
            </div>

            {/* Table Rows */}
            {allServices.map((svc) => (
              <ServiceRow key={svc.id} svc={svc} locale={locale} accounts={projectAccountMap[svc.projectId]} />
            ))}
          </div>
        )}
      </section>

      {/* ── 4. Danger Zone ── */}
      <section className="mb-12">
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
            <Button variant="outline" size="sm" className="border-red-300/60 dark:border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/15 hover:text-red-500 dark:hover:text-red-300" onClick={handleLogout}>
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
              className="border-red-300/60 dark:border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/15 hover:text-red-500 dark:hover:text-red-300"
              onClick={() => toast.info(t(locale, 'account.comingSoon'))}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              {t(locale, 'account.deleteAccount')}
            </Button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

// ─── Service Row (separated for toggle state) ───────────

function ServiceRow({
  svc,
  locale,
  accounts,
}: {
  svc: {
    id: string;
    status: string;
    service?: { name: string; slug: string; icon_url: string | null; category: string };
    projectId: string;
    projectName: string;
  };
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
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: checked ? 'active' : 'revoked' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      setLocalStatus(checked ? 'active' : 'revoked');
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    } catch {
      // Toggle failed — status stays as is
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      className={`grid grid-cols-[1fr_110px_100px_100px_90px_56px] gap-3 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-muted/40 transition-colors ${!isActive ? 'opacity-40' : ''}`}
    >
      {/* Service info with icon */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
          <ServiceIcon serviceId={svc.service?.slug || ''} size={22} />
        </div>
        <span className="text-[14px] font-medium text-foreground truncate">{svc.service?.name || 'Unknown'}</span>
      </div>

      {/* Account */}
      <div className="flex justify-center">
        {accounts && accounts.length > 0 ? (
          <div className="flex items-center gap-1.5">
            <Avatar className="h-5 w-5">
              <AvatarImage src={accounts[0].avatarUrl} alt={accounts[0].login} />
              <AvatarFallback className="text-[9px]">{accounts[0].login.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-[12px] text-muted-foreground truncate max-w-[80px]">
              @{accounts[0].login}
            </span>
          </div>
        ) : (
          <span className="text-[12px] text-muted-foreground/50">—</span>
        )}
      </div>

      {/* Project */}
      <div className="text-center">
        <Link href={`/project/${svc.projectId}`} className="text-[13px] text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors truncate">
          {svc.projectName}
        </Link>
      </div>

      {/* Connection type */}
      <div className="flex justify-center">
        <ConnectionTypeBadge type="manual" locale={locale} />
      </div>

      {/* Status */}
      <div className="flex justify-center">
        <StatusBadge status={localStatus} locale={locale} />
      </div>

      {/* Toggle */}
      <div className="flex justify-center">
        <Switch
          checked={isActive}
          onCheckedChange={handleToggle}
          disabled={toggling}
          aria-label={t(locale, 'account.toggleActive')}
        />
      </div>
    </div>
  );
}
