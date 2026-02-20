import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { safeDecryptToken } from '@/lib/github/token';
import {
  createBlob,
  getRef,
  createTree,
  createCommit,
  updateRef,
  createRef,
  GitHubApiError,
} from '@/lib/github/api';
import { z } from 'zod';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB base64 ≈ 1.5MB binary

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

const uploadSchema = z.object({
  /** Base64-encoded image data (no data URI prefix) */
  data: z
    .string()
    .min(1, 'Image data is required')
    .max(MAX_FILE_SIZE, 'Image too large (max 2MB)'),
  /** File name with extension */
  filename: z
    .string()
    .min(1)
    .max(100)
    .refine((val) => /\.(jpe?g|png|webp|gif|svg)$/i.test(val), 'Unsupported image format'),
  /** MIME type */
  mimeType: z
    .string()
    .refine((val) => ALLOWED_TYPES.includes(val), 'Unsupported MIME type'),
  /** Target directory in the repo */
  directory: z
    .string()
    .default('public/images')
    .refine((val) => !val.includes('..'), 'Invalid directory'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Validation
  const body = await request.json();
  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((e) => e.message).join(', ');
    return apiError(messages, 400);
  }

  const { data: imageData, filename, directory } = parsed.data;

  // 3. Ownership
  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select('id, site_name, forked_repo_full_name, user_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!deploy) return notFoundError('배포');

  // 4. GitHub token
  const { data: githubService } = await supabase
    .from('services')
    .select('id')
    .eq('slug', 'github')
    .single();

  if (!githubService) return serverError('GitHub 서비스 설정을 찾을 수 없습니다');

  const { data: ghAccount } = await supabase
    .from('service_accounts')
    .select('id, encrypted_access_token')
    .eq('user_id', user.id)
    .eq('service_id', githubService.id)
    .eq('connection_type', 'oauth')
    .eq('status', 'active')
    .order('project_id', { ascending: true, nullsFirst: true })
    .limit(1)
    .single();

  if (!ghAccount) return apiError('GitHub 계정이 연결되어 있지 않습니다', 404);

  const decryptResult = await safeDecryptToken(ghAccount.encrypted_access_token, supabase, ghAccount.id);
  if ('error' in decryptResult) {
    return apiError(decryptResult.error, 401);
  }
  const token = decryptResult.token;

  const [owner, repo] = (deploy.forked_repo_full_name || '').split('/');
  if (!owner || !repo) return notFoundError('레포지토리');

  // 5. Upload to GitHub via Git Data API
  const timestamp = Date.now();
  const filePath = `${directory}/${timestamp}-${filename}`;

  try {
    // Create base64 blob
    const blob = await createBlob(token, owner, repo, imageData, 'base64');

    // Get current HEAD
    const existingRef = await getRef(token, owner, repo, 'heads/main');
    const parentSha = existingRef?.object?.sha ?? null;

    // Create tree with new file
    const treeItems = [
      {
        path: filePath,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blob.sha,
      },
    ];
    const tree = await createTree(token, owner, repo, treeItems);

    // Create commit
    const parents = parentSha ? [parentSha] : [];
    const commit = await createCommit(
      token,
      owner,
      repo,
      `Linkmap: upload image ${filename}`,
      tree.sha,
      parents
    );

    // Update ref
    if (parentSha) {
      await updateRef(token, owner, repo, 'heads/main', commit.sha);
    } else {
      await createRef(token, owner, repo, 'refs/heads/main', commit.sha);
    }

    // 6. Audit
    await logAudit(user.id, {
      action: 'oneclick.image_upload',
      resourceType: 'homepage_deploy',
      resourceId: deploy.id,
      details: {
        site_name: deploy.site_name,
        file_path: filePath,
        commit_sha: commit.sha,
      },
    });

    // Return the relative path that can be used in the template
    return NextResponse.json({
      path: `/${filePath}`,
      commit_sha: commit.sha,
    });
  } catch (err) {
    if (err instanceof GitHubApiError) {
      return apiError(`GitHub API 오류: ${err.message}`, err.status);
    }
    return serverError('이미지 업로드 중 오류가 발생했습니다');
  }
}
