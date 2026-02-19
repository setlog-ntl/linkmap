import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError } from '@/lib/api/errors';
import { safeDecryptToken } from '@/lib/github/token';
import { getGitHubPagesStatus, getLatestWorkflowRun, GitHubApiError } from '@/lib/github/api';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: deployments, error } = await supabase
    .from('homepage_deploys')
    .select(`
      id,
      site_name,
      deploy_status,
      deploy_method,
      pages_url,
      pages_status,
      deployment_url,
      forked_repo_url,
      forked_repo_full_name,
      deploy_error_message,
      created_at,
      template_id,
      project_id,
      homepage_templates (
        id,
        slug,
        name,
        name_ko,
        framework,
        preview_image_url
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const list = deployments || [];

  // Re-check stuck deployments (building/creating/pending) against GitHub Pages API
  const stuckDeploys = list.filter(
    (d) => d.deploy_method === 'github_pages'
      && ['building', 'creating', 'pending'].includes(d.deploy_status)
      && d.forked_repo_full_name
  );

  if (stuckDeploys.length > 0) {
    // Resolve GitHub token once for all checks
    const githubToken = await resolveGitHubToken(supabase, user.id);

    if (githubToken) {
      await Promise.allSettled(
        stuckDeploys.map((d) => refreshDeployStatus(supabase, d, githubToken))
      );
    }
  }

  return NextResponse.json({ deployments: list });
}

/** Resolve the user's GitHub OAuth token */
async function resolveGitHubToken(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string | null> {
  const { data: githubService } = await supabase
    .from('services')
    .select('id')
    .eq('slug', 'github')
    .single();

  if (!githubService) return null;

  const { data: ghAccount } = await supabase
    .from('service_accounts')
    .select('id, encrypted_access_token')
    .eq('user_id', userId)
    .eq('service_id', githubService.id)
    .eq('connection_type', 'oauth')
    .eq('status', 'active')
    .order('project_id', { ascending: false, nullsFirst: false })
    .limit(1)
    .single();

  if (!ghAccount) return null;

  const result = await safeDecryptToken(ghAccount.encrypted_access_token, supabase, ghAccount.id);
  if ('error' in result) return null;

  return result.token;
}

/** Check GitHub Pages status and update DB + in-memory object */
async function refreshDeployStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  deploy: Record<string, unknown>,
  githubToken: string
): Promise<void> {
  try {
    const [owner, repo] = (deploy.forked_repo_full_name as string).split('/');
    const pagesInfo = await getGitHubPagesStatus(githubToken, owner, repo);
    const pagesStatus = pagesInfo.status;

    let newDeployStatus = deploy.deploy_status as string;
    let newPagesStatus = deploy.pages_status as string;

    if (pagesStatus === 'built') {
      newDeployStatus = 'ready';
      newPagesStatus = 'built';
    } else if (pagesStatus === 'building') {
      newDeployStatus = 'building';
      newPagesStatus = 'building';
    } else if (pagesStatus === 'errored') {
      newDeployStatus = 'error';
      newPagesStatus = 'errored';
    } else if (pagesStatus === null) {
      // Check if Actions workflow failed
      try {
        const [owner, repo] = (deploy.forked_repo_full_name as string).split('/');
        const run = await getLatestWorkflowRun(githubToken, owner, repo);
        if (run?.status === 'completed' && (run.conclusion === 'failure' || run.conclusion === 'cancelled')) {
          newDeployStatus = 'error';
          newPagesStatus = 'errored';
        }
      } catch { /* ignore */ }
    }

    if (newDeployStatus !== deploy.deploy_status || newPagesStatus !== deploy.pages_status) {
      const updateData: Record<string, unknown> = {
        deploy_status: newDeployStatus,
        pages_status: newPagesStatus,
        pages_url: pagesInfo.html_url || deploy.pages_url,
      };

      if (newDeployStatus === 'ready') {
        updateData.deployed_at = new Date().toISOString();
        updateData.deployment_url = pagesInfo.html_url || deploy.pages_url;
      }

      await supabase
        .from('homepage_deploys')
        .update(updateData)
        .eq('id', deploy.id as string);

      // Update in-memory so the response reflects the new status
      deploy.deploy_status = newDeployStatus;
      deploy.pages_status = newPagesStatus;
      deploy.pages_url = pagesInfo.html_url || deploy.pages_url;
      if (newDeployStatus === 'ready') {
        deploy.deployment_url = pagesInfo.html_url || deploy.pages_url;
      }
    }
  } catch (err) {
    if (err instanceof GitHubApiError && err.status === 404) {
      // Pages not yet enabled — keep current status
      return;
    }
    // Non-fatal: silently ignore
  }
}
