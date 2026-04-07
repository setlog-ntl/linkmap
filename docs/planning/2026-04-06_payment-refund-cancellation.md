# 기획 검토: 결제취소/환불 기능

**검토일**: 2026-04-06
**상태**: 확정
**요청자 요약**: SaaS 구독 서비스에서 결제취소(구독 해지) 및 환불 기능의 타당성과 구현 범위를 검토

---

## 1. 기능 개요

Linkmap 유료 구독(Pro/Team) 사용자가 **구독을 취소**하거나, 특정 조건에서 **환불을 요청**할 수 있는 기능. 현재는 결제 후 취소/환불 경로가 Polar Customer Portal(외부)에 완전히 의존하고 있으며, 자체 UI나 API가 없음.

### 기능 범위 정의

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 구독 취소 (Cancel) | 현재 구독 기간 종료 시 자동 갱신 중지 | P0 |
| 즉시 해지 (Revoke) | 잔여 기간 무시하고 즉시 Free로 다운그레이드 | P1 |
| 전체 환불 (Full Refund) | 최근 결제 건 전액 환불 | P1 |
| 부분 환불 (Partial Refund) | 잔여 기간 비례 환불 (Prorated) | P2 |
| 쿨링오프 (7일 청약철회) | 결제 후 7일 이내 무조건 환불 | P1 (법적 의무) |
| 환불 이력 조회 | 사용자가 환불 상태를 확인 | P1 |

---

## 2. 현재 프로젝트 상태와의 관계

### 결제 시스템 현황

| 결제 제공자 | 상태 | 환불 API 지원 |
|-------------|------|---------------|
| **Polar** | 주력 (활성) | POST `/v1/refunds/` 지원 (전체/부분 환불, 사유 7종) |
| **Stripe** | 레거시 (마이그레이션 중) | POST `/v1/refunds` 지원 (전체/부분 환불) |
| **Toss Payments** | 개발 중 (501 반환) | 미구현 (checkout/confirm만 스텁) |

### 기존 기능과의 관계

- **시너지**: `subscriptions` 테이블에 이미 `status`, `plan`, `payment_provider` 컬럼 존재하여 상태 관리 기반 있음
- **시너지**: Polar/Stripe webhook에 이미 `onSubscriptionCanceled`, `onSubscriptionRevoked`, `customer.subscription.deleted` 핸들러 구현됨
- **중복 없음**: 환불 관련 API/UI가 전무하여 신규 개발 필요
- **충돌**: Toss Payments 통합이 미완성이므로, Toss 환불은 후순위로 배치 필요

### 관련 파일 경로

```
src/app/api/polar/webhook/route.ts    ← 구독 취소/해지 웹훅 이미 처리 중
src/app/api/polar/portal/route.ts     ← Polar Customer Portal (외부 위임)
src/app/api/polar/checkout/route.ts   ← 체크아웃 세션 생성
src/app/api/stripe/webhook/route.ts   ← Stripe 구독 삭제 웹훅 처리 중
src/app/api/stripe/portal/route.ts    ← Stripe Customer Portal (외부 위임)
src/app/settings/billing/page.tsx     ← 결제 관리 UI (현재 Portal 외부 이동만)
src/lib/queries/subscription.ts       ← 구독 조회 훅
src/types/core.ts                     ← Subscription 타입 정의
```

### DB 스키마 관련

- `subscriptions` 테이블: `polar_customer_id`, `polar_subscription_id`, `status` 존재
- **환불 이력 테이블 없음**: `refunds` 또는 `payment_history` 테이블 신규 필요
- `audit_logs` 테이블: 감사 로그로 환불 기록 보조 가능하나, 별도 환불 이력 필요

---

## 3. 4관점 분석

### 제품 전략가 관점 [4/5]

**왜 필요한가**:
1. **법적 의무**: 한국 전자상거래법(전자상거래 등에서의 소비자보호에 관한 법률) 상 디지털 서비스도 7일 청약철회 대상. 청약철회를 제한하려면 사전 고지 + 시용 제공 의무가 있음
2. **사용자 신뢰**: 환불 경로가 없으면 결제 전환률 저하. "언제든 취소 가능"이 SaaS 전환의 핵심 심리적 안전장치
3. **이탈 방지**: 환불 프로세스에서 "정말 취소하시겠습니까?" 플로우를 통한 리텐션 기회 (Win-back)
4. **경쟁 기준**: Vercel, Supabase, Railway 등 모든 SaaS가 자체 구독 취소/환불 제공

**비즈니스 가치**:
- 결제 도입 시 환불 기능은 **필수 동반 기능**이지, 선택 기능이 아님
- 유료 전환 트리거: "7일 무료 체험 + 언제든 취소" 문구를 쓸 수 있게 됨
- CS 부담 감소: 자동화된 환불 프로세스로 수동 환불 요청 처리 불필요

**현재 상태 문제점**:
- Polar Customer Portal로 외부 이동만 가능 → 사용자 경험 단절
- 환불 가능 여부, 환불 상태 확인이 Linkmap 내에서 불가능
- 법적 고지(환불 정책, 청약철회 안내)가 없음

### 기술 아키텍트 관점 [3/5]

**Polar 환불 API 분석**:
- 엔드포인트: `POST /v1/refunds/`
- Scope: `refunds:write` (현재 access token에 추가 필요할 수 있음)
- 요청: `{ order_id, reason, amount, revoke_benefits?, comment?, metadata? }`
- 환불 사유: `duplicate`, `fraudulent`, `customer_request`, `service_disruption`, `satisfaction_guarantee`, `dispute_prevention`, `other`
- 상태: `pending` → `succeeded` / `failed` / `canceled`
- 부분 환불 지원 (amount로 금액 지정)

**Stripe 환불 API 분석**:
- 엔드포인트: `POST /v1/refunds`
- 요청: `{ charge 또는 payment_intent, amount?, reason? }`
- 사유: `duplicate`, `fraudulent`, `requested_by_customer`
- 구독 취소 시 프로레이션 지원

**신규 DB 테이블 필요**:
```
refund_history (신규)
- id: UUID PK
- user_id: UUID FK → auth.users
- subscription_id: UUID FK → subscriptions
- payment_provider: TEXT ('polar' | 'stripe')
- provider_refund_id: TEXT (Polar/Stripe 환불 ID)
- order_id: TEXT (결제 주문 ID)
- amount: INTEGER (센트 단위)
- currency: TEXT
- reason: TEXT
- status: TEXT ('pending' | 'succeeded' | 'failed' | 'canceled')
- requested_at: TIMESTAMPTZ
- completed_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ DEFAULT now()
```

**신규 API 엔드포인트**:
```
POST /api/polar/refund       ← Polar 환불 요청
POST /api/stripe/refund      ← Stripe 환불 요청 (레거시 지원)
GET  /api/refunds             ← 환불 이력 조회
POST /api/subscriptions/cancel ← 구독 취소 (기간 종료 시)
```

**Polar webhook 확장 필요**:
- `onOrderRefunded` 또는 `refund.created`/`refund.updated` 이벤트 처리 추가
- 환불 완료 시 `refund_history.status` 업데이트

**예상 변경 파일 목록**:
```
신규 생성:
- src/app/api/polar/refund/route.ts
- src/app/api/stripe/refund/route.ts
- src/app/api/refunds/route.ts
- src/app/api/subscriptions/cancel/route.ts
- src/lib/validations/refund.ts
- src/lib/queries/refund.ts
- supabase/migrations/0XX_create_refund_history.sql

수정 필요:
- src/app/api/polar/webhook/route.ts (환불 웹훅 핸들러 추가)
- src/app/settings/billing/page.tsx (환불/취소 UI 추가)
- src/types/core.ts (Refund 타입 추가)
- docs/db-schema.md (refund_history 테이블 문서화)
```

**Cloudflare Workers 제약**:
- 특별한 제약 없음. Polar/Stripe API 호출은 단순 HTTP 요청
- crypto 모듈은 webhook 서명 검증에 이미 사용 중

**복잡도 평가**: 중간
- Polar SDK에 환불 API가 잘 정의되어 있어 구현 자체는 단순
- 복잡도는 주로 UI/UX (취소 확인 플로우, 환불 상태 표시)와 엣지 케이스 처리에 집중

### UX 디자이너 관점 [4/5]

**현재 UX 문제**:
- `/settings/billing` 페이지에서 "결제 수단 및 구독 관리" 버튼 클릭 시 Polar Customer Portal(외부)로 이동
- 사용자가 환불/취소 가능 여부를 Linkmap 내에서 알 수 없음
- 환불 진행 상황 추적 불가

**제안 UI 구조**:

1. **구독 취소 플로우** (`/settings/billing` 내):
   - "구독 취소" 버튼 → 취소 사유 선택 모달 → 확인 → 완료
   - 취소 사유: "비용 부담", "기능 부족", "다른 서비스 사용", "기타"
   - Win-back 시도: 취소 전 "이런 기능을 알고 계신가요?" 또는 할인 제안

2. **환불 요청 플로우**:
   - "환불 요청" 버튼 (결제 후 7일 이내만 활성화)
   - 환불 사유 입력 → 확인 → pending 상태 표시
   - 환불 완료 시 이메일 알림

3. **환불 이력 섹션**:
   - 결제/환불 이력 테이블 (날짜, 금액, 상태, 사유)

**기존 UI 패턴 일관성**:
- shadcn/ui `Dialog` (확인 모달), `Badge` (상태 표시), `Card` (이력 카드) 활용
- Circuit Blue-Green v2 디자인 토큰 유지
- `sonner` toast로 환불 요청/완료 알림
- 기존 billing 페이지 레이아웃 확장 (신규 페이지 불필요)

**모바일 고려**:
- 결제/환불은 모바일에서도 필수 접근 가능해야 함
- 현재 billing 페이지가 반응형이므로 큰 문제 없음

### 리스크 매니저 관점 [3/5]

**리스크 식별**:

| 리스크 | 심각도 | 완화 방안 |
|--------|--------|-----------|
| 환불 악용 (반복 결제-환불) | 중간 | 환불 횟수 제한 (예: 연 2회), 감사 로그 모니터링 |
| Polar access token scope 부족 | 낮음 | `refunds:write` scope 확인 후 토큰 재발급 |
| 환불 후 Pro 기능 즉시 차단 시 데이터 손실 | 높음 | Grace period 제공 (환불 후 24시간 데이터 백업 기간) |
| 이중 환불 (webhook + API 동시 처리) | 중간 | Idempotency key 사용, DB unique 제약 |
| 한국 전자상거래법 미준수 | 높음 | 7일 청약철회 정책 명시, 환불 정책 페이지 생성 |
| Stripe 레거시 사용자 환불 처리 | 낮음 | payment_provider 분기 처리 |

**백로그 우선순위 충돌 분석**:
- Stripe 결제 마이그레이션: 환불 기능은 결제 시스템의 일부이므로 **시너지** (충돌 아님)
- 팀 RBAC: 독립적이므로 병렬 진행 가능
- 알림 시스템: 환불 이메일 알림은 기존 `sendEmail()` 재사용

**법적 리스크 (핵심)**:
- 한국 전자상거래법 제17조: 7일 이내 청약철회 원칙
- 디지털 콘텐츠의 경우 사전 고지 + 시용 제공 시 청약철회 제한 가능
- Linkmap은 "7일 무료 체험"을 이미 제공하므로 → 체험 후 결제 건은 청약철회 제한 가능
- 단, 체험 없이 직접 결제한 경우는 7일 환불 의무 발생 가능
- **환불 정책 페이지 필수**: 이용약관 + 환불 정책 명시

**기술 부채**:
- 환불 기능 자체는 기술 부채를 증가시키지 않음
- 오히려 결제 시스템의 완성도를 높여 부채 감소 효과

---

## 4. Q&A 기록

*사용자가 초기 요청에서 충분한 컨텍스트를 제공하여 추가 질의 없이 분석 진행*

Q: 결제취소/환불 기능의 구체적 범위는?
A: 구독 취소, 전체/부분 환불, 쿨링오프, 환불 이력 조회 전체 범위 검토 요청 (사용자 초기 명세)

Q: Polar, Stripe 각각의 환불 API 지원 현황은?
A: 코드 분석 + API 문서 조사로 확인 완료 (Step 2에서 해결)

---

## 5. 종합 권고

### 점수 요약

```
제품 전략가:   ★★★★☆ (4/5) — 법적 의무 + 사용자 신뢰 + 전환률 직결
기술 아키텍트:  ★★★☆☆ (3/5) — Polar API 지원 양호하나 DB/API/UI 신규 개발량 중간
UX 디자이너:   ★★★★☆ (4/5) — 기존 billing 페이지 확장으로 자연스러운 통합 가능
리스크 매니저:  ★★★☆☆ (3/5) — 법적 리스크 해소 효과 크나, 환불 악용/이중 처리 주의

종합: 3.5 → 조건부추진
```

**결론**: **조건부추진**

**근거**:
1. **법적 필수**: 한국 전자상거래법 상 환불/취소 경로 제공은 사실상 의무. 미제공 시 법적 리스크
2. **결제 시스템 완성도**: 결제 기능이 있으면서 환불이 없는 것은 반쪽짜리 구현. Polar Portal 외부 위임은 UX 단절
3. **구현 가능성**: Polar Refund API가 잘 정의되어 있고, 기존 webhook 인프라 확장으로 구현 가능

**조건**:
- Polar access token의 `refunds:write` scope 보유 여부 확인 선행
- 환불 정책 문서(이용약관) 법률 검토 후 착수
- Stripe 레거시는 최소 지원 (Portal 위임 유지), Polar 우선 구현

### 다음 단계

1. **P0 (즉시)**: Polar access token scope 확인, 환불 정책 초안 작성
2. **P0 (1주차)**: `refund_history` DB 마이그레이션, `POST /api/polar/refund` API 구현
3. **P1 (2주차)**: `/settings/billing` UI 확장 (취소 모달, 환불 요청, 이력 표시)
4. **P1 (2주차)**: Polar webhook에 환불 이벤트 핸들러 추가
5. **P2 (3주차)**: 환불 이메일 알림, Stripe 레거시 환불 API
6. **P3 (후순위)**: Toss Payments 환불 (Toss 결제 통합 완료 후)

### 구현 우선순위 판단: **P1**

결제 시스템은 이미 활성 상태이므로, 환불 기능은 **법적 + 비즈니스 필수** 기능. 다만 현재 유료 사용자 수가 적다면 Polar Portal 위임으로 단기 운영 가능하므로 P0이 아닌 P1.

---

## 6. 개선 방향 (조건부추진 조건)

### 추진 가능 조건

1. **Polar token scope 확인**: `refunds:write` 포함 여부. 미포함 시 Polar 대시보드에서 토큰 재발급
2. **환불 정책 법률 검토**: 7일 청약철회 적용 범위 확정 (무료 체험 후 결제 건의 청약철회 제한 가능 여부)
3. **Stripe 마이그레이션 완료 시점 확인**: Stripe 레거시 사용자가 얼마나 남아있는지에 따라 Stripe 환불 구현 범위 결정

### 단계적 접근 권장

**Phase 1 - 최소 기능 (MVP)**:
- 구독 취소 (기간 종료 시 자동 갱신 중지) → Polar API `cancel subscription`
- 환불 정책 페이지 (정적 콘텐츠)
- 7일 이내 전체 환불 → Polar Refund API

**Phase 2 - 확장**:
- 부분 환불 (프로레이션)
- 환불 이력 UI
- Win-back 취소 플로우
- 환불 이메일 알림

**Phase 3 - 완성**:
- Stripe 레거시 환불
- Toss Payments 환불
- 관리자 대시보드 환불 관리

---

## 7. 관련 에이전트 추천

| 에이전트 | 용도 |
|---------|------|
| **benchmark** | Vercel, Supabase, Railway 등 경쟁 SaaS의 환불 정책/UX 벤치마크 분석 |
| **design-director** | 구독 취소/환불 확인 모달, 환불 이력 UI 상세 디자인 |

---

## 참고 자료

- [Polar Refund API - Create Refund](https://polar.sh/docs/api-reference/refunds/create)
- [Stripe Refund API](https://docs.stripe.com/api/refunds/create)
- [Stripe 구독 취소](https://docs.stripe.com/billing/subscriptions/cancel)
- [한국 전자상거래법 - 청약철회](https://www.easylaw.go.kr/CSP/CnpClsMain.laf?csmSeq=835&ccfNo=4&cciNo=1&cnpClsNo=2)
- [전자상거래 등에서의 소비자보호에 관한 법률](https://www.law.go.kr/lsInfoP.do?lsiSeq=140566)
