import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, serverError, apiError, apiErrorWithCode, notFoundError, quotaExceededError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import {
  createOrUpdateFileContent,
  deleteFileContent,
  getFileContent,
  enableGitHubPagesWithActions,
  updatePagesBuildType,
  GitHubApiError,
} from '@/lib/github/api';
import { githubFetch } from '@/lib/github/client';
import { deployRepoRequestSchema } from '@/lib/validations/oneclick';
import { logDeployError, classifyErrorCategory } from '@/lib/oneclick/deploy-error-logger';
import { checkHomepageDeployQuota } from '@/lib/quota';
import { analyzeRepo, blockReasonMessage } from '@/lib/oneclick/repo-analyzer';
import {
  buildImportWorkflowYml,
  buildBuildWorkflowYml,
  isLinkmapWorkflow,
  IMPORT_WORKFLOW_PATH,
  IMPORT_WORKFLOW_FILE,
} from '@/lib/oneclick/static-workflow';
import {
  resolveOneclickGitHubAccount,
  isGitHubAccountFailure,
  missingWorkflowScope,
} from '@/lib/oneclick/github-account';

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * 내 GitHub repo 연결 배포 (트랙 B).
 *
 * 트랙 A와 결정적으로 다른 점: 저장소가 **사용자 자산**이다.
 * - 우리가 넣는 것은 워크플로우 파일 1개뿐이고 기존 파일은 건드리지 않는다
 * - 실패해도 저장소를 삭제하지 않는다. 되돌릴 때는 우리가 넣은 파일만 지운다
 * - Pages 활성화는 무해하므로 되돌리지 않는다 (사용자가 이미 쓰고 있을 수 있다)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorizedError();

    const body = await request.json();
    const parsed = deployRepoRequestSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { owner, repo, publish_dir, link_only, github_service_account_id } = parsed.data;

    const deployQuota = await checkHomepageDeployQuota(user.id);
    if (!deployQuota.allowed) {
      return quotaExceededError('사이트 배포', deployQuota.current, deployQuota.max);
    }

    const failDeploy = (opts: {
      message: string;
      httpStatus: number;
      failedStep: string;
      errorContext?: Record<string, unknown>;
    }) => {
      const code = classifyErrorCategory(opts.message, opts.httpStatus);
      void logDeployError({
        userId: user.id,
        templateSlug: 'import',
        siteName: `${owner}/${repo}`,
        errorMessage: opts.message,
        failedStep: opts.failedStep,
        httpStatus: opts.httpStatus,
        errorContext: opts.errorContext,
      });
      return apiErrorWithCode(opts.message, opts.httpStatus, code);
    };

    const account = await resolveOneclickGitHubAccount(supabase, user.id, github_service_account_id);
    if (isGitHubAccountFailure(account)) {
      if (account.reason === 'service_missing') return serverError('GitHub 서비스 설정을 찾을 수 없습니다');
      if (account.reason === 'not_connected') {
        return failDeploy({
          message: 'GitHub 계정이 연결되어 있지 않습니다. 먼저 GitHub를 연결해주세요.',
          httpStatus: 404, failedStep: '준비 중',
        });
      }
      return failDeploy({ message: account.message, httpStatus: 401, failedStep: '준비 중' });
    }

    if (missingWorkflowScope(account.scopes)) {
      return failDeploy({
        message: 'GitHub 연결에 workflow 권한이 없어 배포할 수 없습니다. GitHub 연결을 해제 후 다시 연결해주세요.',
        httpStatus: 403, failedStep: '준비 중',
      });
    }

    const githubToken = account.token;

    // 클라이언트가 보낸 분석 결과는 신뢰하지 않는다 — 서버에서 다시 판정한다
    const analysis = await analyzeRepo(githubToken, owner, repo);
    if (!analysis.deployable) {
      const message = analysis.block_reason
        ? blockReasonMessage(analysis.block_reason)
        : '이 저장소는 배포할 수 없습니다';
      void logDeployError({
        userId: user.id,
        templateSlug: 'import',
        siteName: analysis.full_name,
        errorMessage: message,
        failedStep: '준비 중',
        httpStatus: 400,
      });
      return apiErrorWithCode(message, 400, 'repo_not_deployable');
    }

    // publish_dir은 분석이 찾아낸 후보 중에서만 고를 수 있다 (임의 경로 주입 차단)
    const publishDir =
      publish_dir && analysis.publish_dir_candidates.includes(publish_dir)
        ? publish_dir
        : analysis.publish_dir;

    const branch = analysis.default_branch;
    const linkOnly = link_only === true && analysis.can_link_only;

    // ── GitHub 리소스 변경 (DB write 이전) ──
    let workflowCommitted = false;
    let workflowSha: string | null = null;
    /** 우리 워크플로우가 이미 있었는지 — 있었다면 롤백에서 지우지 않는다 */
    let workflowPreexisted = false;

    if (!linkOnly) {
      // fork는 Actions가 기본 비활성이라 워크플로우가 영원히 실행되지 않는다
      if (analysis.is_fork) {
        try {
          await githubFetch(`/repos/${owner}/${repo}/actions/permissions`, {
            token: githubToken,
            method: 'PUT',
            body: { enabled: true },
          });
        } catch {
          // 이미 활성화돼 있거나 조직 정책으로 막힌 경우 — 빌드 단계에서 드러난다
        }
      }

      // 같은 경로에 파일이 이미 있으면, 그것이 우리가 만든 것일 때만 덮어쓴다.
      // 사용자가 직접 만든 동명 파일을 말없이 대체하면 "기존 파일 무수정" 약속이 깨진다.
      let existingSha: string | undefined;
      let overwritingOwnFile = false;
      try {
        const existing = await getFileContent(githubToken, owner, repo, IMPORT_WORKFLOW_PATH);
        const existingContent = Buffer.from(existing.content ?? '', 'base64').toString('utf-8');
        if (!isLinkmapWorkflow(existingContent)) {
          return failDeploy({
            message: `저장소에 이미 같은 이름의 파일(${IMPORT_WORKFLOW_PATH})이 있습니다. 그 파일을 옮기거나 이름을 바꾼 뒤 다시 시도해주세요.`,
            httpStatus: 409,
            failedStep: '준비 중',
            errorContext: { repo: analysis.full_name },
          });
        }
        existingSha = existing.sha;
        overwritingOwnFile = true;
      } catch (err) {
        if (!(err instanceof GitHubApiError && err.status === 404)) throw err;
      }
      // 우리가 새로 만든 경우에만 롤백에서 삭제한다 (기존 우리 파일은 남겨둔다 — 재연결 시나리오)
      workflowPreexisted = overwritingOwnFile;

      try {
        // 빌드형이면 install·build 단계가 포함된 워크플로우를 넣는다 (Phase 2)
        const workflowYml =
          analysis.deploy_mode === 'build' && analysis.build
            ? buildBuildWorkflowYml({
                outDir: publishDir,
                branch,
                installCommand: analysis.build.installCommand,
                buildCommand: analysis.build.buildCommand,
                repoName: repo,
              })
            : buildImportWorkflowYml(publishDir, branch);

        const result = await createOrUpdateFileContent(
          githubToken,
          owner,
          repo,
          IMPORT_WORKFLOW_PATH,
          workflowYml,
          'Linkmap: add GitHub Pages deploy workflow',
          existingSha,
          branch,
        );
        workflowCommitted = true;
        workflowSha = result.content?.sha ?? null;
      } catch (err) {
        const status = err instanceof GitHubApiError ? err.status : 502;
        return failDeploy({
          message:
            status === 403
              ? '저장소에 파일을 추가할 권한이 없습니다. GitHub 연결을 다시 확인해주세요.'
              : `워크플로우 파일을 추가하지 못했습니다: ${err instanceof Error ? err.message : 'unknown'}`,
          httpStatus: status,
          failedStep: '준비 중',
          errorContext: { repo: analysis.full_name },
        });
      }
    }

    /** 우리가 만든 것만 되돌린다 — 저장소·기존 파일은 절대 건드리지 않는다 */
    const revertWorkflow = async (): Promise<boolean> => {
      // 우리가 이번에 새로 만든 파일만 되돌린다.
      // sha가 없으면 삭제할 수 없으므로 "되돌렸다"고 보고하지 않는다(거짓 성공 방지).
      if (!workflowCommitted || workflowPreexisted) return true;
      if (!workflowSha) return false;
      try {
        await deleteFileContent(
          githubToken,
          owner,
          repo,
          IMPORT_WORKFLOW_PATH,
          workflowSha,
          'Linkmap: remove deploy workflow (deploy failed)',
          branch,
        );
        return true;
      } catch {
        return false;
      }
    };

    const leftoverNotice = (reverted: boolean) =>
      reverted
        ? ''
        : ` 추가했던 워크플로우 파일(${IMPORT_WORKFLOW_PATH})이 저장소에 남아 있습니다. 삭제해도 무방합니다.`;

    // Pages 활성화 / 빌드 방식 전환
    try {
      if (!analysis.pages_enabled) {
        await enableGitHubPagesWithActions(githubToken, owner, repo);
      } else if (analysis.needs_build_type_switch) {
        await updatePagesBuildType(githubToken, owner, repo);
      }
    } catch (err) {
      // 409 = 이미 활성 → 성공으로 취급
      if (!(err instanceof GitHubApiError && err.status === 409)) {
        const reverted = await revertWorkflow();
        const status = err instanceof GitHubApiError ? err.status : 502;
        const detail =
          analysis.is_private && (status === 403 || status === 422)
            ? '비공개 저장소는 GitHub 유료 플랜에서만 Pages를 사용할 수 있습니다. 저장소를 공개로 바꾸거나 플랜을 확인해주세요.'
            : `GitHub Pages 활성화 실패: ${err instanceof Error ? err.message : 'unknown'}`;
        return failDeploy({
          message: `${detail}${leftoverNotice(reverted)}`,
          httpStatus: status,
          failedStep: '설정 중',
          errorContext: { repo: analysis.full_name, workflow_reverted: reverted },
        });
      }
    }

    const pagesUrl = `https://${owner}.github.io/${repo}`;

    // ── DB 리소스 생성 ──
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: humanizeSlug(repo),
        description: '내 GitHub 저장소를 연결한 GitHub Pages 사이트',
      })
      .select()
      .single();

    if (projectError || !project) {
      const reverted = await revertWorkflow();
      return serverError(
        `${projectError?.message ?? '프로젝트 생성에 실패했습니다'}${leftoverNotice(reverted)}`,
      );
    }

    const { data: createResult, error: deployError } = await supabase.rpc('create_homepage_deploy_atomic', {
      p_project_id: project.id,
      p_template_id: null,
      p_site_name: repo,
      p_forked_repo_full_name: analysis.full_name,
      p_forked_repo_url: `https://github.com/${analysis.full_name}`,
      p_pages_url: pagesUrl,
      p_source_type: 'import',
    });

    const cleanupDb = async () => {
      await supabase.from('projects').delete().eq('id', project.id).eq('user_id', user.id);
    };

    if (deployError || !createResult) {
      await cleanupDb();
      const reverted = await revertWorkflow();
      return serverError(
        `${deployError?.message ?? '배포 레코드 생성에 실패했습니다'}${leftoverNotice(reverted)}`,
      );
    }

    const deployResult = createResult as { allowed: boolean; current: number; max: number; deploy_id?: string };
    if (!deployResult.allowed || !deployResult.deploy_id) {
      await cleanupDb();
      await revertWorkflow();
      return quotaExceededError('사이트 배포', deployResult.current, deployResult.max);
    }
    const deployId = deployResult.deploy_id;

    // 재배포·상태 추적이 참조할 정보 — 워크플로우 파일명이 템플릿과 다르므로 반드시 기록한다
    const configData = {
      workflow_file: IMPORT_WORKFLOW_FILE,
      publish_dir: publishDir,
      source_branch: branch,
      pages_was_enabled: analysis.pages_enabled,
      link_only: linkOnly,
      deploy_mode: analysis.deploy_mode,
      framework: analysis.build?.framework ?? null,
    };

    await Promise.all([
      supabase.from('homepage_deploys').update({ config_data: configData }).eq('id', deployId),
      supabase.from('project_github_repos').insert({
        project_id: project.id,
        service_account_id: account.accountId,
        owner,
        repo_name: repo,
        repo_full_name: analysis.full_name,
        default_branch: branch,
        auto_sync_enabled: false,
        sync_branch: branch,
        sync_directory: publishDir,
      }),
      supabase.from('project_services').insert({
        project_id: project.id,
        service_id: account.serviceId,
      }),
      logAudit(user.id, {
        action: 'oneclick.deploy_repo',
        resourceType: 'homepage_deploy',
        resourceId: deployId,
        details: {
          repo: analysis.full_name,
          pages_url: pagesUrl,
          project_id: project.id,
          publish_dir: publishDir,
          branch,
          link_only: linkOnly,
          workflow_committed: workflowCommitted,
        },
      }),
    ]);

    return NextResponse.json(
      {
        deploy_id: deployId,
        project_id: project.id,
        repo_url: `https://github.com/${analysis.full_name}`,
        pages_url: pagesUrl,
        pages_status: 'enabling',
        site_name: repo,
        workflow_committed: workflowCommitted,
        link_only: linkOnly,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 404) return notFoundError('저장소');
    if (error instanceof GitHubApiError) {
      return apiError(`GitHub 요청이 실패했습니다: ${error.message}`, 502);
    }
    return serverError(error instanceof Error ? error.message : 'Unknown error');
  }
}
