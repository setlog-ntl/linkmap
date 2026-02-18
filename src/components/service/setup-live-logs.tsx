'use client';

import { useEffect, useState } from 'react';
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

export function SetupLiveLogs({
  saving,
  verifying,
  verifySuccess,
  envVarCount,
  serviceName,
}: SetupLiveLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const now = () => new Date().toLocaleTimeString('ko-KR', { hour12: false });

    if (saving) {
      setLogs([
        { timestamp: now(), message: `${envVarCount}개 환경변수 암호화 중...`, status: 'running' },
      ]);
    }
  }, [saving, envVarCount]);

  useEffect(() => {
    if (!saving && logs.length > 0 && logs[0].status === 'running') {
      const now = () => new Date().toLocaleTimeString('ko-KR', { hour12: false });
      setLogs((prev) => [
        { ...prev[0], status: 'success', message: `${envVarCount}개 환경변수 저장 완료` },
        { timestamp: now(), message: `${serviceName} 연결 검증 중...`, status: 'running' },
      ]);
    }
  }, [saving, logs, envVarCount, serviceName]);

  useEffect(() => {
    if (verifySuccess !== null && logs.length >= 2) {
      const now = () => new Date().toLocaleTimeString('ko-KR', { hour12: false });
      setLogs((prev) => {
        const updated = [...prev];
        if (updated.length >= 2) {
          updated[1] = {
            ...updated[1],
            status: verifySuccess ? 'success' : 'error',
            message: verifySuccess
              ? `${serviceName} 연결 성공`
              : `${serviceName} 연결 확인 필요`,
          };
        }
        updated.push({
          timestamp: now(),
          message: verifySuccess ? '설정 완료' : '환경변수 저장됨 (연결 확인 필요)',
          status: verifySuccess ? 'success' : 'error',
        });
        return updated;
      });
    }
  }, [verifySuccess, serviceName, logs.length]);

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
