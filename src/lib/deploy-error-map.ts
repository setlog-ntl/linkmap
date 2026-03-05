/**
 * Deploy error intelligence — maps raw error messages to user-friendly
 * cause + solution pairs. Pure utility, no UI dependencies.
 */

import type { DeployStatus } from '@/lib/queries/oneclick';
import { t, type Locale } from '@/lib/i18n';

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
  const loc = locale as Locale;

  // Repository name conflict
  if (msg.includes('이미 존재') || msg.includes('already exists') || msg.includes('422') || msg.includes('409')) {
    return {
      cause: t(loc, 'deployError.repoExists.cause'),
      solution: t(loc, 'deployError.repoExists.solution'),
      failedStep,
    };
  }

  // Template not found
  if ((msg.includes('템플릿') && msg.includes('찾을 수 없')) || (msg.includes('template') && msg.includes('not found'))) {
    return {
      cause: t(loc, 'deployError.templateNotFound.cause'),
      solution: t(loc, 'deployError.templateNotFound.solution'),
      failedStep,
    };
  }

  // File upload failure
  if (msg.includes('파일 업로드') || msg.includes('file upload') || msg.includes('push')) {
    return {
      cause: t(loc, 'deployError.fileUpload.cause'),
      solution: t(loc, 'deployError.fileUpload.solution'),
      failedStep,
    };
  }

  // Permission error
  if (msg.includes('권한') || msg.includes('permission') || msg.includes('403')) {
    return {
      cause: t(loc, 'deployError.permission.cause'),
      solution: t(loc, 'deployError.permission.solution'),
      failedStep,
    };
  }

  // Token issue
  if (msg.includes('토큰') || msg.includes('token') || msg.includes('401')) {
    return {
      cause: t(loc, 'deployError.token.cause'),
      solution: t(loc, 'deployError.token.solution'),
      failedStep,
    };
  }

  // Rate limit
  if (msg.includes('요청이 너무') || msg.includes('rate') || msg.includes('429')) {
    return {
      cause: t(loc, 'deployError.rateLimit.cause'),
      solution: t(loc, 'deployError.rateLimit.solution'),
      failedStep,
    };
  }

  // Deploy timeout
  if (msg.includes('시간이 초과') || msg.includes('timeout') || msg.includes('10분')) {
    return {
      cause: '배포 시간이 10분을 초과했습니다.',
      solution: '아래 "재배포" 버튼을 눌러 다시 시도해주세요. 반복되면 GitHub Actions 탭에서 로그를 확인하세요.',
      failedStep,
    };
  }

  // Auto-retry exhausted
  if (msg.includes('재시도 후에도') || msg.includes('retry')) {
    return {
      cause: '자동 재시도 후에도 빌드에 실패했습니다.',
      solution: 'GitHub 레포지토리의 Actions 탭에서 실패 원인을 확인하고, 문제 해결 후 "재배포" 버튼을 눌러주세요.',
      failedStep,
    };
  }

  // Workflow build failure (lock file / dependency install)
  if (msg.includes('lock file') || msg.includes('npm err') || msg.includes('워크플로우 빌드')) {
    return {
      cause: t(loc, 'deployError.workflowBuild.cause'),
      solution: t(loc, 'deployError.workflowBuild.solution'),
      failedStep,
    };
  }

  // Pages error
  if (msg.includes('pages') || msg.includes('errored') || (failedStep && failedStep.includes('설정'))) {
    return {
      cause: t(loc, 'deployError.pages.cause'),
      solution: t(loc, 'deployError.pages.solution'),
      failedStep,
    };
  }

  // Network/server error
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('500') || msg.includes('502')) {
    return {
      cause: t(loc, 'deployError.network.cause'),
      solution: t(loc, 'deployError.network.solution'),
      failedStep,
    };
  }

  // Quota exceeded
  if (msg.includes('한도') || msg.includes('quota') || msg.includes('limit')) {
    return {
      cause: t(loc, 'deployError.quota.cause'),
      solution: t(loc, 'deployError.quota.solution'),
      failedStep,
    };
  }

  // Default
  return {
    cause: t(loc, 'deployError.default.cause'),
    solution: t(loc, 'deployError.default.solution'),
    failedStep,
  };
}
