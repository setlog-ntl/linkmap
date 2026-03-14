# Polar 결제 연동 가이드

## 개요
Linkmap의 기본 결제 시스템으로 Polar를 사용합니다.
Polar는 MoR(Merchant of Record)로서 VAT/세금 처리를 대행하며, 한국 사업자를 지원합니다.

## 1. Polar 계정 설정

### Access Token 생성
1. [polar.sh](https://polar.sh) 로그인
2. Settings → Access Tokens → 새 토큰 생성
3. 필요한 스코프: `products:read`, `checkouts:write`, `subscriptions:read`, `customers:read`

### Product 생성
1. Polar Dashboard → Products
2. Pro 플랜 상품 생성 ($9.9/월, recurring subscription)
3. Product ID 복사 (환경변수에 사용)

### Webhook 설정
1. Settings → Webhooks → Add Endpoint
2. URL: `https://www.linkmap.biz/api/polar/webhook`
3. Format: Raw
4. Secret 설정 → 복사 (환경변수에 사용)
5. 구독할 이벤트:
   - `subscription.active`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.revoked`
   - `order.created`

## 2. 환경변수 설정

```bash
# .env.local
POLAR_ACCESS_TOKEN=polar_at_...
POLAR_WEBHOOK_SECRET=polar_whs_...
POLAR_SUCCESS_URL=https://www.linkmap.biz/dashboard?upgraded=true
NEXT_PUBLIC_POLAR_PRODUCT_PRO=product_xxxxx
NEXT_PUBLIC_POLAR_PRODUCT_TEAM=product_yyyyy  # 준비 중
```

## 3. 로컬 테스트

```bash
# Polar CLI 설치
npm install -g @polar-sh/cli

# 로컬 webhook 포워딩
polar listen http://localhost:3000/api/polar/webhook
```

## 4. 구현 파일 목록

| 파일 | 역할 |
|------|------|
| `src/app/api/polar/checkout/route.ts` | Checkout 세션 생성 |
| `src/app/api/polar/webhook/route.ts` | Webhook 이벤트 처리 |
| `src/app/api/polar/portal/route.ts` | Customer Portal 세션 |
| `src/lib/validations/polar.ts` | 요청 검증 스키마 |
| `src/lib/health-check/adapters/polar.ts` | 헬스체크 어댑터 |
| `src/app/pricing/pricing-content.tsx` | 요금제 UI |
| `src/app/settings/billing/page.tsx` | 구독 관리 UI |

## 5. 결제 흐름

```
1. 사용자가 /pricing 접속
2. Pro 플랜 클릭 → POST /api/polar/checkout
3. API: 인증 확인 → Polar Checkout 세션 생성 (customerExternalId = user_id)
4. 클라이언트: Polar Checkout 페이지로 redirect
5. 사용자 결제 완료
6. Webhook: subscription.active → DB 업데이트 (plan='pro')
7. 사용자: success URL로 redirect
```

## 6. Stripe 마이그레이션 노트

- 기존 Stripe 코드(`/api/stripe/`)는 유지 (기존 구독자 호환)
- 새 구독은 모두 Polar로 처리
- `subscriptions.payment_provider` 컬럼으로 구분 (`'polar'` | `'stripe'` | `'none'`)
- DB 마이그레이션: `080_polar_payment_integration.sql`
