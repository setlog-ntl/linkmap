/**
 * Deploy Error Logger — 배포 오류를 자동으로 기록하고 유사 패턴을 그룹화합니다.
 * AdminClient(service_role)를 사용하여 RLS를 우회합니다.
 */
import { createAdminClient } from '@/lib/supabase/admin';

export type DeployErrorCategory =
  | 'repo_conflict'
  | 'template_not_found'
  | 'file_upload'
  | 'permission'
  | 'token'
  | 'rate_limit'
  | 'timeout'
  | 'retry_exhausted'
  | 'workflow_build'
  | 'pages_error'
  | 'network'
  | 'quota'
  | 'upload_validation'
  | 'repo_not_deployable'
  | 'unknown';

interface LogDeployErrorParams {
  deployId?: string;
  userId: string;
  templateId?: string;
  templateSlug?: string;
  siteName?: string;
  errorMessage: string;
  failedStep?: string;
  httpStatus?: number;
  errorContext?: Record<string, unknown>;
}

/**
 * 에러 메시지에서 카테고리를 자동 분류합니다.
 */
export function classifyErrorCategory(errorMessage: string, httpStatus?: number): DeployErrorCategory {
  const msg = errorMessage.toLowerCase();

  if (msg.includes('이미 존재') || msg.includes('already exists') || httpStatus === 422 || httpStatus === 409) {
    return 'repo_conflict';
  }
  if ((msg.includes('템플릿') && msg.includes('찾을 수 없')) || (msg.includes('template') && msg.includes('not found'))) {
    return 'template_not_found';
  }
  if (msg.includes('파일 업로드') || msg.includes('file upload') || msg.includes('push')) {
    return 'file_upload';
  }
  if (msg.includes('권한') || msg.includes('permission') || httpStatus === 403) {
    return 'permission';
  }
  if (msg.includes('토큰') || msg.includes('token') || msg.includes('복호화') || httpStatus === 401) {
    return 'token';
  }
  if (msg.includes('요청이 너무') || msg.includes('rate') || httpStatus === 429) {
    return 'rate_limit';
  }
  if (msg.includes('시간이 초과') || msg.includes('timeout') || msg.includes('10분')) {
    return 'timeout';
  }
  if (msg.includes('재시도 후에도') || msg.includes('retry')) {
    return 'retry_exhausted';
  }
  if (msg.includes('lock file') || msg.includes('npm err') || msg.includes('워크플로우') || msg.includes('빌드에 실패')) {
    return 'workflow_build';
  }
  if (msg.includes('pages') || msg.includes('errored')) {
    return 'pages_error';
  }
  if (msg.includes('network') || msg.includes('fetch') || httpStatus === 500 || httpStatus === 502) {
    return 'network';
  }
  if (msg.includes('한도') || msg.includes('quota') || msg.includes('limit')) {
    return 'quota';
  }
  return 'unknown';
}

/**
 * fingerprint 생성: error_category + failed_step 조합으로 유사 오류를 그룹화합니다.
 * Cloudflare Workers 호환을 위해 단순 문자열 결합 방식 사용 (해시 불필요 — 조합 자체가 고유).
 */
function generateFingerprint(category: DeployErrorCategory, failedStep?: string): string {
  return `${category}::${failedStep || 'none'}`;
}

/**
 * 배포 오류를 기록합니다.
 * - 패턴 테이블에서 동일 fingerprint가 있으면 occurrence_count 증가
 * - 없으면 새 패턴 생성
 * - 개별 로그는 항상 새 행으로 기록
 *
 * 메인 플로우를 절대 중단하지 않습니다.
 */
export async function logDeployError(params: LogDeployErrorParams): Promise<void> {
  try {
    const admin = createAdminClient();
    const category = classifyErrorCategory(params.errorMessage, params.httpStatus);
    const fingerprint = generateFingerprint(category, params.failedStep);

    // 1. 패턴 upsert (RPC — 레이스 컨디션 방지, ON CONFLICT 원자적 처리)
    const { data: patternIdResult } = await admin.rpc('upsert_deploy_error_pattern', {
      p_fingerprint: fingerprint,
      p_error_category: category,
      p_failed_step: params.failedStep || null,
      p_sample_message: params.errorMessage,
    });

    const patternId = patternIdResult as string | null;

    // 2. 개별 로그 기록
    await admin.from('deploy_error_logs').insert({
      deploy_id: params.deployId || null,
      pattern_id: patternId || null,
      user_id: params.userId,
      template_id: params.templateId || null,
      template_slug: params.templateSlug || null,
      site_name: params.siteName || null,
      error_message: params.errorMessage,
      error_category: category,
      failed_step: params.failedStep || null,
      http_status: params.httpStatus || null,
      error_context: params.errorContext || {},
    });
  } catch (error) {
    // 로깅 실패가 메인 플로우를 중단해서는 안 됨
    console.error('[deploy-error-logger] Failed to log error:', error);
  }
}
