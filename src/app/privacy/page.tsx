import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: '개인정보처리방침 - Linkmap',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={null} />
      <main className="flex-1 container max-w-3xl py-12">
        <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">최종 업데이트: 2026년 2월 19일</p>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">1. 수집하는 개인정보</h2>
            <p>Linkmap은 서비스 제공을 위해 다음 정보를 수집합니다:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>이메일 주소 (OAuth 로그인 시 제공)</li>
              <li>프로필 정보 (이름, 프로필 사진 — OAuth 제공자로부터)</li>
              <li>서비스 이용 기록 (프로젝트 생성, 환경변수 관리 등)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. 개인정보의 이용 목적</h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>서비스 제공 및 계정 관리</li>
              <li>서비스 개선 및 신규 기능 개발</li>
              <li>보안 및 부정 이용 방지</li>
              <li>고객 지원 및 문의 응대</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. 개인정보의 보관 및 파기</h2>
            <p className="text-muted-foreground">
              회원 탈퇴 시 개인정보는 즉시 삭제됩니다. 단, 관련 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. 개인정보의 제3자 제공</h2>
            <p className="text-muted-foreground">
              Linkmap은 사용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
              다만, GitHub OAuth 연동 시 GitHub API를 통해 필요한 정보를 교환합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. 데이터 암호화</h2>
            <p className="text-muted-foreground">
              모든 환경변수 및 API 키는 AES-256-GCM으로 암호화되어 저장됩니다.
              전송 중 데이터는 TLS로 보호됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">6. 문의</h2>
            <p className="text-muted-foreground">
              개인정보 관련 문의는 <a href="mailto:support@linkmap.dev" className="text-primary hover:underline">support@linkmap.dev</a>로 연락해주세요.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
