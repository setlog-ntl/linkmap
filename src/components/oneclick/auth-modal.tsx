'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Github, Loader2, LogIn } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/google-icon';
import { useLocaleStore } from '@/stores/locale-store';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { locale } = useLocaleStore();
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? locale === 'ko'
            ? '이메일 또는 비밀번호가 올바르지 않습니다.'
            : 'Invalid email or password.'
          : error.message
      );
      setLoading(false);
      return;
    }

    router.refresh();
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setOauthLoading(provider);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/oneclick`,
      },
    });
    if (error) {
      setError(error.message);
      setOauthLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
            <LogIn className="h-6 w-6" />
          </div>
          <DialogTitle>
            {locale === 'ko' ? '로그인이 필요합니다' : 'Sign In Required'}
          </DialogTitle>
          <DialogDescription>
            {locale === 'ko'
              ? '홈페이지를 배포하려면 먼저 로그인하세요.'
              : 'Sign in to deploy your homepage.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              disabled={oauthLoading !== null || loading}
              className="w-full"
            >
              {oauthLoading === 'google' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('github')}
              disabled={oauthLoading !== null || loading}
              className="w-full"
            >
              {oauthLoading === 'github' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {locale === 'ko' ? '또는' : 'or'}
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="auth-modal-email">
                {locale === 'ko' ? '이메일' : 'Email'}
              </Label>
              <Input
                id="auth-modal-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="auth-modal-password">
                {locale === 'ko' ? '비밀번호' : 'Password'}
              </Label>
              <Input
                id="auth-modal-password"
                type="password"
                placeholder={locale === 'ko' ? '비밀번호를 입력하세요' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading || oauthLoading !== null}>
              {loading
                ? locale === 'ko' ? '로그인 중...' : 'Signing in...'
                : locale === 'ko' ? '로그인' : 'Sign In'}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center">
            {locale === 'ko' ? '계정이 없으신가요?' : "Don't have an account?"}{' '}
            <Link href="/signup?redirect=/oneclick" className="text-primary hover:underline font-medium">
              {locale === 'ko' ? '회원가입' : 'Sign Up'}
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
