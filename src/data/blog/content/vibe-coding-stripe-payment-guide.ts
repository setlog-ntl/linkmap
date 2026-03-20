export const content = `> **KEY:** Stripe는 전 세계에서 가장 많이 쓰이는 결제 인프라입니다. 바이브코딩 프로젝트에 결제를 추가할 때는 Stripe Checkout부터 시작하고, Secret Key는 절대 클라이언트에 노출하지 않아야 합니다.

## Stripe 개요와 한국에서의 사용

[Stripe](https://stripe.com)는 200개 이상 국가에서 결제를 처리하는 인프라입니다. 개발자 경험이 뛰어나 바이브코딩과 궁합이 좋습니다.

한국에서 Stripe를 사용하려면 사업자등록이 필요합니다. 개인 사이드프로젝트로 시작할 때는 테스트 모드로 충분히 개발하고, 실결제는 사업자등록 후 전환하는 방식을 추천합니다.

> **INFO:** 한국 내 결제만 필요하다면 토스페이먼츠를 고려하세요. [결제 연동 가이드](/guides/payment)에서 Stripe과 토스페이먼츠를 모두 다룹니다.

## Stripe Checkout vs Payment Intent

초보자는 **Stripe Checkout**부터 시작하세요. Stripe가 결제 페이지를 제공하므로 UI를 직접 만들 필요가 없습니다.

| 방식 | 난이도 | 특징 |
|------|--------|------|
| Checkout | 쉬움 | Stripe 호스팅 결제 페이지, UI 불필요 |
| Payment Intent | 중급 | 커스텀 결제 UI, 세밀한 제어 |

AI에게 요청하는 프롬프트 예시:

\`\`\`
Next.js API 라우트로 Stripe Checkout 세션을 생성해줘.
- POST /api/checkout
- 가격: 월 9,900원 구독
- 성공 시 /success로, 취소 시 /pricing으로 리다이렉트
- Stripe Secret Key는 환경변수에서 가져오기
\`\`\`

## 테스트 모드로 안전하게 개발

Stripe 대시보드에서 "Test mode"를 켜면 실제 결제 없이 전체 흐름을 테스트할 수 있습니다. [테스트 카드 번호](https://docs.stripe.com/testing)를 사용하세요:

- 성공: \`4242 4242 4242 4242\`
- 실패: \`4000 0000 0000 0002\`
- 3D Secure: \`4000 0025 0000 3155\`

> **TIP:** 테스트 모드에서 모든 흐름(결제, 환불, 구독 갱신, 실패)을 검증한 후 실결제로 전환하세요. 실결제 전환은 API 키만 교체하면 됩니다.

---

## Webhook 설정 — 결제 완료 이벤트 처리

결제가 완료되면 Stripe가 서버에 알림을 보냅니다. 이것이 Webhook입니다. 구독 활성화, 이메일 발송 등의 후속 처리에 필수입니다.

AI에게 요청하는 방법:

\`\`\`
Stripe Webhook 핸들러를 만들어줘.
- POST /api/webhook/stripe
- 이벤트: checkout.session.completed
- Webhook Secret으로 시그니처 검증
- 검증 후 DB에 구독 상태 업데이트
\`\`\`

> **WARNING:** Stripe Secret Key와 Webhook Secret은 **절대 클라이언트에 노출하면 안 됩니다**. \`NEXT_PUBLIC_\` 접두사를 붙이면 브라우저에서 누구나 볼 수 있습니다. [.env 파일은 왜 위험한가](/blog/why-dotenv-is-dangerous)에서 상세히 다뤘습니다.

## 보안 주의사항 정리

- [x] \`STRIPE_SECRET_KEY\`는 서버 사이드(API 라우트)에서만 사용
- [x] \`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY\`만 클라이언트에 노출 (이건 공개용)
- [ ] Webhook 시그니처 검증 필수 (위조 방지)
- [ ] 가격을 클라이언트에서 받지 않기 (서버에서 결정)
- [ ] 환불/분쟁 처리 로직 구현

[환경변수 완전 정복 가이드](/guides/env)에서 API 키 관리법을, [보안 기초 가이드](/guides/security)에서 웹 보안 기초를 확인하세요.

[Linkmap](https://www.linkmap.biz)으로 Stripe API 키를 포함한 모든 서비스 환경변수를 AES-256-GCM 암호화로 관리할 수 있습니다. [서비스 카탈로그](https://www.linkmap.biz/services)에서 Stripe 포함 128개 서비스의 연결 방법을 확인하세요.

> **TRY:** 결제 기능을 추가한 후 [Linkmap 무료 가입](https://www.linkmap.biz/signup)으로 Stripe, Supabase, Vercel 등 모든 서비스의 API 키를 한 곳에서 안전하게 관리해보세요.

---

*결제 심화 설정은 [결제 연동 가이드](/guides/payment)를, 보안 점검은 [바이브코딩 보안 체크리스트](/blog/vibe-coding-security-checklist)를 참고하세요.*`;
