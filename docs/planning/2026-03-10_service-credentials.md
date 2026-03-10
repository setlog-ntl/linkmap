# 기획 검토: 서비스 ID/PW 관리 (Service Credentials)

**검토일**: 2026-03-10
**상태**: 구현 완료
**요청자 요약**: 사용자가 서비스(AWS, Vercel, Supabase 등)에서 사용하는 계정 정보(데모/관리자 계정의 ID/PW)를 암호화 저장하고 관리하는 기능 추가 요청.

---

## 1. 기능 개요

프로젝트에 연결된 외부 서비스의 **로그인 계정 정보(username/password)**를 안전하게 저장하고 조회하는 기능.

- 서비스별 복수 계정 지원 (데모 계정, 관리자 계정 등)
- "목적(purpose)" 필드로 계정 용도 구분
- AES-256-GCM 암호화 저장 + 마스킹 + 서버 전용 복호화
- 환경(dev/staging/prod)별 구분 가능

**핵심 사용 시나리오**:
- 팀원에게 데모 계정 공유 시 안전한 저장소 필요
- 여러 서비스의 관리자 계정을 프로젝트 단위로 정리
- 환경변수와 별도로 "사람이 로그인하는 계정 정보" 관리

---

## 2. 현재 프로젝트 상태와의 관계

### 기존 기능과의 관계

| 기존 시스템 | 관계 | 설명 |
|------------|------|------|
| `environment_variables` | 유사하나 다름 | 환경변수는 "앱이 사용하는 값", 계정 정보는 "사람이 로그인하는 값" |
| `service_accounts` | 보완 관계 | OAuth/API Key는 "머신 인증", ID/PW는 "사람 인증" |
| AES-256-GCM 암호화 | 재사용 가능 | `src/lib/crypto/index.ts`의 encrypt/decrypt 그대로 활용 |
| 감사 로그 | 재사용 가능 | `src/lib/audit.ts`의 logAudit 그대로 활용 |

### 관련 파일/코드 경로

```
암호화:      src/lib/crypto/index.ts (encrypt, decrypt)
감사 로그:   src/lib/audit.ts (logAudit)
env API:     src/app/api/env/route.ts (참고 패턴)
SA API:      src/app/api/service-accounts/route.ts (참고 패턴)
env UI:      src/components/env/env-data-table.tsx (참고 UI)
SA UI:       src/components/service-map/service-account-section.tsx
env 쿼리:    src/lib/queries/env-vars.ts
env 검증:    src/lib/validations/env.ts
DB 스키마:   docs/db-schema.md
```

### 중복 여부 판정

**중복 아님**. 환경변수(`DATABASE_URL=xxx`)와 계정 정보(`admin / p@ssword`)는 개념적으로 다른 데이터:
- 환경변수: key-value 쌍, 앱 런타임이 소비
- 계정 정보: username-password 쌍, 사람이 브라우저/CLI로 로그인에 사용
- service_accounts: OAuth 토큰/API Key, 자동화된 머신 인증

---

## 3. 4관점 분석

### 제품 전략가 관점 [4/5]

**긍정 요인**:
- Linkmap의 핵심 가치 제안("서비스 연결 관리")과 자연스럽게 연결됨
- 환경변수 + OAuth + API Key + ID/PW로 "서비스 인증 정보의 완전한 관리"라는 포지셔닝 강화
- 1인 개발자/소규모 팀이 실제로 겪는 페인포인트 (서비스마다 다른 계정을 스프레드시트나 노션에 저장)
- 유료 플랜 전환 트리거 가능 (credential 수 제한 → pro 업그레이드)
- 경쟁 차별화: 일반 패스워드 매니저(1Password, Bitwarden)와 다르게 "프로젝트-서비스 맥락" 내에서 관리

**부정 요인**:
- 본격적인 비밀번호 관리 도구(1Password, Vault)와의 경쟁 우려 — 다만 Linkmap은 "프로젝트 맥락 내 관리"라는 차별점이 있음
- 사용 빈도: 계정 정보는 한번 등록 후 가끔 조회하는 패턴 → DAU 기여도 낮을 수 있음

**결론**: 기존 가치 제안을 강화하는 자연스러운 확장. "서비스 연결의 모든 인증 정보를 한 곳에서"라는 완결성 확보.

---

### 기술 아키텍트 관점 [4/5]

**4가지 방안 비교**:

| 기준 | A. env_vars 확장 | B. service_accounts 확장 | C. 별도 테이블 | D. env_vars + 그룹화 |
|------|-----------------|------------------------|--------------|---------------------|
| 개념적 정합성 | 낮음 | 중간 | **높음** | 낮음 |
| 구현 난이도 | 낮음 | 중간 | 중간 | 높음 |
| 기존 코드 재사용 | 높음 | 중간 | 중간 | 높음 |
| DB 마이그레이션 | 컬럼 추가 | 컬럼 추가 | 테이블 신설 | 컬럼+테이블 추가 |
| UI 복잡도 증가 | 높음 (혼재) | 높음 (혼재) | **낮음** (분리) | 중간 |
| 향후 확장성 | 낮음 | 낮음 | **높음** | 낮음 |

**권장: 방안 C (별도 테이블 신설)**

근거:
1. **개념 분리**: 환경변수(앱 소비)와 계정 정보(사람 소비)는 다른 도메인. 한 테이블에 혼재하면 쿼리, UI, RLS 모두 복잡해짐
2. **service_accounts는 OAuth 특화**: 토큰 만료, 스코프, 프로바이더 등 OAuth 전용 필드가 많아 ID/PW와 맞지 않음
3. **깔끔한 RLS**: 새 테이블에 독립 RLS 정책 적용 → 기존 정책 수정 불필요
4. **쿼터 관리 용이**: `plan_quotas`에 `max_credentials_per_project` 추가로 독립 관리

**예상 테이블 구조** (service_credentials):

```
id              UUID PK
project_id      UUID FK → projects(id) ON DELETE CASCADE
service_id      UUID FK → services(id) (nullable, 서비스 미연결도 허용)
label           TEXT NOT NULL  -- "관리자 계정", "데모 계정"
encrypted_username  TEXT NOT NULL
encrypted_password  TEXT NOT NULL
purpose         TEXT  -- 'admin' | 'demo' | 'deploy' | 'monitoring' | 'other'
environment     TEXT  -- development | staging | production | all
website_url     TEXT  -- 로그인 페이지 URL (편의)
notes           TEXT  -- 추가 메모 (암호화 불필요)
last_used_at    TIMESTAMPTZ
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
```

**기술 적합성**:
- AES-256-GCM 암호화 인프라 그대로 재사용 (`src/lib/crypto`)
- API 패턴은 `src/app/api/env/route.ts`와 동일한 5단계 패턴
- Cloudflare Workers 제약 없음 (crypto 모듈 사용, 파일 시스템 미사용)
- RLS: `project_id` 기반 소유자+팀원 정책 (기존 env_vars RLS 패턴 복제)

**필요 작업 목록**:
- 마이그레이션: 1개 (테이블 + RLS + 인덱스)
- API: `src/app/api/credentials/route.ts` (CRUD + decrypt)
- Zod: `src/lib/validations/credentials.ts`
- 쿼리 훅: `src/lib/queries/credentials.ts`
- 타입: `src/types/credentials.ts`
- UI: 2~3개 컴포넌트 (테이블, 폼, 필터)
- 감사 로그: logAudit 재사용

**구현 복잡도**: 중간 (env_vars 패턴을 거의 그대로 복제, 2~3일 예상)

---

### UX 디자이너 관점 [4/5]

**네비게이션 IA**:
현재 프로젝트 페이지 탭 구조: `개요 | 서비스 | 환경변수 | 서비스맵 | 설정`

추천 위치 (2가지 옵션):

**옵션 1 (권장): 환경변수 페이지 내 탭 분리**
```
환경변수 페이지
├── [환경변수] 탭 (기존)
└── [계정 정보] 탭 (신규)
```
- 장점: 새 네비게이션 항목 불필요, "보안 정보" 맥락 유지
- 단점: 환경변수 페이지 역할 확장

**옵션 2: 별도 탭 추가**
```
개요 | 서비스 | 환경변수 | 계정 정보 | 서비스맵 | 설정
```
- 장점: 명확한 분리
- 단점: 탭 6개로 증가 (모바일에서 스크롤 필요)

**UI 패턴**:
- 기존 `env-data-table.tsx` 패턴 재사용 가능 (마스킹, Eye 토글, 복사)
- Circuit Blue-Green v2 디자인 시스템 유지
- shadcn/ui `Table`, `Dialog`, `Badge`, `DropdownMenu` 활용
- 비밀번호 강도 표시기는 불필요 (이미 존재하는 비밀번호를 저장하는 것이므로)

**인지 부하**:
- 환경변수와의 차이를 사용자에게 명확히 전달해야 함
- 빈 상태(Empty State) 메시지에 "환경변수와 다른 점" 안내 포함 권장
- 서비스맵에서 계정 정보 유무를 아이콘/배지로 표시하면 발견성 향상

**모바일**:
- 비밀번호 조회/복사는 모바일에서도 유용 → 반응형 필수
- 하지만 등록/수정은 데스크탑 중심으로도 무방

---

### 리스크 매니저 관점 [3/5]

**보안 리스크 (가장 중요)**:

1. **AES-256-GCM (양방향 암호화) 사용은 적절한가?**
   - **적절함**. 이 기능의 목적은 "사용자가 비밀번호를 다시 조회"하는 것이므로 단방향 해시(bcrypt)는 사용 불가
   - 환경변수와 동일한 보안 수준 (같은 ENCRYPTION_KEY 사용)
   - 단, **복호화된 비밀번호가 API 응답에 포함되는 경로를 최소화**해야 함 (전용 decrypt 엔드포인트, 감사 로그 필수)

2. **ENCRYPTION_KEY 단일 키 의존**:
   - 현재 환경변수와 동일한 키 사용 → 키 유출 시 모든 데이터 노출
   - 개선안: 키 로테이션 메커니즘 도입 (하지만 이는 기존 env_vars에도 해당하는 문제로, 이 기능만의 리스크는 아님)

3. **브루트포스/레이트 리밋**:
   - 복호화 API에 Cloudflare Rate Limiting 적용 필수
   - 기존 Cloudflare Rules로 커버 가능

**우선순위 충돌**:

현재 백로그와의 비교:
| 백로그 항목 | 우선순위 | 비교 |
|------------|---------|------|
| Stripe 결제 | P1 | 수익화 직결 → 더 높음 |
| 팀 RBAC | P1 | 협업 기반 → 더 높음 |
| 알림 시스템 | P1 | UX 완결성 → 비슷 |
| 서비스 ID/PW | **P2** | 기존 기능 확장 → 중간 |

**권장**: Stripe, 팀 RBAC 이후 진행 (P2 우선순위)

**기술 부채 리스크**:
- 새 테이블 1개, API 1세트 → 유지보수 부담 적음
- env_vars 패턴 복제이므로 학습 곡선 없음
- 롤백 용이: 테이블 DROP + 코드 revert로 완전 제거 가능

**데이터 일관성**:
- 프로젝트 삭제 시 CASCADE로 자동 정리 (FK 설계)
- 서비스 삭제 시 `service_id` nullable이므로 고아 데이터 가능 → SET NULL로 처리

---

## 4. Q&A 기록

요청이 충분히 구체적이었으므로, 잠재적 질문과 요청 내용 기반 추론 답변을 정리합니다.

Q: 계정 정보를 팀원과 공유할 수 있어야 하나요?
A: (추론) 현재 팀 기능이 개발 중이므로, 프로젝트 소유자만 접근 가능하게 시작하고, 팀 RBAC 완성 후 역할 기반 접근 추가.

Q: 서비스에 연결되지 않은 일반 계정 정보도 저장 가능해야 하나요?
A: (추론) `service_id` nullable 설계로 대응. 서비스 미연결 계정도 프로젝트 단위로 관리 가능.

Q: 비밀번호 자동 생성 기능이 필요한가요?
A: (추론) 초기 버전에서는 불필요. 기존 서비스에서 이미 발급된 비밀번호를 저장하는 것이 주 목적.

---

## 5. 종합 권고

```
제품 전략가:   ★★★★☆ (4/5) — 핵심 가치 제안 강화, 자연스러운 확장
기술 아키텍트:  ★★★★☆ (4/5) — 기존 인프라 재사용률 높음, 방안 C로 깔끔한 구현 가능
UX 디자이너:   ★★★★☆ (4/5) — 기존 UI 패턴 활용, 환경변수 탭 내 분리로 IA 부담 최소화
리스크 매니저:  ★★★☆☆ (3/5) — 보안상 무리 없으나, P1 백로그(Stripe/RBAC)보다 우선순위 낮음

종합: 3.75 / 5 → 조건부추진
```

**결론**: **조건부추진**

**근거**:
1. Linkmap의 "서비스 인증 정보 통합 관리" 포지셔닝을 완성하는 자연스러운 기능 확장
2. 기존 암호화/API/UI 패턴을 거의 그대로 복제할 수 있어 구현 비용이 낮음 (2~3일)
3. 다만 Stripe 결제, 팀 RBAC 등 P1 백로그가 수익화/협업에 더 직접적인 기여를 하므로, 이후 진행이 적절

**다음 단계** (추진 결정 시):
1. DB 마이그레이션 설계 (테이블 + RLS + 인덱스) → 마이그레이션 073번
2. API 구현: `src/app/api/credentials/` (CRUD + decrypt 엔드포인트)
3. UI 구현: 환경변수 페이지 내 탭 추가 방식
4. 쿼터 연동: `plan_quotas`에 `max_credentials_per_project` 추가
5. 테스트: API 단위 테스트 + 감사 로그 검증

---

## 6. 개선 방향 (조건부)

**즉시 추진 조건**:
- Stripe 결제 + 팀 RBAC 구현이 완료되었거나 병렬 진행 가능한 경우
- 또는 사용자 피드백에서 이 기능의 요청 빈도가 높은 경우

**향후 고도화 방향**:
- 팀 RBAC 완성 후: 역할별 접근 권한 (admin만 비밀번호 조회 가능)
- 비밀번호 만료 알림: `expires_at` 필드 추가 + 알림 시스템 연동
- 서비스맵 연동: 계정 정보 유무를 노드 배지로 표시
- CLI 연동: `packages/cli/`에서 credential 조회 명령 추가
- 2FA 정보 저장: TOTP secret 저장 (장기)

---

## 7. 관련 에이전트 추천

| 에이전트 | 용도 |
|---------|------|
| **benchmark** | 1Password/Bitwarden 등 경쟁 서비스의 개발자 credential 관리 UX 사례 조사 시 |
| **design-director** | 환경변수 탭 내 계정 정보 UI 상세 설계 시 |
| **service-domain-manager** | credential 기능과 연동할 서비스 카탈로그 메타데이터(로그인 URL 등) 추가 시 |

---

## 부록: 방안별 상세 비교

### 방안 A: env_vars 확장 (비권장)
- `var_type` 컬럼 추가 (`env_var` | `credential`)
- credential인 경우 key_name이 `*_USERNAME`, `*_PASSWORD` 패턴
- **문제**: 환경변수 리스트에 계정 정보가 혼재 → 필터링 복잡, 사용자 혼란
- **문제**: `is_secret`과 `var_type` 조합으로 조건 분기 증가

### 방안 B: service_accounts 확장 (비권장)
- `connection_type`에 `credentials` 추가
- `encrypted_username`, `encrypted_password` 컬럼 추가
- **문제**: service_accounts는 프로젝트 없이도 존재 가능(`project_id` nullable), credential은 반드시 프로젝트에 속해야 함
- **문제**: OAuth 전용 필드(scopes, provider_user_id, token_expires_at)와 혼재

### 방안 C: 별도 테이블 (권장)
- 위 본문 참조

### 방안 D: env_vars + 그룹화 (비권장)
- `credential_groups` 테이블 + env_vars에 `credential_group_id` FK
- **문제**: 가장 복잡한 구조, 2개 테이블 수정 + 조인 필요
- **문제**: 기존 env_vars API 전체에 영향
