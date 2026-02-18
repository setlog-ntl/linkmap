# Cloudflare Workers 마이그레이션 가이드

> Vercel → Cloudflare Workers 배포 전환 문서
> 작성일: 2026-02-18
> 상태: 배포 완료 (https://linkmap.cdhrich.workers.dev)
>
> **처음 연결만 하려면** → [2.5 처음 연결 단계](#25-처음-연결-단계-vercel--cloudflare)  
> **Namecheap linkmap.biz 도메인 설정** → [8. Namecheap linkmap.biz → Cloudflare 도메인 설정](#8-namecheap-linkmapbiz--cloudflare-도메인-설정)

---

## 1. 개요

Linkmap 서비스를 Vercel에서 Cloudflare Workers로 이전합니다.
Next.js 16.1.6 앱을 `@opennextjs/cloudflare` 어댑터를 통해 Workers에서 실행합니다.

### 현재 스택
- **Framework**: Next.js 16.1.6 (App Router)
- **Deploy**: Vercel (https://www.linkmap.biz)
- **DB/Auth**: Supabase
- **Encryption**: AES-256-GCM (Node.js crypto)
- **Rate Limit**: In-memory Map (서버리스 비호환)
- **Logger**: Pino
- **Monitoring**: Sentry

---

## 2. 호환성 분석

### BLOCKER (반드시 수정)

| 항목 | 파일 | 문제 | 해결 방법 |
|------|------|------|----------|
| In-Memory Rate Limit | `src/lib/rate-limit.ts` | Workers는 stateless — Map 상태 유지 불가 | **해결: 코드 제거, Cloudflare Rate Limiting Rules 사용** |
| Node.js `crypto` | `src/lib/crypto/index.ts` | `createCipheriv` 등 Node.js 전용 | `nodejs_compat` 플래그로 해결 가능 |

### WARNING (조정 필요)

| 항목 | 파일 | 문제 | 해결 방법 |
|------|------|------|----------|
| Pino Logger | `src/lib/logger.ts` | `pino/file` transport Workers 미지원 | 프로덕션에서 transport 제거 |
| Sentry | `src/instrumentation.ts` | `NEXT_RUNTIME` 감지 로직 | edge config 분기 조정 |
| Image Optimization | `next.config.ts` | Vercel Image API 의존 | Cloudflare Images 또는 `unoptimized` |

### 호환 (수정 불필요)

- Supabase 클라이언트/서버 (`@supabase/ssr`)
- React Flow (`@xyflow/react`) — client-only, `ssr: false`
- TanStack Query, Zustand, Zod — 클라이언트/런타임 무관
- next-themes, framer-motion, shadcn/ui — 클라이언트 전용
- Tailwind CSS — 빌드 타임

---

## 2.5 처음 연결 단계 (Vercel → Cloudflare)

배포 플랫폼만 바꾸는 **최소 연결** 순서입니다. (Rate limit/Logger 등 호환 작업은 이후 단계에서 진행.)

### ① Cloudflare 계정 준비

1. **Cloudflare 가입/로그인**  
   https://dash.cloudflare.com
2. **Workers & Pages 활성화**  
   왼쪽 메뉴 **Workers & Pages** 이동.
3. **workers.dev 서브도메인 설정 (필수)**  
   - **Workers & Pages** 화면에서 **“Your subdomain”** 또는 **“Change”** 클릭  
   - `linkmap`(또는 원하는 이름) 입력 후 저장 → `linkmap.workers.dev` 사용 가능  
   - 이걸 하지 않으면 Git 연결 배포 시 404 / “An unknown error” 발생

### ② 로컬에서 Wrangler 로그인

```bash
npx wrangler login
```

브라우저가 열리면 Cloudflare 계정으로 로그인해 권한 부여.

### ③ 프로젝트 설정 확인 (이미 되어 있음)

| 항목 | 상태 |
|------|------|
| `@opennextjs/cloudflare` | ✅ package.json |
| `wrangler.jsonc` | ✅ 있음 |
| `open-next.config.ts` | ✅ 있음 |
| `build:cf`, `preview:cf`, `deploy:cf` | ✅ package.json 스크립트 |

### ④ 첫 빌드 (Cloudflare용)

```bash
npm run build:cf
```

실패 시: BLOCKER(WARNING) 항목(예: rate-limit, logger) 수정 후 다시 시도.  
성공 시 `.open-next/` 폴더가 생성됨.

### ⑤ 첫 배포

```bash
npx wrangler deploy
```

- 배포 성공 시 `https://linkmap.<계정서브도메인>.workers.dev` 형태 URL이 부여됨.
- **환경변수**는 아직 없어도 앱이 뜨고, 로그인/API 등은 다음 단계에서 시크릿 설정 후 동작 확인.

### ⑥ 환경변수 이전 (필수만 먼저)

Vercel에 있던 값을 Cloudflare 시크릿으로 옮깁니다. 한 번에 하나씩:

```bash
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put ENCRYPTION_KEY
# 필요 시 4장 목록대로 추가
```

입력 시 Vercel 프로젝트 설정 또는 `.env.local`에서 값을 복사해 붙여넣기.

### ⑦ (선택) 커스텀 도메인

- **지금은 Vercel에서 www.linkmap.biz 서비스 중**이면, 도메인 전환은 트래픽 끊김 없이 할 때 별도 진행.
- 나중에 전환 시: Cloudflare **Workers & Pages** → 해당 Worker → **Settings** → **Domains & Routes**에서 `www.linkmap.biz` 추가 후, DNS에서 Vercel 대신 Cloudflare로 가리키면 됨.

### ⚠ Git 연결(GitHub)로 배포하는 경우 — 빌드 명령 필수 변경

Cloudflare **Workers & Pages**에서 GitHub 저장소를 연결해 배포할 때, **기본 빌드 명령(`npm run build`)을 그대로 쓰면 배포가 실패합니다.**

| 단계 | 기본값 (잘못됨) | 올바른 값 |
|------|-----------------|-----------|
| **Build command** | `npm run build` | **`npm run build:cf`** |
| Deploy command | `npx wrangler deploy` | `npx wrangler deploy` (그대로) |

**이유:**  
- `npm run build` → 일반 Next.js 빌드만 수행 → `.next/`만 생성됨.  
- `wrangler.jsonc`는 **`.open-next/worker.js`** 와 **`.open-next/assets`** 를 참조함.  
- `.open-next/`는 **`npm run build:cf`** (`@opennextjs/cloudflare build`)를 실행해야만 생성됨.  
- 따라서 빌드 명령을 `npm run build:cf`로 바꿔야 `wrangler deploy` 시 "Missing entry-point" 오류가 사라짐.

**설정 방법:**  

**⚠️ 먼저 필수 파일 커밋 (중요!):**  
Cloudflare는 Git 저장소를 클론하므로, 다음 파일들이 **반드시 커밋되어 있어야** 빌드 환경에서 사용 가능합니다:

```bash
git add package.json wrangler.jsonc open-next.config.ts
git commit -m "feat: Cloudflare Workers 배포 설정 추가"
git push origin main
```

커밋해야 할 파일:
- `package.json` — `build:cf`, `preview:cf`, `deploy:cf` 스크립트 및 `@opennextjs/cloudflare`, `wrangler` 의존성
- `wrangler.jsonc` — Workers 설정 파일
- `open-next.config.ts` — OpenNext Cloudflare 어댑터 설정

**이후 대시보드 설정:**  
1. Cloudflare 대시보드 → **Workers & Pages** → 해당 프로젝트(linkmap)  
2. **Settings** → **Builds & deployments** (또는 Build configuration)  
3. **Build command**를 `npm run build:cf`로 변경 후 저장  
4. **Retry deployment** 또는 새 커밋 푸시 후 자동 재배포

---

**처음 연결 요약:**  
① 대시보드에서 workers.dev 서브도메인 설정 → ② `npx wrangler login` → ③ `npm run build:cf` → ④ `npx wrangler deploy` → ⑤ 시크릿 설정.  
이후 Rate limit / Logger / Sentry 등은 아래 마이그레이션 단계대로 진행.

---

## 3. 마이그레이션 단계

### 단계 1: Cloudflare 프로젝트 설정 ✅
- [x] `@opennextjs/cloudflare` 설치
- [x] `wrangler.jsonc` 생성
- [x] `open-next.config.ts` 생성
- [x] `package.json` 스크립트 추가 (`build:cf`, `preview:cf`, `deploy:cf`)

### 단계 2: Rate Limiter → Cloudflare Rate Limiting Rules ✅
- [x] 앱 코드에서 rate limiting 로직 완전 제거 (28개 API route)
- [x] `src/lib/rate-limit.ts` 삭제
- [x] `@upstash/ratelimit`, `@upstash/redis` 패키지 불필요 (미사용)
- [x] 테스트 파일 4개 rate-limit mock 및 429 테스트 케이스 제거
- [x] 46개 테스트 전부 통과 확인
- [ ] Cloudflare 대시보드에서 Rate Limiting Rules 설정 (배포 후)

### 단계 3: Crypto 호환성 확인 ✅
- [x] `wrangler.jsonc`에 `nodejs_compat` 플래그 설정 완료
- [x] `createCipheriv`, `createDecipheriv`, `randomBytes` — `nodejs_compat`에서 지원 확인
- [x] 코드 변경 불필요 (주석만 업데이트)

### 단계 4: Logger 호환 처리 ✅
- [x] Pino `pino/file` transport — 프로덕션에서는 이미 비활성화 상태 확인
- [x] `process.stdout` 존재 여부 체크 가드 추가

### 단계 5: Sentry 제거 ✅
- [x] `@sentry/nextjs` 패키지 완전 제거 (번들 17MB → 8.5MB, gzip 1.97MB)
- [x] `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` 삭제
- [x] `instrumentation.ts` — Sentry import 제거, logger 기반 에러 추적만 유지
- [x] `error.tsx` — `Sentry.captureException` → `console.error` 변경
- [x] `next.config.ts` — `withSentryConfig` 래퍼 제거

### 단계 6: 빌드 테스트 및 배포 ✅
- [x] TypeScript 타입 체크 통과
- [x] 46개 테스트 전부 통과
- [x] GitHub Actions 배포 워크플로우 추가 (`.github/workflows/deploy-cloudflare.yml`)
- [x] `next build --webpack` 플래그로 Windows NTFS 콜론 파일명 우회
- [x] 환경변수 6개 설정 (`wrangler secret put`)
- [x] `npx wrangler deploy` 배포 성공 → https://linkmap.cdhrich.workers.dev
- [ ] GitHub Actions secrets 설정 (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)
- [ ] 도메인 연결 (`www.linkmap.biz`)
- [ ] Cloudflare Rate Limiting Rules 대시보드 설정

---

## 4. 환경변수 이전 목록

```bash
# Supabase
wrangler secret put NEXT_PUBLIC_SUPABASE_URL
wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY

# Encryption
wrangler secret put ENCRYPTION_KEY

# GitHub OAuth
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET

# Stripe (필요 시)
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET

# Sentry: 제거됨 (불필요)
# Rate Limiting: Cloudflare 대시보드에서 설정 (환경변수 불필요)
```

---

## 5. 진행 기록

### 2026-02-18 — 분석 및 계획 수립
- 프로젝트 전체 호환성 분석 완료
- BLOCKER 2건, WARNING 3건 식별
- 6단계 마이그레이션 계획 수립
- 마이그레이션 문서 작성

### 2026-02-18 — 코드 마이그레이션 및 배포 완료
- 단계 1~6 전부 완료
- Rate Limiter: 앱 코드에서 완전 제거 → Cloudflare Rate Limiting Rules로 대체
  - `src/lib/rate-limit.ts` 삭제, 28개 API route에서 import/호출 제거
  - 4개 테스트 파일에서 rate-limit mock 및 429 테스트 케이스 제거
- Crypto: `nodejs_compat` 플래그로 해결 (코드 변경 불필요)
- Logger: `process.stdout` 가드 추가
- Sentry(`@sentry/nextjs`) 완전 제거 — 번들 17MB → 8.5MB, gzip 1.97MB
- `next build --webpack` 플래그로 Windows NTFS 콜론 파일명 우회
- GitHub Actions `deploy-cloudflare.yml` 워크플로우 추가
- 환경변수 6개 `wrangler secret put`으로 설정 완료
- **배포 성공**: https://linkmap.cdhrich.workers.dev

---

## 6. Cloudflare 대시보드 설정 가이드

### Workers 프로젝트 생성
1. https://dash.cloudflare.com → Workers & Pages
2. "Create" → 프로젝트명: `linkmap`
3. Git 연결 또는 Direct Upload 선택

### 도메인 연결
상세 절차는 **[8. Namecheap linkmap.biz → Cloudflare 도메인 설정](#8-namecheap-linkmapbiz--cloudflare-도메인-설정)** 참고.

### 환경변수
- Workers & Pages → Settings → Variables
- 또는 CLI: `npx wrangler secret put <KEY>`

---

## 7. 대시보드 배포 오류 해결

Git 연결 후 "Set up your application"에서 **Deploy** 시 아래 오류가 나는 경우 대응 방법입니다.

### 발생한 오류 요약

| 증상 | HTTP | 의미 |
|------|------|------|
| `.../workers/subdomain` | 404 | 계정에 Workers 서브도메인(workers.dev)이 아직 설정되지 않음 |
| `.../workers/scripts/linkmap/settings` | 404 | 스크립트가 아직 없음(생성 중이므로 정상) |
| `.../workers/services/.../production` | 403 | 권한 부족 또는 플랜/리소스 제한 |
| `D2W: stub worker creation failed` | — | 내부적으로 Worker 생성 실패(위 404/403의 결과) |
| `D2W: resource provisioning failed` | — | 리소스 프로비저닝 실패 |
| `An unknown error occurred` | — | 대시보드가 위 오류를 사용자에게 포괄 메시지로 표시 |

### 1) Workers 서브도메인 404 해결 (우선 수행)

**원인:** 해당 계정에서 Workers를 한 번도 쓰지 않았거나, `*.workers.dev` 서브도메인을 아직 “claim”하지 않은 상태입니다. 대시보드 Git 배포는 이 정보가 있어야 진행됩니다.

**조치:**

1. **대시보드에서 서브도메인 설정**
   - https://dash.cloudflare.com → **Workers & Pages**
   - 상단/설정 근처에 **“Your subdomain”** 또는 **“Change”** 링크가 있으면 클릭
   - `[원하는이름].workers.dev` 형태로 서브도메인을 **한 번 저장(claim)**  
     (예: `linkmap` → `linkmap.workers.dev`)
2. 저장 후 **Workers & Pages**로 돌아가서 다시 **Create** → **Connect to Git** → linkmap 저장소 연결 → **Set up your application**에서 **Deploy** 재시도

서브도메인을 claim하기 전에는 `/workers/subdomain` API가 404를 반환할 수 있고, 이때 대시보드 배포가 “An unknown error” / D2W 오류로 실패합니다.

### 2) 403 권한 오류 해결

**원인:** 계정 역할/권한 제한, 또는 조직(Organization) 정책으로 Workers API 접근이 막혀 있을 수 있습니다.

**조치:**

- **본인 계정 소유인지 확인**  
  조직에 속한 계정이면, 관리자에게 **Workers 및 Pages** 권한이 있는지 확인
- **브라우저 로그인 상태**  
  쿠키/시크릿 모드, 다른 계정으로 로그인된 탭이면 로그아웃 후 올바른 계정으로 재로그인
- **다른 브라우저/기기**에서 한 번 시도해 보기 (캐시/확장 프로그램 영향 제거)

### 3) 대시보드 대신 Wrangler CLI로 배포 (권장)

Git 연결 + 대시보드 빌드 대신, **로컬/CI에서 빌드 후 Wrangler로 배포**하면 위 API( subdomain/settings/services ) 호출 순서나 대시보드 제한을 피할 수 있습니다. OpenNext + Cloudflare 구성은 이미 되어 있으므로 다음만 수행하면 됩니다.

1. **서브도메인은 위 1)처럼 대시보드에서 한 번만 claim**
2. **로컬에서 빌드 및 배포:**

   ```bash
   npm run build:cf
   npx wrangler deploy
   ```

3. **환경변수/시크릿**은 `wrangler secret put ...` 또는 대시보드 Workers & Pages → 해당 Worker → Settings → Variables에서 설정

이렇게 하면 “Set up your application” 단계의 404/403/D2W 오류 없이 배포할 수 있습니다.

### 4) 정리

- **404 (subdomain)** → Workers & Pages에서 **workers.dev 서브도메인을 한 번 설정(claim)** 한 뒤 재배포
- **403** → 계정/조직 권한 및 로그인 계정 확인
- **D2W / An unknown error** → 위 404·403 해결 후 재시도하거나, **Wrangler CLI 배포**로 우회

---

## 8. Namecheap linkmap.biz → Cloudflare 도메인 설정

Namecheap에 등록한 **linkmap.biz**를 Cloudflare DNS로 이전한 뒤, Workers에 커스텀 도메인(`linkmap.biz`, `www.linkmap.biz`)을 연결하는 방법입니다.

### 전체 흐름 요약

| 단계 | 위치 | 내용 |
|------|------|------|
| 1 | Cloudflare | linkmap.biz 사이트 추가 → 네임서버 발급 |
| 2 | Namecheap | 도메인 네임서버를 Cloudflare 네임서버로 변경 |
| 3 | Cloudflare | Worker에 Custom Domain 연결 (linkmap.biz, www.linkmap.biz) |

---

### 1단계: Cloudflare에 linkmap.biz 사이트 추가

1. **Cloudflare 대시보드** 접속  
   https://dash.cloudflare.com
2. **Add a site** (사이트 추가) 클릭
3. **도메인 입력:** `linkmap.biz` 입력 후 **Add site**
4. **플랜 선택:** Free 플랜 선택 후 **Continue**
5. **DNS 레코드 스캔**  
   - 기존에 사용 중인 레코드가 있으면 표시됨  
   - 필요 레코드만 남기고 **Continue**
6. **네임서버 확인**  
   - 예: `lara.ns.cloudflare.com`, `matt.ns.cloudflare.com` (계정마다 다름)  
   - 이 두 개(또는 표시된 개수)를 **복사해 두기** → 다음 단계에서 Namecheap에 입력

---

### 2단계: Namecheap에서 네임서버를 Cloudflare로 변경

1. **Namecheap 로그인**  
   https://www.namecheap.com → 로그인
2. **Domain List** → **linkmap.biz** 옆 **Manage** 클릭
3. **NAMESERVERS** 섹션으로 스크롤
4. **Custom DNS** 선택  
   - 기본값 "Namecheap BasicDNS" 등이면 **Custom DNS**로 변경
5. **Cloudflare에서 받은 네임서버 2개 입력**  
   - 1번: `lara.ns.cloudflare.com` (본인 계정에 표시된 값)  
   - 2번: `matt.ns.cloudflare.com` (본인 계정에 표시된 값)  
   - 체크마크(저장) 클릭
6. **전파 대기**  
   - 보통 10분~24시간 (최대 48시간)  
   - 전파 확인: https://www.whatmydns.net 에서 `linkmap.biz` NS 레코드 조회 → Cloudflare 네임서버가 보이면 완료

---

### 3단계: Cloudflare Worker에 Custom Domain 연결

도메인 전파가 완료된 뒤 진행합니다. (Cloudflare 대시보드에서 해당 도메인 상태가 "Active"로 보이면 진행 가능)

1. **Workers & Pages** → **linkmap** Worker 선택
2. **Settings** 탭 → **Domains & Routes** (또는 **Triggers** → **Custom Domains**)
3. **Add Custom Domain** (또는 **Add** → Custom Domain) 클릭
4. **도메인 입력**
   - `linkmap.biz` 추가 → **Add**
   - `www.linkmap.biz` 추가 → **Add**
5. **저장**  
   - Cloudflare가 자동으로 DNS 레코드(CNAME 등) 생성 및 SSL 인증서 발급  
   - 몇 분 내에 `https://linkmap.biz`, `https://www.linkmap.biz`로 Worker 접속 가능

---

### 4단계: (선택) 루트 도메인 리다이렉트

- **www만 사용**하려면: Cloudflare **Rules** 또는 **Page Rules**에서 `linkmap.biz` → `https://www.linkmap.biz` 301 리다이렉트 설정
- **루트만 사용**하려면: Custom Domain을 `linkmap.biz`만 연결하고, `www.linkmap.biz`는 301로 `https://linkmap.biz` 리다이렉트

---

### 체크리스트

- [ ] Cloudflare에 linkmap.biz 사이트 추가 완료
- [ ] Namecheap에서 네임서버를 Cloudflare 네임서버로 변경
- [ ] DNS 전파 확인 (whatmydns 등)
- [ ] Workers & Pages → linkmap → Domains & Routes에서 `linkmap.biz`, `www.linkmap.biz` Custom Domain 추가
- [ ] 브라우저에서 `https://www.linkmap.biz` 접속 테스트
