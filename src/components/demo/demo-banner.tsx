import Link from 'next/link';
import { Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DemoBanner() {
  return (
    <div className="w-full border-b border-brand-blue/20 bg-brand-blue/[0.08]">
      <div className="container flex h-10 items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Eye className="h-3.5 w-3.5 text-brand-blue shrink-0" />
          <p className="text-xs text-muted-foreground truncate">
            <span className="font-medium text-foreground">데모 미리보기</span>
            {' — '}이 화면은 읽기 전용입니다. 수정하려면 로그인하세요.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2" asChild>
            <Link prefetch={false} href="/login">로그인</Link>
          </Button>
          <Button size="sm" className="h-7 text-xs px-2 bg-brand-blue text-white hover:bg-brand-blue/90" asChild>
            <Link prefetch={false} href="/signup">
              무료 시작
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
