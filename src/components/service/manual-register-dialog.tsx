'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { ManualEnvForm } from './manual-env-form';
import { SecureNoteForm } from './secure-note-form';
import type { Service } from '@/types';

interface ManualRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  projectId: string;
}

/**
 * 수동 등록 다이얼로그 — 2가지 타입을 탭으로 구분.
 * - 환경변수: KEY=VALUE 형식 (코드/배포 설정값)
 * - 보안 메모: 자유 텍스트 (백업코드·비밀번호·복구문구 등)
 */
export function ManualRegisterDialog({ open, onOpenChange, service, projectId }: ManualRegisterDialogProps) {
  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[88dvh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>{service.name} 수동 등록</DialogTitle>
          <DialogDescription>
            저장할 값의 형식을 선택하세요. 환경변수는 KEY=VALUE 설정값, 보안 메모는 백업코드·비밀번호 같은 자유 텍스트입니다.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="env" className="flex flex-col flex-1 min-h-0">
          <TabsList className="grid w-full grid-cols-2 shrink-0">
            <TabsTrigger value="env" className="gap-1.5">
              <KeyRound className="h-3.5 w-3.5" />
              환경변수
            </TabsTrigger>
            <TabsTrigger value="note" className="gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              보안 메모
            </TabsTrigger>
          </TabsList>

          <TabsContent value="env" className="flex flex-col flex-1 min-h-0 mt-3 data-[state=inactive]:hidden">
            <ManualEnvForm service={service} projectId={projectId} onClose={close} />
          </TabsContent>

          <TabsContent value="note" className="flex flex-col flex-1 min-h-0 mt-3 data-[state=inactive]:hidden">
            <SecureNoteForm service={service} projectId={projectId} onClose={close} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
