import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError } from '@/lib/api/errors';
import { resolveUserGitHubToken } from '@/lib/github/token';
import { resolveDeployStatus } from '@/lib/oneclick/deploy-status';

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
    const githubToken = await resolveUserGitHubToken(supabase, user.id);

    if (githubToken) {
      await Promise.allSettled(
        stuckDeploys.map((d) => refreshDeployStatus(supabase, d, githubToken))
      );
    }
  }

  return NextResponse.json({ deployments: list });
}

/** Check GitHub Pages status and update DB + in-memory object */
async function refreshDeployStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  deploy: Record<string, unknown>,
  githubToken: string
): Promise<void> {
  try {
    const result = await resolveDeployStatus(
      githubToken,
      deploy.forked_repo_full_name as string,
      deploy.deploy_status as string,
      deploy.pages_status as string,
      deploy.pages_url as string | null
    );

    if (result.changed) {
      const updateData: Record<string, unknown> = {
        deploy_status: result.deployStatus,
        pages_status: result.pagesStatus,
        pages_url: result.pagesUrl,
      };

      if (result.deployStatus === 'ready') {
        updateData.deployed_at = new Date().toISOString();
        updateData.deployment_url = result.deploymentUrl;
      }

      await supabase
        .from('homepage_deploys')
        .update(updateData)
        .eq('id', deploy.id as string);

      // Update in-memory so the response reflects the new status
      deploy.deploy_status = result.deployStatus;
      deploy.pages_status = result.pagesStatus;
      deploy.pages_url = result.pagesUrl;
      if (result.deployStatus === 'ready') {
        deploy.deployment_url = result.deploymentUrl;
      }
    }
  } catch {
    // Non-fatal: silently ignore
  }
}
