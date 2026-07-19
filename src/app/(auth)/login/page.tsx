'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { safeInternalPath } from '@/lib/utils/safe-redirect';
import { isStaleClientKeyFailure } from '@/lib/supabase/auth-recovery';
import { reloadForFreshBundle } from '@/lib/stale-bundle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Github, Loader2, MailWarning } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/google-icon';

// 구 번들(폐기 키)로 로그인 시도 시 자동 리로드가 가드에 걸렸을 때의 폴백 안내
const STALE_BUNDLE_MESSAGE =
  '앱이 이전 버전으로 실행되고 있습니다. 강력 새로고침(Ctrl+Shift+R) 후 다시 시도해주세요.';

// /auth/callback이 내려보내는 실패 사유 코드 → 사용자가 취할 행동이 담긴 안내.
// 사유를 뭉뚱그리면(구 `auth_failed`) 원인 추적이 불가능해 같은 장애가 반복됐다
// (2026-07-13·07-15) — 사유별로 다음 행동이 달라지므로 반드시 구분해 표기한다.
const CALLBACK_ERROR_MESSAGES: Record<string, string> = {
  // 멀티탭에서 code_verifier가 덮어써진 경우 — 탭 정리가 실질적 해법
  auth_verifier:
    '다른 탭에서 로그인을 새로 시작해 이 시도가 무효가 됐습니다. 다른 로그인 탭을 모두 닫은 뒤 이 탭에서만 다시 시도해주세요.',
  // 교환 자체가 거부됨 — 대개 코드 만료·재사용, 또는 로그인 버튼을 짧은 시간에
  // 여러 번 누르거나 여러 탭에서 동시에 시도해 PKCE 검증값이 어긋난 경우
  auth_exchange:
    '로그인이 완료되지 않았습니다. 로그인 버튼을 여러 번 누르거나 여러 탭·창에서 동시에 시도하면 발생할 수 있어요. 다른 로그인 탭·창을 모두 닫고 이 화면에서 한 번만 다시 시도해주세요.',
  // 콜백에 code가 없음 — 링크 직접 열람·잘못된 리다이렉트
  auth_nocode:
    '로그인 정보가 전달되지 않았습니다. 로그인 링크를 직접 열지 말고 아래에서 다시 시도해주세요.',
  // 구 배포본이 내려보낸 코드 (하위 호환)
  auth_failed:
    '로그인 처리 중 문제가 발생했습니다. 아래에서 다시 시도해주세요. 반복되면 다른 탭의 로그인 화면을 닫은 뒤 이 탭에서만 시도해주세요.',
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Open Redirect 방어는 safeInternalPath로 일원화 (프로토콜 상대 URL `//` 포함 차단)
  const redirect = safeInternalPath(searchParams.get('redirect'));
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

  // 콜백 실패(auth_failed 등)가 배너 없이 삼켜져 "이유 없이 로그인이 안 되는"
  // 경험을 유발했음(2026-07-13) — 만료 링크 외 오류도 반드시 화면에 표기한다
  // 알려진 사유 코드는 안내 문구로, 그 외(프로바이더 error_description 등)는 원문 그대로
  const callbackError =
    authErrorParam && !isExpiredLink
      ? (CALLBACK_ERROR_MESSAGES[authErrorParam] ?? authErrorParam)
      : null;

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
      // 폐기 키(구 번들) — 새 번들을 받아야 로그인 가능 (2026-07-12 키 로테이션 재발 방지)
      if (isStaleClientKeyFailure(error)) {
        if (!reloadForFreshBundle()) {
          setError(STALE_BUNDLE_MESSAGE);
          setLoading(false);
        }
        return;
      }
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
      if (isStaleClientKeyFailure(error)) {
        if (!reloadForFreshBundle()) {
          setError(STALE_BUNDLE_MESSAGE);
          setOauthLoading(null);
        }
        return;
      }
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
          {callbackError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {callbackError}
            </div>
          )}
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
