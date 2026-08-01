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
    .select('id, deploy_status, forked_repo_full_name, site_name, source_type, config_data')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!deploy) return notFoundError('배포');

  // 빌드 중인 상태에서는 재배포 방지 (중복 트리거 방지)
  if (['building', 'creating', 'pending'].includes(deploy.deploy_status)) {
    return apiError('이미 배포가 진행 중입니다', 400);
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

  // 가져온 저장소는 사용자 자산이다 — 워크플로우 파일명·브랜치가 다르고,
  // 아래 레거시 package.json 패치도 적용해서는 안 된다.
  const isImported = deploy.source_type === 'import';
  const config = (deploy.config_data ?? {}) as {
    workflow_file?: string;
    source_branch?: string;
  };
  const workflowFile = typeof config.workflow_file === 'string' ? config.workflow_file : 'deploy.yml';
  const workflowRef = typeof config.source_branch === 'string' ? config.source_branch : 'main';

  // 레거시 레포(package-lock.json 없이 `npm install` 사용)의 알려진 버전 문제 자동 패치.
  // 신규 배포는 package-lock.json + `npm ci`로 고정된 정식 버전(typescript 5.7.2, tailwindcss 4.0.17)을
  // 쓰므로 아래 조건(=== '5.7.0' / '4.0.0')에 매칭되지 않는다 → 패치 미발생, lockfile 비동기화 위험 없음.
  // (즉 이 패치는 lockfile 도입 이전에 생성된 레포에만 작동한다.)
  try {
    if (isImported) throw new Error('skip: imported repo is user-owned');
    const file = await getFileContent(githubToken, owner, repo, 'package.json');
    const content = Buffer.from(file.content, 'base64').toString('utf-8');
    const pkg = JSON.parse(content);
    let patched = false;

    // 빌드 실패를 유발하는 알려진 버전 문제 패치
    const fixes: Record<string, Record<string, [string, string]>> = {
      devDependencies: {
        typescript: ['5.7.0', '5.7.2'],           // 5.7.0 미존재
        tailwindcss: ['4.0.0', '4.0.17'],          // 4.0.0 negated 버그
        '@tailwindcss/postcss': ['4.0.0', '4.0.17'],
      },
    };
    for (const [section, entries] of Object.entries(fixes)) {
      for (const [pkgName, [bad, good]] of Object.entries(entries)) {
        if ((pkg as Record<string, Record<string, string>>)[section]?.[pkgName] === bad) {
          (pkg as Record<string, Record<string, string>>)[section][pkgName] = good;
          patched = true;
        }
      }
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
    await triggerWorkflowDispatch(githubToken, owner, repo, workflowFile, workflowRef);
  } catch {
    return apiError('워크플로우 재실행에 실패했습니다. GitHub 레포지토리를 확인해주세요.', 500);
  }

  // Update DB: reset to building + updated_at 갱신 (타임아웃 기준 시각)
  await supabase
    .from('homepage_deploys')
    .update({
      deploy_status: 'building',
      pages_status: 'building',
      deploy_error_message: null,
      retry_count: 0,
      updated_at: new Date().toISOString(),
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
