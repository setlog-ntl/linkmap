'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, Rocket, Save, ChevronDown } from 'lucide-react';

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
    <div className="flex w-full">
      <Button
        size="sm"
        className="flex-1 h-9 gap-1.5 rounded-r-none bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
        onClick={onSaveAndDeploy}
        disabled={disabled}
      >
        {isDeploying ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isApplying ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Rocket className="h-3.5 w-3.5" />
        )}
        <span className="text-xs">
          {isApplying ? '저장 중...' : isDeploying ? '배포 중...' : '저장 + 배포'}
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
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onSaveOnly} disabled={disabled}>
            <Save className="h-3.5 w-3.5 mr-2" />
            <span className="text-xs">GitHub에 저장</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
