import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, serverError, apiError, apiErrorWithCode, notFoundError, quotaExceededError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { createRepo, pushFilesAtomically, deleteRepo, enableGitHubPagesWithActions, GitHubApiError } from '@/lib/github/api';
import { safeDecryptToken } from '@/lib/github/token';
import { deployUploadRequestSchema } from '@/lib/validations/oneclick';
import { logDeployError, classifyErrorCategory } from '@/lib/oneclick/deploy-error-logger';
import { checkHomepageDeployQuota } from '@/lib/quota';
import { sanitizeUploadFiles, summarizeUpload, UploadValidationError } from '@/lib/oneclick/upload-sanitizer';
import { STATIC_WORKFLOW_PATH, staticDeployYml } from '@/lib/oneclick/static-workflow';

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * 배포 실패 시 생성된 리소스 정리. 트랙 A는 Linkmap이 방금 만든 레포만 다루므로
 * 템플릿 배포와 동일하게 레포 삭제를 시도한다 (트랙 B는 기존 레포라 절대 삭제하지 않는다).
 */
async function cleanupResources(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string | null,
  copiedServiceAccountId: string | null,
  githubToken?: string,
  repoOwner?: string,
  repoName?: string,
): Promise<{ orphanRepo: string | null }> {
  let orphanRepo: string | null = null;
  if (githubToken && repoOwner && repoName) {
    try {
      await deleteRepo(githubToken, repoOwner, repoName);
    } catch {
      orphanRepo = `${repoOwner}/${repoName}`;
    }
  }
  if (copiedServiceAccountId) {
    await supabase.from('service_accounts').delete().eq('id', copiedServiceAccountId);
  }
  if (projectId) {
    await supabase.from('projects').delete().eq('id', projectId);
  }
  return { orphanRepo };
}

function orphanRepoNotice(orphanRepo: string | null): string {
  return orphanRepo
    ? ` 생성된 GitHub 저장소(github.com/${orphanRepo})는 자동 정리되지 않았습니다. GitHub에서 직접 삭제할 수 있어요.`
    : '';
}

/**
 * 내 파일 업로드 배포 (트랙 A).
 *
 * 파이프라인은 템플릿 배포(`/api/oneclick/deploy`)와 동일하되 파일 소스만 다르다:
 * 템플릿 번들 대신 사용자 업로드 파일을 검증(sanitize)한 뒤 표준 정적 워크플로우를 주입한다.
 * GitHub 리소스를 먼저 확정하고 DB row는 마지막에 만들어 고아 row를 방지하는 순서도 동일하다.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorizedError();

    const body = await request.json();
    const parsed = deployUploadRequestSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { site_name: rawSiteName, files: rawFiles, github_service_account_id } = parsed.data;

    const deployQuota = await checkHomepageDeployQuota(user.id);
    if (!deployQuota.allowed) return quotaExceededError('사이트 배포', deployQuota.current, deployQuota.max);

    const site_name = rawSiteName.replace(/[^a-z0-9-]/g, '').slice(0, 100);
    if (site_name.length < 2) {
      return apiError('사이트 이름이 유효하지 않습니다', 400);
    }

    const failDeploy = (opts: {
      message: string;
      httpStatus: number;
      failedStep: string;
      siteName?: string;
      errorContext?: Record<string, unknown>;
    }) => {
      const code = classifyErrorCategory(opts.message, opts.httpStatus);
      void logDeployError({
        userId: user.id,
        templateSlug: 'upload',
        siteName: opts.siteName,
        errorMessage: opts.message,
        failedStep: opts.failedStep,
        httpStatus: opts.httpStatus,
        errorContext: opts.errorContext,
      });
      return apiErrorWithCode(opts.message, opts.httpStatus, code);
    };

    // 업로드 파일 검증 — 클라이언트 필터링 결과를 신뢰하지 않고 전량 재검증한다.
    // GitHub 리소스를 만들기 전에 수행해 고아 레포 생성을 막는다.
    let sanitized;
    try {
      sanitized = sanitizeUploadFiles(rawFiles);
    } catch (err) {
      if (err instanceof UploadValidationError) {
        void logDeployError({
          userId: user.id,
          templateSlug: 'upload',
          siteName: site_name,
          errorMessage: err.message,
          failedStep: '준비 중',
          httpStatus: 400,
        });
        return apiErrorWithCode(err.message, 400, 'upload_validation');
      }
      throw err;
    }

    // 사용자 .github/ 는 sanitizer가 전량 드랍했다. 워크플로우는 서버 상수만 주입한다.
    const filesToPush = [
      ...sanitized.files,
      { path: STATIC_WORKFLOW_PATH, content: staticDeployYml, encoding: 'utf-8' as const },
    ];

    const { data: githubService } = await supabase
      .from('services')
      .select('id')
      .eq('slug', 'github')
      .single();

    if (!githubService) return serverError('GitHub 서비스 설정을 찾을 수 없습니다');

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
      return failDeploy({
        message: 'GitHub 계정이 연결되어 있지 않습니다. 먼저 GitHub를 연결해주세요.',
        httpStatus: 404, failedStep: '준비 중',
      });
    }

    const decryptResult = await safeDecryptToken(ghAccount.encrypted_access_token, supabase, ghAccount.id);
    if ('error' in decryptResult) {
      return failDeploy({ message: decryptResult.error, httpStatus: 401, failedStep: '준비 중' });
    }
    const githubToken = decryptResult.token;

    // workflow 스코프 없으면 .github/workflows 푸시·Pages(Actions) 활성화가 불가 — 레포 생성 전 fail-fast
    const ghScopes = ghAccount.oauth_scopes;
    if (Array.isArray(ghScopes) && ghScopes.length > 0 && !ghScopes.includes('workflow')) {
      return failDeploy({
        message: 'GitHub 연결에 workflow 권한이 없어 배포할 수 없습니다. GitHub 연결을 해제 후 다시 연결해주세요.',
        httpStatus: 403, failedStep: '준비 중', siteName: site_name,
      });
    }

    // ── GitHub 리소스 생성 (DB write 이전) ──
    const SUFFIX_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
    function randomSuffix(len: number): string {
      let s = '';
      for (let i = 0; i < len; i++) {
        s += SUFFIX_CHARS[Math.floor(Math.random() * SUFFIX_CHARS.length)];
      }
      return s;
    }

    const nameCandidates: string[] = [site_name];
    for (let i = 0; i < 5; i++) nameCandidates.push(`${site_name}-${randomSuffix(2)}`);
    for (let i = 0; i < 2; i++) nameCandidates.push(`${site_name}-${randomSuffix(3)}`);

    const REPO_CREATE_BUDGET_MS = 20_000;
    const repoLoopStart = Date.now();

    let repoResult;
    let finalSiteName = site_name;

    for (let idx = 0; idx < nameCandidates.length; idx++) {
      if (idx > 0 && Date.now() - repoLoopStart > REPO_CREATE_BUDGET_MS) {
        return failDeploy({
          message: '레포지토리 생성이 지연되고 있습니다. 잠시 후 다시 시도해주세요.',
          httpStatus: 429, failedStep: '준비 중', siteName: site_name,
          errorContext: { attempted: idx },
        });
      }

      const attemptName = nameCandidates[idx];
      try {
        repoResult = await createRepo(
          githubToken,
          attemptName,
          'Deployed with Linkmap',
          { auto_init: true }
        );
        finalSiteName = attemptName;
        break;
      } catch (err) {
        if (err instanceof GitHubApiError && err.status === 422 && idx < nameCandidates.length - 1) {
          await sleep(150 + Math.floor(Math.random() * 250));
          continue;
        }
        if (err instanceof GitHubApiError) {
          if (err.status === 403) {
            return failDeploy({
              message: 'GitHub 권한이 부족합니다. GitHub 연결을 해제 후 다시 연결해주세요.',
              httpStatus: 403, failedStep: '준비 중', siteName: site_name,
              errorContext: { attemptName },
            });
          }
          return failDeploy({
            message: `GitHub 레포지토리 생성 실패: ${err.message}`,
            httpStatus: 502, failedStep: '준비 중', siteName: site_name,
            errorContext: { attemptName },
          });
        }
        return failDeploy({
          message: 'GitHub 레포지토리 생성 중 오류가 발생했습니다',
          httpStatus: 500, failedStep: '준비 중', siteName: site_name,
        });
      }
    }

    if (!repoResult) {
      return failDeploy({
        message: `'${site_name}' 및 대체 이름이 모두 사용 중입니다. 다른 이름을 입력해주세요.`,
        httpStatus: 409, failedStep: '준비 중', siteName: site_name,
      });
    }

    const repoOwner = repoResult.owner.login;
    const repoName = repoResult.name;
    const pagesUrl = `https://${repoOwner}.github.io/${repoName}`;

    const PAGES_MAX_RETRIES = 10;
    const PAGES_RETRY_INTERVAL = 100;
    let pagesEnabled = false;

    for (let attempt = 0; attempt < PAGES_MAX_RETRIES; attempt++) {
      try {
        await enableGitHubPagesWithActions(githubToken, repoOwner, repoName);
        pagesEnabled = true;
        break;
      } catch (err) {
        if (err instanceof GitHubApiError && err.status === 409) {
          pagesEnabled = true;
          break;
        }
        if (err instanceof GitHubApiError && (err.status === 404 || err.status === 422) && attempt < PAGES_MAX_RETRIES - 1) {
          await sleep(PAGES_RETRY_INTERVAL * (attempt + 1));
          continue;
        }
        const { orphanRepo } = await cleanupResources(supabase, null, null, githubToken, repoOwner, repoName);
        const errMsg = err instanceof GitHubApiError ? err.message : 'GitHub Pages 활성화 실패';
        return failDeploy({
          message: `GitHub Pages 활성화 실패: ${errMsg}${orphanRepoNotice(orphanRepo)}`,
          httpStatus: err instanceof GitHubApiError ? err.status : 502,
          failedStep: '설정 중', siteName: finalSiteName,
          errorContext: { repo: repoResult.full_name, orphan_repo: orphanRepo },
        });
      }
    }

    if (!pagesEnabled) {
      const { orphanRepo } = await cleanupResources(supabase, null, null, githubToken, repoOwner, repoName);
      return failDeploy({
        message: `GitHub Pages 활성화 시간 초과. 다시 시도해주세요.${orphanRepoNotice(orphanRepo)}`,
        httpStatus: 502, failedStep: '설정 중', siteName: finalSiteName,
        errorContext: { repo: repoResult.full_name, orphan_repo: orphanRepo },
      });
    }

    const MAX_RETRIES = 2;
    let pushError: unknown = null;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        await pushFilesAtomically(githubToken, repoOwner, repoName, filesToPush, 'Deploy my files with Linkmap');
        pushError = null;
        break;
      } catch (err) {
        pushError = err;
        if (err instanceof GitHubApiError && [409, 502, 503].includes(err.status) && attempt < MAX_RETRIES) {
          await sleep(500 * (attempt + 1));
          continue;
        }
        break;
      }
    }

    if (pushError) {
      const { orphanRepo } = await cleanupResources(supabase, null, null, githubToken, repoOwner, repoName);
      const pushErrMsg = pushError instanceof GitHubApiError
        ? `파일 업로드 실패: ${pushError.message}`
        : '파일 업로드 중 오류가 발생했습니다';
      return failDeploy({
        message: `${pushErrMsg}${orphanRepoNotice(orphanRepo)}`,
        httpStatus: pushError instanceof GitHubApiError ? pushError.status : 502,
        failedStep: '준비 중', siteName: finalSiteName,
        errorContext: { repo: repoResult.full_name, orphan_repo: orphanRepo },
      });
    }

    // ── DB 리소스 생성 (GitHub 리소스 확정 후) ──
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: humanizeSlug(finalSiteName),
        description: '내가 올린 파일로 만든 GitHub Pages 사이트',
      })
      .select()
      .single();

    if (projectError || !project) {
      const { orphanRepo } = await cleanupResources(supabase, null, null, githubToken, repoOwner, repoName);
      return serverError(`${projectError?.message ?? '프로젝트 생성에 실패했습니다'}${orphanRepoNotice(orphanRepo)}`);
    }

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

    // source_type='upload' → template_id는 NULL이어야 한다 (M109 정합성 CHECK)
    const { data: createResult, error: deployError } = await supabase.rpc('create_homepage_deploy_atomic', {
      p_project_id: project.id,
      p_template_id: null,
      p_site_name: finalSiteName,
      p_forked_repo_full_name: repoResult.full_name,
      p_forked_repo_url: repoResult.html_url,
      p_pages_url: pagesUrl,
      p_source_type: 'upload',
    });

    if (deployError || !createResult) {
      const { orphanRepo } = await cleanupResources(supabase, project.id, copiedServiceAccountId, githubToken, repoOwner, repoName);
      return serverError(`${deployError?.message ?? '배포 레코드 생성에 실패했습니다'}${orphanRepoNotice(orphanRepo)}`);
    }

    const deployResult = createResult as { allowed: boolean; current: number; max: number; deploy_id?: string };
    if (!deployResult.allowed || !deployResult.deploy_id) {
      const { orphanRepo } = await cleanupResources(supabase, project.id, copiedServiceAccountId, githubToken, repoOwner, repoName);
      if (orphanRepo) {
        void logDeployError({
          userId: user.id,
          templateSlug: 'upload',
          siteName: finalSiteName,
          errorMessage: `쿼터 초과로 배포 중단 — 고아 레포 정리 실패 (github.com/${orphanRepo})`,
          failedStep: '정리 중',
          httpStatus: 403,
          errorContext: { orphan_repo: orphanRepo },
        });
      }
      return quotaExceededError('사이트 배포', deployResult.current, deployResult.max);
    }
    const deployId = deployResult.deploy_id;

    const uploadSummary = summarizeUpload(sanitized);

    await Promise.all([
      supabase.from('homepage_deploys').update({ config_data: uploadSummary }).eq('id', deployId),
      supabase.from('project_github_repos').insert({
        project_id: project.id,
        service_account_id: projectServiceAccountId,
        owner: repoOwner,
        repo_name: repoName,
        repo_full_name: repoResult.full_name,
        default_branch: repoResult.default_branch,
        auto_sync_enabled: false,
      }),
      supabase.from('project_services').insert({
        project_id: project.id,
        service_id: githubService.id,
      }),
      logAudit(user.id, {
        action: 'oneclick.deploy_upload',
        resourceType: 'homepage_deploy',
        resourceId: deployId,
        details: {
          site_name: finalSiteName,
          repo: repoResult.full_name,
          pages_url: pagesUrl,
          project_id: project.id,
          file_count: uploadSummary.file_count,
          total_bytes: uploadSummary.total_bytes,
          skipped_count: uploadSummary.skipped_files.length,
        },
      }),
    ]);

    return NextResponse.json(
      {
        deploy_id: deployId,
        project_id: project.id,
        repo_url: repoResult.html_url,
        pages_url: pagesUrl,
        pages_status: 'enabling',
        site_name: finalSiteName,
        file_count: uploadSummary.file_count,
        skipped_files: uploadSummary.skipped_files,
      },
      { status: 201 }
    );
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Unknown error');
  }
}
