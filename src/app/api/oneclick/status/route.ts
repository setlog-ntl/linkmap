import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, notFoundError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { safeDecryptToken } from '@/lib/github/token';
import { getGitHubPagesStatus, getLatestWorkflowRun, GitHubApiError } from '@/lib/github/api';

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
            .select('id, encrypted_access_token')
            .eq('user_id', user.id)
            .eq('service_id', githubService.id)
            .eq('connection_type', 'oauth')
            .eq('status', 'active')
            .order('project_id', { ascending: false, nullsFirst: false })
            .limit(1)
            .single()
        : { data: null };

      if (ghAccount) {
        const decryptResult = await safeDecryptToken(ghAccount.encrypted_access_token, supabase, ghAccount.id);
        if ('error' in decryptResult) {
          // Token decryption failed — mark deploy as error so UI can show it
          await supabase
            .from('homepage_deploys')
            .update({
              deploy_status: 'error',
              deploy_error_message: 'GitHub 토큰 복호화 실패. GitHub를 다시 연결해주세요.',
            })
            .eq('id', deployId);
          deploy.deploy_status = 'error';
          deploy.deploy_error_message = 'GitHub 토큰 복호화 실패. GitHub를 다시 연결해주세요.';
        } else {
        const githubToken = decryptResult.token;
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
          // build_type: 'workflow' — Pages API always returns status: null.
          // Must check Actions workflow run to determine actual deploy state.
          try {
            const run = await getLatestWorkflowRun(githubToken, owner, repo);
            if (run?.status === 'completed' && run.conclusion === 'success') {
              newDeployStatus = 'ready';
              newPagesStatus = 'built';
            } else if (run?.status === 'completed' && run.conclusion === 'failure') {
              newDeployStatus = 'error';
              newPagesStatus = 'errored';
              deploy.deploy_error_message = 'GitHub Actions 워크플로우 빌드에 실패했습니다. GitHub 레포지토리의 Actions 탭에서 로그를 확인해주세요.';
            } else if (run?.status === 'completed' && run.conclusion === 'cancelled') {
              newDeployStatus = 'error';
              newPagesStatus = 'errored';
              deploy.deploy_error_message = 'GitHub Actions 워크플로우가 취소되었습니다.';
            } else {
              // Workflow still running or no runs yet — keep as building
              newDeployStatus = 'building';
              newPagesStatus = 'enabling';
            }
          } catch {
            // Couldn't check workflow — keep as building
            newDeployStatus = 'building';
            newPagesStatus = 'enabling';
          }
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
            if (deploy.deploy_error_message) {
              updateData.deploy_error_message = deploy.deploy_error_message;
            }
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
    const pagesStatus = deploy.pages_status as string;

    const repoStep: StepStatus =
      forkStatus === 'forked' ? 'completed' :
      forkStatus === 'forking' ? 'in_progress' :
      forkStatus === 'failed' ? 'error' : 'pending';

    const pagesStep: StepStatus =
      repoStep !== 'completed' ? 'pending' :
      pagesStatus === 'built' ? 'completed' :
      pagesStatus === 'errored' ? 'error' :
      pagesStatus === 'enabling' || pagesStatus === 'building' ? 'in_progress' :
      'pending';

    const liveStep: StepStatus =
      deployStatus === 'ready' ? 'completed' :
      deployStatus === 'error' ? 'error' :
      pagesStep === 'completed' ? 'in_progress' :
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
