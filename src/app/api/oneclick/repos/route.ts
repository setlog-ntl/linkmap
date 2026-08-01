import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, serverError, apiError, notFoundError } from '@/lib/api/errors';
import { listUserRepos, GitHubApiError } from '@/lib/github/api';
import { reposQuerySchema } from '@/lib/validations/oneclick';
import {
  resolveOneclickGitHubAccount,
  isGitHubAccountFailure,
} from '@/lib/oneclick/github-account';

const PER_PAGE = 30;

/**
 * 배포할 저장소를 고르기 위한 목록.
 *
 * 기존 `/api/github/repos`는 project_id가 필수라 프로젝트 없이 고르는 흐름에 쓸 수 없어 신설했다.
 * affiliation=owner로 좁히는 이유: Pages 활성화에 admin 권한이 필요해 collaborator 저장소는
 * 어차피 배포할 수 없다(Phase 1 범위). 고를 수 없는 항목을 보여주지 않는 편이 낫다.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorizedError();

    const parsed = reposQuerySchema.safeParse({
      page: request.nextUrl.searchParams.get('page') ?? undefined,
      github_service_account_id:
        request.nextUrl.searchParams.get('github_service_account_id') ?? undefined,
    });
    if (!parsed.success) return validationError(parsed.error);

    const account = await resolveOneclickGitHubAccount(
      supabase,
      user.id,
      parsed.data.github_service_account_id,
    );
    if (isGitHubAccountFailure(account)) {
      if (account.reason === 'service_missing') return serverError('GitHub 서비스 설정을 찾을 수 없습니다');
      if (account.reason === 'not_connected') return notFoundError('GitHub 연결');
      return apiError(account.message, 401);
    }

    const page = parsed.data.page ?? 1;
    const repos = await listUserRepos(account.token, {
      page,
      perPage: PER_PAGE,
      affiliation: 'owner',
    });

    return NextResponse.json({
      repos: repos.map((r) => ({
        full_name: r.full_name,
        owner: r.owner.login,
        name: r.name,
        private: r.private,
        description: r.description,
        language: r.language,
        default_branch: r.default_branch,
        updated_at: r.updated_at,
        html_url: r.html_url,
      })),
      page,
      // 정확한 총 개수는 Link 헤더 파싱이 필요하나, "더 보기" 노출에는 이 판단으로 충분하다
      has_next: repos.length === PER_PAGE,
    });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return apiError(`GitHub 저장소 목록을 불러오지 못했습니다: ${error.message}`, 502);
    }
    return serverError(error instanceof Error ? error.message : 'Unknown error');
  }
}
