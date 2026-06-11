import { NextResponse } from 'next/server';
import { z } from 'zod';

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * 안정적 에러 코드를 포함한 응답. 클라이언트가 메시지 문구가 아닌 `code`로 분기하도록 한다.
 * (원클릭 배포 실패 등 — code는 deploy-error-logger의 카테고리와 동일 어휘 사용)
 */
export function apiErrorWithCode(message: string, status: number, code: string) {
  return NextResponse.json({ error: message, code }, { status });
}

export function unauthorizedError() {
  return apiError('인증이 필요합니다', 401);
}

export function notFoundError(resource = '리소스') {
  return apiError(`${resource}를 찾을 수 없습니다`, 404);
}

export function validationError(error: z.ZodError) {
  const messages = error.issues.map((e) => e.message).join(', ');
  return apiError(messages, 400);
}

export function configurationError(message: string, code: string) {
  return NextResponse.json({ error: message, code }, { status: 422 });
}

export function serverError(message = '서버 오류가 발생했습니다') {
  return apiError(message, 500);
}

export function quotaExceededError(resource: string, current: number, max: number) {
  return NextResponse.json(
    {
      error: `${resource} 한도를 초과했습니다 (${current}/${max})`,
      code: 'QUOTA_EXCEEDED',
      current,
      max,
    },
    { status: 403 },
  );
}

export function mfaRequiredError() {
  return NextResponse.json(
    {
      error: '2단계 인증이 필요합니다',
      code: 'MFA_REQUIRED',
    },
    { status: 403 },
  );
}

export function proRequiredError(feature: string) {
  return NextResponse.json(
    {
      error: `${feature} 기능은 Pro 플랜에서 사용할 수 있습니다`,
      code: 'PRO_REQUIRED',
      upgradeUrl: '/pricing',
    },
    { status: 403 },
  );
}
