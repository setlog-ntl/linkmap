'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Link2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SettingsNav } from '@/components/settings/settings-nav';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

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

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  provider: string;
  createdAt: string;
}

function getStatusVariant(status: string): 'default' | 'destructive' | 'secondary' | 'outline' {
  switch (status) {
    case 'active': return 'default';
    case 'error': return 'destructive';
    case 'expired': return 'secondary';
    case 'revoked': return 'outline';
    default: return 'outline';
  }
}

function getStatusLabel(status: string, locale: 'ko' | 'en'): string {
  const key = `account.status${status.charAt(0).toUpperCase() + status.slice(1)}`;
  return t(locale, key);
}

function getConnectionLabel(type: string, locale: 'ko' | 'en'): string {
  const map: Record<string, string> = {
    oauth: 'account.connectionOAuth',
    api_key: 'account.connectionApiKey',
    manual: 'account.connectionManual',
  };
  const key = map[type];
  return key ? t(locale, key) : type;
}

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useLocaleStore();

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

    const res = await fetch('/api/account/connected-accounts');
    if (res.ok) {
      const data = await res.json();
      setAccounts(data.accounts || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="container py-8 max-w-2xl">
        <SettingsNav />
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-32 mb-6" />
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      <SettingsNav />

      {/* Profile Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t(locale, 'account.profileInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile && (
            <div className="flex items-start gap-4">
              <Avatar size="lg">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 min-w-0">
                <p className="font-medium">{profile.name}</p>
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

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            {t(locale, 'account.connectedAccounts')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Link2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">{t(locale, 'account.noAccounts')}</p>
              <p className="text-xs mt-1">{t(locale, 'account.noAccountsDesc')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => (
                <div key={account.id} className="p-3 rounded-lg border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      {account.service?.icon_url && (
                        <img
                          src={account.service.icon_url}
                          alt={account.service.name}
                          className="h-5 w-5 rounded"
                        />
                      )}
                      <span className="font-medium text-sm">{account.service?.name || 'Unknown'}</span>
                      {account.oauth_provider_user_id && (
                        <span className="text-xs text-muted-foreground">
                          @{account.oauth_metadata?.login || account.oauth_provider_user_id}
                        </span>
                      )}
                    </div>
                    <Badge variant={getStatusVariant(account.status)}>
                      {getStatusLabel(account.status, locale)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{getConnectionLabel(account.connection_type, locale)}</span>
                    {account.oauth_scopes && account.oauth_scopes.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="truncate">{account.oauth_scopes.join(', ')}</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {account.project_id && account.project
                      ? `${t(locale, 'account.projectLabel')}: ${account.project.name}`
                      : t(locale, 'account.userAccount')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
