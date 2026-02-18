import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, notFoundError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { decrypt } from '@/lib/crypto';
import { getGitHubPagesStatus, GitHubApiError } from '@/lib/github/api';

type StepStatus = 'completed' | 'in_progress' | 'pending' | 'error';

interface DeployStep {
  name: string;
  status: StepStatus;
  label: string;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const deployId = request.nextUrl.searchParams.get('deploy_id');
  if (!deployId) return apiError('deploy_id는 필수입니다', 400);

  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select('*')
    .eq('id', deployId)
    .eq('user_id', user.id)
    .single();

  if (!deploy) return notFoundError('배포');

  const deployMethod = deploy.deploy_method || 'github_pages';

  // GitHub Pages polling
  if (deployMethod === 'github_pages' && deploy.deploy_status !== 'ready' && deploy.deploy_status !== 'error') {
    try {
      const { data: githubService } = await supabase
        .from('services')
        .select('id')
        .eq('slug', 'github')
        .single();

      const { data: ghAccount } = githubService
        ? await supabase
            .from('service_accounts')
            .select('encrypted_access_token')
            .eq('project_id', deploy.project_id)
            .eq('service_id', githubService.id)
            .eq('status', 'active')
            .single()
        : { data: null };

      if (ghAccount) {
        const githubToken = decrypt(ghAccount.encrypted_access_token);
        const [owner, repo] = (deploy.forked_repo_full_name as string).split('/');

        const pagesInfo = await getGitHubPagesStatus(githubToken, owner, repo);
        const pagesStatus = pagesInfo.status;

        let newDeployStatus = deploy.deploy_status;
        let newPagesStatus = deploy.pages_status;

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
          // GitHub Pages API returns null status when no deployment has completed yet.
          // This is normal during the initial setup phase — keep as 'building'.
          newDeployStatus = 'building';
          newPagesStatus = 'enabling';
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
            await logAudit(user.id, {
              action: 'oneclick.deploy_success',
              resourceType: 'homepage_deploy',
              resourceId: deploy.id,
              details: { pages_url: pagesInfo.html_url || deploy.pages_url },
            });
          }
          if (newDeployStatus === 'error') {
            await logAudit(user.id, {
              action: 'oneclick.deploy_error',
              resourceType: 'homepage_deploy',
              resourceId: deploy.id,
            });
          }

          await supabase
            .from('homepage_deploys')
            .update(updateData)
            .eq('id', deployId);

          deploy.deploy_status = newDeployStatus;
          deploy.pages_status = newPagesStatus;
          deploy.pages_url = pagesInfo.html_url || deploy.pages_url;
          if (newDeployStatus === 'ready') {
            deploy.deployment_url = pagesInfo.html_url || deploy.pages_url;
          }
        }
      }
    } catch (err) {
      // If Pages API returns 404, Pages might not be enabled yet — retry silently
      if (err instanceof GitHubApiError && err.status === 404) {
        // Pages not yet enabled, keep current status
      }
      // Non-fatal: return whatever we have in the DB
    }
  }

  const steps = buildSteps(deploy, deployMethod);

  return NextResponse.json({
    deploy_id: deploy.id,
    fork_status: deploy.fork_status,
    deploy_status: deploy.deploy_status,
    deployment_url: deploy.deployment_url,
    deploy_error: deploy.deploy_error_message,
    forked_repo_url: deploy.forked_repo_url,
    deploy_method: deployMethod,
    pages_url: deploy.pages_url,
    pages_status: deploy.pages_status,
    steps,
  });
}

function buildSteps(deploy: Record<string, unknown>, deployMethod: string): DeployStep[] {
  const forkStatus = deploy.fork_status as string;
  const deployStatus = deploy.deploy_status as string;

  if (deployMethod === 'github_pages') {
    const repoStep: StepStatus =
      forkStatus === 'forked' ? 'completed' :
      forkStatus === 'forking' ? 'in_progress' :
      forkStatus === 'failed' ? 'error' : 'pending';

    const pagesStep: StepStatus =
      repoStep !== 'completed' ? 'pending' :
      deployStatus === 'building' || deployStatus === 'ready' ? 'completed' :
      deployStatus === 'error' ? 'error' : 'in_progress';

    const liveStep: StepStatus =
      deployStatus === 'ready' ? 'completed' :
      deployStatus === 'error' ? 'error' :
      pagesStep === 'completed' && deployStatus === 'building' ? 'in_progress' :
      'pending';

    return [
      { name: 'repo', status: repoStep, label: '레포지토리 생성' },
      { name: 'pages', status: pagesStep, label: 'GitHub Pages 활성화' },
      { name: 'live', status: liveStep, label: '사이트 게시 완료' },
    ];
  }

  // LEGACY: Vercel deploy steps — kept for backward compatibility with
  // existing homepage_deploys rows where deploy_method = 'vercel'.
  // Do NOT add new features here. New deploys always use github_pages.
  const forkStep: StepStatus =
    forkStatus === 'forked' ? 'completed' :
    forkStatus === 'forking' ? 'in_progress' :
    forkStatus === 'failed' ? 'error' : 'pending';

  const projectStep: StepStatus =
    deployStatus === 'pending' ? 'pending' :
    deployStatus === 'creating' ? 'in_progress' :
    ['building', 'ready', 'error', 'canceled'].includes(deployStatus) ? 'completed' : 'pending';

  const buildStep: StepStatus =
    deployStatus === 'building' ? 'in_progress' :
    deployStatus === 'ready' ? 'completed' :
    deployStatus === 'error' ? 'error' :
    'pending';

  const deployStep: StepStatus =
    deployStatus === 'ready' ? 'completed' :
    deployStatus === 'error' ? 'error' :
    'pending';

  return [
    { name: 'fork', status: forkStep, label: '레포지토리 복사' },
    { name: 'project', status: projectStep, label: 'Vercel 프로젝트 생성' },
    { name: 'build', status: buildStep, label: '빌드 중...' },
    { name: 'deploy', status: deployStep, label: '배포 완료' },
  ];
}
