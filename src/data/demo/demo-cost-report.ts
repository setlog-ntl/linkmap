import type { CostReportResult } from '@/lib/validations/ai-cost-report';

/** 데모용 AI 비용 분석 샘플 리포트 데이터 */
export const DEMO_COST_REPORT: CostReportResult = {
  headline: '월 $287 지출 중 최대 $112 절감 가능 — 연간 $1,344 절약 기회 확인',
  totalInsight:
    '현재 스택에서 Vercel Pro($20)·Supabase Pro($25)·Stripe 수수료가 주요 비용을 차지합니다. Stripe는 사용량 기반 과금이므로 매출 성장과 연동되나, Vercel과 Supabase는 트래픽 규모 대비 티어를 재검토할 여지가 있습니다. AI 네이티브 도구 도입으로 반복 운영 비용을 추가 절감할 수 있습니다.',
  services: [
    {
      name: 'Vercel',
      category: 'deploy',
      monthlyCost: 20,
      percentage: 28,
      status: 'review',
      insight: 'Pro 플랜($20/월) 사용 중. 월 트래픽이 100GB 미만이라면 Hobby(무료)·또는 Cloudflare Pages 전환으로 $20 절감 가능.',
    },
    {
      name: 'Supabase',
      category: 'database',
      monthlyCost: 25,
      percentage: 35,
      status: 'review',
      insight: 'Pro 플랜($25/월). DB 크기가 8GB 미만이고 MAU 50,000 미만이라면 Free 티어 유지 가능. 성장 대비 적절한 투자이나 스타트업 크레딧 프로그램 신청 권장.',
    },
    {
      name: 'Stripe',
      category: 'payment',
      monthlyCost: 22,
      percentage: 31,
      status: 'optimal',
      insight: '거래액 대비 2.9%+$0.30 과금 구조. 매출 연동이므로 최적. 연간 $100k+ 결제 처리 시 Enterprise 협상으로 수수료 0.2~0.5%p 인하 가능.',
    },
    {
      name: 'SendGrid',
      category: 'email',
      monthlyCost: 14.95,
      percentage: 6,
      status: 'high_cost',
      insight: '월 14.95달러(Essentials 플랜). 발송량이 월 5,000건 미만이라면 Resend 무료 플랜($0)으로 전환하여 100% 절감 가능.',
    },
  ],
  optimizations: [
    {
      title: 'SendGrid → Resend 무료 플랜 전환',
      description: '월 5,000건 이하 발송 기준으로 Resend 무료 플랜이 동일 기능 제공. 마이그레이션은 SDK 교체 1일 작업으로 가능.',
      estimatedMonthlySaving: 14.95,
      priority: 'high',
      effort: 'immediate',
    },
    {
      title: 'Vercel Hobby 전환 또는 Cloudflare Pages 이전',
      description: '트래픽이 소규모라면 Vercel Hobby(무료) 유지 가능. 더 나아가 Cloudflare Pages(무료)로 이전 시 성능 향상과 함께 $20 절감.',
      estimatedMonthlySaving: 20,
      priority: 'high',
      effort: 'short_term',
    },
    {
      title: 'Supabase 스타트업 크레딧 신청',
      description: 'Supabase는 초기 스타트업 대상 $300 크레딧 프로그램 운영 중. 신청 기준 충족 시 12개월간 Pro 플랜 무료 이용 가능.',
      estimatedMonthlySaving: 25,
      priority: 'medium',
      effort: 'short_term',
    },
    {
      title: 'Stripe 연간 결제 도입으로 수수료 최적화',
      description: '구독 서비스라면 연간 결제 유도 시 카드 결제 횟수 감소 → Stripe 고정 수수료($0.30/건) 절감. 연간 결제 비율 30% 달성 시 월 $4~8 절감.',
      estimatedMonthlySaving: 6,
      priority: 'medium',
      effort: 'short_term',
    },
  ],
  alternatives: [
    {
      currentServiceName: 'SendGrid',
      alternativeName: 'Resend',
      alternativeMonthlyCost: 0,
      monthlySaving: 14.95,
      rationale: '개발자 친화적 API, 무료 3,000건/월. 리액트 이메일 템플릿 지원으로 개발 생산성도 향상.',
    },
    {
      currentServiceName: 'Vercel',
      alternativeName: 'Cloudflare Pages',
      alternativeMonthlyCost: 0,
      monthlySaving: 20,
      rationale: '엣지 네트워크 기반 무료 호스팅. Next.js 지원(@opennextjs/cloudflare). 글로벌 CDN 성능 우수.',
    },
    {
      currentServiceName: 'Supabase',
      alternativeName: 'PlanetScale Hobby',
      alternativeMonthlyCost: 0,
      monthlySaving: 25,
      rationale: 'MySQL 기반 서버리스 DB. 무료 플랜 제공. 단, PostgreSQL 의존 기능(RLS 등) 사용 시 전환 비용 발생.',
    },
  ],
  trends: [
    {
      title: 'AI 네이티브 SaaS 도구 비용 급증',
      description: 'ChatGPT·Claude API 등 AI 기능 번들링으로 기존 SaaS 가격이 20~40% 인상되는 추세. AI 부가 기능 필요 여부를 선택적으로 검토하세요.',
      impact: 'negative',
    },
    {
      title: '사용량 기반(Usage-Based) 과금 확산',
      description: '고정 구독 대신 실제 사용량 기반 과금 모델로 전환하는 SaaS 증가. 초기 스타트업에 유리한 구조.',
      impact: 'positive',
    },
    {
      title: '오픈소스 대안 성숙',
      description: 'Supabase·PocketBase 등 자체 호스팅 가능한 오픈소스 백엔드가 성숙 단계. 트래픽 증가 시 TCO 비교 검토 권장.',
      impact: 'positive',
    },
    {
      title: '스타트업 크레딧 프로그램 경쟁 심화',
      description: 'Vercel·AWS·Google Cloud·Supabase 등 주요 플랫폼이 스타트업 크레딧을 확대 중. 적극 신청으로 초기 비용 최소화 가능.',
      impact: 'positive',
    },
  ],
  actionItems: [
    {
      action: 'SendGrid를 Resend 무료 플랜으로 교체 (SDK 교체 1일 작업, 즉시 $14.95 절감)',
      timeline: 'immediate',
      expectedMonthlySaving: 14.95,
    },
    {
      action: 'Supabase 스타트업 크레딧 프로그램 신청 (https://supabase.com/partners/integrations)',
      timeline: 'immediate',
      expectedMonthlySaving: 25,
    },
    {
      action: '월 트래픽·빌드 횟수 확인 후 Vercel 플랜 다운그레이드 또는 Cloudflare Pages 이전 검토',
      timeline: '1_3_months',
      expectedMonthlySaving: 20,
    },
    {
      action: '구독 상품에 연간 결제 옵션 추가하여 카드 수수료 최적화',
      timeline: '1_3_months',
      expectedMonthlySaving: 6,
    },
    {
      action: 'AI 운영 도구(자동화 응답, 코드 리뷰 봇 등) 도입으로 반복 인건비 절감 ROI 측정',
      timeline: '3_plus_months',
      expectedMonthlySaving: null,
    },
  ],
};

/** 데모 리포트 생성 시간 (2025-02-20 기준 샘플) */
export const DEMO_COST_REPORT_GENERATED_AT = '2026-02-20T09:15:00.000Z';
