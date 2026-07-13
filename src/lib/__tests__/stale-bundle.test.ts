import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  reloadForFreshBundle,
  isChunkLoadFailure,
  installChunkFailureRecovery,
} from '../stale-bundle';

const reloadMock = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  window.sessionStorage.clear();
  reloadMock.mockClear();
  Object.defineProperty(window, 'location', {
    value: { ...window.location, reload: reloadMock },
    writable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('reloadForFreshBundle', () => {
  it('첫 호출은 리로드를 수행하고 true를 반환한다', () => {
    expect(reloadForFreshBundle()).toBe(true);
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it('가드 간격(5분) 내 재호출은 리로드하지 않는다 — 무한 루프 방지', () => {
    expect(reloadForFreshBundle()).toBe(true);
    expect(reloadForFreshBundle()).toBe(false);
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it('가드 간격이 지나면 다시 리로드할 수 있다', () => {
    expect(reloadForFreshBundle()).toBe(true);
    vi.advanceTimersByTime(5 * 60 * 1000 + 1);
    expect(reloadForFreshBundle()).toBe(true);
    expect(reloadMock).toHaveBeenCalledTimes(2);
  });
});

describe('isChunkLoadFailure', () => {
  it('ChunkLoadError(webpack)를 인식한다', () => {
    const err = new Error('Loading chunk 40031 failed.');
    err.name = 'ChunkLoadError';
    expect(isChunkLoadFailure(err)).toBe(true);
  });

  it('메시지 패턴(청크 로드·동적 import 실패)을 인식한다', () => {
    expect(isChunkLoadFailure(new Error('Loading chunk app/layout failed. (missing: ...)'))).toBe(true);
    expect(isChunkLoadFailure(new Error('Failed to fetch dynamically imported module: https://...'))).toBe(true);
    expect(isChunkLoadFailure(new Error('Importing a module script failed.'))).toBe(true);
  });

  it('일반 오류·비 Error 값은 제외한다', () => {
    expect(isChunkLoadFailure(new Error('Network request failed'))).toBe(false);
    expect(isChunkLoadFailure('Loading chunk 1 failed')).toBe(false);
    expect(isChunkLoadFailure(null)).toBe(false);
  });
});

describe('installChunkFailureRecovery', () => {
  /** vitest가 전역 error 이벤트를 미처리 오류로 집계하지 않도록 억제하며 디스패치 */
  function dispatchErrorEvent(error: unknown) {
    const suppress = (e: ErrorEvent) => e.preventDefault();
    window.addEventListener('error', suppress);
    window.dispatchEvent(new ErrorEvent('error', { error, cancelable: true }));
    window.removeEventListener('error', suppress);
  }

  it('전역 error 이벤트의 청크 실패 시 리로드한다', () => {
    const cleanup = installChunkFailureRecovery();
    const err = new Error('Loading chunk 123 failed.');
    err.name = 'ChunkLoadError';
    dispatchErrorEvent(err);
    expect(reloadMock).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it('무관한 오류는 무시하고, cleanup 후에는 반응하지 않는다', () => {
    const cleanup = installChunkFailureRecovery();
    dispatchErrorEvent(new Error('일반 오류'));
    expect(reloadMock).not.toHaveBeenCalled();

    cleanup();
    const err = new Error('Loading chunk 123 failed.');
    err.name = 'ChunkLoadError';
    dispatchErrorEvent(err);
    expect(reloadMock).not.toHaveBeenCalled();
  });
});
