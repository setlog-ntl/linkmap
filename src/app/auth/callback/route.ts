import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error_param = searchParams.get('error');
  const error_description = searchParams.get('error_description');
  const next = searchParams.get('next') ?? '/dashboard';

  // OAuth provider returned an error
  if (error_param) {
    console.error('[auth/callback] OAuth error from provider:', {
      error: error_param,
      description: error_description,
    });
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error_description || error_param)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
    console.error('[auth/callback] Session exchange failed:', {
      message: error.message,
      status: error.status,
    });
  } else {
    console.error('[auth/callback] No code parameter in callback URL');
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
