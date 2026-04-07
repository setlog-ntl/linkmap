'use client';

import { useState, useCallback, useRef } from 'react';

interface UseMfaChallengeReturn {
  /** MFA 챌린지 다이얼로그 열림 여부 */
  isChallengeOpen: boolean;
  /** 다이얼로그 열림/닫힘 제어 */
  setChallengeOpen: (open: boolean) => void;
  /** MFA 검증 완료 콜백 */
  onVerified: () => void;
  /** 복구 코드 사용 완료 콜백 */
  onRecovery: () => void;
  /**
   * 민감 API 호출을 MFA 가드로 래핑.
   * 403 MFA_REQUIRED 응답 시 자동으로 챌린지 다이얼로그를 열고,
   * 검증 완료 후 원래 API를 재시도합니다.
   */
  executeSensitive: (apiCall: () => Promise<Response>) => Promise<Response>;
}

export function useMfaChallenge(): UseMfaChallengeReturn {
  const [isChallengeOpen, setChallengeOpen] = useState(false);
  const pendingCallRef = useRef<(() => Promise<Response>) | null>(null);
  const resolveRef = useRef<((res: Response) => void) | null>(null);
  const rejectRef = useRef<((err: Error) => void) | null>(null);

  const onVerified = useCallback(() => {
    const call = pendingCallRef.current;
    if (call) {
      call().then(
        (res) => resolveRef.current?.(res),
        (err) => rejectRef.current?.(err),
      ).finally(() => {
        pendingCallRef.current = null;
        resolveRef.current = null;
        rejectRef.current = null;
      });
    }
  }, []);

  const onRecovery = useCallback(() => {
    // 복구 코드 사용 → MFA 해제됨 → 원래 호출 재시도 (이제 MFA 가드 통과)
    onVerified();
  }, [onVerified]);

  const executeSensitive = useCallback(
    (apiCall: () => Promise<Response>): Promise<Response> => {
      return new Promise((resolve, reject) => {
        apiCall().then((res) => {
          if (res.status === 403) {
            // MFA_REQUIRED 확인을 위해 body를 clone해서 읽음
            const cloned = res.clone();
            cloned.json().then((data) => {
              if (data.code === 'MFA_REQUIRED') {
                pendingCallRef.current = apiCall;
                resolveRef.current = resolve;
                rejectRef.current = reject;
                setChallengeOpen(true);
              } else {
                resolve(res);
              }
            }).catch(() => resolve(res));
          } else {
            resolve(res);
          }
        }).catch(reject);
      });
    },
    [],
  );

  return {
    isChallengeOpen,
    setChallengeOpen,
    onVerified,
    onRecovery,
    executeSensitive,
  };
}
