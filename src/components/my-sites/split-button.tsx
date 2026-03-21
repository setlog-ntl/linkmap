'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, Rocket, Save, ChevronDown, Eye } from 'lucide-react';

interface SplitButtonProps {
  onSaveAndDeploy: () => void;
  onSaveOnly: () => void;
  isApplying: boolean;
  isDeploying: boolean;
}

export function SplitButton({
  onSaveAndDeploy,
  onSaveOnly,
  isApplying,
  isDeploying,
}: SplitButtonProps) {
  const disabled = isApplying || isDeploying;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* 메인: 저장 (미리보기 즉시 반영, 배포 없음) */}
      <div className="flex w-full">
        <Button
          size="sm"
          className="flex-1 h-9 gap-1.5 rounded-r-none bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          onClick={onSaveOnly}
          disabled={disabled}
        >
          {isApplying ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          <span className="text-xs">
            {isApplying ? '저장 중...' : '저장'}
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="h-9 px-2 rounded-l-none border-l border-indigo-500 bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={disabled}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={onSaveOnly} disabled={disabled}>
              <Eye className="h-3.5 w-3.5 mr-2" />
              <div>
                <span className="text-xs font-medium">저장</span>
                <p className="text-[10px] text-muted-foreground">미리보기에 즉시 반영</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSaveAndDeploy} disabled={disabled}>
              <Rocket className="h-3.5 w-3.5 mr-2" />
              <div>
                <span className="text-xs font-medium">저장 + 배포</span>
                <p className="text-[10px] text-muted-foreground">실제 사이트에 반영 (1~3분)</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* 배포 버튼 (별도 행) */}
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-full gap-1.5 text-xs"
        onClick={onSaveAndDeploy}
        disabled={disabled}
      >
        {isDeploying ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Rocket className="h-3.5 w-3.5" />
        )}
        {isDeploying ? '배포 중...' : '실제 사이트에 배포'}
      </Button>
    </div>
  );
}
