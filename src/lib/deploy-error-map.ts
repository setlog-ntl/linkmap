/**
 * Deploy error intelligence — maps raw error messages to user-friendly
 * cause + solution pairs. Pure utility, no UI dependencies.
 */

import type { DeployStatus } from '@/lib/queries/oneclick';

export interface ErrorDetails {
  cause: string;
  solution: string;
  failedStep: string | null;
}

export function getErrorDetails(
  errorMessage: string,
  status: DeployStatus | null,
  locale: string
): ErrorDetails {
  const msg = errorMessage.toLowerCase();
  const failedStep = status?.steps.find((s) => s.status === 'error')?.label || null;

  // Repository name conflict
  if (msg.includes('이미 존재') || msg.includes('already exists') || msg.includes('422') || msg.includes('409')) {
    return {
      cause: locale === 'ko'
        ? '동일한 이름의 레포지토리가 GitHub에 이미 존재합니다.'
        : 'A repository with the same name already exists on GitHub.',
      solution: locale === 'ko'
        ? '다른 사이트 이름을 사용하거나, GitHub에서 기존 레포지토리를 삭제한 후 다시 시도해주세요.'
        : 'Use a different site name, or delete the existing repository on GitHub and try again.',
      failedStep,
    };
  }

  // Template not found
  if ((msg.includes('템플릿') && msg.includes('찾을 수 없')) || (msg.includes('template') && msg.includes('not found'))) {
    return {
      cause: locale === 'ko'
        ? '선택한 템플릿의 원본 레포지토리를 찾을 수 없습니다.'
        : 'The source repository for the selected template was not found.',
      solution: locale === 'ko'
        ? '다른 템플릿을 선택하거나, 관리자에게 문의해주세요.'
        : 'Choose a different template or contact the administrator.',
      failedStep,
    };
  }

  // File upload failure
  if (msg.includes('파일 업로드') || msg.includes('file upload') || msg.includes('push')) {
    return {
      cause: locale === 'ko'
        ? '템플릿 파일을 레포지토리에 업로드하는 중 오류가 발생했습니다.'
        : 'An error occurred while uploading template files to the repository.',
      solution: locale === 'ko'
        ? '다시 시도해주세요. 문제가 계속되면 GitHub 연결을 해제 후 다시 연결해보세요.'
        : 'Please try again. If the issue persists, disconnect and reconnect your GitHub account.',
      failedStep,
    };
  }

  // Permission error
  if (msg.includes('권한') || msg.includes('permission') || msg.includes('403')) {
    return {
      cause: locale === 'ko'
        ? 'GitHub 계정의 권한이 부족하거나 토큰이 만료되었습니다.'
        : 'Insufficient GitHub permissions or expired token.',
      solution: locale === 'ko'
        ? 'GitHub 연결을 해제한 후 다시 연결해주세요. (설정 → GitHub 연결 해제)'
        : 'Disconnect and reconnect your GitHub account. (Settings → Disconnect GitHub)',
      failedStep,
    };
  }

  // Token issue
  if (msg.includes('토큰') || msg.includes('token') || msg.includes('401')) {
    return {
      cause: locale === 'ko'
        ? 'GitHub 인증 토큰이 만료되었거나 유효하지 않습니다.'
        : 'GitHub authentication token has expired or is invalid.',
      solution: locale === 'ko'
        ? 'GitHub를 다시 연결해주세요.'
        : 'Please reconnect your GitHub account.',
      failedStep,
    };
  }

  // Rate limit
  if (msg.includes('요청이 너무') || msg.includes('rate') || msg.includes('429')) {
    return {
      cause: locale === 'ko'
        ? '짧은 시간에 너무 많은 요청이 발생했습니다.'
        : 'Too many requests in a short period.',
      solution: locale === 'ko'
        ? '1분 후 다시 시도해주세요.'
        : 'Please wait 1 minute and try again.',
      failedStep,
    };
  }

  // Pages error
  if (msg.includes('pages') || msg.includes('errored') || (failedStep && failedStep.includes('설정'))) {
    return {
      cause: locale === 'ko'
        ? 'GitHub Pages 활성화 또는 빌드 중 오류가 발생했습니다.'
        : 'An error occurred while enabling or building GitHub Pages.',
      solution: locale === 'ko'
        ? 'GitHub 레포지토리의 Settings → Pages에서 직접 활성화하거나, 재시도해주세요.'
        : 'Enable Pages manually in your GitHub repo Settings → Pages, or retry.',
      failedStep,
    };
  }

  // Network/server error
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('500') || msg.includes('502')) {
    return {
      cause: locale === 'ko'
        ? '서버 또는 네트워크 오류가 발생했습니다.'
        : 'A server or network error occurred.',
      solution: locale === 'ko'
        ? '잠시 후 다시 시도해주세요. 문제가 계속되면 관리자에게 문의하세요.'
        : 'Please try again later. If the issue persists, contact the administrator.',
      failedStep,
    };
  }

  // Quota exceeded
  if (msg.includes('한도') || msg.includes('quota') || msg.includes('limit')) {
    return {
      cause: locale === 'ko'
        ? '배포 한도에 도달했습니다.'
        : 'Deployment quota has been reached.',
      solution: locale === 'ko'
        ? 'Pro 플랜으로 업그레이드하거나, 기존 사이트를 삭제한 후 다시 시도해주세요.'
        : 'Upgrade to Pro plan or delete existing sites and try again.',
      failedStep,
    };
  }

  // Default
  return {
    cause: locale === 'ko'
      ? '배포 중 예기치 않은 오류가 발생했습니다.'
      : 'An unexpected error occurred during deployment.',
    solution: locale === 'ko'
      ? '다시 시도해주세요. 문제가 계속되면 다른 사이트 이름으로 시도하거나 관리자에게 문의하세요.'
      : 'Please try again. If the issue persists, try a different site name or contact the administrator.',
    failedStep,
  };
}
