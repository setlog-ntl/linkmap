import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-1 font-bold text-lg mb-3">
              <span className="text-primary">Link</span>
              <span>map</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              바이브 코딩의 시작과 끝을 연결하는 허브
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">제품</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-foreground transition-colors">서비스 카탈로그</Link></li>
              <li><Link href="/#features" className="hover:text-foreground transition-colors">기능 소개</Link></li>
              <li><Link href="/#pricing" className="hover:text-foreground transition-colors">요금제</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">지원</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/guides/github" className="hover:text-foreground transition-colors">GitHub 설정 가이드</Link></li>
              <li><span className="text-muted-foreground/60 cursor-default">문서 (준비 중)</span></li>
              <li><span className="text-muted-foreground/60 cursor-default">문의하기 (준비 중)</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">법적 고지</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="text-muted-foreground/60 cursor-default">개인정보처리방침 (준비 중)</span></li>
              <li><span className="text-muted-foreground/60 cursor-default">이용약관 (준비 중)</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Linkmap. All rights reserved. | 모든 권리 보유.</p>
        </div>
      </div>
    </footer>
  );
}
