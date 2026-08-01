import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, serverError, apiError, notFoundError } from '@/lib/api/errors';
import { GitHubApiError } from '@/lib/github/api';
import { repoAnalyzeRequestSchema } from '@/lib/validations/oneclick';
import { analyzeRepo, blockReasonMessage } from '@/lib/oneclick/repo-analyzer';
import { buildImportWorkflowYml, IMPORT_WORKFLOW_PATH } from '@/lib/oneclick/static-workflow';
import {
  resolveOneclickGitHubAccount,
  isGitHubAccountFailure,
} from '@/lib/oneclick/github-account';

/**
 * 저장소가 정적 배포 가능한지 판정하고, 동의 화면에 필요한 정보를 한 번에 돌려준다.
 * 커밋될 워크플로우 전문까지 함께 주는 이유: 사용자가 "무엇이 저장소에 추가되는지"를
 * 승인 전에 그대로 볼 수 있어야 하기 때문이다.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorizedError();

    const body = await request.json();
    const parsed = repoAnalyzeRequestSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { owner, repo, github_service_account_id } = parsed.data;

    const account = await resolveOneclickGitHubAccount(supabase, user.id, github_service_account_id);
    if (isGitHubAccountFailure(account)) {
      if (account.reason === 'service_missing') return serverError('GitHub 서비스 설정을 찾을 수 없습니다');
      if (account.reason === 'not_connected') return notFoundError('GitHub 연결');
      return apiError(account.message, 401);
    }

    const analysis = await analyzeRepo(account.token, owner, repo);

    if (!analysis.deployable) {
      return NextResponse.json({
        analysis,
        message: analysis.block_reason ? blockReasonMessage(analysis.block_reason) : null,
        workflow: null,
      });
    }

    return NextResponse.json({
      analysis,
      message: null,
      // 동의 화면이 그대로 보여줄 커밋 내용
      workflow: {
        path: IMPORT_WORKFLOW_PATH,
        content: buildImportWorkflowYml(analysis.publish_dir, analysis.default_branch),
        commit_message: 'Linkmap: add GitHub Pages deploy workflow',
      },
    });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      if (error.status === 404) return notFoundError('저장소');
      return apiError(`저장소를 확인하지 못했습니다: ${error.message}`, 502);
    }
    return serverError(error instanceof Error ? error.message : 'Unknown error');
  }
}
