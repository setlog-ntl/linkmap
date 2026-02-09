import { NextResponse } from 'next/server';
import { z } from 'zod';

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
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

export function serverError(message = '서버 오류가 발생했습니다') {
  return apiError(message, 500);
}
