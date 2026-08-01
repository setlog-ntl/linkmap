# 원클릭 배포 × 사용자 개인 Supabase 연결 — 타당성 검토 (기획 단계)

- 작성: 2026-07-31 · **개정 v2 (2026-07-31): "수동 연결 제거" 전략 상세화** · 상태: **기획 검토 (구현 착수 아님)**
- 질문: ① 원클릭 배포에서 사용자 각자의 Supabase까지 연결하여 테이블 기반 동적 페이지를 제공할 수 있는가? ② 원클릭 컨셉에 맞게 **수동 연결 과정을 줄이거나 없앨 수 있는가?**

---

## 1. 결론 요약

| 질문 | 답 |
|---|---|
| 기술적으로 가능한가 | **가능** — GitHub Pages 정적 export 모델을 그대로 유지한 채 가능 (supabase-js CSR + anon key + RLS) |
| **수동 과정을 없앨 수 있는가** | **가능** — ① 기본값은 Linkmap 관리형 위젯(위젯 토글 1클릭, Supabase 계정 자체 불필요) ② "내 DB로 승격"은 Supabase OAuth 완전 자동 프로비저닝(클릭 3~4회, **복붙 0회**) ③ 수동 SQL 복붙은 폴백으로만 유지 |
| 심플함에 걸림돌인가 | **아니오 (v2 설계 기준)** — 사용자 최소 경험은 "위젯 켜기" 1클릭. 배포 위저드는 무변경 |
| 방향성과 충돌하는가 | **오히려 부합** — 관리형(1층, 즉시 가치) → 내 DB 승격(2층, 학습 이벤트)이 퍼널 그 자체 |

**핵심 원칙 (v2): "위젯은 1클릭으로 즉시 작동(관리형), '내 Supabase로 승격'은 원할 때 자동으로(OAuth), 복붙은 어디에도 없다."**

---

## 2. 기술 구조 — 왜 가능한가

### 2.1 현재 구조 (조사 결과, 2026-07-31 기준)

- 템플릿 = Next.js 15 소스 번들(TS 문자열 하드코딩) → 사용자 GitHub 레포에 단일 커밋 push → GitHub Actions `next build`(`output: 'export'`) → GitHub Pages 정적 호스팅
- 사용자 데이터는 전부 `src/lib/config.ts`에 빌드 타임 상수로 emit. **런타임 데이터 소스 없음**
- 외부 연동은 GA 스니펫(선택) 하나뿐. 폼/방명록/DB 연동 전무. `output: 'export'`라 서버 route handler 불가
- GitHub OAuth 토큰은 `service_accounts`에 AES-256-GCM 암호화 저장 — **동일 패턴을 Supabase 토큰에 재사용 가능**

### 2.2 확장 아키텍처 (정적 유지 + CSR)

```
[방문자 브라우저]
  GitHub Pages 정적 사이트 (지금과 동일)
      └─ 동적 모듈(방명록/문의폼/RSVP)
           ├─ [관리형]  fetch → Linkmap API (Workers) → Linkmap DB   ← 기본값
           └─ [승격 후] supabase-js → 사용자 개인 Supabase (anon key + RLS)
```

- anon key는 **RLS 전제 하에 공개 가능하도록 설계된 키** — `config.ts`에 평문 emit 가능 (Supabase 공식 모델)
- Supabase는 기본 모든 origin 허용, Linkmap API는 위젯 라우트만 CORS 개방 → GitHub Pages에서 호출 문제 없음
- 콘텐츠(레이아웃) 편집은 여전히 재배포(수 분)지만, **동적 데이터는 재배포 없이 즉시 반영**

---

## 3. 수동 과정 제거 전략 (v2 핵심)

### 3.1 수동 연결의 마찰 해부 — 무엇이 문제인가

v1의 "수동 연결(SQL 복붙 + 키 입력)"을 단계로 분해하면 **약 14단계**다:

| 구간 | 단계 수 | 내용 | 바이브코더 이탈 위험 |
|---|---|---|---|
| Supabase 가입 | ~5 | 사이트 이동, 가입, 이메일 인증, 로그인 | 높음 (외부 이탈 + 인증 대기) |
| 프로젝트 생성 | ~4 | 조직/이름/리전 선택, **DB 비밀번호 결정**, 프로비저닝 대기 ~2분 | 높음 (리전·비밀번호는 초보에게 낯선 결정) |
| 테이블 생성 | ~3 | SQL 복사, SQL Editor 이동, 붙여넣고 Run | 중간 (SQL 자체가 공포 요소) |
| 키 입력 | ~2 | URL·anon key 찾아 복사, Linkmap에 붙여넣기 | 중간 (어느 키인지 혼동 — service_role 오입력 사고 위험) |

원클릭 컨셉과 정면 충돌. → 아래 3개 전략으로 구간별 제거.

### 3.2 전략 A — Linkmap 관리형 위젯 (기본값, 진짜 1클릭)

**사용자 경험: 편집기에서 "방명록" 모듈 토글 ON → 재배포. 끝.** Supabase 계정·가입·복붙 전부 불필요 (0/14단계).

- 구현: Linkmap DB에 위젯 데이터 테이블(예: `site_widget_entries` — `deploy_id` 스코프, RLS, created_at) + 공개 위젯 API `GET/POST /api/oneclick/widget/[deployId]/entries`. 정적 사이트는 이 API를 fetch (해당 라우트만 CORS 개방)
- config emit은 위젯 endpoint URL만 — 키 노출 자체가 없음
- **스팸 통제가 오히려 강해짐**: 3안 중 유일하게 서버를 경유하므로 Cloudflare Rate Limiting Rules(기존 정책 그대로)로 통제 가능. BYO 직결 방식에선 불가능했던 것
- 플랜별 쿼터(엔트리 수/위젯 수)로 남용·비용 통제 — 기존 `quota.ts` 패턴 재사용, 유료 전환 포인트도 됨
- 트레이드오프: 데이터가 Linkmap에 있음(→ 3.3 승격으로 해소, "언제든 내 DB로 가져가기"가 오히려 신뢰 포인트), Workers 트래픽 부하(→ 리스크 §6-9), 신규 마이그레이션 필요

### 3.3 전략 B — Supabase OAuth 완전 자동 프로비저닝 ("내 DB로 승격")

**사용자 경험: [내 Supabase로 승격] 버튼 → Supabase 동의 화면 1클릭 → 대기(진행바) → 완료. 클릭 3~4회, 복붙 0회.**

자동화 시퀀스 (전부 Management API, 공식 지원):

| # | 단계 | API / 방법 | 제거되는 수동 |
|---|---|---|---|
| 1 | 가입/로그인 | OAuth 진입 시 Supabase가 처리 — **GitHub 소셜 로그인 유도** (원클릭 사용자는 GitHub 계정 보유가 전제이므로 이메일 인증 대기 없음) | 가입 5단계 → 클릭 1~2회 |
| 2 | 동의 | OAuth2 authorize (Linkmap을 Supabase OAuth App으로 등록) | — |
| 3 | 조직/프로젝트 확인 | `GET /v1/organizations`, `GET /v1/projects` — 기존 프로젝트 있으면 선택지 제시, 없으면 신규 | 조직 결정 |
| 4 | 프로젝트 생성 | `POST /v1/projects` — 이름 자동(사이트명 기반), 리전 자동(`ap-northeast-2`), **DB 비밀번호 자동 생성 후 1회 표시+보관 안내** | 프로젝트 생성 4단계 |
| 5 | 프로비저닝 대기 | 상태 폴링 ~2분 — 기존 `deploy-status.ts` 폴링 UX 패턴 재사용 (진행바) | 대기 중 이탈 방지 |
| 6 | 테이블+RLS 생성 | `POST /v1/projects/{ref}/database/query` — RLS 표준 SQL 자동 실행 후 `pg_policies` 조회로 활성 기계 검증 | SQL 복붙 3단계 |
| 7 | anon key 회수 | `GET /v1/projects/{ref}/api-keys` | 키 복붙 2단계 |
| 8 | (관리형에서 승격 시) 데이터 이전 | 기존 관리형 엔트리를 새 테이블로 insert | — |
| 9 | config emit → 재배포 | 기존 batch-update 파이프라인 그대로 | — |
| 10 | 토큰 파기 | 기본: 완료 즉시 파기. 선택: Health Check 연동 동의 시에만 암호화 보관 | 상시 강권한 보유 회피 |

- 남는 수동은 **"동의" 클릭뿐** — 이것은 제거가 불가능하고 제거해서도 안 되는 단계(사용자 계정 권한 위임)
- 사전작업: Supabase 조직 설정에서 OAuth App 등록, `service_accounts`에 `supabase` provider 추가(기존 암호화 패턴), **콜백 P0 수정 선결**

### 3.4 전략 C — 반자동 폴백 (수동 최소화)

OAuth를 거부하거나 실패한 사용자, 이미 자기 프로젝트를 쓰는 고급 사용자용 **폴백 전용** (기본 경로 아님):

- SQL 복붙 → **SQL Editor 프리필 딥링크**(`supabase.com/dashboard/project/_/sql/new` — Supabase 공식 quickstart들이 사용하는 패턴)로 "버튼 클릭 → Run 1클릭"으로 축소. 정확한 프리필 파라미터 사양은 구현 시 검증 필요
- 키 입력 → 프로젝트 URL 입력 시 anon key 위치로 바로 가는 딥링크 안내 + **service_role 키 오입력 감지·거부**(prefix 검사) 필수
- 14단계 → 약 6단계

### 3.5 전략 비교와 권장 조합

| | 사용자 클릭 | 복붙 | Supabase 계정 | 스팸 통제 | 데이터 소유 | 구현 난이도 |
|---|---|---|---|---|---|---|
| 수동 (v1안, 폐기) | ~14단계 | 3회 | 필요 | 불가 | 사용자 | 하 |
| **A 관리형 (기본)** | **1클릭** | 0회 | 불필요 | **강함 (CF rate limit)** | Linkmap (이전 가능) | 중 |
| **B OAuth 승격** | 3~4클릭 | **0회** | 필요 (GitHub로 즉시 가입) | DB 제약만 | **사용자** | 중상 |
| C 반자동 폴백 | ~6단계 | 1~2회 | 필요 | DB 제약만 | 사용자 | 하 |

**권장: A를 기본값으로 1층에 배치(원클릭 유지) + B를 "내 Supabase로 승격" 버튼으로 2층에 배치(학습 이벤트) + C는 B의 폴백.** 수동 복붙은 어떤 기본 경로에도 등장하지 않는다.

---

## 4. 현재 방향성과의 차이점

| 항목 | 현재 | 확장 후 (v2) |
|---|---|---|
| 필요 외부 계정 | GitHub 1개 | GitHub 1개 (관리형) / +Supabase (승격 선택 시) |
| 사이트 성격 | 순수 정적 | 정적 + 동적 위젯 (방명록·문의·RSVP) |
| 데이터 위치 | 레포 config.ts | + Linkmap DB(관리형) 또는 사용자 DB(승격) |
| 반영 속도 | 편집 → 재빌드 수 분 | 동적 데이터는 즉시 |
| 위젯 활성화 비용 | — | **1클릭 (모듈 토글)** |

**퍼널 관점**: 관리형→승격 구조가 코어 컨셉("배우다 보니 관리가 되어 있는")과 정확히 일치. 1층에서 마찰 0으로 방명록이 작동하고, "내 DB로 가져가기"가 바이브코더의 첫 자발적 인프라 학습 이벤트가 된다. 승격 시 서비스맵 노드·환경변수·Health Check가 자연 활성화.

**온보딩 마찰**: 기본 경로에서 Supabase 가입이 완전히 사라졌으므로 1층 진입률 영향 없음. 배포 위저드(3단계)는 여전히 무변경.

---

## 5. 사전작업

### 5.1 보안 선결 (P0 — 이 기능 이전에 반드시)
1. **OAuth 콜백 크로스계정 CSRF 수정** (`src/app/api/oauth/[provider]/callback/route.ts` — 2026-07-12 감사 P0, 미수정). Supabase provider가 같은 콜백을 타므로 수정 없이는 공격 표면 확대.
2. GitHub Secrets 경로 nacl 논스 버그 — 본 기획은 anon key 평문 emit + 관리형 endpoint emit이므로 Secrets 경로 회피 가능.

### 5.2 전략 A (관리형) 사전작업
1. 위젯 데이터 테이블 마이그레이션 (RLS + 정책 + created_at, deploy_id FK) + 플랜별 쿼터 설계 (`quota.ts` 패턴)
2. 공개 위젯 API (5단계 규칙 적용, 익명 POST는 Zod 검증 + honeypot + 글자수 제한) + 해당 라우트만 CORS 개방
3. Cloudflare Rate Limiting Rule 추가 (앱 코드 아님 — 기존 정책 준수)
4. 템플릿 측 동적 모듈 1종 (모듈 스키마·제너레이터·프리뷰 3중 구조 + `module-roundtrip.test.ts` 확장) — 후보: invitation 방명록/RSVP

### 5.3 전략 B (OAuth 승격) 사전작업
1. Supabase 조직 설정에서 OAuth App 등록 (redirect URI, 스코프 확인)
2. `service_accounts`에 `supabase` provider 추가 (AES-256-GCM 패턴 재사용) + 사용 후 파기 플로우
3. RLS 표준 SQL 템플릿 (위젯 유형별: 방명록 = 공개 read + 익명 insert / 문의폼 = insert만·read owner 한정 / RSVP = insert + 확인 코드 조회) + `pg_policies` 기계 검증
4. 프로비저닝 폴링 UX (기존 deploy-status 패턴), 관리형→승격 데이터 이전 로직
5. supabase-js 고정 버전 + lockfile 규칙 (`npm view` 검증), 또는 CDN 방식 검토

---

## 6. 고려사항 / 리스크

| # | 리스크 | 심각도 | 대응 |
|---|---|---|---|
| 1 | RLS 없는 테이블 + anon key = DB 전체 공개 | 높음 | RLS 포함 SQL만 자동 실행 + `pg_policies` 기계 검증. 임의 테이블 연결 기능 없음 |
| 2 | Management API 토큰 = 계정 전체 제어 권한 | 높음 (B) | 기본: 프로비저닝 완료 즉시 파기. Health Check 동의 시에만 암호화 보관 |
| 3 | 익명 insert 스팸 | 중간 | **관리형: Cloudflare rate limit (강함)** / 승격 후: 글자수·honeypot·DB 제약. Edge Function 배포는 비목표 |
| 4 | 무료 티어 프로젝트 자동 일시정지 → 위젯 깨짐 | 중간 | 위젯 우아한 실패(연결 실패 시 섹션 숨김) + Health Check 감지·알림 (2층 셀링 포인트) |
| 5 | **무료 조직 활성 프로젝트 2개 제한** | 중간 (B) | 프로비저닝 전 `GET /v1/projects`로 확인 → 기존 프로젝트 선택지 제시. 한도 초과 시 명확한 안내 |
| 6 | **DB 비밀번호 자동 생성의 전달 문제** | 중간 (B) | 생성 직후 1회 표시 + "Supabase 대시보드에서 재설정 가능" 안내. Linkmap은 저장하지 않음 |
| 7 | 사용자가 자기 DB에서 테이블 삭제·변경 | 중간 | 조용한 폴백 + "연결 재설정"(재프로비저닝) 버튼 — OAuth 재동의로 원클릭 복구 |
| 8 | 기존 편집·재배포 P1 결함 위 적층 | 중간 | 편집 경로 P1(멀티계정 토큰 오참조 등) 선정리 권장 |
| 9 | **관리형 위젯 API의 Workers 부하** (Free plan 503 이력) | 중간 (A) | 위젯 라우트 경량화 + GET 캐싱 + rate limit. 트래픽 급증 시 쿼터로 제어. `cpu_ms` 설정 확인 |
| 10 | 관리형→승격 데이터 이전 무결성 | 낮음 | 이전 후 건수 대조, 원본은 soft 보관 후 지연 삭제 |
| 11 | 문의폼 개인정보 책임 경계 | 낮음 | 관리형: Linkmap 보관정책 명시 / 승격 후: 사용자 소유·사용자 DB 명시 |

---

## 7. 단계별 로드맵 (v2, 검증 기준 포함)

| 단계 | 내용 | 검증 기준 |
|---|---|---|
| **Phase 0** | OAuth 콜백 P0 수정 (+ 편집 경로 P1) | 감사 항목 재현 테스트 통과 |
| **Phase 1** | **관리형 위젯 (전략 A)**: invitation 방명록/RSVP 모듈 + Linkmap 위젯 API + 쿼터 + CF rate limit | **위젯 토글 → 재배포만으로 방명록 작동 (Supabase 계정 없이, 1클릭)** · rate limit 동작 확인 · 기본 배포 플로우 무변경(기존 E2E 통과) |
| **Phase 2** | **OAuth 자동 승격 (전략 B)** + 반자동 폴백 (전략 C) | **승격 클릭 4회 이내·복붙 0회** · 자동 생성 테이블 RLS를 `pg_policies`로 기계 검증 · 관리형 데이터 이전 건수 일치 · 토큰 파기 확인 |
| **Phase 3** | 2층 퍼널 브릿지: 승격 시 서비스맵 노드·환경변수·Health Check 자동 연동 | supabase 노드 자동 생성 · 일시정지 감지 알림 작동 |

각 Phase는 독립 출시 가능. **Phase 1만으로 "원클릭 동적 위젯"이라는 사용자 가치가 완성**되고, Phase 2부터는 소유권·학습 가치가 추가된다.

---

## 8. 비목표 (이번 범위에서 하지 않는 것)

- 배포 위저드(3단계) 변경 — 위젯은 편집기(배포 후) 진입점에서만
- 수동 SQL 복붙을 기본 경로에 두는 것 (폴백으로만 존재)
- 사용자 Supabase에 Edge Function/서버 코드 배포
- 임의 테이블 연결 기능 — RLS 통제 불가
- 호스팅형(`/s/[slug]`) 발행 모델 전환 — 별도 설계 트랙(2026-06-18) 유지
- 사용자 사이트 자체의 회원제/로그인 — 복잡도 급증, 추후 별도 검토

---

*근거: 2026-07-31 코드베이스 구조 조사(oneclick API·generators·shared-template-files·github lib), 2026-07-12 원클릭 감사 메모리, Supabase 공식 통합 문서(OAuth2 Integration·Management API·quickstart SQL 프리필 딥링크).*
