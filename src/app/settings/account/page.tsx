'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  GitBranch, Trash2, Pencil, Plus, Check, X,
  ExternalLink, FolderOpen, Unlink,
  ArrowLeft, Link2, Calendar, LogOut, AlertTriangle,
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

// ─── Status & Connection helpers ────────────────────────

function statusDotColor(status: string): string {
  switch (status) {
    case 'active': return 'bg-emerald-500';
    case 'expired': return 'bg-yellow-500';
    case 'error': return 'bg-red-500';
    case 'revoked': return 'bg-zinc-500';
    default: return 'bg-zinc-500';
  }
}

function StatusBadge({ status, locale }: { status: string; locale: 'ko' | 'en' }) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    expired: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    revoked: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  };
  const color = colors[status] || colors.revoked;
  const label = t(locale, `account.status${status.charAt(0).toUpperCase() + status.slice(1)}`);

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border ${color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor(status)}`} />
      {label}
    </span>
  );
}

function ConnectionTypeBadge({ type, locale }: { type: string; locale: 'ko' | 'en' }) {
  const colors: Record<string, string> = {
    oauth: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    api_key: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    manual: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  };
  const labels: Record<string, string> = {
    oauth: 'account.connectionOAuth',
    api_key: 'account.connectionApiKey',
    manual: 'account.connectionManual',
  };
  const color = colors[type] || colors.manual;
  const label = labels[type] ? t(locale, labels[type]) : type;

  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full border ${color}`}>
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
    <div className={`rounded-lg border bg-card/50 p-5 transition-opacity ${!isActive ? 'opacity-50' : ''}`}>
      {/* Header: avatar + name + toggle + status badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={login} />
            <AvatarFallback>{login.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              {editing ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-7 text-sm w-40"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename();
                      if (e.key === 'Escape') setEditing(false);
                    }}
                  />
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRename} disabled={renameMutation.isPending}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditing(false)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="font-semibold text-sm">{connection.display_name || login}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground hover:text-foreground"
                    onClick={() => { setEditName(connection.display_name || login); setEditing(true); }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
            <a
              href={`https://github.com/${login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5"
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
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            {t(locale, 'account.scopes')}
          </span>
          {connection.oauth_scopes.map((scope) => (
            <span
              key={scope}
              className="inline-flex text-[11px] px-2 py-0.5 rounded bg-muted/50 text-muted-foreground font-mono"
            >
              {scope}
            </span>
          ))}
        </div>
      )}

      {connection.error_message && (
        <p className="text-xs text-red-400 mt-3">{connection.error_message}</p>
      )}

      {/* PROJECTS */}
      {connection.linked_projects && connection.linked_projects.length > 0 && (
        <div className="mt-4 flex items-start gap-2">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase pt-0.5">
            Projects
          </span>
          <div className="flex flex-col gap-1">
            {connection.linked_projects.map((proj) => (
              <Link
                key={proj.project_id}
                href={`/project/${proj.project_id}`}
                className="inline-flex items-center gap-1.5 text-xs text-foreground hover:text-primary transition-colors"
              >
                <FolderOpen className="h-3 w-3 text-muted-foreground" />
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
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-end gap-4">
        {hasLinkedRepos && (
          <ConfirmDialog
            trigger={
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
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
                  <span className="text-xs text-muted-foreground/40 cursor-not-allowed">
                    Delete Data
                  </span>
                ) : (
                  <ConfirmDialog
                    trigger={
                      <button className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer">
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

  const isLoading = loading || connectionsLoading || projectsLoading;

  if (isLoading) {
    return (
      <div className="container py-8 max-w-3xl mx-auto">
        <Skeleton className="h-5 w-48 mb-8" />
        <Skeleton className="h-24 mb-10 rounded-lg" />
        <Skeleton className="h-5 w-32 mb-4" />
        <Skeleton className="h-40 rounded-lg mb-10" />
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      {/* ── Back Navigation ── */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        {t(locale, 'account.backToDashboard')}
      </Link>

      {/* ── 1. Profile Card ── */}
      {profile && (
        <Card className="mb-10 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback className="text-lg">{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {editingName ? (
                    <div className="flex items-center gap-1">
                      <Input
                        ref={nameInputRef}
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        className="h-8 text-sm w-48"
                        placeholder={t(locale, 'account.namePlaceholder')}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName();
                          if (e.key === 'Escape') setEditingName(false);
                        }}
                      />
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSaveName} disabled={savingName}>
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingName(false)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-lg font-semibold">{profile.name}</h1>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => { setNameValue(profile.name); setEditingName(true); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                  <Badge variant="outline" className="text-[11px] font-normal px-2 py-0.5">
                    {profile.provider}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{profile.email}</p>
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(profile.createdAt).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 2. GitHub Accounts ── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">
            GitHub {t(locale, 'account.tab')}
          </h2>
          <Button onClick={handleAddGitHub} size="sm" variant="ghost" className="h-8 w-8 p-0">
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
      <section className="mb-10">
        <div className="mb-4">
          <h2 className="text-base font-bold">{t(locale, 'account.allServices')}</h2>
          <p className="text-xs text-muted-foreground mt-1">{t(locale, 'account.allServicesDesc')}</p>
        </div>

        {allServices.length === 0 ? (
          <EmptyState
            icon={Layers}
            title={t(locale, 'account.noServices')}
            description={t(locale, 'account.noServicesDesc')}
          />
        ) : (
          <div className="rounded-lg border bg-card/50 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b bg-muted/20">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                {t(locale, 'account.colService')}
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase w-28 text-center">
                {t(locale, 'account.colProject')}
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase w-24 text-center">
                {t(locale, 'account.colConnectionType')}
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase w-20 text-center">
                {t(locale, 'account.colStatus')}
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase w-14 text-center">
                {t(locale, 'account.colToggle')}
              </span>
            </div>

            {/* Table Rows */}
            {allServices.map((svc) => (
              <ServiceRow key={svc.id} svc={svc} locale={locale} />
            ))}
          </div>
        )}
      </section>

      {/* ── 4. Danger Zone ── */}
      <section className="mb-10">
        <h2 className="text-base font-bold mb-4 text-red-400">
          {t(locale, 'account.dangerZone')}
        </h2>
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 divide-y divide-red-500/20">
          {/* Logout */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">{t(locale, 'account.logout')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t(locale, 'account.logoutDesc')}</p>
            </div>
            <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              {t(locale, 'account.logout')}
            </Button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">{t(locale, 'account.deleteAccount')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t(locale, 'account.deleteAccountDesc')}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={() => toast.info(t(locale, 'account.comingSoon'))}
            >
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
              {t(locale, 'account.deleteAccount')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Service Row (separated for toggle state) ───────────

function ServiceRow({
  svc,
  locale,
}: {
  svc: {
    id: string;
    status: string;
    service?: { name: string; slug: string; icon_url: string | null; category: string };
    projectId: string;
    projectName: string;
  };
  locale: 'ko' | 'en';
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
      className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5 border-b last:border-0 hover:bg-muted/10 transition-colors ${!isActive ? 'opacity-50' : ''}`}
    >
      {/* Service info */}
      <div className="flex items-center gap-3 min-w-0">
        {svc.service?.icon_url ? (
          <img src={svc.service.icon_url} alt="" className="h-8 w-8 rounded-lg" />
        ) : (
          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <span className="text-sm font-medium truncate">{svc.service?.name || 'Unknown'}</span>
      </div>

      {/* Project */}
      <div className="w-28 text-center">
        <Link href={`/project/${svc.projectId}`} className="text-xs text-muted-foreground hover:text-primary transition-colors truncate">
          {svc.projectName}
        </Link>
      </div>

      {/* Connection type — project_services don't have connection_type, show category */}
      <div className="w-24 flex justify-center">
        <ConnectionTypeBadge type="manual" locale={locale} />
      </div>

      {/* Status */}
      <div className="w-20 flex justify-center">
        <StatusBadge status={localStatus} locale={locale} />
      </div>

      {/* Toggle */}
      <div className="w-14 flex justify-center">
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
