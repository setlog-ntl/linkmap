'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useEnvConflicts, useResolveConflict } from '@/lib/queries/env-vars';
import { ConflictMetricsPanel } from '@/components/env/conflict-resolver/conflict-metrics-panel';
import { ConflictList } from '@/components/env/conflict-resolver/conflict-list';
import { ConflictComparisonView } from '@/components/env/conflict-resolver/conflict-comparison-view';
import { ConflictResolutionDialog } from '@/components/env/conflict-resolver/conflict-resolution-dialog';
import type { EnvConflict } from '@/lib/env/conflict-detector';
import type { Environment } from '@/types';

export default function EnvConflictsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { data, isLoading, refetch, isFetching } = useEnvConflicts(projectId);
  const resolveConflict = useResolveConflict(projectId);

  const [selectedConflict, setSelectedConflict] = useState<EnvConflict | null>(null);
  const [resolveDialog, setResolveDialog] = useState<{
    open: boolean;
    keyName: string;
    sourceEnv: Environment;
    targetEnvs: Environment[];
    action: 'copy' | 'delete';
  }>({
    open: false,
    keyName: '',
    sourceEnv: 'development',
    targetEnvs: [],
    action: 'copy',
  });

  const conflicts = data?.conflicts || [];

  const handleResolve = (sourceEnv: Environment, targetEnvs: Environment[]) => {
    if (!selectedConflict) return;
    setResolveDialog({
      open: true,
      keyName: selectedConflict.key_name,
      sourceEnv,
      targetEnvs,
      action: 'copy',
    });
  };

  const handleConfirmResolve = async () => {
    await resolveConflict.mutateAsync({
      key_name: resolveDialog.keyName,
      source_env: resolveDialog.sourceEnv,
      target_envs: resolveDialog.targetEnvs,
      action: resolveDialog.action,
    });
    setResolveDialog((prev) => ({ ...prev, open: false }));
    setSelectedConflict(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/project/${projectId}/env`}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              환경변수
            </Link>
          </Button>
          <h2 className="text-lg font-semibold">충돌 검사</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          다시 검사
        </Button>
      </div>

      {/* Metrics */}
      <ConflictMetricsPanel conflicts={conflicts} />

      {data?.scanned_at && (
        <p className="text-xs text-muted-foreground">
          마지막 검사: {new Date(data.scanned_at).toLocaleString('ko-KR')}
        </p>
      )}

      {/* Content: list + detail */}
      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <ConflictList
          conflicts={conflicts}
          selectedId={selectedConflict?.id || null}
          onSelect={setSelectedConflict}
        />

        {selectedConflict ? (
          <ConflictComparisonView
            conflict={selectedConflict}
            onResolve={handleResolve}
          />
        ) : (
          <div className="hidden lg:flex items-center justify-center text-sm text-muted-foreground border rounded-lg p-8">
            충돌 항목을 선택하면 상세 비교를 볼 수 있습니다
          </div>
        )}
      </div>

      {/* Resolution Dialog */}
      <ConflictResolutionDialog
        open={resolveDialog.open}
        onOpenChange={(open) => setResolveDialog((prev) => ({ ...prev, open }))}
        keyName={resolveDialog.keyName}
        sourceEnv={resolveDialog.sourceEnv}
        targetEnvs={resolveDialog.targetEnvs}
        action={resolveDialog.action}
        onConfirm={handleConfirmResolve}
        isPending={resolveConflict.isPending}
      />
    </div>
  );
}
