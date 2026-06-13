'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Loader2, ShieldAlert } from 'lucide-react';
import { useUnregisterShowcase, useProjectShowcase } from '@/lib/queries/showcase';

interface ShowcaseRemoveButtonProps {
  showcaseId: string;
  source: 'deploy' | 'project';
  /** 현재 사용자가 이 쇼케이스의 제작자인지 */
  isOwner: boolean;
  /** 현재 사용자가 관리자인지 */
  isAdmin: boolean;
}

/**
 * 쇼케이스 갤러리에서 항목을 내리는 버튼.
 * - 제작자(소유자): 본인 쇼케이스 해제
 * - 관리자: 모더레이션 목적으로 타인 쇼케이스도 해제 가능 (원본 사이트/프로젝트는 보존)
 */
export function ShowcaseRemoveButton({ showcaseId, source, isOwner, isAdmin }: ShowcaseRemoveButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const unregisterDeploy = useUnregisterShowcase();
  const projectShowcase = useProjectShowcase();
  const isPending = unregisterDeploy.isPending || projectShowcase.isPending;

  // 소유자도 관리자도 아니면 노출하지 않음 (서버에서도 이중 차단)
  if (!isOwner && !isAdmin) return null;

  const adminModeration = isAdmin && !isOwner;

  async function handleRemove() {
    try {
      if (source === 'project') {
        await projectShowcase.mutateAsync({ projectId: showcaseId, action: 'unregister' });
      } else {
        await unregisterDeploy.mutateAsync(showcaseId);
      }
      toast.success('쇼케이스에서 내렸습니다');
      setOpen(false);
      router.push('/showcase');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '쇼케이스 해제에 실패했습니다');
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-destructive hover:text-destructive"
        >
          {adminModeration ? <ShieldAlert className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
          {adminModeration ? '관리자 권한으로 내리기' : '쇼케이스에서 내리기'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>쇼케이스에서 내릴까요?</AlertDialogTitle>
          <AlertDialogDescription>
            {adminModeration
              ? '관리자 권한으로 이 쇼케이스를 갤러리에서 내립니다. 원본 사이트·프로젝트는 삭제되지 않으며, 제작자가 다시 등록할 수 있습니다.'
              : '이 쇼케이스를 갤러리에서 내립니다. 원본 사이트는 삭제되지 않으며, 언제든 다시 등록할 수 있습니다.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleRemove();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            내리기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
