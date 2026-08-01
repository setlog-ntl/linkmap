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
  githubFetch,
} from '@/lib/github/api';
import { z } from 'zod';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB base64 string length limit

// P0-3 fix: SVG 제거 — SVG는 <script> 태그를 포함할 수 있어 GitHub Pages에 XSS 페이로드가 영구 배포될 수 있음
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
type AllowedMimeType = (typeof ALLOWED_TYPES)[number];

// P0-3 fix: MIME 타입별 매직 바이트 시그니처 (클라이언트 mimeType 신뢰 불가)
const MAGIC_BYTES: Record<AllowedMimeType, (buf: Buffer) => boolean> = {
  'image/jpeg': (buf) => buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff,
  'image/png': (buf) =>
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a,
  'image/webp': (buf) =>
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50,
  'image/gif': (buf) =>
    buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38,
};

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
    // P0-3 fix: svg 확장자 제거
    .refine((val) => /\.(jpe?g|png|webp|gif)$/i.test(val), 'Unsupported image format'),
  /** MIME type */
  mimeType: z
    .string()
    .refine((val): val is AllowedMimeType => (ALLOWED_TYPES as readonly string[]).includes(val), 'Unsupported MIME type'),
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

  const { data: imageData, filename, mimeType, directory } = parsed.data;

  // P0-3 fix: 매직 바이트 검증 — 클라이언트가 전달한 mimeType과 실제 파일 내용 일치 여부 확인
  try {
    const buffer = Buffer.from(imageData, 'base64');
    if (buffer.length < 12) {
      return apiError('유효하지 않은 이미지 파일입니다', 400);
    }
    const isValidMagic = MAGIC_BYTES[mimeType](buffer);
    if (!isValidMagic) {
      return apiError('파일 내용이 선언된 형식과 일치하지 않습니다', 400);
    }
  } catch {
    return apiError('이미지 데이터를 파싱할 수 없습니다', 400);
  }

  // 3. Ownership
  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select('id, site_name, forked_repo_full_name, user_id, source_type')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!deploy) return notFoundError('배포');

  // 가져온 저장소(트랙 B)에는 파일을 추가하지 않는다 — 사용자 자산이다
  if (deploy.source_type === 'import') {
    return apiError('가져온 저장소에는 Linkmap에서 파일을 올릴 수 없습니다.', 403);
  }

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

    // Get parent commit's tree SHA for base_tree (preserve existing files)
    let baseTreeSha: string | undefined;
    if (parentSha) {
      const parentCommit = await githubFetch<{ tree: { sha: string } }>(
        `/repos/${owner}/${repo}/git/commits/${parentSha}`,
        { token }
      );
      baseTreeSha = parentCommit.tree.sha;
    }

    // Create tree with new file (base_tree preserves all existing files)
    const treeItems = [
      {
        path: filePath,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blob.sha,
      },
    ];
    const tree = await createTree(token, owner, repo, treeItems, baseTreeSha);

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

    // Return the web-accessible path (Next.js serves public/ from root)
    // e.g. public/images/foo.webp → /images/foo.webp
    const webPath = filePath.startsWith('public/')
      ? `/${filePath.slice('public/'.length)}`
      : `/${filePath}`;

    return NextResponse.json({
      path: webPath,
      commit_sha: commit.sha,
    });
  } catch (err) {
    if (err instanceof GitHubApiError) {
      return apiError(`GitHub API 오류: ${err.message}`, err.status);
    }
    return serverError('이미지 업로드 중 오류가 발생했습니다');
  }
}
