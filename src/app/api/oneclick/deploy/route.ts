import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, serverError, apiError, notFoundError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { createRepo, pushFilesAtomically, deleteRepo, enableGitHubPagesWithActions, GitHubApiError } from '@/lib/github/api';
import { getTemplateBySlug } from '@/data/oneclick/homepage-template-content';
import { safeDecryptToken } from '@/lib/github/token';
import { deployPagesRequestSchema } from '@/lib/validations/oneclick';
import { logDeployError } from '@/lib/oneclick/deploy-error-logger';

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** 배포 실패 시 생성된 리소스 정리 */
async function cleanupResources(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  copiedServiceAccountId: string | null,
  githubToken?: string,
  repoOwner?: string,
  repoName?: string,
) {
  // 1. GitHub 레포 삭제 (있으면)
  if (githubToken && repoOwner && repoName) {
    try {
      await deleteRepo(githubToken, repoOwner, repoName);
    } catch { /* best effort */ }
  }
  // 2. 복사된 service_account 삭제 (있으면)
  if (copiedServiceAccountId) {
    await supabase.from('service_accounts').delete().eq('id', copiedServiceAccountId);
  }
  // 3. 프로젝트 삭제
  await supabase.from('projects').delete().eq('id', projectId);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = deployPagesRequestSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { template_id, site_name: rawSiteName, github_service_account_id } = parsed.data;

  // Sanitize site_name: strip anything not lowercase alphanumeric or hyphens
  const site_name = rawSiteName.replace(/[^a-z0-9-]/g, '').slice(0, 100);
  if (site_name.length < 2) {
    return apiError('사이트 이름이 유효하지 않습니다', 400);
  }

  // ── Group 2: 데이터 조회 병렬화 ──
  const [templateResult, githubServiceResult] = await Promise.all([
    supabase
      .from('homepage_templates')
      .select('*')
      .eq('id', template_id)
      .eq('is_active', true)
      .single(),
    supabase
      .from('services')
      .select('id')
      .eq('slug', 'github')
      .single(),
  ]);

  const template = templateResult.data;
  if (!template) return notFoundError('템플릿');

  const githubService = githubServiceResult.data;
  if (!githubService) {
    return serverError('GitHub 서비스 설정을 찾을 수 없습니다');
  }

  let ghQuery = supabase
    .from('service_accounts')
    .select('id, project_id, encrypted_access_token, encrypted_refresh_token, token_expires_at, oauth_scopes, oauth_provider_user_id, oauth_metadata')
    .eq('user_id', user.id)
    .eq('service_id', githubService.id)
    .eq('connection_type', 'oauth')
    .eq('status', 'active');

  if (github_service_account_id) {
    ghQuery = ghQuery.eq('id', github_service_account_id);
  }

  const { data: ghAccount } = await ghQuery
    .order('project_id', { ascending: true, nullsFirst: true })
    .limit(1)
    .single();

  if (!ghAccount) {
    void logDeployError({
      userId: user.id, templateId: template_id, errorMessage: 'GitHub 계정이 연결되어 있지 않습니다',
      failedStep: '준비 중', httpStatus: 404,
    });
    return apiError('GitHub 계정이 연결되어 있지 않습니다. 먼저 GitHub를 연결해주세요.', 404);
  }

  const decryptResult = await safeDecryptToken(
    ghAccount.encrypted_access_token,
    supabase,
    ghAccount.id
  );
  if ('error' in decryptResult) {
    void logDeployError({
      userId: user.id, templateId: template_id, errorMessage: decryptResult.error,
      failedStep: '준비 중', httpStatus: 401,
    });
    return apiError(decryptResult.error, 401);
  }
  const githubToken = decryptResult.token;

  // 4. Create Linkmap project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: humanizeSlug(site_name),
      description: `${template.name_ko} 템플릿으로 생성된 GitHub Pages 사이트`,
    })
    .select()
    .single();

  if (projectError) return serverError(projectError.message);

  // 4.5. Copy user-level service account to project
  let projectServiceAccountId = ghAccount.id;
  let copiedServiceAccountId: string | null = null;
  if (!ghAccount.project_id) {
    const { data: copiedAccount } = await supabase.from('service_accounts').insert({
      project_id: project.id,
      service_id: githubService.id,
      user_id: user.id,
      connection_type: 'oauth',
      encrypted_access_token: ghAccount.encrypted_access_token,
      encrypted_refresh_token: ghAccount.encrypted_refresh_token,
      token_expires_at: ghAccount.token_expires_at,
      oauth_scopes: ghAccount.oauth_scopes,
      oauth_provider_user_id: ghAccount.oauth_provider_user_id,
      oauth_metadata: ghAccount.oauth_metadata,
      status: 'active',
      last_verified_at: new Date().toISOString(),
    }).select('id').single();

    if (copiedAccount) {
      projectServiceAccountId = copiedAccount.id;
      copiedServiceAccountId = copiedAccount.id;
    }
  }

  // 5. Look up bundled template content
  const templateContent = getTemplateBySlug(template.slug);
  if (!templateContent) {
    await cleanupResources(supabase, project.id, copiedServiceAccountId);
    void logDeployError({
      userId: user.id, templateId: template_id, templateSlug: template.slug, siteName: site_name,
      errorMessage: `템플릿 번들을 찾을 수 없습니다 (${template.slug})`, failedStep: '준비 중', httpStatus: 404,
    });
    return apiError(`템플릿 번들을 찾을 수 없습니다 (${template.slug}). 관리자에게 문의하세요.`, 404);
  }

  // 5a. Create repo — auto-suffix on name collision (422)
  // 원본 → 랜덤 2자리 영숫자(20회) → 랜덤 3자리 영숫자(10회)
  const SUFFIX_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
  function randomSuffix(len: number): string {
    let s = '';
    for (let i = 0; i < len; i++) {
      s += SUFFIX_CHARS[Math.floor(Math.random() * SUFFIX_CHARS.length)];
    }
    return s;
  }

  // 시도 순서: [원본, 2자리×20, 3자리×10] = 최대 31회
  const nameCandidates: string[] = [site_name];
  for (let i = 0; i < 20; i++) nameCandidates.push(`${site_name}-${randomSuffix(2)}`);
  for (let i = 0; i < 10; i++) nameCandidates.push(`${site_name}-${randomSuffix(3)}`);

  let repoResult;
  let finalSiteName = site_name;

  for (let idx = 0; idx < nameCandidates.length; idx++) {
    const attemptName = nameCandidates[idx];
    try {
      repoResult = await createRepo(
        githubToken,
        attemptName,
        `${template.name_ko} - Generated by Linkmap`,
        { auto_init: true }
      );
      finalSiteName = attemptName;
      break;
    } catch (err) {
      // Name already taken — try next candidate
      if (err instanceof GitHubApiError && err.status === 422 && idx < nameCandidates.length - 1) {
        continue;
      }
      await cleanupResources(supabase, project.id, copiedServiceAccountId);
      if (err instanceof GitHubApiError) {
        const errMsg = err.status === 403
          ? 'GitHub 권한이 부족합니다'
          : `GitHub 레포지토리 생성 실패: ${err.message}`;
        void logDeployError({
          userId: user.id, templateId: template_id, templateSlug: template.slug, siteName: site_name,
          errorMessage: errMsg, failedStep: '준비 중', httpStatus: err.status,
          errorContext: { attemptName },
        });
        if (err.status === 403) {
          return apiError('GitHub 권한이 부족합니다. GitHub 연결을 해제 후 다시 연결해주세요.', 403);
        }
        return apiError(`GitHub 레포지토리 생성 실패: ${err.message}`, 502);
      }
      void logDeployError({
        userId: user.id, templateId: template_id, templateSlug: template.slug, siteName: site_name,
        errorMessage: 'GitHub 레포지토리 생성 중 알 수 없는 오류', failedStep: '준비 중', httpStatus: 500,
      });
      return serverError('GitHub 레포지토리 생성 중 오류가 발생했습니다');
    }
  }

  if (!repoResult) {
    await cleanupResources(supabase, project.id, copiedServiceAccountId);
    void logDeployError({
      userId: user.id, templateId: template_id, templateSlug: template.slug, siteName: site_name,
      errorMessage: `'${site_name}' 및 대체 이름이 모두 사용 중`, failedStep: '준비 중', httpStatus: 409,
    });
    return apiError(`'${site_name}' 및 대체 이름이 모두 사용 중입니다. 다른 이름을 입력해주세요.`, 409);
  }

  // 5b. Enable GitHub Pages — poll-based instead of fixed delay.
  // Try immediately, retry with short interval if GitHub isn't ready yet.
  const pagesStatus: 'enabling' | 'built' = 'enabling';
  const pagesUrl = `https://${repoResult.owner.login}.github.io/${repoResult.name}`;

  const PAGES_MAX_RETRIES = 10;
  const PAGES_RETRY_INTERVAL = 100; // ms
  let pagesEnabled = false;

  for (let attempt = 0; attempt < PAGES_MAX_RETRIES; attempt++) {
    try {
      await enableGitHubPagesWithActions(
        githubToken,
        repoResult.owner.login,
        repoResult.name
      );
      pagesEnabled = true;
      break;
    } catch (err) {
      if (err instanceof GitHubApiError && err.status === 409) {
        // Pages already enabled
        pagesEnabled = true;
        break;
      }
      // GitHub not ready yet (404 or 422 on newly created repo) — retry
      if (err instanceof GitHubApiError && (err.status === 404 || err.status === 422) && attempt < PAGES_MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, PAGES_RETRY_INTERVAL * (attempt + 1)));
        continue;
      }
      // Fatal error — clean up and return
      await cleanupResources(supabase, project.id, copiedServiceAccountId, githubToken, repoResult.owner.login, repoResult.name);

      const errMsg = err instanceof GitHubApiError ? err.message : 'GitHub Pages 활성화 실패';
      void logDeployError({
        userId: user.id, templateId: template_id, templateSlug: template.slug, siteName: finalSiteName,
        errorMessage: `GitHub Pages 활성화 실패: ${errMsg}`, failedStep: '설정 중',
        httpStatus: err instanceof GitHubApiError ? err.status : 502,
        errorContext: { repo: repoResult.full_name },
      });
      return apiError(`GitHub Pages 활성화 실패: ${errMsg}`, 502);
    }
  }

  if (!pagesEnabled) {
    await cleanupResources(supabase, project.id, copiedServiceAccountId, githubToken, repoResult.owner.login, repoResult.name);
    void logDeployError({
      userId: user.id, templateId: template_id, templateSlug: template.slug, siteName: finalSiteName,
      errorMessage: 'GitHub Pages 활성화 시간 초과', failedStep: '설정 중', httpStatus: 502,
      errorContext: { repo: repoResult.full_name },
    });
    return apiError('GitHub Pages 활성화 시간 초과. 다시 시도해주세요.', 502);
  }

  // 5c. Push all template files as a single atomic commit (with retry).
  // Try immediately — no fixed delay. Retry on transient errors.
  const MAX_RETRIES = 2;
  let pushError: unknown = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      await pushFilesAtomically(
        githubToken,
        repoResult.owner.login,
        repoResult.name,
        templateContent.files,
        'Initial commit from Linkmap'
      );
      pushError = null;
      break;
    } catch (err) {
      pushError = err;
      // Retry on 409 (conflict/empty repo race), 502/503 (transient gateway error)
      if (err instanceof GitHubApiError && [409, 502, 503].includes(err.status) && attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }
      break;
    }
  }

  if (pushError) {
    // Clean up: delete the created repo, service account, and project
    await cleanupResources(supabase, project.id, copiedServiceAccountId, githubToken, repoResult.owner.login, repoResult.name);

    const pushErrMsg = pushError instanceof GitHubApiError
      ? `파일 업로드 실패: ${pushError.message}`
      : '템플릿 파일 업로드 중 오류가 발생했습니다';
    void logDeployError({
      userId: user.id, templateId: template_id, templateSlug: template.slug, siteName: finalSiteName,
      errorMessage: pushErrMsg, failedStep: '준비 중',
      httpStatus: pushError instanceof GitHubApiError ? pushError.status : 502,
      errorContext: { repo: repoResult.full_name },
    });

    if (pushError instanceof GitHubApiError) {
      return apiError(`파일 업로드 실패: ${pushError.message}`, 502);
    }
    return serverError('템플릿 파일 업로드 중 오류가 발생했습니다');
  }

  // 6.5. 자동채번으로 site_name이 변경된 경우 프로젝트 이름도 업데이트
  if (finalSiteName !== site_name) {
    await supabase
      .from('projects')
      .update({ name: humanizeSlug(finalSiteName) })
      .eq('id', project.id);
  }

  // 7-9. Create deploy record, link repo, add service (parallel where possible)
  // Deploy record must come first (we need deploy.id for audit log)
  const { data: deploy, error: deployError } = await supabase
    .from('homepage_deploys')
    .insert({
      user_id: user.id,
      project_id: project.id,
      template_id: template.id,
      site_name: finalSiteName,
      forked_repo_full_name: repoResult.full_name,
      forked_repo_url: repoResult.html_url,
      fork_status: 'forked',
      deploy_status: 'building',
      deploy_method: 'github_pages',
      pages_url: pagesUrl,
      pages_status: pagesStatus,
    })
    .select()
    .single();

  if (deployError) return serverError(deployError.message);

  // Parallel: link repo + add project_services + audit log
  await Promise.all([
    supabase.from('project_github_repos').insert({
      project_id: project.id,
      service_account_id: projectServiceAccountId,
      owner: repoResult.owner.login,
      repo_name: repoResult.name,
      repo_full_name: repoResult.full_name,
      default_branch: repoResult.default_branch,
      auto_sync_enabled: false,
    }),
    supabase.from('project_services').insert({
      project_id: project.id,
      service_id: githubService.id,
    }),
    logAudit(user.id, {
      action: 'oneclick.deploy_pages',
      resourceType: 'homepage_deploy',
      resourceId: deploy.id,
      details: {
        template_slug: template.slug,
        site_name: finalSiteName,
        repo: repoResult.full_name,
        pages_url: pagesUrl,
        project_id: project.id,
      },
    }),
  ]);

  return NextResponse.json(
    {
      deploy_id: deploy.id,
      project_id: project.id,
      repo_url: repoResult.html_url,
      pages_url: pagesUrl,
      pages_status: pagesStatus,
      site_name: finalSiteName,
    },
    { status: 201 }
  );
}
