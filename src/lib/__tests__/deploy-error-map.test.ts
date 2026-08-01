import { describe, it, expect } from 'vitest';
import { getErrorDetails } from '../deploy-error-map';

describe('getErrorDetails — 세션 만료 안내', () => {
  // 세션 만료를 "일시적 오류, 다시 시도"로 안내하면 사용자가 원인을 모른 채 재시도만 반복한다
  it('tells the user to sign in again when the session expired', () => {
    const details = getErrorDetails('인증이 필요합니다', null, 'ko');
    expect(details.cause).toContain('로그인');
    expect(details.solution).toContain('로그인');
  });

  it('recognizes the code from the server without relying on wording', () => {
    const details = getErrorDetails('무언가 잘못됨', null, 'ko', 'auth_required');
    expect(details.cause).toContain('로그인');
  });

  it('does not confuse a session expiry with a GitHub token problem', () => {
    const session = getErrorDetails('인증이 필요합니다', null, 'ko');
    const token = getErrorDetails('GitHub 토큰 복호화 실패', null, 'ko');
    expect(session.cause).not.toBe(token.cause);
  });

  it('still explains upload validation failures', () => {
    const details = getErrorDetails('index.html이 없습니다', null, 'ko', 'upload_validation');
    expect(details.solution).toContain('index.html');
  });
});
