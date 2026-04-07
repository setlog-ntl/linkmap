'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Check, X, Calendar, LogOut, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { MfaSection } from '@/components/settings/mfa-section';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  provider: string;
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [savingName, setSavingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
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
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

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

  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      const res = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmText: deleteConfirmText }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t(locale, 'account.deleteAccountFailed'));
      }
      toast.success(t(locale, 'account.deleteAccountSuccess'));
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t(locale, 'account.deleteAccountFailed'));
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl">
        <Skeleton className="h-5 w-36 mb-6" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-2xl space-y-8">
      {/* Profile Section */}
      <section>
        <h2 className="text-lg font-bold mb-5">{t(locale, 'account.myAccount')}</h2>
        <Card className="bg-card border-border">
          <CardContent className="p-7">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-2 ring-border">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback className="text-xl font-bold bg-muted text-foreground">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
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
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSaveName} disabled={savingName}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingName(false)}>
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
      </section>

      {/* 2FA Section */}
      <MfaSection />

      {/* Danger Zone */}
      <section>
        <h2 className="text-lg font-bold mb-5 text-red-600 dark:text-red-400">
          {t(locale, 'account.dangerZone')}
        </h2>
        <div className="rounded-xl border border-red-300/40 dark:border-red-500/30 bg-red-50/50 dark:bg-red-950/20 divide-y divide-red-200/40 dark:divide-red-500/20">
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
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-[15px] font-semibold text-foreground">{t(locale, 'account.deleteAccount')}</p>
              <p className="text-[13px] text-muted-foreground mt-0.5">{t(locale, 'account.deleteAccountDesc')}</p>
            </div>
            <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
              setDeleteDialogOpen(open);
              if (!open) setDeleteConfirmText('');
            }}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-300/60 dark:border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/15"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {t(locale, 'account.deleteAccount')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600 dark:text-red-400">
                    {t(locale, 'account.deleteAccountTitle')}
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-3">
                      <p className="whitespace-pre-line text-sm text-muted-foreground">
                        {t(locale, 'account.deleteAccountWarning')}
                      </p>
                      <div className="space-y-2 pt-2">
                        <Label htmlFor="delete-confirm" className="text-sm font-medium text-foreground">
                          {t(locale, 'account.deleteAccountConfirmLabel')}
                        </Label>
                        <Input
                          id="delete-confirm"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder={t(locale, 'account.deleteAccountConfirmText')}
                          className="bg-muted border-border"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deletingAccount}>
                    {t(locale, 'common.cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deleteConfirmText !== t(locale, 'account.deleteAccountConfirmText') || deletingAccount}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteAccount();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                  >
                    {deletingAccount ? t(locale, 'account.deletingAccount') : t(locale, 'account.deleteAccount')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </section>
    </div>
  );
}
