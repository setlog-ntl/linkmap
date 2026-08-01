import { z } from 'zod';

const siteNameRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

const FORBIDDEN_PATH_PATTERNS = [
  /^\./,           // 숨김 파일 (.env, .git 등)
  /\/\./,          // 하위 숨김 파일
  /\.github\//i,   // GitHub Actions (워크플로우 인젝션 방지)
];

export const statusQuerySchema = z.object({
  deploy_id: z.string().uuid('유효하지 않은 배포 ID'),
});

export const deployPagesRequestSchema = z.object({
  template_id: z.string().uuid('유효하지 않은 템플릿 ID'),
  site_name: z
    .string()
    .min(2, '사이트 이름은 최소 2자 이상이어야 합니다')
    .max(100, '사이트 이름은 100자 이하여야 합니다')
    .regex(siteNameRegex, '사이트 이름은 소문자, 숫자, 하이픈만 사용할 수 있습니다 (예: my-site-1)'),
  github_service_account_id: z.string().uuid().optional(),
});

/**
 * 트랙 A(내 파일 업로드) — 서버는 항상 "파일 배열"만 받는다.
 * 단일 HTML·ZIP·폴더 어느 입력이든 클라이언트에서 해제·정규화되어 이 형태로 수렴하므로
 * 서버 검증 코드가 단일화된다. 상세 정책(경로·확장자·크기)은 upload-sanitizer가 담당하고,
 * 여기서는 요청 형태와 개수 상한만 검증한다.
 */
export const deployUploadRequestSchema = z.object({
  site_name: z
    .string()
    .min(2, '사이트 이름은 최소 2자 이상이어야 합니다')
    .max(100, '사이트 이름은 100자 이하여야 합니다')
    .regex(siteNameRegex, '사이트 이름은 소문자, 숫자, 하이픈만 사용할 수 있습니다 (예: my-site-1)'),
  files: z
    .array(
      z.object({
        path: z.string().min(1, '파일 경로는 필수입니다').max(256, '파일 경로가 너무 깁니다'),
        content: z.string(),
        encoding: z.enum(['utf-8', 'base64']).optional(),
      }),
    )
    .min(1, '업로드할 파일이 없습니다')
    .max(60, '파일은 최대 60개까지 업로드할 수 있습니다'),
  github_service_account_id: z.string().uuid().optional(),
});

/**
 * 퍼센트 인코딩을 풀어 실제 경로로 되돌린다.
 *
 * 편집 경로는 path를 GitHub Contents API의 URL에 그대로 보간하는데, GitHub이 이를 디코딩하므로
 * `%2Egithub/workflows/x.yml` 같은 입력은 서버에서 `.github/workflows/x.yml`로 복원된다.
 * 리터럴 문자열만 보는 금지 패턴은 이를 통과시켜 워크플로우 인젝션이 성립한다.
 * 따라서 검사 전에 반드시 디코딩한 형태로 정규화한다(디코딩 실패는 잘못된 경로로 간주).
 */
function decodePathForCheck(value: string): string | null {
  if (!value.includes('%')) return value;
  try {
    // 이중 인코딩(%252E)까지 되돌린다
    let decoded = value;
    for (let i = 0; i < 3 && decoded.includes('%'); i++) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
    return decoded;
  } catch {
    return null;
  }
}

export const fileUpdateSchema = z.object({
  path: z
    .string()
    .min(1, '파일 경로는 필수입니다')
    .refine((val) => decodePathForCheck(val) !== null, '잘못된 파일 경로입니다')
    .refine(
      (val) => !(decodePathForCheck(val) ?? val).includes('..'),
      '잘못된 파일 경로입니다',
    )
    .refine(
      (val) => {
        const target = decodePathForCheck(val) ?? val;
        return !FORBIDDEN_PATH_PATTERNS.some((pattern) => pattern.test(target));
      },
      '허용되지 않는 파일 경로입니다 (숨김 파일, .github 디렉토리 등)',
    ),
  content: z.string(),
  sha: z.string().optional(), // 없으면 새 파일 생성
  message: z.string().max(200).optional(),
});

export type FileUpdateInput = z.infer<typeof fileUpdateSchema>;
export type StatusQueryInput = z.infer<typeof statusQuerySchema>;
export type DeployPagesRequestInput = z.infer<typeof deployPagesRequestSchema>;
export type DeployUploadRequestInput = z.infer<typeof deployUploadRequestSchema>;
