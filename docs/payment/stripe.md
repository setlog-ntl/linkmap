# Stripe 설정 가이드

## 1. Stripe 계정 및 API 키

1. [Stripe Dashboard](https://dashboard.stripe.com) 로그인
2. **Developers → API Keys** 에서 키 확인
3. `.env.local`에 설정:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

## 2. 플랜별 Price ID 등록

1. **Products → Add Product** → Pro 플랜 상품 생성
   - 가격: $9.9/월 (recurring)
   - Price ID 복사 → `NEXT_PUBLIC_STRIPE_PRICE_PRO`
2. Team 플랜 동일하게 생성 ($29/월) → `NEXT_PUBLIC_STRIPE_PRICE_TEAM`

## 3. Customer Portal 활성화

1. Stripe Dashboard → **Settings → Billing → Customer Portal**
2. 허용 기능 설정 (취소, 플랜 변경, 결제 수단 업데이트)
3. Return URL: `https://www.linkmap.biz/settings/billing`

## 4. Webhook 설정

### 로컬 테스트 (stripe-cli)

```bash
# 설치
brew install stripe/stripe-cli/stripe

# 로그인
stripe login

# 포워딩
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 이벤트 트리거
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_failed
```

### 프로덕션 설정

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL: `https://www.linkmap.biz/api/stripe/webhook`
3. 이벤트 선택:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Signing Secret 복사 → `STRIPE_WEBHOOK_SECRET`

## 구현 파일 목록

| 파일 | 역할 |
|------|------|
| `src/app/api/stripe/checkout/route.ts` | 결제 세션 생성 |
| `src/app/api/stripe/portal/route.ts` | Customer Portal 세션 생성 |
| `src/app/api/stripe/webhook/route.ts` | Webhook 이벤트 처리 |
| `src/app/pricing/pricing-content.tsx` | 플랜 선택 UI |
| `src/app/settings/billing/page.tsx` | 구독 관리 페이지 |
| `src/lib/queries/subscription.ts` | useSubscription 훅 |
| `src/lib/validations/stripe.ts` | Zod 스키마 |
