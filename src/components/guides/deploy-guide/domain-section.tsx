'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';

const urlParts = [
  { part: 'https://', label: '프로토콜', desc: '통신 방식. https = 암호화 연결', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700' },
  { part: 'www.', label: '서브도메인', desc: '선택 사항. app., api., blog. 등도 가능', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700' },
  { part: 'my-app', label: '도메인 이름', desc: '내가 구매한 이름. 브랜드 정체성', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700' },
  { part: '.com', label: '최상위 도메인(TLD)', desc: '.com .io .kr .dev .app 등', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700' },
  { part: '/dashboard', label: '경로(Path)', desc: '서버 안의 특정 페이지 위치', color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600' },
];

const domainRegistrars = [
  { name: 'Gabia', emoji: '🇰🇷', desc: '국내 최대 도메인 등록 업체. 한국어 지원', price: '.com 연 14,000원~' },
  { name: 'Namecheap', emoji: '🌐', desc: '저렴하고 신뢰할 수 있는 글로벌 업체', price: '.com 연 $9~' },
  { name: 'Cloudflare Registrar', emoji: '☁️', desc: '원가에 판매. 부가 서비스 연동 편리', price: '.com 연 $10.44' },
];

export function DomainSection() {
  return (
    <section id="domain" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">도메인이란?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          인터넷의 주소입니다. 실제 서버 IP는 <code className="text-xs bg-muted px-1 py-0.5 rounded">142.250.80.14</code>처럼 숫자지만,
          사람이 기억하기 어렵기 때문에 <code className="text-xs bg-muted px-1 py-0.5 rounded">google.com</code>처럼 이름을 붙여 씁니다.
        </p>
      </ScrollReveal>

      {/* URL 해부 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">URL 해부하기</h3>
        <div className="max-w-2xl mb-8">
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
                <code className="font-mono text-sm font-bold shrink-0 w-20">{p.part}</code>
                <div className="min-w-0">
                  <div className="text-xs font-semibold">{p.label}</div>
                  <div className="text-xs opacity-80">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 도메인 구매 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">도메인 구매처</h3>
        <p className="text-sm text-muted-foreground mb-4">
          도메인은 연간 요금을 내고 빌려 쓰는 방식입니다. (소유가 아닌 임대)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl">
          {domainRegistrars.map((r) => (
            <div key={r.name} className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{r.emoji}</span>
                <span className="font-semibold text-sm">{r.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{r.desc}</p>
              <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono">{r.price}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
