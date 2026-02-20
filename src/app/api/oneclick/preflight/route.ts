import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError } from '@/lib/api/errors';
import { checkHomepageDeployQuota } from '@/lib/quota';
import { GitHubApiError } from '@/lib/github/api';
import { safeDecryptToken } from '@/lib/github/token';

/**
 * GET /api/oneclick/preflight?site_name=xxx
 * Unified pre-deploy check: GitHub connection + quota + site name availability.
 * Replaces the old /github-check endpoint with additional validation.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const siteName = request.nextUrl.searchParams.get('site_name');

  // Parallel: GitHub account + quota check
  const [githubServiceResult, quota] = await Promise.all([
    supabase
      .from('services')
      .select('id')
      .eq('slug', 'github')
      .single(),
    checkHomepageDeployQuota(user.id),
  ]);

  const githubService = githubServiceResult.data;
  if (!githubService) {
    return NextResponse.json({
      github: { connected: false, account: null },
      quota,
      siteNameAvailable: null,
    });
  }

  // Find active GitHub OAuth account
  const { data: account } = await supabase
    .from('service_accounts')
    .select('id, encrypted_access_token, oauth_provider_user_id, oauth_metadata, status')
    .eq('user_id', user.id)
    .eq('service_id', githubService.id)
    .eq('connection_type', 'oauth')
    .eq('status', 'active')
    .order('project_id', { ascending: true, nullsFirst: true })
    .limit(1)
    .single();

  const metadata = account?.oauth_metadata as Record<string, string> | null;
  const githubUsername = metadata?.login || account?.oauth_provider_user_id || null;

  const githubInfo = account ? {
    connected: true,
    account: {
      id: account.id,
      provider_account_id: githubUsername || 'GitHub User',
      status: account.status,
    },
  } : {
    connected: false,
    account: null,
  };

  // Check site name availability (only if GitHub connected and site_name provided)
  let siteNameAvailable: boolean | null = null;
  if (siteName && account) {
    const decryptResult = await safeDecryptToken(
      account.encrypted_access_token,
      supabase,
      account.id
    );
    if (!('error' in decryptResult) && githubUsername) {
      try {
        const res = await fetch(`https://api.github.com/repos/${githubUsername}/${siteName}`, {
          headers: {
            Authorization: `Bearer ${decryptResult.token}`,
            Accept: 'application/vnd.github+json',
          },
        });
        // 404 = available, 200 = exists
        siteNameAvailable = res.status === 404;
      } catch {
        siteNameAvailable = null; // Unknown
      }
    }
  }

  return NextResponse.json({
    github: githubInfo,
    quota,
    siteNameAvailable,
  });
}
