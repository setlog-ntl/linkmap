'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, ShieldCheck, ShieldOff } from 'lucide-react';
import { MfaEnrollDialog } from './mfa-enroll-dialog';
import { MfaDisableDialog } from './mfa-disable-dialog';

interface MfaStatus {
  enabled: boolean;
  factorId: string | null;
  currentLevel: string;
  nextLevel: string;
}

export function MfaSection() {
  const [status, setStatus] = useState<MfaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/account/mfa/status');
      if (res.ok) {
        setStatus(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStatus(); }, [loadStatus]);

  const handleSuccess = () => {
    loadStatus();
  };

  if (loading) {
    return (
      <section>
        <Skeleton className="h-5 w-36 mb-5" />
        <Skeleton className="h-24 rounded-xl" />
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
        <Shield className="h-5 w-5" />
        2단계 인증
      </h2>
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {status?.enabled ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                  <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShieldOff className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-semibold text-foreground">TOTP 인증</p>
                  {status?.enabled ? (
                    <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-500/40 text-xs">
                      활성화됨
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-xs">
                      비활성화
                    </Badge>
                  )}
                </div>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  {status?.enabled
                    ? '인증 앱을 사용한 2단계 인증이 활성화되어 있습니다.'
                    : '인증 앱(Google Authenticator 등)으로 민감한 작업 시 추가 인증을 요구합니다.'}
                </p>
              </div>
            </div>
            {status?.enabled ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDisableOpen(true)}
              >
                비활성화
              </Button>
            ) : (
              <Button size="sm" onClick={() => setEnrollOpen(true)}>
                설정하기
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <MfaEnrollDialog
        open={enrollOpen}
        onOpenChange={setEnrollOpen}
        onSuccess={handleSuccess}
      />

      {status?.enabled && status.factorId && (
        <MfaDisableDialog
          open={disableOpen}
          onOpenChange={setDisableOpen}
          factorId={status.factorId}
          onSuccess={handleSuccess}
        />
      )}
    </section>
  );
}
