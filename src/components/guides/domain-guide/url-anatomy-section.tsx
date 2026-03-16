'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';

const urlParts = [
  { part: 'https://', label: '프로토콜', desc: '통신 방식. https = 암호화 연결 (자물쇠 🔒)', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700' },
  { part: 'www.', label: '서브도메인', desc: '선택 사항. app., api., blog. 등도 가능', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700' },
  { part: 'my-app', label: '도메인 이름', desc: '내가 구매한 이름. 브랜드 정체성', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700' },
  { part: '.com', label: '최상위 도메인(TLD)', desc: '.com .io .kr .dev .app 등', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700' },
  { part: '/dashboard', label: '경로(Path)', desc: '서버 안의 특정 페이지 위치', color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600' },
];

const subdomainExamples = [
  { sub: 'app.mysite.com', use: '웹 애플리케이션', icon: '📱' },
  { sub: 'api.mysite.com', use: 'API 서버', icon: '⚙️' },
  { sub: 'blog.mysite.com', use: '블로그', icon: '📝' },
  { sub: 'docs.mysite.com', use: '문서 사이트', icon: '📚' },
  { sub: 'admin.mysite.com', use: '관리자 페이지', icon: '🔐' },
];

const tldComparison = [
  { tld: '.com', purpose: '범용 (가장 보편적)', price: '연 $10~15', recommend: '대부분의 프로젝트', popularity: '⭐⭐⭐⭐⭐' },
  { tld: '.io', purpose: '기술/스타트업', price: '연 $30~40', recommend: 'SaaS, 개발 도구', popularity: '⭐⭐⭐⭐' },
  { tld: '.kr', purpose: '한국 전용', price: '연 ₩17,000~', recommend: '한국 대상 서비스', popularity: '⭐⭐⭐' },
  { tld: '.dev', purpose: '개발자/기술', price: '연 $12~15', recommend: '포트폴리오, 오픈소스', popularity: '⭐⭐⭐' },
  { tld: '.app', purpose: '앱/서비스', price: '연 $12~15', recommend: '모바일 앱, 웹 앱', popularity: '⭐⭐⭐' },
];

export function UrlAnatomySection() {
  return (
    <section id="url-anatomy" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">URL 해부하기</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          웹 주소(URL)는 여러 부분으로 구성됩니다. 각 부분이 어떤 역할을 하는지 알아보세요.
        </p>
      </ScrollReveal>

      {/* URL 컬러코딩 도식 */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-2xl mb-10">
          {/* URL 전체 표시 */}
          <div className="rounded-lg bg-muted/50 border p-4 mb-4 font-mono text-sm overflow-x-auto whitespace-nowrap">
            <span className="text-purple-600 dark:text-purple-400">https://</span>
            <span className="text-blue-600 dark:text-blue-400">www.</span>
            <span className="text-green-600 dark:text-green-400">my-app</span>
            <span className="text-orange-600 dark:text-orange-400">.com</span>
            <span className="text-gray-500">/dashboard</span>
          </div>

          {/* 각 부분 설명 */}
          <div className="grid grid-cols-1 gap-2">
            {urlParts.map((p) => (
              <div key={p.part} className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${p.color}`}>
                <code className="font-mono text-sm font-bold shrink-0 w-24">{p.part}</code>
                <div className="min-w-0">
                  <div className="text-xs font-semibold">{p.label}</div>
                  <div className="text-xs opacity-80">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 서브도메인 활용 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">서브도메인 활용 예시</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          서브도메인은 하나의 도메인 안에서 용도별로 주소를 나누는 방법입니다.
          추가 비용 없이 원하는 만큼 만들 수 있습니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mb-10">
          {subdomainExamples.map((s) => (
            <div key={s.sub} className="rounded-lg border bg-card p-3 flex items-center gap-3">
              <span className="text-lg">{s.icon}</span>
              <div>
                <code className="text-xs font-mono font-bold text-primary">{s.sub}</code>
                <div className="text-[10px] text-muted-foreground">{s.use}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-2xl p-3 rounded-lg bg-muted/50 border mb-10">
          <p className="text-xs text-muted-foreground">
            💡 서브도메인은 DNS 설정에서 추가하며, 각각 다른 서버를 가리킬 수 있습니다.
            예를 들어 <code className="bg-muted px-1 py-0.5 rounded">app.mysite.com</code>은 Vercel에,
            <code className="bg-muted px-1 py-0.5 rounded ml-1">api.mysite.com</code>은 Railway에 연결할 수 있습니다.
          </p>
        </div>
      </ScrollReveal>

      {/* TLD 비교표 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">TLD(최상위 도메인) 종류 비교</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          TLD는 도메인 이름 맨 뒤에 붙는 부분입니다. 목적과 예산에 맞게 선택하세요.
        </p>
        <div className="max-w-2xl rounded-xl border overflow-hidden bg-card">
          <div className="bg-muted px-4 py-2 border-b text-xs font-semibold text-muted-foreground grid grid-cols-5 gap-2">
            <div>TLD</div>
            <div>용도</div>
            <div>가격대</div>
            <div>추천 상황</div>
            <div>인지도</div>
          </div>
          {tldComparison.map((t, i) => (
            <div key={t.tld} className={`grid grid-cols-5 gap-2 px-4 py-3 text-xs ${i < tldComparison.length - 1 ? 'border-b' : ''}`}>
              <div className="font-mono font-bold text-primary">{t.tld}</div>
              <div className="text-muted-foreground">{t.purpose}</div>
              <div className="font-mono text-[10px] text-muted-foreground">{t.price}</div>
              <div className="text-muted-foreground">{t.recommend}</div>
              <div className="text-[10px]">{t.popularity}</div>
            </div>
          ))}
        </div>
        <div className="max-w-2xl mt-4 p-3 rounded-lg bg-muted/50 border">
          <p className="text-xs text-muted-foreground">
            💡 처음이라면 <strong className="text-foreground">.com</strong>을 추천합니다.
            가장 보편적이고 사용자가 자연스럽게 기대하는 TLD입니다.
            원하는 .com이 이미 사용 중이면 .dev나 .app도 좋은 대안입니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
