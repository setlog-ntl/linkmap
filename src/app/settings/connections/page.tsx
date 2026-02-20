'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { SettingsNav } from '@/components/settings/settings-nav';
import {
  useGitHubConnections,
  useDeleteGitHubConnection,
  useRenameGitHubConnection,
} from '@/lib/queries/github-connections';
import { GitBranch, Trash2, Pencil, Plus, Check, X, ShieldCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { useSearchParams } from 'next/navigation';
import type { GitHubConnection } from '@/types';

const statusConfig: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary' | 'outline'; icon: React.ReactNode }> = {
  active: { label: 'Active', variant: 'default', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  expired: { label: 'Expired', variant: 'secondary', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  revoked: { label: 'Revoked', variant: 'outline', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  error: { label: 'Error', variant: 'destructive', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
};

function ConnectionCard({ connection }: { connection: GitHubConnection }) {
  const { locale } = useLocaleStore();
  const deleteMutation = useDeleteGitHubConnection();
  const renameMutation = useRenameGitHubConnection();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(connection.display_name || '');

  const metadata = connection.oauth_metadata as Record<string, string>;
  const login = metadata?.login || connection.oauth_provider_user_id || 'unknown';
  const avatarUrl = metadata?.avatar_url;
  const status = statusConfig[connection.status] || statusConfig.error;

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
            <p className="text-xs text-muted-foreground">@{login}</p>

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
          </div>

          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
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
        </div>
      </CardContent>
    </Card>
  );
}

export default function ConnectionsPage() {
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
      <div className="container py-8 max-w-4xl">
        <SettingsNav />
        <Skeleton className="h-10 w-48 mb-4" />
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <SettingsNav />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                {t(locale, 'account.githubConnections')}
              </CardTitle>
              <CardDescription className="mt-1">
                {t(locale, 'account.githubConnectionsDesc')}
              </CardDescription>
            </div>
            <Button onClick={handleAddGitHub} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {t(locale, 'account.addGitHub')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
