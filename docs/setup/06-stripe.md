# Stripe 결제 + Webhook 설정

Linkmap의 Pro 구독 결제를 위한 Stripe 설정입니다. 선택 사항이며, 설정하지 않으면 결제 기능만 비활성화됩니다.

## 1. Stripe 계정 및 API 키

1. [stripe.com](https://stripe.com) 로그인
2. **Developers > API Keys** 에서 키 확인:

| 키 | 환경변수 | 노출 범위 |
|----|----------|-----------|
| Publishable key (`pk_test_...` / `pk_live_...`) | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | 클라이언트 (공개 가능) |
| Secret key (`sk_test_...` / `sk_live_...`) | `STRIPE_SECRET_KEY` | 서버 전용 |

> **테스트 모드**에서는 `pk_test_`, `sk_test_` 접두사가 붙은 키를 사용합니다. 프로덕션 전환 시 Live 키로 교체하세요.

## 2. 상품 및 가격 생성

1. **Products > Add product**
2. 상품 이름: `Linkmap Pro` (원하는 이름)
3. 가격 설정: 월별 반복 결제 (예: $9.99/month)
4. 생성된 **Price ID** (`price_...`)를 코드에서 참조

## 3. Webhook 설정

Stripe 이벤트를 수신하여 구독 상태를 동기화합니다.

### 엔드포인트 등록

1. **Developers > Webhooks > Add endpoint**
2. Endpoint URL:

```
https://linkmap.vercel.app/api/stripe/webhook
```

3. 수신 이벤트 선택:

| 이벤트 | 용도 |
|--------|------|
| `checkout.session.completed` | 결제 완료 → 구독 활성화 |
| `customer.subscription.updated` | 구독 변경 (플랜/상태 동기화) |
| `customer.subscription.deleted` | 구독 취소 → free로 다운그레이드 |

4. **Add endpoint** 클릭
5. 생성된 **Signing secret** (`whsec_...`)를 복사

### 환경변수 설정

`.env.local`에 추가:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 4. 로컬 테스트

로컬에서 Webhook을 테스트하려면 Stripe CLI를 사용합니다:

```bash
# Stripe CLI 설치
# macOS: brew install stripe/stripe-cli/stripe
# Windows: scoop install stripe

# 로그인
stripe login

# 로컬 Webhook 포워딩
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

CLI가 출력하는 `whsec_...` 값을 `.env.local`의 `STRIPE_WEBHOOK_SECRET`에 설정합니다.

```bash
# 테스트 이벤트 발송
stripe trigger checkout.session.completed
```

## 5. Webhook 보안

Webhook 핸들러는 HMAC-SHA256 서명을 검증합니다:

- `stripe-signature` 헤더에서 타임스탬프와 서명 추출
- `STRIPE_WEBHOOK_SECRET`으로 페이로드 서명 재계산
- 타이밍 세이프 비교 (timing-safe comparison)
- 5분 이내 타임스탬프만 허용 (리플레이 방지)

## 코드 참조

| 파일 | 역할 |
|------|------|
| `src/app/api/stripe/webhook/route.ts` | Webhook 수신 + 서명 검증 + 구독 상태 업데이트 |
| `src/app/api/stripe/checkout/route.ts` | 체크아웃 세션 생성 (Stripe Customer 연동) |
| `supabase/migrations/004_subscriptions.sql` | 구독 테이블 스키마 |
