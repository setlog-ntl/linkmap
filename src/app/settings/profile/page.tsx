'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, Check, X, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  provider: string;
  createdAt: string;
}

export default function ProfilePage() {
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
    <div className="max-w-2xl">
      <h2 className="text-lg font-bold mb-5">{t(locale, 'account.profileInfo')}</h2>
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
    </div>
  );
}
