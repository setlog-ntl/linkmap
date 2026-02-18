import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { decrypt } from '@/lib/crypto';
import { pushFilesAtomically, GitHubApiError } from '@/lib/github/api';
import { z } from 'zod';

const FORBIDDEN_PATH_PATTERNS = [
  /^\./,
  /\/\./,
  /\.github\//i,
];

const batchUpdateSchema = z.object({
  files: z
    .array(
      z.object({
        path: z
          .string()
          .min(1)
          .refine((val) => !val.includes('..'), 'Invalid path')
          .refine(
            (val) => !FORBIDDEN_PATH_PATTERNS.some((p) => p.test(val)),
            'Forbidden path'
          ),
        content: z.string(),
      })
    )
    .min(1, 'At least one file required')
    .max(50, 'Maximum 50 files per batch'),
  message: z.string().max(200).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = batchUpdateSchema.safeParse(body);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((e) => e.message).join(', ');
    return apiError(messages, 400);
  }

  const { files, message } = parsed.data;

  // Get deploy record + verify ownership
  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select('id, site_name, forked_repo_full_name, user_id, project_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!deploy) return notFoundError('배포');

  // Get GitHub token
  const { data: githubService } = await supabase
    .from('services')
    .select('id')
    .eq('slug', 'github')
    .single();

  if (!githubService) return serverError('GitHub 서비스 설정을 찾을 수 없습니다');

  const { data: ghAccount } = await supabase
    .from('service_accounts')
    .select('encrypted_access_token')
    .eq('user_id', user.id)
    .eq('service_id', githubService.id)
    .eq('connection_type', 'oauth')
    .eq('status', 'active')
    .order('project_id', { ascending: true, nullsFirst: true })
    .limit(1)
    .single();

  if (!ghAccount) return apiError('GitHub 계정이 연결되어 있지 않습니다', 404);

  let token: string;
  try {
    token = decrypt(ghAccount.encrypted_access_token);
  } catch {
    return apiError('GitHub 토큰이 유효하지 않습니다', 401);
  }

  const [owner, repo] = (deploy.forked_repo_full_name || '').split('/');
  if (!owner || !repo) return notFoundError('레포지토리');

  // Atomic push all files as a single commit
  const commitMessage = message
    || `Linkmap AI: ${files.length}개 파일 일괄 수정`;

  try {
    const { commitSha } = await pushFilesAtomically(
      token,
      owner,
      repo,
      files,
      commitMessage
    );

    await logAudit(user.id, {
      action: 'oneclick.batch_update',
      resourceType: 'homepage_deploy',
      resourceId: deploy.id,
      details: {
        site_name: deploy.site_name,
        file_count: files.length,
        file_paths: files.map((f) => f.path),
        commit_sha: commitSha,
      },
    });

    return NextResponse.json({
      commit_sha: commitSha,
      file_count: files.length,
    });
  } catch (err) {
    if (err instanceof GitHubApiError) {
      if (err.status === 409) {
        return apiError('파일 충돌이 발생했습니다. 새로고침 후 다시 시도해주세요.', 409);
      }
      return apiError(`GitHub API 오류: ${err.message}`, err.status);
    }
    return serverError('파일 일괄 저장 중 오류가 발생했습니다');
  }
}
