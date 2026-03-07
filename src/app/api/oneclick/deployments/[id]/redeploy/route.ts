import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { resolveUserGitHubToken } from '@/lib/github/token';
import { triggerWorkflowDispatch, getFileContent, createOrUpdateFileContent } from '@/lib/github/api';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // Verify ownership
  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select('id, deploy_status, forked_repo_full_name, site_name')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!deploy) return notFoundError('배포');

  // Only allow redeploy from error state
  if (deploy.deploy_status !== 'error') {
    return apiError('오류 상태의 배포만 재배포할 수 있습니다', 400);
  }

  if (!deploy.forked_repo_full_name) {
    return apiError('배포된 레포지토리 정보가 없습니다', 400);
  }

  // Resolve GitHub token
  const githubToken = await resolveUserGitHubToken(supabase, user.id, { preferUserLevel: true });
  if (!githubToken) {
    return apiError('GitHub 연결이 필요합니다. GitHub를 다시 연결해주세요.', 400);
  }

  const [owner, repo] = deploy.forked_repo_full_name.split('/');

  // 기존 레포의 package.json에 존재하지 않는 패키지 버전이 있으면 자동 패치
  try {
    const file = await getFileContent(githubToken, owner, repo, 'package.json');
    const content = Buffer.from(file.content, 'base64').toString('utf-8');
    const pkg = JSON.parse(content);
    let patched = false;

    // typescript@5.7.0은 npm에 존재하지 않음 → 5.7.2로 패치
    if (pkg.devDependencies?.typescript === '5.7.0') {
      pkg.devDependencies.typescript = '5.7.2';
      patched = true;
    }

    if (patched) {
      await createOrUpdateFileContent(
        githubToken, owner, repo, 'package.json',
        JSON.stringify(pkg, null, 2) + '\n',
        file.sha,
        'fix: patch invalid package versions for build compatibility'
      );
    }
  } catch {
    // 패치 실패는 무시 — 워크플로우 트리거로 진행
  }

  // Trigger workflow dispatch
  try {
    await triggerWorkflowDispatch(githubToken, owner, repo);
  } catch {
    return apiError('워크플로우 재실행에 실패했습니다. GitHub 레포지토리를 확인해주세요.', 500);
  }

  // Update DB: reset to building, reset retry_count
  await supabase
    .from('homepage_deploys')
    .update({
      deploy_status: 'building',
      pages_status: 'building',
      deploy_error_message: null,
      retry_count: 0,
    })
    .eq('id', id);

  await logAudit(user.id, {
    action: 'oneclick.redeploy',
    resourceType: 'homepage_deploy',
    resourceId: id,
    details: { site_name: deploy.site_name, repo: deploy.forked_repo_full_name },
  });

  return NextResponse.json({ success: true, deploy_status: 'building' });
}
