'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquarePlus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { QuickFeedbackForm } from '@/components/feedback/QuickFeedbackForm';
import { getPageContext } from '@/lib/utils/page-context';

export function FeedbackFab() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const pageContext = getPageContext(pathname);

  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-safe-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg bg-brand-blue text-white hover:bg-brand-blue/90"
        onClick={() => setOpen(true)}
        title="기능 요청 / 피드백"
      >
        <MessageSquarePlus className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              빠른 피드백
              <Link
                href="/feedback"
                prefetch={false}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-normal"
                onClick={() => setOpen(false)}
              >
                전체 보기
                <ExternalLink className="h-3 w-3" />
              </Link>
            </SheetTitle>
            <SheetDescription>
              현재 페이지에서 불편한 점이나 필요한 기능을 알려주세요
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <QuickFeedbackForm
              defaultPageContext={pageContext}
              onSuccess={() => setOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
