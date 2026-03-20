'use client';

import { useState, useCallback } from 'react';
import { Share2, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useShareStatus, useToggleShare } from '@/lib/queries/share';

interface ShareMapButtonProps {
  projectId: string;
}

export function ShareMapButton({ projectId }: ShareMapButtonProps) {
  const { data: shareStatus, isLoading } = useShareStatus(projectId);
  const toggleShare = useToggleShare(projectId);
  const [copied, setCopied] = useState(false);

  const shareUrl = shareStatus?.shareToken
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/shared/map/${shareStatus.shareToken}`
    : '';

  const handleToggle = useCallback((checked: boolean) => {
    toggleShare.mutate(checked, {
      onSuccess: () => {
        toast.success(checked ? '서비스맵 공유가 활성화되었습니다' : '서비스맵 공유가 비활성화되었습니다');
      },
      onError: () => {
        toast.error('공유 설정 변경에 실패했습니다');
      },
    });
  }, [toggleShare]);

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('링크가 복사되었습니다');
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
          title="서비스맵 공유"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">서비스맵 공유</h4>
            <p className="text-xs text-muted-foreground">
              공개 링크를 통해 서비스 구조를 공유할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="share-toggle" className="text-sm">
              공유 활성화
            </Label>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Switch
                id="share-toggle"
                checked={shareStatus?.enabled ?? false}
                onCheckedChange={handleToggle}
                disabled={toggleShare.isPending}
              />
            )}
          </div>

          {shareStatus?.enabled && shareUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 text-xs bg-muted px-3 py-2 rounded-md border truncate"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                환경변수, 계정 정보는 공유되지 않습니다.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
