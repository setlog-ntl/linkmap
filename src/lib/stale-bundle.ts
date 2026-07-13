/**
 * 스테일 번들 자가치유 — 배포·키 로테이션 이후 브라우저가 구 빌드의
 * HTML/JS를 계속 실행하는 상황(엣지 캐시 잔존, 장기 방치 탭, bfcache 복원)을
 * 감지해 문서 새로고침으로 최신 번들을 다시 받는다.
 *
 * 증상 예: 폐기된 publishable 키로 인한 401 반복(로그인 불가),
 * 배포 후 구 청크 404(ChunkLoadError). 2026-07-12 키 로테이션 사고의
 * 재발 방지책 — 세션 정리(auth-recovery)로는 이 계열을 복구할 수 없다.
 */

const RELOAD_GUARD_KEY = 'lm:stale-bundle-reloaded-at';

/** 리로드 반복 방지 최소 간격 — 새 번들에서도 같은 오류면 루프 대신 정지 */
const RELOAD_MIN_INTERVAL_MS = 5 * 60 * 1000;

/**
 * 가드된 문서 리로드. 탭 세션당 RELOAD_MIN_INTERVAL_MS에 1회만 수행해
 * 서버가 실제로 깨진 경우의 무한 리로드 루프를 차단한다.
 *
 * @returns true = 리로드 시작됨(이후 코드는 실행되지 않는다고 가정 금지 —
 *          리로드는 비동기), false = 가드에 걸림 → 호출 측이 안내 메시지 등
 *          폴백을 제공해야 한다.
 */
export function reloadForFreshBundle(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const last = Number(window.sessionStorage.getItem(RELOAD_GUARD_KEY) ?? '0');
    if (Date.now() - last < RELOAD_MIN_INTERVAL_MS) return false;
    window.sessionStorage.setItem(RELOAD_GUARD_KEY, String(Date.now()));
  } catch (error) {
    // storage 접근 불가(시크릿 모드 등) — 가드 없이 리로드하면 무한 루프
    // 위험이 있으므로 복구를 포기하고 호출 측 폴백에 맡긴다.
    console.error('[stale-bundle] reload guard unavailable:', error);
    return false;
  }
  window.location.reload();
  return true;
}

/** 코드 스플릿 청크 로드 실패(배포 후 구 청크 404 등) 여부 */
export function isChunkLoadFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.name === 'ChunkLoadError' ||
    /loading chunk .+ failed|failed to fetch dynamically imported module|importing a module script failed/i.test(
      error.message
    )
  );
}

/**
 * 전역 청크 로드 실패 리스너 설치 — 스테일 HTML이 참조하는 구 청크가
 * 404일 때 새 문서를 받아 복구한다. cleanup 함수를 반환한다.
 */
export function installChunkFailureRecovery(): () => void {
  const onError = (event: ErrorEvent) => {
    if (isChunkLoadFailure(event.error)) reloadForFreshBundle();
  };
  const onRejection = (event: PromiseRejectionEvent) => {
    if (isChunkLoadFailure(event.reason)) reloadForFreshBundle();
  };
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
  };
}
