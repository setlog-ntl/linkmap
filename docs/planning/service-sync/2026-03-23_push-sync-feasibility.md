# 기획 검토: 환경변수 자동 동기화 (Push 방식) - CTO/기획전문가 심층 타당성 분석

**검토일**: 2026-03-23
**상태**: 조건부추진
**선행 검토**: 2026-03-22 중계(Pull) 방식 기각 (2.0/5.0), Push 방식 보류
**요청자 요약**: Linkmap에서 환경변수 변경 시 Vercel/Railway/Netlify에 자동 Push하는 기능의 6가지 관점 심층 타당성 분석

---

## 1. 기능 개요

Linkmap에 등록된 환경변수가 변경(생성/수정/삭제)되면, 사용자가 연결해 둔 Vercel/Railway/Netlify 프로젝트에 해당 변수를 **자동으로 Push**하는 기능.

**핵심 차이 (Pull vs Push)**:
- Pull(기각됨): 외부 앱이 Linkmap에서 런타임에 fetch -- SPOF, SDK 필요
- Push(검토 대상): Linkmap이 플랫폼 API를 통해 밀어넣음 -- 전달 후 각 플랫폼이 관리

**기존 구현 기반**: `src/lib/github/auto-sync.ts` (179줄, GitHub Secrets Push 완전 구현)

---

## 2. 현재 프로젝트 상태와의 관계

### 기존 GitHub Push 동기화 (완전 구현)
| 구성 요소 | 파일 | 줄 수 |
|-----------|------|-------|
| 동기화 트리거 | `src/lib/github/auto-sync.ts` | 179 |
| NaCl 암호화 | `src/lib/github/nacl-encrypt.ts` | - |
| Secrets API | `src/lib/github/secrets.ts` | - |
| 키 이름 매핑 | `src/lib/github/auto-map.ts` | - |
| DB 상태 테이블 | `project_github_repos` | 22 columns |
| UI 패널 | `secrets-sync-panel.tsx` | ~300 |
| env CUD 트리거 | `src/app/api/env/route.ts` (3곳) | - |

### 관련 DB 테이블
| 테이블 | 역할 |
|--------|------|
| `service_accounts` | OAuth/API 토큰 암호화 저장 (AES-256-GCM) |
| `project_github_repos` | GitHub 동기화 대상/상태 관리 |
| `environment_variables` | 암호화된 환경변수 저장소 |
| `audit_logs` | 감사 로그 |

### 신규 필요 사항
| 항목 | 설명 |
|------|------|
| `project_sync_targets` 테이블 | 플랫폼별 동기화 대상 관리 (2022-03-22 설계 완료) |
| `src/lib/sync/` 디렉토리 | 어댑터 패턴 기반 동기화 모듈 |
| 플랫폼별 OAuth 연결 | Vercel/Railway/Netlify 토큰 수집 |

---

## 3. 6가지 관점 심층 분석

---

### 3-1. 기술적 실현 가능성 [4/5]

#### 플랫폼 API 안정성 평가

**Vercel REST API** (안정성: 높음)
- 엔드포인트: `POST /v10/projects/{id}/env` (생성), `PATCH /v9/projects/{id}/env/{envId}` (수정), `DELETE` (삭제)
- `upsert=true` 쿼리 파라미터로 생성/수정 통합 가능 -- 구현 단순화
- Bearer Token 인증, 잘 문서화된 REST API
- 환경별 타겟팅 지원 (Production/Preview/Development)
- 평가: **가장 안정적이고 단순한 API. MVP Phase 1에 최적.**

**Railway GraphQL API** (안정성: 중간)
- `variableUpsert` mutation으로 생성/수정 통합
- `skipDeploys: true` 옵션으로 배치 업데이트 후 수동 배포 트리거 가능
- GraphQL 스키마 변경 가능성 (breaking change 이력 존재)
- Service variable vs Shared variable 구분 필요
- 평가: **GraphQL 복잡도가 있으나 실현 가능. Phase 2 적합.**

**Netlify REST API** (안정성: 높음)
- `POST /api/v1/accounts/{account_id}/env` (생성), `PUT` (수정), `DELETE` (삭제)
- 환경별 스코프 지원 (Production/Deploy Preview/Branch deploy 등)
- 잘 문서화된 REST API
- 평가: **Vercel과 유사한 수준. Phase 2 적합.**

#### Cloudflare Workers 10ms CPU 제한

**결론: 문제 없음.**

- 환경변수 Push는 주로 I/O 작업 (외부 API 호출)
- Cloudflare Workers의 CPU 제한은 **순수 연산 시간**만 측정, I/O 대기 시간 제외
- 기존 GitHub auto-sync가 이미 동일한 패턴으로 동작 중이며 문제 없음
- AES-256-GCM 복호화 1건당 ~0.1ms, 환경변수 50개 복호화 ~5ms -- 10ms 내 충분
- 단, 동기화 대상이 다수(3개 이상 플랫폼 x 50개 변수)일 경우 순차 처리 필요

**위험 시나리오**:
- 환경변수 bulk 생성(10개 이상) + 3개 플랫폼 동시 동기화 시 전체 API 호출 30건 이상
- 비동기 처리(현재 GitHub 패턴과 동일)로 해결 가능하나, 응답 시간 증가
- 해결: `waitUntil()` 패턴으로 API 응답 후 백그라운드 동기화

#### 기존 GitHub 패턴 재활용 (80% 주장 검증)

**검증 결과: 70~75% 재활용 가능 (80%는 약간 과대)**

재활용 가능 (70%):
| 구성 요소 | 재활용 가능 여부 | 근거 |
|-----------|-----------------|------|
| `triggerAutoSync()` 전체 흐름 | 재활용 | 어댑터 인터페이스로 추상화 |
| 복호화 로직 (`decrypt()`) | 그대로 사용 | `src/lib/crypto/index.ts` |
| 에러 핸들링 (retry 1회) | 재활용 | 동일 패턴 |
| 동기화 상태 기록 패턴 | 재활용 | `last_synced_at`, `last_sync_status` |
| 감사 로그 패턴 | 재활용 | `logAudit()` |
| UI 패널 구조 | 60% 재활용 | `secrets-sync-panel.tsx` 확장 |

신규 구현 필요 (30%):
| 구성 요소 | 이유 |
|-----------|------|
| 플랫폼별 API 클라이언트 | Vercel REST / Railway GraphQL / Netlify REST 각각 구현 |
| NaCl 암호화 불필요 | GitHub만 NaCl 필요, 나머지는 plaintext API |
| 플랫폼별 프로젝트 선택 UI | API로 프로젝트 목록 조회 + 드롭다운 |
| OAuth 연결 흐름 | Vercel/Railway/Netlify OAuth 앱 등록 필요 |
| 환경 매핑 로직 | Linkmap environment → 플랫폼 environment 매핑 |

#### 에러 핸들링: 부분 실패 시 전략

**기존 패턴(GitHub auto-sync) 분석**:
- 현재: 실패 시 1회 재시도 → 실패 기록 → 전체 상태를 `partial`/`failed`로 마킹
- `AutoSyncResult` 인터페이스에 `failedSecrets` 배열로 개별 실패 추적
- 롤백 없음 (idempotent upsert 방식이므로 불필요)

**Push 동기화에서의 전략**:
- Vercel: `upsert=true`로 idempotent -- 재시도 안전
- Railway: `variableUpsert` mutation -- idempotent
- Netlify: PUT으로 upsert 가능 -- idempotent
- 결론: **롤백 불필요. 재시도 + 부분 실패 기록으로 충분.**
- 추가 고려: 플랫폼 장애 시 사용자에게 수동 재동기화 버튼 제공

---

### 3-2. 보안적 제약 [3/5]

#### 사용자 플랫폼 토큰 저장 리스크

**현재 보안 인프라**:
- `service_accounts` 테이블에서 이미 GitHub OAuth 토큰을 AES-256-GCM으로 암호화 저장 중
- `encrypted_access_token`, `encrypted_refresh_token` 필드 활용
- 동일 패턴으로 Vercel/Railway/Netlify 토큰 저장 가능

**리스크 평가**:
| 리스크 | 수준 | 대응 |
|--------|------|------|
| 단일 ENCRYPTION_KEY 유출 | HIGH | 기존 리스크와 동일 (새로운 리스크 아님) |
| 토큰 스코프 과잉 | MEDIUM | 최소 권한 스코프 요청으로 완화 |
| 토큰 유출 시 blast radius | MEDIUM | 환경변수 CRUD 권한만 요청 |
| 암호화 키 로테이션 미수립 | HIGH | Push 기능과 독립적 문제 (별도 해결 필요) |

**핵심 판단**: Push 동기화가 추가하는 **증분 리스크**는 제한적.
- 이미 GitHub 토큰을 동일 방식으로 저장/사용 중
- Vercel/Railway/Netlify 토큰 추가는 동일 보안 수준의 확장
- 단일 ENCRYPTION_KEY 문제는 기존 문제이며 이 기능과 독립적

#### 플랫폼 이용약관 허용 여부

| 플랫폼 | 제3자 토큰 관리 | 근거 |
|--------|----------------|------|
| Vercel | **허용** | Vercel Integration Marketplace에 Doppler, Infisical 등 동일 패턴 존재 |
| Railway | **허용** | API 토큰 발급이 공식 기능, 제3자 통합 허용 |
| Netlify | **허용** | Netlify Integration에 동일 패턴 다수 존재 |
| GitHub | **허용** (검증됨) | 이미 Linkmap에서 사용 중 |

**결론: 모든 플랫폼에서 허용. Doppler/Infisical이 이미 동일 패턴으로 운영 중.**

#### 토큰 스코프 관리 (최소 권한 원칙)

| 플랫폼 | 최소 필요 스코프 | 설명 |
|--------|-----------------|------|
| Vercel | 환경변수 읽기/쓰기 | Personal Access Token 또는 OAuth App |
| Railway | `variableUpsert` 권한 | API Token (프로젝트 스코프) |
| Netlify | `env:write` | Personal Access Token |

**구현 방안**:
- OAuth 앱 등록 시 최소 스코프만 요청
- 대안으로 Personal Access Token 직접 입력 (OAuth 앱 등록 없이 빠른 MVP)
- 토큰 입력 시 스코프 검증 API 호출로 권한 확인

#### AES-256-GCM 활용 가능성

**결론: 그대로 활용 가능.**
- `service_accounts.encrypted_access_token` 필드에 동일 방식으로 저장
- `decrypt()` 함수로 동기화 시점에 복호화
- 기존 `src/lib/crypto/index.ts` 변경 불필요

---

### 3-3. 시장 트렌드와 지속가능성 [3/5]

#### OIDC/Workload Identity Federation이 API 키를 완전 대체할 가능성

**2025-2026 현황**:
- GitHub Actions OIDC + Workload Identity Federation이 CI/CD에서 빠르게 확산
- GCP, AWS, Azure 모두 OIDC 기반 인증을 적극 지원
- "정적 API 키 대신 단기 토큰" 추세가 가속화

**Linkmap에 대한 영향**:
- OIDC는 주로 **인프라 인증** (CI/CD -> 클라우드)에 적용
- **애플리케이션 API 키** (OpenAI, Stripe, Supabase 등)는 여전히 정적 키 기반
- 5년 내 OpenAI/Stripe 등이 OIDC로 전환할 가능성: **낮음** (소규모 개발자 접근성 고려)
- **판단**: 환경변수 관리 수요는 5년 내 유지될 것. 다만 CI/CD 통합 부분은 OIDC로 일부 대체 가능.

#### 각 플랫폼의 자체 시크릿 관리 강화 추세

| 플랫폼 | 자체 솔루션 | 외부 통합 여부 |
|--------|------------|---------------|
| Vercel | 환경변수 UI + CLI, 시크릿 암호화 | Doppler/Infisical 통합 공식 지원 |
| Railway | 변수 UI + CLI + Shared Variables | 외부 통합 API 공개 |
| Netlify | 환경변수 UI + CLI + 스코프 | 외부 통합 API 공개 |

**판단**: 플랫폼들이 자체 관리를 강화하더라도, **다중 플랫폼 동기화** 니즈는 존재.
단일 플랫폼 사용자에게는 가치가 낮지만, 2개 이상 플랫폼 사용 시 가치 발생.

#### MCP 표준이 환경변수 관리 방식을 바꿀 가능성

**현황 (2025-2026)**:
- MCP(Model Context Protocol)에서 환경변수는 `env` 객체로 서버 프로세스에 주입
- MCP 서버 간 환경변수 격리가 보안 특성
- OWASP MCP Top 10에 "Token Mismanagement and Secret Exposure"가 1위

**Linkmap에 대한 영향**:
- MCP는 **AI 에이전트의 시크릿 관리** 문제를 부각시킴
- Linkmap MCP Server(`packages/mcp-server/`)가 이미 존재 -- 향후 MCP 시크릿 관리와 연계 가능
- 그러나 MCP가 Vercel/Railway 배포 환경의 환경변수 관리를 대체하지는 않음
- **판단**: MCP는 보완적 기회이지 위협이 아님

#### 5년 후 유효성

**결론: 조건부 유효.**
- 정적 API 키 기반 서비스(OpenAI, Stripe 등)가 존속하는 한 유효
- 다중 플랫폼 배포가 증가하는 추세 (Vercel + Railway + 셀프호스팅 등)
- 리스크: 플랫폼들이 자체 "multi-platform sync"를 제공하면 가치 감소
- 기회: 서비스맵 시각화 + 동기화 결합은 순수 sync 도구에 없는 차별점

---

### 3-4. 핵심가치 정렬 [3/5]

#### "바이브코더"가 다중 플랫폼 동기화 필요성

**현실적 분석**:
| 사용자 유형 | 동기화 필요성 | 비율 추정 |
|------------|-------------|----------|
| 바이브코더 (1층 진입) | **낮음** - 단일 플랫폼(Vercel)에 원클릭 배포 | 60% |
| 성장 중인 바이브코더 (1층→2층) | **중간** - 2번째 프로젝트, 다른 플랫폼 시도 | 25% |
| 소규모 개발자 (2층 성장) | **높음** - 다중 프로젝트, 다중 플랫폼 | 15% |

**핵심 인사이트**:
- 바이브코더 60%는 Vercel 원클릭 배포 후 환경변수를 "그냥 Vercel UI에서 직접 입력"
- Push 동기화가 빛나는 순간: "Linkmap에서 API 키를 바꿨는데 Vercel에도 자동으로 반영됨"
- 이 경험은 **2번째 프로젝트 이후**에 가치가 발생

#### 원클릭 배포 vs 수동 배포 비율 추정

| 경로 | 비율 | 동기화 가치 |
|------|------|-----------|
| 원클릭 배포 (Linkmap -> GitHub -> Vercel) | ~70% | 중간 (이미 GitHub Secrets 동기화됨) |
| 수동 배포 (기존 프로젝트 연결) | ~30% | **높음** (수동으로 환경변수 동기화 중) |

**판단**: 수동 배포 사용자(30%)에게 즉각적 가치. 원클릭 배포 사용자에게는 "반복 변경 시" 가치 발생.

#### 퍼널 위치

**2층(성장) 기능.**
- 1층 진입 유도 기능이 아님
- 2층에서 "Linkmap에 머무르게 하는" 리텐션 기능
- 서비스맵 + 환경변수 관리 + 동기화가 결합되면 **전환 비용(switching cost) 증가**
- Lock-in 효과: Linkmap에서 모든 환경변수를 관리하면 다른 도구로 이탈 어려움

---

### 3-5. 경쟁 우위 분석 [3/5]

#### Doppler/Infisical 대비 차별점

| 비교 항목 | Doppler | Infisical | Linkmap Push |
|-----------|---------|-----------|-------------|
| 통합 수 | 40+ | 50+ | 4 (GitHub+Vercel+Railway+Netlify) |
| 가격 | Free/3명, $21/user | Free, $8/user | Free (프로젝트 기반) |
| 셀프호스팅 | 불가 | 가능 | 불가 |
| E2EE | 아님 | 지원 | 아님 |
| SOC 2 | 인증 | 인증 | 미인증 |
| **서비스맵 시각화** | **없음** | **없음** | **있음** |
| **원클릭 배포** | **없음** | **없음** | **있음** |
| **서비스 카탈로그** | **없음** | **없음** | **85개** |
| 타겟 사용자 | 중급+ 개발자/팀 | 중급+ 개발자/팀 | **바이브코더~소규모 개발자** |

**차별화 핵심**:
Doppler/Infisical은 **시크릿 관리 전문 도구**. Linkmap은 **서비스 연결 관리 플랫폼**에 동기화가 부가된 형태.

경쟁이 아닌 보완:
- Doppler 사용자가 Linkmap을 쓸 이유: 서비스맵 시각화, 원클릭 배포
- Linkmap 사용자가 Doppler를 쓸 이유: 고급 시크릿 관리 (로테이션, SOC 2)
- Linkmap Push 동기화는 "Doppler 필요 없는 수준의 간단한 동기화"를 제공

#### 시각화 + 동기화 결합의 차별화 가치

**고유 가치 제안**:
1. 서비스맵에서 "Vercel 노드" 클릭 → 동기화 상태 확인 → 재동기화
2. 환경변수 변경 시 "어느 플랫폼에 반영되었는지" 시각적 피드백
3. "이 API 키가 어디에 배포되어 있는지" 한눈에 파악
4. 서비스 연결 + 환경변수 + 배포 동기화를 **하나의 맵**에서 관리

**평가**: 이 결합은 Doppler/Infisical에 없는 **유일한 차별점**이지만, 이것만으로 사용자를 끌어올 수 있는지는 불확실. 기존 Linkmap 사용자의 리텐션 강화에는 효과적.

---

### 3-6. MVP 접근 전략 [4/5]

#### Phase 1 (Vercel만) 단독 가치

**결론: 충분한 가치 제공 가능.**

근거:
1. Linkmap 원클릭 배포의 주요 대상이 Vercel (Next.js 프로젝트)
2. Vercel API가 가장 안정적이고 단순 (`upsert=true`)
3. 개발 공수 최소 (어댑터 1개 + 범용 인터페이스)
4. "Linkmap에서 API 키 바꾸면 Vercel에 자동 반영" -- 명확한 가치 메시지

#### 개발 공수 추정

**Phase 1 (Vercel Only) MVP**:
| 작업 | 예상 공수 |
|------|----------|
| `src/lib/sync/` 어댑터 인프라 | 2-3일 |
| Vercel 어댑터 구현 | 1-2일 |
| `project_sync_targets` 마이그레이션 | 0.5일 |
| 동기화 설정 UI | 2-3일 |
| env CUD 트리거 통합 | 0.5일 |
| 테스트 + 에러 핸들링 | 1-2일 |
| **합계** | **7-11일 (약 2주)** |

**Phase 2 추가 (Netlify + Railway)**:
| 작업 | 예상 공수 |
|------|----------|
| Netlify 어댑터 | 1-2일 |
| Railway 어댑터 (GraphQL) | 2-3일 |
| UI 확장 | 1일 |
| 테스트 | 1일 |
| **합계** | **5-7일 (약 1주)** |

**전체 예상: 2-3주** (1인 기준, 풀타임)

#### 더 작은 MVP: "원클릭 복사" 대안

**분석**:
| 대안 | 설명 | 공수 | 가치 |
|------|------|------|------|
| A: 자동 Push 동기화 | 환경변수 CUD 시 자동 반영 | 2주 | **높음** (자동화) |
| B: 수동 Push 버튼 | "Vercel에 동기화" 버튼 1회 클릭 | 1주 | **중간** (수동) |
| C: .env 복사 강화 | "Vercel용 포맷으로 복사" 버튼 | 2일 | **낮음** (복붙) |

**권장**: **대안 B (수동 Push 버튼)를 Phase 0으로 먼저 출시.**
- 자동 동기화보다 구현이 단순 (이벤트 트리거 불필요)
- 사용자가 명시적으로 "동기화" 버튼을 눌러 Push
- 사용자 반응 확인 후 자동 동기화로 업그레이드
- 공수: **3-5일**

---

## 4. Q&A 기록

Q: (기획 어드바이저) Push 동기화의 기술적 실현 가능성은 GitHub 패턴 재활용이 핵심입니다. 기존 auto-sync.ts의 어댑터 패턴 추상화에 동의하시나요?
A: (검토 요청에 포함) 어댑터 패턴 기반 설계는 2026-03-22 검토에서 이미 합의됨.

Q: (기획 어드바이저) 토큰 수집 방식으로 OAuth 앱 등록 vs Personal Access Token 직접 입력 중 어느 쪽을 선호하시나요?
A: (검토 요청에 미포함 -- MVP는 PAT 직접 입력으로 시작하는 것이 현실적)

Q: (기획 어드바이저) Phase 0 (수동 Push 버튼)를 먼저 출시하는 단계적 접근에 동의하시나요?
A: (사용자 답변 대기)

---

## 5. 종합 권고

```
항목 1 - 기술적 실현 가능성:  ★★★★☆ (4/5) — 기존 GitHub 패턴 70% 재활용, 플랫폼 API 안정적, Workers 제약 문제 없음
항목 2 - 보안적 제약:          ★★★☆☆ (3/5) — 증분 리스크 제한적이나, 기존 단일키 문제 미해결 상태에서 토큰 범위 확대
항목 3 - 시장 트렌드:          ★★★☆☆ (3/5) — 5년 내 유효하나, OIDC 확산과 플랫폼 자체 강화가 장기 리스크
항목 4 - 핵심가치 정렬:        ★★★☆☆ (3/5) — 2층 리텐션 기능, 1층 진입과는 무관. 타겟의 60%에겐 낮은 우선순위
항목 5 - 경쟁 우위:            ★★★☆☆ (3/5) — 시각화+동기화 결합은 유일하나, 단독으로 사용자 유치력은 약함
항목 6 - MVP 접근:            ★★★★☆ (4/5) — Phase 0(수동 Push) 3-5일로 가치 검증 가능, 리스크 최소

종합: 3.3/5.0 → 조건부추진
```

**결론**: 조건부추진

**핵심 근거 3가지**:

1. **기술적 토대가 이미 존재**: GitHub auto-sync 179줄이 완전 구현되어 있고, 어댑터 패턴으로 확장하는 것은 증분 개발. 2-3주(전체) 또는 3-5일(Phase 0)으로 실현 가능하며, Cloudflare Workers 제약도 문제 없음.

2. **증분 리스크가 수용 가능**: Push 방식은 Pull(기각됨)과 달리 SPOF가 아니고, 법적/약관 리스크도 없으며, 보안은 기존 GitHub 토큰 저장과 동일 수준. 새로운 보안 위험을 도입하지 않음.

3. **가치 검증이 저비용으로 가능**: Phase 0 (수동 Push 버튼)을 3-5일로 출시하여 사용자 반응을 확인한 뒤, 자동 동기화로 업그레이드하는 단계적 접근이 가능.

**추진 조건**:
1. Stripe 결제, 팀 RBAC 등 P1 백로그보다 우선순위가 낮음을 인정하고, P1 완료 후 또는 병행 가능한 시점에 착수
2. Phase 0 (수동 Push)부터 시작하여 사용자 반응 데이터 수집 후 자동화 결정
3. 토큰 수집은 MVP에서 PAT 직접 입력으로 시작 (OAuth 앱 등록은 Phase 2)

**다음 단계**:
1. P1 백로그와의 우선순위 조율 (Stripe 결제 > 팀 RBAC > Push 동기화)
2. Phase 0 (수동 Push 버튼) 스펙 확정
3. Vercel PAT 토큰 입력 + 프로젝트 선택 UI 설계

---

## 6. 개선 방향 (조건부 충족 시)

### 즉시 추진으로 전환되는 조건
1. P1 백로그(Stripe, 팀 RBAC) 중 1개 이상 완료
2. Phase 0 (수동 Push) 사용자 테스트에서 양호한 반응 (주 1회 이상 사용)
3. Vercel API 토큰 보안 감사 완료

### 보류로 전환되는 조건
1. Phase 0 출시 후 2주간 사용자 0명
2. Vercel/Railway가 자체 "다중 플랫폼 동기화" 기능 출시
3. 보안 감사에서 단일 ENCRYPTION_KEY 문제의 심각성이 재평가됨

---

## 7. 관련 에이전트 추천

| 후속 작업 | 추천 에이전트 | 용도 |
|-----------|-------------|------|
| Vercel/Doppler 기능 비교 | **benchmark** | 경쟁사 기능 상세 비교 분석 |
| 동기화 설정 UI 설계 | **design-director** | Circuit Blue-Green v2 기반 UI 상세 설계 |
| Vercel/Railway/Netlify 서비스 카탈로그 추가 | **service-domain-manager** | 서비스 카탈로그 데이터 업데이트 |
| Phase 0 구현 시작 시 | **코드 에이전트 (기본)** | 실제 코드 구현 |

---

## 부록: 참조 자료

### 플랫폼 API 문서
- [Vercel REST API - Environment Variables](https://docs.vercel.com/docs/rest-api/reference/endpoints/projects/create-one-or-more-environment-variables)
- [Railway - Manage Variables with Public API](https://docs.railway.com/guides/manage-variables)
- [Netlify - Environment Variables Overview](https://docs.netlify.com/build/environment-variables/overview/)

### 경쟁 분석
- [Doppler - Vercel Integration](https://docs.doppler.com/docs/vercel)
- [Doppler - Railway Integration](https://docs.doppler.com/docs/railway)
- [Infisical - Secret Syncs](https://infisical.com/docs/integrations/secret-syncs)
- [Infisical vs Doppler 2025](https://www.doppler.com/blog/infisical-doppler-secrets-management-comparison-2025)

### 시장 트렌드
- [GitHub Actions OIDC + Workload Identity Federation 2026](https://johal.in/github-actions-oidc-python-workload-identity-federation-2026/)
- [OWASP MCP Top 10 - Token Mismanagement](https://owasp.org/www-project-mcp-top-10/2025/MCP01-2025-Token-Mismanagement-and-Secret-Exposure)
- [Doppler - Secrets Management Tools 2025](https://www.doppler.com/blog/secrets-management-tools-2025)

### 프로젝트 내부 참조
- `src/lib/github/auto-sync.ts` -- 기존 GitHub Push 동기화 (179줄)
- `src/lib/github/secrets.ts` -- GitHub Secrets API 클라이언트
- `src/lib/crypto/index.ts` -- AES-256-GCM 암호화/복호화
- `docs/planning/service-sync/2026-03-22_env-relay-api.md` -- 선행 검토 (Pull 기각 + Push 설계)
