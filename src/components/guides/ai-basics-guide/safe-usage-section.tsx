'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const hallucinationTips = [
  { method: '항상 검증', desc: 'AI 답변의 핵심 사실은 공식 문서에서 직접 확인' },
  { method: '출처 요청', desc: '"출처를 알려줘"라고 요청하고 실재 여부 확인' },
  { method: '모른다고 유도', desc: '"확실하지 않으면 모른다고 말해줘" 포함' },
  { method: '최신 정보 주의', desc: '라이브러리 버전, 최신 뉴스는 공식 사이트 확인' },
  { method: '코드는 테스트', desc: 'AI가 생성한 코드는 반드시 직접 실행 검증' },
];

const securityRules = [
  { rule: '개인정보 보내지 않기', emoji: '🔒', detail: '주민번호, 비밀번호, 신용카드 정보를 AI에 입력하지 않기' },
  { rule: 'API 키 노출 금지', emoji: '🔑', detail: '프롬프트에 API 키나 시크릿을 포함하지 않기' },
  { rule: '민감 코드 주의', emoji: '📋', detail: '회사 기밀 코드를 공개 AI에 붙여넣기 전 정책 확인' },
  { rule: 'AI 출력 맹신 금지', emoji: '⚠️', detail: '의료, 법률, 금융 답변은 전문가 확인 필수' },
];

const costTips = [
  { method: '프롬프트 캐싱', saving: '50~90%', desc: '반복 시스템 프롬프트 캐싱' },
  { method: '배치 처리', saving: '50%', desc: '즉시 응답 불필요 시 배치 활용' },
  { method: '작은 모델 사용', saving: '70~95%', desc: '간단한 작업은 Haiku·Flash' },
  { method: '영어 프롬프트', saving: '50~66%', desc: '한국어 대비 토큰 절약' },
];

export function SafeUsageSection() {
  return (
    <section id="safe-usage" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">안전하게 사용하기</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed text-sm">
          AI는 강력한 도구이지만, 올바르게 사용해야 합니다. 할루시네이션, 보안, 비용 관리를 이해합니다.
        </p>
      </ScrollReveal>

      {/* 할루시네이션 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-2">할루시네이션 (AI 환각)</h3>
        <p className="text-xs text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          AI가 거짓 정보를 사실처럼 제시하는 현상입니다. AI는 &quot;자신감 넘치는 거짓말쟁이&quot;가 될 수 있습니다 — 모르는 것도 그럴듯하게 답변하는 경향이 있습니다.
        </p>
        <div className="space-y-2 max-w-xl mb-10">
          {hallucinationTips.map((t, i) => (
            <div key={t.method} className="flex items-start gap-3 text-xs rounded-lg border bg-card px-4 py-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">
                {i + 1}
              </span>
              <div>
                <div className="font-semibold text-sm mb-0.5">{t.method}</div>
                <span className="text-muted-foreground leading-relaxed">{t.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 보안 주의사항 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">보안 주의사항</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-10">
          {securityRules.map((r) => (
            <Card key={r.rule}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="text-base">{r.emoji}</span>
                  {r.rule}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{r.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollReveal>

      {/* 비용 절약 팁 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">비용 절약 팁</h3>
        <div className="space-y-2 max-w-xl">
          {costTips.map((t) => (
            <div key={t.method} className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold mb-0.5">{t.method}</div>
                <span className="text-[10px] text-muted-foreground">{t.desc}</span>
              </div>
              <Badge variant="secondary" className="text-[10px] bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 shrink-0">
                -{t.saving}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border max-w-xl">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">핵심 원칙:</strong> AI가 생성한 모든 결과물은 &quot;초안&quot;으로 취급하세요. 코드는 반드시 실행 테스트하고, 사실 정보는 공식 소스에서 검증합니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
