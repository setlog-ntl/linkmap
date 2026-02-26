'use client';

import { useMemo } from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  message: string;
  status: 'pending' | 'running' | 'success' | 'error';
}

interface SetupLiveLogsProps {
  saving: boolean;
  verifying: boolean;
  verifySuccess: boolean | null;
  envVarCount: number;
  serviceName: string;
}

function now() {
  return new Date().toLocaleTimeString('ko-KR', { hour12: false });
}

export function SetupLiveLogs({
  saving,
  verifySuccess,
  envVarCount,
  serviceName,
}: SetupLiveLogsProps) {
  // props로부터 직접 로그를 파생 — useEffect + setState 체이닝 제거
  const logs = useMemo<LogEntry[]>(() => {
    if (!saving && verifySuccess === null) return [];

    const entries: LogEntry[] = [];

    if (saving) {
      // 저장 중
      entries.push({
        timestamp: now(),
        message: `${envVarCount}개 환경변수 암호화 중...`,
        status: 'running',
      });
    } else {
      // 저장 완료
      entries.push({
        timestamp: now(),
        message: `${envVarCount}개 환경변수 저장 완료`,
        status: 'success',
      });

      if (verifySuccess === null) {
        // 검증 대기 중
        entries.push({
          timestamp: now(),
          message: `${serviceName} 연결 검증 중...`,
          status: 'running',
        });
      } else {
        // 검증 완료
        entries.push({
          timestamp: now(),
          message: verifySuccess
            ? `${serviceName} 연결 성공`
            : `${serviceName} 연결 확인 필요`,
          status: verifySuccess ? 'success' : 'error',
        });
        entries.push({
          timestamp: now(),
          message: verifySuccess ? '설정 완료' : '환경변수 저장됨 (연결 확인 필요)',
          status: verifySuccess ? 'success' : 'error',
        });
      }
    }

    return entries;
  }, [saving, verifySuccess, envVarCount, serviceName]);

  if (logs.length === 0) return null;

  return (
    <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs space-y-1.5 max-h-[160px] overflow-y-auto">
      {logs.map((log, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="text-muted-foreground shrink-0">{log.timestamp}</span>
          <span className="shrink-0 mt-0.5">
            {log.status === 'running' && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
            {log.status === 'success' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
            {log.status === 'error' && <XCircle className="h-3 w-3 text-yellow-500" />}
            {log.status === 'pending' && <span className="h-3 w-3 block" />}
          </span>
          <span className={log.status === 'error' ? 'text-yellow-600 dark:text-yellow-400' : ''}>
            {log.message}
          </span>
        </div>
      ))}
    </div>
  );
}
