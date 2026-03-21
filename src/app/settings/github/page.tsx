'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
import {
  GitBranch, Pencil, Plus, Check, X,
  ExternalLink, FolderOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/keys';
import { useSearchParams } from 'next/navigation';
import type { GitHubConnection } from '@/types';

function StatusBadge({ status, locale }: { status: string; locale: 'ko' | 'en' }) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    expired: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/25',
    error: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/25',
    revoked: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-300 border-zinc-500/25',
  };
  const dotColors: Record<string, string> = {
    active: 'bg-emerald-400',
    expired: 'bg-yellow-400',
    error: 'bg-red-400',
    revoked: 'bg-zinc-400',
  };
  const color = colors[status] || colors.revoked;
  const label = t(locale, `account.status${status.charAt(0).toUpperCase() + status.slice(1)}`);

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${color}`}>
      <span className={`h-2 w-2 rounded-full ${dotColors[status] || 'bg-zinc-400'}`} />
      {label}
    </span>
  );
}

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
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 text-sm w-44" autoFocus
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditing(false); }} />
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRename} disabled={renameMutation.isPending}><Check className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(false)}><X className="h-4 w-4" /></Button>
                </div>
              ) : (
                <>
                  <span className="font-semibold text-[15px] text-foreground">{connection.display_name || login}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => { setEditName(connection.display_name || login); setEditing(true); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
            <a href={`https://github.com/${login}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors mt-0.5">
              @{login}<ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={isActive} onCheckedChange={handleToggleStatus} disabled={toggling} aria-label={t(locale, 'account.toggleActive')} />
          <StatusBadge status={connection.status} locale={locale} />
        </div>
      </div>

      {connection.oauth_scopes && connection.oauth_scopes.length > 0 && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{t(locale, 'account.scopes')}</span>
          {connection.oauth_scopes.map((scope) => (
            <span key={scope} className="inline-flex text-xs px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono border border-border">{scope}</span>
          ))}
        </div>
      )}

      {connection.error_message && <p className="text-sm text-red-400 mt-3">{connection.error_message}</p>}

      {connection.linked_projects && connection.linked_projects.length > 0 && (
        <div className="mt-4 flex items-start gap-2.5">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase pt-0.5">Projects</span>
          <div className="flex flex-col gap-1.5">
            {connection.linked_projects.map((proj) => (
              <Link key={proj.project_id} prefetch={false} href={`/project/${proj.project_id}`}
                className="inline-flex items-center gap-1.5 text-[13px] text-foreground/80 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{proj.project_name}</span>
                <span className="text-muted-foreground">({proj.repo_count} {t(locale, 'account.repoCount')})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-end gap-5">
        {hasLinkedRepos && (
          <ConfirmDialog
            trigger={<button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Unlink</button>}
            title={t(locale, 'account.disconnect')} description={t(locale, 'account.disconnectConfirm')}
            confirmLabel={t(locale, 'account.disconnect')} cancelLabel={t(locale, 'common.cancel')} variant="destructive"
            onConfirm={async () => { try { await disconnectMutation.mutateAsync(connection.id); toast.success(t(locale, 'account.disconnectSuccess')); } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); } }}
          />
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                {hasLinkedRepos ? (
                  <span className="text-[13px] text-muted-foreground/50 cursor-not-allowed">Delete Data</span>
                ) : (
                  <ConfirmDialog
                    trigger={<button className="text-[13px] text-red-400 hover:text-red-300 transition-colors cursor-pointer">Delete Data</button>}
                    title={t(locale, 'account.deleteConnection')} description={t(locale, 'account.deleteConnectionConfirm')}
                    confirmLabel={t(locale, 'common.delete')} cancelLabel={t(locale, 'common.cancel')} variant="destructive"
                    onConfirm={async () => { try { await deleteMutation.mutateAsync(connection.id); toast.success(t(locale, 'account.connectionDeleted')); } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); } }}
                  />
                )}
              </span>
            </TooltipTrigger>
            {hasLinkedRepos && <TooltipContent><p>{t(locale, 'account.deleteBlocked')}</p></TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default function GitHubSettingsPage() {
  const { locale } = useLocaleStore();
  const { data: connections, isLoading } = useGitHubConnections();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('oauth_success') === 'github') {
      toast.success(t(locale, 'account.connectionAdded'));
    }
  }, [searchParams, locale]);

  const handleAddGitHub = () => {
    window.location.href = '/api/oauth/github/authorize?flow_context=settings';
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl">
        <Skeleton className="h-5 w-48 mb-5" />
        <Skeleton className="h-44 rounded-xl mb-4" />
        <Skeleton className="h-44 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold">{t(locale, 'account.githubConnections')}</h2>
        <Button onClick={handleAddGitHub} size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-[13px] text-muted-foreground mb-5">{t(locale, 'account.githubConnectionsDesc')}</p>

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
    </div>
  );
}
