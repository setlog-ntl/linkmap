# Linkmap 결제 시스템 개요

## 결제 흐름

```
사용자 클릭 [업그레이드]
    │
    ▼
POST /api/stripe/checkout
    │  ← stripe_customer_id 없으면 생성
    │
    ▼
Stripe Checkout 세션 생성 → 사용자 결제 페이지 이동
    │
    ▼
결제 완료 → Stripe Webhook (checkout.session.completed)
    │
    ▼
DB subscriptions 업데이트 (plan: pro/team, status: active)
    │
    ▼
이메일 발송 (subscription_change: upgraded)

---

사용자 클릭 [결제 수단 및 구독 관리]
    │
    ▼
POST /api/stripe/portal
    │
    ▼
Stripe Customer Portal 세션 생성 → 리다이렉트
```

## 환경변수 일람

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `STRIPE_SECRET_KEY` | Stripe 기능 전체 | sk_test_... / sk_live_... |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | 클라이언트 | pk_test_... / pk_live_... |
| `STRIPE_WEBHOOK_SECRET` | Webhook 검증 | whsec_... |
| `NEXT_PUBLIC_STRIPE_PRICE_PRO` | Pro 플랜 결제 | price_xxxxx |
| `NEXT_PUBLIC_STRIPE_PRICE_TEAM` | Team 플랜 결제 | price_yyyyy |
| `TOSS_SECRET_KEY` | Toss 결제 (예정) | test_sk_xxxxx |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | Toss 클라이언트 (예정) | test_ck_xxxxx |

## 현재 구현 현황

| 기능 | Stripe | Toss |
|------|--------|------|
| 결제 세션 생성 | ✅ 완료 | 🚧 스켈레톤 |
| Webhook 처리 | ✅ 완료 | ❌ 미구현 |
| Customer Portal | ✅ 완료 | ❌ 해당없음 |
| 구독 관리 UI | ✅ 완료 (/settings/billing) | ❌ 미구현 |
| 결제 실패 처리 | ✅ 완료 | ❌ 미구현 |

## Webhook 이벤트 처리 현황

| 이벤트 | 처리 여부 |
|--------|----------|
| `checkout.session.completed` | ✅ |
| `customer.subscription.updated` | ✅ |
| `customer.subscription.deleted` | ✅ |
| `invoice.payment_failed` | ✅ |
