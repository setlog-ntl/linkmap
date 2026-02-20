import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, notFoundError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { safeDecryptToken } from '@/lib/github/token';
import { resolveDeployStatus, buildDeploySteps } from '@/lib/oneclick/deploy-status';

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
      // Resolve token — need full flow for error handling (token decryption failure → mark deploy as error)
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
          const result = await resolveDeployStatus(
            decryptResult.token,
            deploy.forked_repo_full_name as string,
            deploy.deploy_status,
            deploy.pages_status,
            deploy.pages_url
          );

          // Preserve error message from resolveDeployStatus
          if (result.errorMessage) {
            deploy.deploy_error_message = result.errorMessage;
          }

          if (result.changed) {
            const updateData: Record<string, unknown> = {
              deploy_status: result.deployStatus,
              pages_status: result.pagesStatus,
              pages_url: result.pagesUrl,
            };

            if (result.deployStatus === 'ready') {
              updateData.deployed_at = new Date().toISOString();
              updateData.deployment_url = result.deploymentUrl;
              await logAudit(user.id, {
                action: 'oneclick.deploy_success',
                resourceType: 'homepage_deploy',
                resourceId: deploy.id,
                details: { pages_url: result.pagesUrl },
              });
            }
            if (result.deployStatus === 'error') {
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

            deploy.deploy_status = result.deployStatus;
            deploy.pages_status = result.pagesStatus;
            deploy.pages_url = result.pagesUrl;
            if (result.deployStatus === 'ready') {
              deploy.deployment_url = result.deploymentUrl;
            }
          }
        }
      }
    } catch (err) {
      console.error('[oneclick/status] GitHub polling error:', {
        deployId,
        error: err instanceof Error ? err.message : String(err),
      });
      // Non-fatal: return whatever we have in the DB
    }
  }

  const steps = buildDeploySteps(deploy, deployMethod);

  return NextResponse.json({
    deploy_id: deploy.id,
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
