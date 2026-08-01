/**
 * Deploy error intelligence — maps deploy failures to user-friendly
 * cause + solution pairs. Pure utility, no UI dependencies.
 *
 * 우선순위: 서버가 내려준 안정적 `code`(deploy-error-logger 카테고리와 동일 어휘) →
 * 없으면 에러 메시지 substring 매칭으로 폴백. code 기반이라 문구가 바뀌어도 견고하다.
 */

import type { DeployStatus } from '@/lib/queries/oneclick';
import { t, type Locale } from '@/lib/i18n';

export interface ErrorDetails {
  cause: string;
  solution: string;
  failedStep: string | null;
}

/** deploy-error-logger.ts의 DeployErrorCategory와 동일 어휘 (클라이언트 전용 복제 — admin 의존성 회피) */
type DeployErrorCategory =
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
  | 'unknown';

/** 카테고리 → 사용자 친화 cause/solution. 'unknown'은 null(기본 메시지로 폴백). */
function detailsForCategory(
  category: DeployErrorCategory,
  loc: Locale,
  failedStep: string | null
): ErrorDetails | null {
  switch (category) {
    case 'repo_conflict':
      return { cause: t(loc, 'deployError.repoExists.cause'), solution: t(loc, 'deployError.repoExists.solution'), failedStep };
    case 'template_not_found':
      return { cause: t(loc, 'deployError.templateNotFound.cause'), solution: t(loc, 'deployError.templateNotFound.solution'), failedStep };
    case 'file_upload':
      return { cause: t(loc, 'deployError.fileUpload.cause'), solution: t(loc, 'deployError.fileUpload.solution'), failedStep };
    case 'permission':
      return { cause: t(loc, 'deployError.permission.cause'), solution: t(loc, 'deployError.permission.solution'), failedStep };
    case 'token':
      return { cause: t(loc, 'deployError.token.cause'), solution: t(loc, 'deployError.token.solution'), failedStep };
    case 'rate_limit':
      return { cause: t(loc, 'deployError.rateLimit.cause'), solution: t(loc, 'deployError.rateLimit.solution'), failedStep };
    case 'timeout':
      return {
        cause: '배포가 제한 시간 내에 완료되지 않았습니다.',
        solution: '아래 "재배포" 버튼을 눌러 다시 시도해주세요. 반복되면 GitHub Actions 탭에서 로그를 확인하세요.',
        failedStep,
      };
    case 'retry_exhausted':
      return {
        cause: '자동 재시도 후에도 빌드에 실패했습니다.',
        solution: 'GitHub 레포지토리의 Actions 탭에서 실패 원인을 확인하고, 문제 해결 후 "재배포" 버튼을 눌러주세요.',
        failedStep,
      };
    case 'workflow_build':
      return { cause: t(loc, 'deployError.workflowBuild.cause'), solution: t(loc, 'deployError.workflowBuild.solution'), failedStep };
    case 'pages_error':
      return { cause: t(loc, 'deployError.pages.cause'), solution: t(loc, 'deployError.pages.solution'), failedStep };
    case 'network':
      return { cause: t(loc, 'deployError.network.cause'), solution: t(loc, 'deployError.network.solution'), failedStep };
    case 'quota':
      return { cause: t(loc, 'deployError.quota.cause'), solution: t(loc, 'deployError.quota.solution'), failedStep };
    case 'upload_validation':
      // 서버 메시지 자체가 무엇을 고쳐야 하는지 알려주므로(예: index.html 부재) cause로 그대로 쓴다
      return {
        cause: '올린 파일을 그대로 배포할 수 없었습니다.',
        solution: '위 안내에 따라 파일을 고친 뒤 다시 올려주세요. 웹페이지 파일(index.html)이 반드시 있어야 합니다.',
        failedStep,
      };
    case 'unknown':
    default:
      return null;
  }
}

/** 에러 메시지 substring → 카테고리 (서버 code가 없을 때의 폴백 분류) */
function classifyMessage(msg: string, failedStep: string | null): DeployErrorCategory {
  if (msg.includes('이미 존재') || msg.includes('already exists') || msg.includes('422') || msg.includes('409')) return 'repo_conflict';
  if ((msg.includes('템플릿') && msg.includes('찾을 수 없')) || (msg.includes('template') && msg.includes('not found'))) return 'template_not_found';
  if (msg.includes('파일 업로드') || msg.includes('file upload') || msg.includes('push')) return 'file_upload';
  if (msg.includes('권한') || msg.includes('permission') || msg.includes('403')) return 'permission';
  if (msg.includes('토큰') || msg.includes('token') || msg.includes('401')) return 'token';
  if (msg.includes('요청이 너무') || msg.includes('rate') || msg.includes('429')) return 'rate_limit';
  if (msg.includes('시간이 초과') || msg.includes('timeout') || msg.includes('초과')) return 'timeout';
  if (msg.includes('재시도 후에도') || msg.includes('retry')) return 'retry_exhausted';
  if (msg.includes('lock file') || msg.includes('npm err') || msg.includes('워크플로우 빌드')) return 'workflow_build';
  if (msg.includes('pages') || msg.includes('errored') || (failedStep != null && failedStep.includes('설정'))) return 'pages_error';
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('500') || msg.includes('502')) return 'network';
  if (msg.includes('한도') || msg.includes('quota') || msg.includes('limit')) return 'quota';
  return 'unknown';
}

export function getErrorDetails(
  errorMessage: string,
  status: DeployStatus | null,
  locale: string,
  code?: string
): ErrorDetails {
  const msg = errorMessage.toLowerCase();
  const failedStep = status?.steps.find((s) => s.status === 'error')?.label || null;
  const loc = locale as Locale;

  // 1) 서버가 내려준 code 우선 (문구 변화에 견고). quota는 별도 UI에서 처리됨.
  if (code) {
    const byCode = detailsForCategory(code as DeployErrorCategory, loc, failedStep);
    if (byCode) return byCode;
  }

  // 2) 폴백: 메시지 substring 매칭
  const byMessage = detailsForCategory(classifyMessage(msg, failedStep), loc, failedStep);
  if (byMessage) return byMessage;

  // 3) 기본 메시지
  return {
    cause: t(loc, 'deployError.default.cause'),
    solution: t(loc, 'deployError.default.solution'),
    failedStep,
  };
}
