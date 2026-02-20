'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import {
  GitBranch, Trash2, Pencil, Plus, Check, X,
  ExternalLink, FolderOpen, Unlink,
  ArrowLeft, Link2, Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
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

interface ConnectedAccount {
  id: string;
  connection_type: string;
  oauth_metadata: Record<string, string> | null;
  oauth_scopes: string[] | null;
  oauth_provider_user_id: string | null;
  status: string;
  last_verified_at: string | null;
  error_message: string | null;
  created_at: string;
  project_id: string | null;
  service: { name: string; slug: string; icon_url: string | null; category: string } | null;
  project: { name: string } | null;
}

// ─── Status & Connection helpers (Stitch design) ────────

/** Status dot color matching Stitch palette */
function statusDotColor(status: string): string {
  switch (status) {
    case 'active': return 'bg-emerald-500';
    case 'expired': return 'bg-yellow-500';
    case 'error': return 'bg-red-500';
    case 'revoked': return 'bg-zinc-500';
    default: return 'bg-zinc-500';
  }
}

/** Stitch-style pill badge with status dot */
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

/** Stitch-style connection type badge (violet=OAuth, amber=API Key, zinc=Manual/Webhook) */
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

// ─── GitHubConnectionCard (Stitch card style) ───────────

function GitHubConnectionCard({ connection }: { connection: GitHubConnection }) {
  const { locale } = useLocaleStore();
  const deleteMutation = useDeleteGitHubConnection();
  const disconnectMutation = useDisconnectGitHubConnection();
  const renameMutation = useRenameGitHubConnection();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(connection.display_name || '');

  const metadata = connection.oauth_metadata as Record<string, string>;
  const login = metadata?.login || connection.oauth_provider_user_id || 'unknown';
  const avatarUrl = metadata?.avatar_url;
  const hasLinkedRepos = (connection.linked_repos_count ?? 0) > 0;

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

  return (
    <div className="rounded-lg border bg-card/50 p-5">
      {/* Header: avatar + name + status badge */}
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
        <StatusBadge status={connection.status} locale={locale} />
      </div>

      {/* SCOPES: monospace tags like Stitch design */}
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

      {/* PROJECTS: folder list like Stitch design */}
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

      {/* Action row: Unlink / Delete Data (text links like Stitch) */}
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
  const [allAccounts, setAllAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useLocaleStore();
  const { data: connections, isLoading: connectionsLoading } = useGitHubConnections();
  const searchParams = useSearchParams();

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

    // Fetch ALL connected service accounts
    const res = await fetch('/api/account/connected-accounts');
    if (res.ok) {
      const data = await res.json();
      setAllAccounts(data.accounts || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddGitHub = () => {
    window.location.href = '/api/oauth/github/authorize?flow_context=settings';
  };

  const isLoading = loading || connectionsLoading;

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

      {/* ── 1. Profile Card (Stitch style) ── */}
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
                  <h1 className="text-lg font-semibold">{profile.name}</h1>
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

      {/* ── 2. GitHub Accounts (Stitch card style) ── */}
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

      {/* ── 3. Connected Service Accounts (Stitch 3-column table) ── */}
      <section className="mb-10">
        <h2 className="text-base font-bold mb-4">
          {t(locale, 'account.connectedAccounts')}
        </h2>

        {allAccounts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Link2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t(locale, 'account.noAccounts')}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">{t(locale, 'account.noAccountsDesc')}</p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card/50 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 border-b bg-muted/20">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                {t(locale, 'account.colService')}
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase w-28 text-center">
                {t(locale, 'account.colConnectionType')}
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase w-28 text-right">
                {t(locale, 'account.colStatus')}
              </span>
            </div>

            {/* Table Rows */}
            {allAccounts.map((account) => (
              <div
                key={account.id}
                className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-3.5 border-b last:border-0 hover:bg-muted/10 transition-colors"
              >
                {/* Service info */}
                <div className="flex items-center gap-3 min-w-0">
                  {account.service?.icon_url ? (
                    <img src={account.service.icon_url} alt="" className="h-8 w-8 rounded-lg" />
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {account.service?.slug ? (
                        <Link href={`/services#${account.service.slug}`} className="text-sm font-medium hover:text-primary transition-colors truncate">
                          {account.service.name}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium truncate">Unknown</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {account.project_id && account.project ? (
                        <Link href={`/project/${account.project_id}`} className="hover:text-primary transition-colors">
                          {account.project.name}
                        </Link>
                      ) : (
                        account.oauth_provider_user_id
                          ? `@${(account.oauth_metadata as Record<string, string>)?.login || account.oauth_provider_user_id}`
                          : t(locale, 'account.userAccount')
                      )}
                    </p>
                  </div>
                </div>

                {/* Connection type badge */}
                <div className="w-28 flex justify-center">
                  <ConnectionTypeBadge type={account.connection_type} locale={locale} />
                </div>

                {/* Status badge */}
                <div className="w-28 flex justify-end">
                  <StatusBadge status={account.status} locale={locale} />
                </div>
              </div>
            ))}

            {/* Add service CTA */}
            <Link
              href="/services"
              className="flex items-center justify-center gap-2 px-5 py-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              {t(locale, 'account.addService')}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
