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

## 6. 트러블슈팅

### `Product is archived` (checkout 502)
- **증상**: `/api/polar/checkout` 502, 응답에 `PolarRequestValidationError` / `"Product is archived."` + 거부된 product ID.
- **원인**: `NEXT_PUBLIC_POLAR_PRODUCT_*`에 설정된 product ID가 Polar 대시보드에서 **아카이브(보관)** 상태. 아카이브 상품은 checkout에 사용할 수 없음.
- **조치**:
  1. Polar Dashboard → Products에서 거부된 ID와 일치하는 상품을 찾는다(4개 env 값 중 어느 것인지 확인 — PRO/TEAM × 월/연).
  2. 해당 상품을 **un-archive** 하거나, 활성 상품을 새로 만들고 그 **새 product ID**로 교체.
  3. 배포 환경(Cloudflare/Vercel)과 `.env.local`의 `NEXT_PUBLIC_POLAR_PRODUCT_*` 값을 갱신.
  4. **재배포 필수** — `NEXT_PUBLIC_*`는 빌드 타임에 번들로 굳어지므로 env만 바꾸고 재배포하지 않으면 반영되지 않음.
- 미설정/빈 값이면 checkout 호출 없이 "서비스 안정화 후 결제 연결" 토스트만 노출(`pricing-content.tsx`).

### subscriptions 406 (콘솔 네트워크 오류)
- **증상**: 브라우저 콘솔에 `rest/v1/subscriptions?select=*&user_id=eq...` 406.
- **원인**: 구독 레코드가 없는(신규/무료) 사용자에 `.single()`을 쓰면 PostgREST가 406 반환. 기능상 free 폴백으로 처리되지만 콘솔 오류로 남음.
- **조치**: `src/lib/queries/subscription.ts`에서 `.single()` → `.maybeSingle()`로 0건도 200+null 반환하게 수정(적용 완료).

## 7. Stripe 마이그레이션 노트

- 기존 Stripe 코드(`/api/stripe/`)는 유지 (기존 구독자 호환)
- 새 구독은 모두 Polar로 처리
- `subscriptions.payment_provider` 컬럼으로 구분 (`'polar'` | `'stripe'` | `'none'`)
- DB 마이그레이션: `080_polar_payment_integration.sql`
