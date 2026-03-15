'use client';

import { Share2, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { toast } from 'sonner';

interface ShowcaseShareButtonProps {
  showcaseId: string;
  title: string;
  size?: 'sm' | 'default';
}

export function ShowcaseShareButton({
  showcaseId,
  title,
  size = 'default',
}: ShowcaseShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/showcase/${showcaseId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('링크가 복사되었습니다');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('링크 복사에 실패했습니다');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - Linkmap 쇼케이스`,
          url,
        });
      } catch {
        // 사용자가 공유 취소한 경우 무시
      }
    } else {
      handleCopyLink();
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${title} - Linkmap 쇼케이스에서 확인하세요!`);
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={size === 'sm' ? 'h-8 text-xs px-2.5' : ''}
        >
          <Share2 className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Link2 className="h-4 w-4 mr-2" />
          )}
          링크 복사
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNativeShare}>
          <Share2 className="h-4 w-4 mr-2" />
          공유하기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToTwitter}>
          <span className="h-4 w-4 mr-2 flex items-center justify-center text-xs font-bold">X</span>
          X(Twitter)에 공유
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
