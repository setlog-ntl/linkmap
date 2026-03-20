'use client';

import Link from 'next/link';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeedbackFab() {
  return (
    <Button
      asChild
      size="icon"
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg bg-brand-blue text-white hover:bg-brand-blue/90"
    >
      <Link href="/feedback" prefetch={false} title="기능 요청 / 피드백">
        <MessageSquarePlus className="h-5 w-5" />
      </Link>
    </Button>
  );
}
