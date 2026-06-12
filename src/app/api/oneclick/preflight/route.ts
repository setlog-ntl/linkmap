import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError } from '@/lib/api/errors';
import { safeDecryptToken } from '@/lib/github/token';
import { getRepo, GitHubApiError } from '@/lib/github/api';

/**
 * GET /api/oneclick/preflight?site_name=xxx
 * Unified pre-deploy check: GitHub connection + site name availability.
 * Replaces the old /github-check endpoint with additional validation.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const siteName = request.nextUrl.searchParams.get('site_name');

  const githubServiceResult = await supabase
    .from('services')
    .select('id')
    .eq('slug', 'github')
    .single();

  const githubService = githubServiceResult.data;
  if (!githubService) {
    return NextResponse.json({
      github: { connected: false, account: null },
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
      // 공용 githubFetch 사용 (User-Agent 포함 — raw fetch는 GitHub API가 403으로 거부해
      // 미존재 이름도 "이미 존재"로 오판하는 거짓 양성 발생. 2026-06-12 E2E B-1)
      try {
        await getRepo(decryptResult.token, githubUsername, siteName);
        siteNameAvailable = false; // 200 = exists
      } catch (e) {
        if (e instanceof GitHubApiError && e.status === 404) {
          siteNameAvailable = true; // 404 = available
        } else {
          siteNameAvailable = null; // 403/401/네트워크 등 — 단정하지 않음 (unknown)
        }
      }
    }
  }

  return NextResponse.json({
    github: githubInfo,
    siteNameAvailable,
  });
}
