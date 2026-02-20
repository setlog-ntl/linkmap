'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
  User, GitBranch, Trash2, Pencil, Plus, Check, X, ShieldCheck,
  AlertTriangle, ExternalLink, FolderOpen, Unlink, Settings,
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

// ─── Status config ──────────────────────────────────────

const statusConfig: Record<string, { variant: 'default' | 'destructive' | 'secondary' | 'outline'; icon: React.ReactNode }> = {
  active: { variant: 'default', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  expired: { variant: 'secondary', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  revoked: { variant: 'outline', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  error: { variant: 'destructive', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
};

// ─── ConnectionCard ─────────────────────────────────────

function ConnectionCard({ connection }: { connection: GitHubConnection }) {
  const { locale } = useLocaleStore();
  const deleteMutation = useDeleteGitHubConnection();
  const disconnectMutation = useDisconnectGitHubConnection();
  const renameMutation = useRenameGitHubConnection();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(connection.display_name || '');

  const metadata = connection.oauth_metadata as Record<string, string>;
  const login = metadata?.login || connection.oauth_provider_user_id || 'unknown';
  const avatarUrl = metadata?.avatar_url;
  const status = statusConfig[connection.status] || statusConfig.error;
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
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={login} />
            <AvatarFallback>{login.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleRename}
                    disabled={renameMutation.isPending}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setEditing(false)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="font-medium text-sm">
                    {connection.display_name || login}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => {
                      setEditName(connection.display_name || login);
                      setEditing(true);
                    }}
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
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              @{login}
              <ExternalLink className="h-3 w-3" />
            </a>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge variant={status.variant} className="gap-1 text-[10px]">
                {status.icon}
                {t(locale, `account.status${connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}`)}
              </Badge>
              {connection.oauth_scopes && connection.oauth_scopes.length > 0 && (
                <span className="text-[10px] text-muted-foreground">
                  {t(locale, 'account.scopes')}: {connection.oauth_scopes.join(', ')}
                </span>
              )}
            </div>

            {connection.error_message && (
              <p className="text-xs text-destructive mt-1">{connection.error_message}</p>
            )}

            <p className="text-[10px] text-muted-foreground mt-1">
              {new Date(connection.created_at).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')}
            </p>

            {/* Linked projects section */}
            {connection.linked_projects && connection.linked_projects.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-[10px] font-medium text-muted-foreground mb-1.5">
                  {t(locale, 'account.linkedProjects')}
                </p>
                <div className="flex flex-col gap-1">
                  {connection.linked_projects.map((proj) => (
                    <Link
                      key={proj.project_id}
                      href={`/project/${proj.project_id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-foreground hover:text-primary transition-colors group/proj"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FolderOpen className="h-3 w-3 text-muted-foreground group-hover/proj:text-primary" />
                      <span>{proj.project_name}</span>
                      <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                        {proj.repo_count} {t(locale, 'account.repoCount')}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Disconnect button */}
            {hasLinkedRepos && (
              <ConfirmDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-orange-500"
                  >
                    <Unlink className="h-3.5 w-3.5" />
                  </Button>
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

            {/* Delete button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    {hasLinkedRepos ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground opacity-40 cursor-not-allowed"
                        disabled
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <ConfirmDialog
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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
      </CardContent>
    </Card>
  );
}

// ─── Main Page ──────────────────────────────────────────

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { locale } = useLocaleStore();
  const { data: connections, isLoading: connectionsLoading } = useGitHubConnections();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('oauth_success') === 'github') {
      toast.success(t(locale, 'account.connectionAdded'));
    }
  }, [searchParams, locale]);

  const loadProfile = useCallback(async () => {
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
    loadProfile();
  }, [loadProfile]);

  const handleAddGitHub = () => {
    window.location.href = '/api/oauth/github/authorize?flow_context=settings';
  };

  const isLoading = loading || connectionsLoading;

  if (isLoading) {
    return (
      <div className="container py-8 max-w-3xl">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <Settings className="h-6 w-6" />
          {t(locale, 'account.tab')}
        </h1>
        <Skeleton className="h-28 mb-6" />
        <Skeleton className="h-10 w-48 mb-4" />
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        {t(locale, 'account.tab')}
      </h1>

      {/* 1. Profile Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {profile && (
            <div className="flex items-start gap-4">
              <Avatar size="lg">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 min-w-0">
                <p className="font-semibold text-lg">{profile.name}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span>
                    {t(locale, 'account.loginMethod')}: {profile.provider}
                  </span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>
                    {t(locale, 'account.joinedAt')}: {new Date(profile.createdAt).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. GitHub Connections Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              {t(locale, 'account.githubConnections')}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t(locale, 'account.githubConnectionsDesc')}
            </p>
          </div>
          <Button onClick={handleAddGitHub} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {t(locale, 'account.addGitHub')}
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
              <ConnectionCard key={conn.id} connection={conn} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
