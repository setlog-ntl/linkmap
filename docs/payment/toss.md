# Toss Payments 연동 계획

## 개요

Toss Payments는 국내(KRW) 결제 수단을 위한 PSP입니다. 현재 **스켈레톤 구현** 상태이며, 실제 API 연동은 별도 스프린트에서 진행합니다.

## 계정 발급 절차

1. [Toss Payments 개발자센터](https://developers.tosspayments.com) 회원가입
2. 앱 생성 → 테스트 API 키 발급
3. `.env.local`에 설정:
   ```
   TOSS_SECRET_KEY=test_sk_xxxxx
   NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxx
   ```
4. 프로덕션 전환 시 사업자 정보 등록 필요

## 국내 결제 수단

- 신용카드 / 체크카드
- 계좌이체
- 가상계좌
- 휴대폰 소액결제
- 카카오페이 / 네이버페이 / 삼성페이

## 구현 예정 파일

| 파일 | 역할 | 상태 |
|------|------|------|
| `src/app/api/toss/checkout/route.ts` | 결제 플로우 시작 | 🚧 스켈레톤 |
| `src/app/api/toss/confirm/route.ts` | 결제 승인 처리 | 🚧 스켈레톤 |
| `src/app/api/toss/webhook/route.ts` | 이벤트 수신 | ❌ 미생성 |
| `src/app/settings/billing/toss/` | 국내 결제 UI | ❌ 미생성 |

## 글로벌/국내 결제 분기 전략

```
사용자 국가 감지 (IP 기반 또는 명시적 선택)
    │
    ├─ 해외 → Stripe (USD)
    └─ 국내 → Toss Payments (KRW)
```

예상 구현:
- `NEXT_PUBLIC_PAYMENT_REGION=global|kr` 환경변수
- `/pricing` 페이지에서 통화 선택 토글
- Webhook 통합: 양쪽 이벤트를 동일한 `subscriptions` 테이블로 수렴

## 연동 시 참고 API

- 빌링키 발급: `POST https://api.tosspayments.com/v1/billing/authorizations/issue`
- 결제 승인: `POST https://api.tosspayments.com/v1/payments/confirm`
- 구독 자동결제: `POST https://api.tosspayments.com/v1/billing/{billingKey}`
