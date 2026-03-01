# 결제 시스템 로드맵

## Phase 1 — Stripe 기반 결제 (완료)

- [x] Stripe Checkout 세션 생성 API
- [x] Webhook 처리 (checkout.session.completed, subscription.updated, subscription.deleted)
- [x] invoice.payment_failed 처리 + 이메일 알림
- [x] Customer Portal API
- [x] /pricing 페이지 업그레이드 버튼 연결
- [x] /settings/billing 구독 관리 페이지
- [x] SettingsNav 결제 링크 추가
- [x] useSubscription 훅 (TanStack Query)
- [x] past_due 경고 배너

## Phase 2 — Toss Payments 국내 결제 (예정)

- [ ] Toss 빌링키 발급 API 구현
- [ ] Toss 결제 승인 API 구현
- [ ] Toss Webhook 처리
- [ ] 글로벌/국내 결제 분기 로직
- [ ] KRW 가격 표시 (pricing 페이지 통화 토글)
- [ ] 자동 구독 갱신 스케줄러

## Phase 3 — 결제 고도화 (예정)

- [ ] 연간 구독 할인 (monthly/yearly 토글)
- [ ] 쿠폰 / 프로모션 코드 지원
- [ ] Invoice 이력 조회 UI
- [ ] 사용량 기반 과금 (usage-based billing)
- [ ] 팀 플랜 멤버별 시트 관리
- [ ] 결제 실패 자동 재시도 알림 고도화

## Phase 4 — 엔터프라이즈 (장기)

- [ ] 기업 청구서 발행 (세금계산서)
- [ ] 커스텀 엔터프라이즈 플랜 협상
- [ ] SSO + 결제 통합
