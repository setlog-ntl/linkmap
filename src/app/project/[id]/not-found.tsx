import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FolderX } from 'lucide-react';

export default function ProjectNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <FolderX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">프로젝트를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-6">
          요청하신 프로젝트가 존재하지 않거나 접근 권한이 없습니다.
        </p>
        <Button asChild>
          <Link href="/dashboard">대시보드로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
