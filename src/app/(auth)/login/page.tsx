'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Github, Loader2, MailWarning } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/google-icon';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Safe redirect: must start with / and not contain ://
  const rawRedirect = searchParams.get('redirect');
  const redirect = rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.includes('://')
    ? rawRedirect
    : '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  // 인증 링크 만료/재사용으로 리다이렉트된 경우 (Supabase verify → ?error=Email link is invalid or has expired)
  // URL 파라미터로만 전달되어 사용자가 원인을 알 수 없었음 — 배너 + 재발송 CTA 제공 (2026-06-12 E2E A-2)
  const authErrorParam = searchParams.get('error');
  const isExpiredLink = !!authErrorParam && /invalid|expired/i.test(authErrorParam);
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('재발송할 이메일 주소를 아래에 먼저 입력해주세요.');
      return;
    }
    setError(null);
    setResendState('sending');
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}` },
    });
    if (resendError) {
      setError(resendError.message);
      setResendState('idle');
      return;
    }
    setResendState('sent');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? '이메일 또는 비밀번호가 올바르지 않습니다.'
        : error.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setOauthLoading(provider);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
      },
    });
    if (error) {
      setError(error.message);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" prefetch={false} className="inline-flex items-center justify-center gap-1 font-bold text-2xl mb-2">
            <span className="text-primary">Link</span>
            <span>map</span>
          </Link>
          <CardTitle className="text-xl">로그인</CardTitle>
          <CardDescription>계정에 로그인하여 프로젝트를 관리하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isExpiredLink && (
            <div className="rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3 space-y-2">
              <div className="flex items-start gap-2">
                <MailWarning className="h-4 w-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                  <p className="font-medium">인증 링크가 만료되었거나 이미 사용되었습니다.</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    이미 인증을 완료했다면 아래에서 그대로 로그인하세요. 인증이 안 된 경우
                    이메일을 입력한 뒤 재발송을 눌러주세요.
                  </p>
                </div>
              </div>
              {resendState === 'sent' ? (
                <p className="text-xs font-medium text-green-700 dark:text-green-400 pl-6">
                  인증 메일을 다시 보냈습니다. 받은편지함(스팸함 포함)을 확인해주세요.
                </p>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-6 h-7 text-xs border-amber-300 dark:border-amber-700"
                  onClick={handleResendConfirmation}
                  disabled={resendState === 'sending'}
                >
                  {resendState === 'sending' ? (
                    <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                  ) : null}
                  인증 메일 재발송
                </Button>
              )}
            </div>
          )}
          {/* 모바일(390px)에서 2열이 좁아 한 줄씩 쌓고, sm 이상에서 2열 — 모바일 UX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              disabled={oauthLoading !== null}
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
              disabled={oauthLoading !== null}
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
              <span className="bg-card px-2 text-muted-foreground">또는</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">비밀번호</Label>
                <Link href="/reset-password" prefetch={false} className="text-xs text-muted-foreground hover:text-primary">
                  비밀번호 찾기
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            계정이 없으신가요?{' '}
            <Link href={redirect !== '/dashboard' ? `/signup?redirect=${encodeURIComponent(redirect)}` : '/signup'} prefetch={false} className="text-primary hover:underline font-medium">
              회원가입
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
