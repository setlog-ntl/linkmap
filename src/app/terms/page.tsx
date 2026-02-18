import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: '이용약관 - Linkmap',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={null} />
      <main className="flex-1 container max-w-3xl py-12">
        <h1 className="text-3xl font-bold mb-8">이용약관</h1>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">최종 업데이트: 2026년 2월 19일</p>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">1. 서비스 개요</h2>
            <p className="text-muted-foreground">
              Linkmap은 프로젝트에 연결된 외부 서비스의 연결 정보를 시각화하고,
              API 키 및 환경변수를 안전하게 관리하는 설정 관리 플랫폼입니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. 이용자의 의무</h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>타인의 계정을 무단으로 사용하지 않습니다.</li>
              <li>서비스를 통해 불법적인 활동을 수행하지 않습니다.</li>
              <li>API 키 및 환경변수의 관리 책임은 이용자에게 있습니다.</li>
              <li>서비스의 보안을 위협하는 행위를 하지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. 서비스 제공</h2>
            <p className="text-muted-foreground">
              Linkmap은 서비스의 안정적 제공을 위해 최선을 다하며, 서비스 변경 시
              사전에 공지합니다. 천재지변, 시스템 장애 등 불가항력적 사유로 인한
              서비스 중단에 대해서는 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. 데이터 보안</h2>
            <p className="text-muted-foreground">
              저장되는 모든 환경변수 및 API 키는 AES-256-GCM 암호화로 보호됩니다.
              Linkmap은 사용자의 복호화된 데이터에 접근하지 않으며, 암호화 키는
              사용자 환경에서만 관리됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. 지적재산권</h2>
            <p className="text-muted-foreground">
              Linkmap 서비스의 소프트웨어, 디자인, 콘텐츠에 대한 지적재산권은
              Linkmap에 귀속됩니다. 사용자가 저장한 데이터의 소유권은 사용자에게
              있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">6. 계정 해지</h2>
            <p className="text-muted-foreground">
              사용자는 언제든지 계정을 삭제할 수 있으며, 삭제 시 모든 데이터가
              영구적으로 제거됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">7. 문의</h2>
            <p className="text-muted-foreground">
              이용약관 관련 문의는 <a href="mailto:support@linkmap.dev" className="text-primary hover:underline">support@linkmap.dev</a>로 연락해주세요.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
