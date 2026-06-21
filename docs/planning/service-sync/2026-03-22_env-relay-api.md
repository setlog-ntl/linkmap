# 기획 검토: 환경변수 중계(Relay) API 서비스 고도화

**검토일**: 2026-03-22
**상태**: 기각
**요청자 요약**: 사용자가 Linkmap에 등록한 환경변수(API 키)를 외부 서비스에서 Linkmap API를 통해 가져갈 수 있는 중계(Relay) 서비스로 고도화. "Linkmap 키 하나만 연결하면 모든 서비스가 자동 연결"되는 경험 제공.

---

## 1. 기능 개요

Linkmap에 등록된 환경변수(OpenAI, Stripe, Supabase 등의 API 키)를 **외부 런타임 환경에서 Linkmap API 토큰 하나로 pull** 할 수 있는 중계 서비스.

**동작 흐름 (구상)**:
1. 사용자가 Linkmap에 프로젝트별 환경변수 등록 (현재 기능)
2. Linkmap API 토큰 발급 (현재 기능 - `stl_` 접두사)
3. 외부 서비스(Vercel, Railway 등)에서 `LINKMAP_TOKEN` 하나만 설정
4. 애플리케이션 시작 시 Linkmap SDK/CLI가 환경변수를 fetch하여 주입
5. 런타임 중 환경변수가 변경되면 자동 반영 (선택적)

---

## 2. 현재 프로젝트 상태와의 관계

### 이미 존재하는 유사 기능
| 기능 | 파일 | 설명 |
|------|------|------|
| CLI `pull` | `packages/cli/src/index.ts` L117-138 | `linkmap pull <project-id>` → .env 파일 다운로드 |
| env download API | `src/app/api/env/download/route.ts` | 복호화된 .env를 text/plain으로 반환 |
| env raw API | `src/app/api/env/raw/route.ts` | JSON 형태로 복호화된 변수 반환 |
| API 토큰 시스템 | `src/app/api/tokens/route.ts` | `stl_` 접두사, SHA-256 해시 저장 |
| 암호화 모듈 | `src/lib/crypto/index.ts` | AES-256-GCM, 단일 ENCRYPTION_KEY |

### 핵심 발견: 기본 인프라는 이미 존재함
- CLI에서 `linkmap pull`로 .env 파일을 이미 가져올 수 있음
- `/api/env/raw`에서 JSON으로 복호화된 환경변수를 이미 반환함
- API 토큰 인증 시스템이 이미 구축됨

### 중계 서비스로 "고도화"하려면 추가 필요한 것
- 런타임 SDK (Node.js, Python 등)
- 스코프 기반 토큰 (프로젝트/환경별 제한)
- IP 화이트리스트
- 실시간 변경 감지/웹훅
- 고가용성 보장
- 법적/보안 검토

---

## 3. 4관점 분석

### 제품 전략가 관점 [2/5]

**시장 포지셔닝 문제 - 레드오션 진입**

기존 경쟁자들이 이미 성숙한 시장:

| 서비스 | 특징 | 가격 |
|--------|------|------|
| **Doppler** | 클라우드 네이티브, 40+ 통합, 자동 로테이션 | Free(3명), $21/user/월 |
| **Infisical** | 오픈소스, 셀프호스팅 가능, E2EE | Free, $8/user/월 |
| **HashiCorp Vault** | 동적 시크릿, PKI, 엔터프라이즈 표준 | 오픈소스/유료 |
| **1Password SDM** | 개발자 신뢰도 최상위 | $19.95/user/월 |
| **AWS Secrets Manager** | AWS 네이티브 통합 | $0.40/시크릿/월 |

**Linkmap의 차별화 요소 부재**:
- Doppler: 40+ 네이티브 통합 (Vercel, AWS, GCP, GitHub Actions 등) vs Linkmap: 0개
- Infisical: 오픈소스 + 셀프호스팅 + E2EE vs Linkmap: 클로즈드소스, 단일 암호화 키
- Vault: 동적 시크릿, 자동 로테이션, PKI vs Linkmap: 정적 저장만 지원

**타겟 사용자 모순**:
- Linkmap 타겟 = 바이브코더(코딩 경험 0~초보)
- 환경변수 중계 API 사용자 = SDK 통합 가능한 중급+ 개발자
- 바이브코더는 Vercel 환경변수 UI에 직접 복붙하는 것이 더 쉬움
- "Linkmap 키 하나만 연결하면 끝"이라는 가치 제안은 실제로는 "Linkmap SDK 설치 + 토큰 발급 + 환경변수 fetch 코드 작성"이 필요하여 오히려 복잡도 증가

**비즈니스 가치 평가**:
- 현재 사용자 규모에서 secrets relay는 수익 트리거가 되기 어려움
- Doppler Free(3명)로 충분한 소규모 팀이 Linkmap에 비용을 지불할 이유 없음
- 이 기능 때문에 Linkmap을 선택하는 사용자는 극소수일 것으로 예상

---

### 기술 아키텍트 관점 [2/5]

**구현 가능성은 있으나, 근본적 아키텍처 한계 존재**

**(1) 단일 ENCRYPTION_KEY 문제 (CRITICAL)**
```
현재: 모든 사용자의 환경변수가 하나의 ENCRYPTION_KEY로 암호화
문제: 이 키가 유출되면 전체 사용자의 모든 환경변수가 노출
경쟁사: Doppler - 테넌트별 키, Infisical - E2EE (사용자 키쌍), Vault - per-path 암호화
```
- `src/lib/crypto/index.ts`의 `getKey()` 함수가 `process.env.ENCRYPTION_KEY` 하나만 사용
- 중계 서비스로 전환하려면 **per-user 또는 per-project 암호화**가 필수
- 이는 기존 데이터 전체 마이그레이션 + 암호화 아키텍처 재설계를 의미

**(2) Cloudflare Workers 제약**
- CPU 시간 제한: Free Plan 10ms, Paid 30ms
- 환경변수 bulk 복호화 시 수십~수백 개 변수의 AES-256-GCM 복호화는 CPU 집약적
- Workers KV/Durable Objects 없이는 세션 관리, 캐싱 어려움
- WebSocket(실시간 변경 감지) 미지원 (Durable Objects 필요)

**(3) 토큰 스코프 부재**
- 현재 `api_tokens` 테이블에 스코프/권한 필드 없음 (L382-394 of db-schema.md)
- 토큰 하나로 해당 사용자의 **모든 프로젝트, 모든 환경변수** 접근 가능
- 중계 서비스에는 최소 project-scoped + environment-scoped 토큰 필요
- DB 스키마 변경: `api_tokens`에 `scopes JSONB`, `project_id UUID FK`, `environments TEXT[]` 추가 필요

**(4) 가용성 보장 불가**
- 현재 Cloudflare Workers Free Plan 사용
- SLA 없음 (503 에러 이력 존재 - `docs/workers-503-prefetch-resolution.md`)
- 중계 서비스는 외부 앱의 부팅에 직접 영향 → 99.9% 이상 가용성 필수
- Cloudflare Workers Paid Plan ($5/월) + 멀티 리전 배포 필요

**(5) 예상 변경 범위 (읽기 분석 기반)**
- `src/lib/crypto/index.ts` — per-project 키 파생 로직 추가
- `src/app/api/tokens/route.ts` — 스코프 기반 토큰 생성
- 새 API 라우트: `src/app/api/relay/` (환경변수 중계 전용)
- `environment_variables` 테이블 — 캐시 레이어 설계
- 새 테이블: `token_scopes`, `relay_access_logs`, `ip_allowlist`
- SDK 패키지: `packages/sdk-node/`, `packages/sdk-python/`
- 마이그레이션 3~5개 이상

---

### UX 디자이너 관점 [3/5]

**사용자 경험은 매력적이나 실현 복잡도가 높음**

**긍정적 측면**:
- "하나의 키로 모든 것을 관리"하는 메시지는 강력함
- 현재 CLI `linkmap pull`의 자연스러운 확장
- 대시보드에서 "어디서 내 키가 사용되고 있는지" 시각화 가능성

**부정적 측면**:
- 바이브코더가 SDK를 설치하고 코드에 통합하는 것은 현재 타겟과 불일치
- Vercel/Railway에서 "LINKMAP_TOKEN 하나만 설정"이라고 해도, 실제로는:
  1. Linkmap에서 토큰 발급
  2. 프로젝트에 SDK 설치 (`npm install @linkmap/sdk`)
  3. 앱 시작 시 환경변수 fetch 코드 추가
  4. Vercel/Railway에 LINKMAP_TOKEN 설정
  - → 직접 환경변수를 복붙하는 것보다 **단계가 더 많음**
- 기존 UI 패턴(Circuit Blue-Green v2)과의 통합보다는 독립 서비스 성격이 강함
- 설정 UI: 토큰 스코프, IP 화이트리스트, 환경 선택 등 새로운 설정 화면 다수 필요

**대안 UX 제안**:
- 중계 API보다 **Vercel/Railway 네이티브 통합** (GitHub App/OAuth 기반)이 바이브코더에게 더 적합
- "연결" 버튼 하나로 Vercel 프로젝트에 환경변수 자동 푸시하는 방식

---

### 리스크 매니저 관점 [1/5]

**이 기능의 리스크는 CRITICAL 수준이며 현재 상태에서 추진 불가**

**(1) "키의 키" 문제 (CRITICAL)**
- Linkmap 토큰이 유출되면 해당 사용자의 **모든** API 키(OpenAI, Stripe, Supabase 등)가 동시 노출
- 기존: `.env` 파일 유출 → 하나의 서비스 위험
- 중계 서비스: Linkmap 토큰 유출 → **모든 서비스 동시 위험**
- Blast radius가 기하급수적으로 증가
- 이는 OWASP에서 말하는 "키 집중화(Key Aggregation)" 위험의 전형적 사례

**(2) Single Point of Failure**
- Linkmap 서버 장애 → 모든 연결된 서비스의 앱이 부팅 불가
- 현재 Cloudflare Workers Free Plan으로는 SLA 보장 불가
- 503 에러 이력이 있는 인프라에서 다른 서비스의 핵심 의존성이 되는 것은 위험

**(3) 법적/약관 리스크**
- 제3자 API 키를 중계하는 행위의 법적 검토 필요:
  - OpenAI 이용약관: API 키 공유/재배포 관련 조항 확인 필요
  - Stripe: PCI DSS 관련 키 보관 의무 (Stripe은 키를 자사 대시보드에서만 관리하도록 권고)
  - AWS: 자격증명 관리에 대한 공유 책임 모델
- 데이터 사고 시 Linkmap의 법적 책임이 불명확
- 한국 개인정보보호법: API 키가 개인정보에 해당하는지 해석 필요

**(4) 보안 아키텍처 미달**
- 현재 보안 수준:
  - 단일 ENCRYPTION_KEY (전체 테넌트 공유)
  - 키 로테이션 절차 미수립 (SECURITY.md L47: "plan a migration or background job")
  - 토큰 스코프 없음
  - IP 제한 없음
  - MFA 미지원
- 시크릿 중계 서비스가 갖춰야 할 최소 보안 요건:
  - per-tenant 암호화 키
  - 자동 키 로테이션
  - 스코프 기반 접근 제어
  - IP 화이트리스트
  - MFA 필수
  - SOC 2 / ISO 27001 인증
  - 침해 시 자동 키 무효화

**(5) 백로그 우선순위 충돌**
- 현재 미완료 P1 백로그: Stripe 결제, 팀 RBAC UI, 알림, 소프트 삭제
- 중계 서비스 구현 예상 공수: 3~6개월 (1인 기준)
- 기존 백로그 전체를 밀어내는 규모

**(6) 성능/비용 리스크**
- 외부 앱이 부팅마다 Linkmap API를 호출하면 트래픽 폭증 가능
- Cloudflare Workers 무료 10만 req/일 한도 초과 가능성
- 과금 전환 시 비용 구조가 불확실

---

## 4. Q&A 기록

Q: (기획 어드바이저 → 요청자) 이 기능의 핵심 차별점은 무엇인가요? Doppler(Free 3명, 40+ 통합)나 Infisical(오픈소스, E2EE)와 비교했을 때 Linkmap을 선택해야 하는 이유는?
A: (요청자 답변 대기 - 검토 과정에서 자체 분석으로 판단)

Q: 바이브코더 타겟과 SDK 통합의 복잡성 사이의 모순을 어떻게 해결할 계획인가요?
A: (요청자 답변 대기)

**자체 분석 결론**: 요청자의 아이디어는 개념적으로 매력적이나, 현재 프로젝트 상태(보안 아키텍처, 인프라, 타겟 사용자)와의 괴리가 너무 큼.

---

## 5. 종합 권고

```
제품 전략가:   ** (2/5) — 레드오션, 차별점 부재, 타겟 사용자 불일치
기술 아키텍트:  ** (2/5) — 구현 가능하나 암호화 아키텍처 전면 재설계 필요
UX 디자이너:   *** (3/5) — 메시지는 매력적이나 실제 UX는 현재보다 복잡
리스크 매니저:  * (1/5) — "키의 키" 문제, SPOF, 법적 리스크, 보안 미달

종합: 2.0 → 기각 (보안 위험으로 자동 기각 적용)
```

**결론**: 기각

**핵심 근거 3가지**:

1. **보안 아키텍처 근본 미달**: 단일 ENCRYPTION_KEY, 토큰 스코프 없음, MFA 없음, 키 로테이션 미수립. 시크릿 중계 서비스의 최소 보안 요건(SOC 2 수준)에 현저히 미달. 이 상태에서 "다른 서비스의 키를 관리하는 서비스"를 운영하는 것은 사용자에게 거짓 안전감을 주는 위험한 행위.

2. **타겟 사용자 불일치**: 바이브코더(코딩 경험 0)에게 SDK 설치 + 토큰 관리 + fetch 코드 작성을 요구하는 것은 현재 "원클릭 배포"라는 핵심 가치와 정면 충돌. 실제로 .env 직접 복붙보다 단계가 늘어남.

3. **경쟁 우위 부재**: Doppler(40+ 통합, $0/3명), Infisical(오픈소스, E2EE), Vault(엔터프라이즈 표준)에 비해 Linkmap이 제공할 차별화 요소가 없음. 후발주자로서 이들을 이기려면 막대한 투자(SOC 2 인증, 통합 개발, 보안 감사)가 필요하나 현재 1인 프로젝트 규모에서는 비현실적.

---

## 6. 채택된 방향: 자동 동기화 (Push)

**상태**: 추진 결정 (2026-03-22)

중계(Pull) 대신 **Push 방식** 채택 — Linkmap에서 환경변수 변경 시 Vercel/Railway/Netlify에 자동 반영.

### 핵심 발견: GitHub Secrets 자동 동기화가 이미 완전 구현됨
| 기존 구현 | 파일 | 상태 |
|-----------|------|------|
| 자동 동기화 트리거 | `src/lib/github/auto-sync.ts` | ✅ 179줄 |
| 환경변수 CUD 시 트리거 | `src/app/api/env/route.ts` (3곳) | ✅ |
| NaCl 암호화 + GitHub API Push | `src/lib/github/nacl-encrypt.ts` | ✅ |
| 동기화 상태 DB | `project_github_repos` | ✅ |
| UI 패널 | `secrets-sync-panel.tsx` | ✅ 300줄 |

→ 이 패턴을 **어댑터 패턴**으로 범용화하면 Vercel/Railway/Netlify 확장 가능.

### 아키텍처: 어댑터 패턴
```
src/lib/sync/
  ├── types.ts              # SyncAdapter 인터페이스
  ├── trigger.ts            # 범용 triggerAllSync
  ├── adapter-registry.ts   # 어댑터 등록/조회
  ├── name-map.ts           # 플랫폼별 키 이름 매핑
  └── adapters/
      ├── github.ts         # 기존 auto-sync.ts 이동
      ├── vercel.ts         # Vercel REST API
      ├── railway.ts        # Railway GraphQL API
      └── netlify.ts        # Netlify REST API
```

### 트리거 흐름
```
환경변수 CUD
  → triggerAllSync()
  → project_sync_targets 조회 (auto_sync_enabled=true)
  → 각 타겟별 어댑터 선택
  → 환경변수 복호화
  → 플랫폼 API로 push
  → last_sync_* 상태 기록
  → logAudit()
```

### DB: `project_sync_targets` 신규 테이블
```sql
CREATE TABLE project_sync_targets (
  id UUID PK, project_id FK, user_id FK,
  platform TEXT CHECK (IN ('github','vercel','railway','netlify')),
  service_account_id FK,
  external_project_id TEXT NOT NULL,
  external_project_name TEXT,
  auto_sync_enabled BOOLEAN DEFAULT false,
  sync_environment TEXT DEFAULT 'production',
  target_environment TEXT,
  last_synced_at, last_sync_status, last_sync_error,
  UNIQUE(project_id, platform, external_project_id, sync_environment)
);
```

### 플랫폼별 API
| 플랫폼 | API | 환경변수 엔드포인트 | 인증 |
|--------|-----|-------------------|------|
| Vercel | REST | POST/PATCH/DELETE /v10/projects/{id}/env | Bearer Token |
| Railway | GraphQL | variableUpsert/variableDelete | Bearer Token |
| Netlify | REST | POST/PUT/DELETE /api/v1/accounts/{id}/env | Bearer Token |
| GitHub | REST+NaCl | PUT/DELETE Actions Secrets | OAuth Token |

### MVP 단계
- **Phase 1**: Vercel (타겟 사용자 최다 사용, REST API, 가장 단순)
- **Phase 2**: Netlify + Railway
- **Phase 3**: GitHub 통합 (기존 auto-sync를 새 구조로 마이그레이션)

### 보안 평가 (Push vs Pull)
| 항목 | Pull (기각) | Push (채택) |
|------|------------|------------|
| Linkmap 장애 시 | 외부 앱 부팅 불가 (SPOF) | 영향 없음 (이미 전달됨) |
| 키 노출 범위 | 상시 API 노출 | 전달 시점에만 |
| SDK 필요 | 필수 | 불필요 |
| 이용약관 | 중계 행위 리스크 | 공식 API 사용 (문제없음) |
| 보안 책임 | Linkmap에 집중 | 푸시 후 각 플랫폼이 관리 |

### UX 플로우 (바이브코더 기준)
1. 프로젝트 설정 → "동기화" 탭
2. "동기화 대상 추가" → 플랫폼 카드 선택 (Vercel/Railway/Netlify)
3. 토큰 입력 (이미 서비스 연결되어 있으면 자동 감지)
4. 플랫폼 프로젝트 선택 (API로 목록 → 드롭다운)
5. 환경 매핑 (Linkmap production → Vercel production)
6. "자동 동기화" 토글 ON
7. 이후 환경변수 변경 시 **자동 push**

---

## 7. 기각된 대안 기록

### 대안 B: ".env 자동 생성기" 강화
- CLI pull → CI/CD 빌드 시점 주입
- 이미 80% 구현됨, 향후 병행 가능

### 대안 C: 보안 강화 우선
- per-project 암호화, 토큰 스코프, MFA
- Push 기능과 독립적으로 진행 가능 (별도 스프린트)

---

## 부록: 참조 자료

- [Infisical - Best Secret Management Tools](https://infisical.com/blog/best-secret-management-tools)
- [Doppler - Vault vs Doppler 비교](https://www.doppler.com/blog/vault-vs-doppler-a-2025-secrets-management-face-off)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Vercel REST API - Environment Variables](https://vercel.com/docs/rest-api/endpoints/projects/envs)
- [Railway GraphQL API](https://docs.railway.app/reference/public-api)
- [Netlify API - Environment Variables](https://docs.netlify.com/api/get-started/)
