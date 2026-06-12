import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, serverError, apiError, apiErrorWithCode, notFoundError, quotaExceededError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { createRepo, pushFilesAtomically, deleteRepo, enableGitHubPagesWithActions, GitHubApiError } from '@/lib/github/api';
import { getTemplateBySlug } from '@/data/oneclick/homepage-template-content';
import { safeDecryptToken } from '@/lib/github/token';
import { deployPagesRequestSchema } from '@/lib/validations/oneclick';
import { logDeployError, classifyErrorCategory } from '@/lib/oneclick/deploy-error-logger';
import { checkHomepageDeployQuota } from '@/lib/quota';

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * 배포 실패 시 생성된 리소스 정리 (projectId는 GitHub 단계 실패 시 null일 수 있음).
 *
 * 반환: 삭제하지 못한 고아 GitHub 레포(`owner/repo`) 또는 null.
 * OAuth 토큰에 `delete_repo` 스코프가 없어 레포 삭제는 항상 403으로 실패할 수 있다 —
 * silent catch로 삼키지 않고 호출자에게 알려 사용자 안내·로깅에 사용한다. (2026-06-12 E2E B-3)
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
  // 1. GitHub 레포 삭제 (있으면) — 실패 시 고아 레포로 보고
  if (githubToken && repoOwner && repoName) {
    try {
      await deleteRepo(githubToken, repoOwner, repoName);
    } catch {
      orphanRepo = `${repoOwner}/${repoName}`;
    }
  }
  // 2. 복사된 service_account 삭제 (있으면)
  if (copiedServiceAccountId) {
    await supabase.from('service_accounts').delete().eq('id', copiedServiceAccountId);
  }
  // 3. 프로젝트 삭제 (있으면)
  if (projectId) {
    await supabase.from('projects').delete().eq('id', projectId);
  }
  return { orphanRepo };
}

/** 고아 레포 발생 시 사용자 안내 문구 (없으면 빈 문자열) */
function orphanRepoNotice(orphanRepo: string | null): string {
  return orphanRepo
    ? ` 생성된 GitHub 저장소(github.com/${orphanRepo})는 자동 정리되지 않았습니다. GitHub에서 직접 삭제할 수 있어요.`
    : '';
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorizedError();

    const body = await request.json();
    const parsed = deployPagesRequestSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { template_id, site_name: rawSiteName, github_service_account_id } = parsed.data;

    // 쿼터 체크
    const deployQuota = await checkHomepageDeployQuota(user.id);
    if (!deployQuota.allowed) return quotaExceededError('사이트 배포', deployQuota.current, deployQuota.max);

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

    /**
     * 실패 응답 헬퍼 — 안정적 code(=로깅 카테고리)를 응답에 포함하고 동시에 로깅한다.
     * 클라이언트는 메시지 문구가 아닌 code로 분기한다 (deploy-error-map).
     */
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
        templateId: template_id,
        templateSlug: template.slug,
        siteName: opts.siteName,
        errorMessage: opts.message,
        failedStep: opts.failedStep,
        httpStatus: opts.httpStatus,
        errorContext: opts.errorContext,
      });
      return apiErrorWithCode(opts.message, opts.httpStatus, code);
    };

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

    const decryptResult = await safeDecryptToken(
      ghAccount.encrypted_access_token,
      supabase,
      ghAccount.id
    );
    if ('error' in decryptResult) {
      return failDeploy({ message: decryptResult.error, httpStatus: 401, failedStep: '준비 중' });
    }
    const githubToken = decryptResult.token;

    // 스코프 사전 검증 — workflow 스코프가 없으면 .github/workflows 푸시·Pages(Actions) 활성화가 불가.
    // 레포를 만들기 전에 빠르게 실패시켜 고아 레포 생성과 "레포 생성 후 Pages 단계 403" 혼란을 방지한다.
    // (oauth_scopes가 비어있는 레거시 연결은 검증을 생략하고 실제 시도에서 처리 — false-block 방지)
    const ghScopes = ghAccount.oauth_scopes;
    if (Array.isArray(ghScopes) && ghScopes.length > 0 && !ghScopes.includes('workflow')) {
      return failDeploy({
        message: 'GitHub 연결에 workflow 권한이 없어 배포할 수 없습니다. GitHub 연결을 해제 후 다시 연결해주세요.',
        httpStatus: 403, failedStep: '준비 중', siteName: site_name,
      });
    }

    // Look up bundled template content — DB/GitHub 리소스 생성 전에 fail-fast
    const templateContent = getTemplateBySlug(template.slug);
    if (!templateContent) {
      return failDeploy({
        message: `템플릿 번들을 찾을 수 없습니다 (${template.slug}). 관리자에게 문의하세요.`,
        httpStatus: 404, failedStep: '준비 중', siteName: site_name,
      });
    }

    // ──────────────────────────────────────────────────────────────
    // GitHub 리소스 생성 (DB write 이전).
    // 이 단계에서 중도 실패/요청 중단이 나도 고아 DB row가 생기지 않는다.
    // 정리 대상은 생성된 GitHub 레포뿐이며 각 실패 경로에서 즉시 삭제한다.
    // ──────────────────────────────────────────────────────────────

    // 레포 생성 — 이름충돌 시 자동 채번 (원본 + 2자리×5 + 3자리×2 = 최대 8회).
    // 2자리 접미사 조합은 1296개라 5회 내 충돌 확률은 무시 가능. 각 시도 사이 지터
    // 백오프로 GitHub 2차 rate-limit을 회피하고, 누적 예산 초과 시 조기 중단한다.
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
      // 누적 예산 초과 — 게이트웨이 타임아웃으로 응답이 유실되기 전에 조기 중단
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
          `${template.name_ko} - Generated by Linkmap`,
          { auto_init: true }
        );
        finalSiteName = attemptName;
        break;
      } catch (err) {
        // Name already taken — 지터 백오프 후 다음 후보 시도
        if (err instanceof GitHubApiError && err.status === 422 && idx < nameCandidates.length - 1) {
          await sleep(150 + Math.floor(Math.random() * 250));
          continue;
        }
        // 치명적 오류 — 레포 미생성 상태이므로 정리할 GitHub/DB 리소스 없음
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
    const pagesStatus: 'enabling' | 'built' = 'enabling';
    const pagesUrl = `https://${repoOwner}.github.io/${repoName}`;

    // Enable GitHub Pages — poll-based retry. 실패 시 생성된 레포만 정리.
    const PAGES_MAX_RETRIES = 10;
    const PAGES_RETRY_INTERVAL = 100; // ms
    let pagesEnabled = false;

    for (let attempt = 0; attempt < PAGES_MAX_RETRIES; attempt++) {
      try {
        await enableGitHubPagesWithActions(githubToken, repoOwner, repoName);
        pagesEnabled = true;
        break;
      } catch (err) {
        if (err instanceof GitHubApiError && err.status === 409) {
          pagesEnabled = true; // Pages already enabled
          break;
        }
        // GitHub not ready yet (404 or 422 on newly created repo) — retry
        if (err instanceof GitHubApiError && (err.status === 404 || err.status === 422) && attempt < PAGES_MAX_RETRIES - 1) {
          await sleep(PAGES_RETRY_INTERVAL * (attempt + 1));
          continue;
        }
        // Fatal — 레포 정리 후 반환
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

    // Push all template files as a single atomic commit (with retry). 실패 시 레포 정리.
    const MAX_RETRIES = 2;
    let pushError: unknown = null;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        await pushFilesAtomically(
          githubToken,
          repoOwner,
          repoName,
          templateContent.files,
          'Initial commit from Linkmap'
        );
        pushError = null;
        break;
      } catch (err) {
        pushError = err;
        // Retry on 409 (conflict/empty repo race), 502/503 (transient gateway error)
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
        : '템플릿 파일 업로드 중 오류가 발생했습니다';
      return failDeploy({
        message: `${pushErrMsg}${orphanRepoNotice(orphanRepo)}`,
        httpStatus: pushError instanceof GitHubApiError ? pushError.status : 502,
        failedStep: '준비 중', siteName: finalSiteName,
        errorContext: { repo: repoResult.full_name, orphan_repo: orphanRepo },
      });
    }

    // ──────────────────────────────────────────────────────────────
    // DB 리소스 생성 (GitHub 리소스 성공 확정 후).
    // 이후 DB 실패 시에는 이미 만들어진 GitHub 레포를 함께 정리한다.
    // ──────────────────────────────────────────────────────────────

    // Create Linkmap project (최종 레포명으로 바로 생성 — 이후 이름 재동기화 불필요)
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: humanizeSlug(finalSiteName),
        description: `${template.name_ko} 템플릿으로 생성된 GitHub Pages 사이트`,
      })
      .select()
      .single();

    if (projectError || !project) {
      const { orphanRepo } = await cleanupResources(supabase, null, null, githubToken, repoOwner, repoName);
      return serverError(`${projectError?.message ?? '프로젝트 생성에 실패했습니다'}${orphanRepoNotice(orphanRepo)}`);
    }

    // Copy user-level service account to project
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

    // Create deploy record — 쿼터 체크와 INSERT를 advisory lock 하의 단일 트랜잭션(RPC)으로 수행.
    // 시작 시점의 checkHomepageDeployQuota는 빠른 사전 차단(UX)일 뿐, 실제 원자적 한도 강제는 여기서 한다.
    // (멀티탭/직접 API 동시 배포가 사전 체크를 모두 통과해도 한도를 넘기지 못함)
    const { data: createResult, error: deployError } = await supabase.rpc('create_homepage_deploy_atomic', {
      p_project_id: project.id,
      p_template_id: template.id,
      p_site_name: finalSiteName,
      p_forked_repo_full_name: repoResult.full_name,
      p_forked_repo_url: repoResult.html_url,
      p_pages_url: pagesUrl,
    });

    if (deployError || !createResult) {
      const { orphanRepo } = await cleanupResources(supabase, project.id, copiedServiceAccountId, githubToken, repoOwner, repoName);
      return serverError(`${deployError?.message ?? '배포 레코드 생성에 실패했습니다'}${orphanRepoNotice(orphanRepo)}`);
    }

    const deployResult = createResult as { allowed: boolean; current: number; max: number; deploy_id?: string };
    if (!deployResult.allowed || !deployResult.deploy_id) {
      // 동시 배포로 한도 초과 — 생성된 GitHub 레포·프로젝트·SA 정리 후 쿼터 에러
      const { orphanRepo } = await cleanupResources(supabase, project.id, copiedServiceAccountId, githubToken, repoOwner, repoName);
      if (orphanRepo) {
        // 쿼터 응답 형태는 유지(클라이언트 업그레이드 UI 의존) — 고아 레포는 로깅으로 가시화
        void logDeployError({
          userId: user.id,
          templateId: template_id,
          templateSlug: template.slug,
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

    // Parallel: link repo + add project_services + audit log
    await Promise.all([
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
        action: 'oneclick.deploy_pages',
        resourceType: 'homepage_deploy',
        resourceId: deployId,
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
        deploy_id: deployId,
        project_id: project.id,
        repo_url: repoResult.html_url,
        pages_url: pagesUrl,
        pages_status: pagesStatus,
        site_name: finalSiteName,
      },
      { status: 201 }
    );
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Unknown error');
  }
}
