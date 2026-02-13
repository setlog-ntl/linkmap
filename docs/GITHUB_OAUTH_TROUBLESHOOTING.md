# GitHub OAuth 연결 오류 트러블슈팅 가이드

## 문제 요약

배포된 사이트(`https://linkmap.vercel.app`)에서 GitHub OAuth 연결 시 `/api/oauth/github/callback`이 **404 NOT_FOUND**를 반환한다.

- `/api/oauth/github/authorize` → 정상 동작 (GitHub으로 리디렉트됨)
- `/api/oauth/github/callback` → **404** (GitHub에서 돌아올 때 실패)

---

## 근본 원인 분석

### 1. authorize vs callback 라우트 비교

두 라우트는 같은 `[provider]` 디렉토리에 있지만, **import하는 모듈이 다르다.**

| 구분 | authorize/route.ts | callback/route.ts |
|------|-------------------|-------------------|
| `@/lib/crypto` (encrypt) | **사용 안함** | **사용** |
| `@/lib/audit` (logAudit) | **사용 안함** | **사용** |
| `@/lib/rate-limit` | 사용 | 사용 안함 |
| `crypto` (Node.js) | randomBytes만 | 사용 안함 |

### 2. callback 라우트의 환경변수 의존성

callback 라우트는 실행 시 다음 환경변수가 **모두 필수**:

```
GITHUB_OAUTH_CLIENT_ID      → GitHub API 토큰 교환
GITHUB_OAUTH_CLIENT_SECRET   → GitHub API 토큰 교환
ENCRYPTION_KEY               → encrypt() - 토큰 암호화 저장
SUPABASE_SERVICE_ROLE_KEY    → createAdminClient() - DB 저장
NEXT_PUBLIC_SUPABASE_URL     → Supabase 연결
NEXT_PUBLIC_SUPABASE_ANON_KEY → Supabase 연결
```

### 3. Vercel 404 발생 원인 (가능성 순)

#### 원인 A: Vercel 배포에 최신 코드 미반영 (가장 유력)

Git 히스토리에서 callback 라우트는 커밋 `aaaad35`에서 추가되었다.
Vercel 배포가 이 커밋 이전 버전으로 되어 있다면, 라우트 자체가 존재하지 않는다.

**확인 방법:**
- Vercel Dashboard → Deployments → 최신 배포의 Git Commit SHA 확인
- `aaaad35` 이후인지 확인

#### 원인 B: 환경변수 누락으로 빌드/런타임 실패

`ENCRYPTION_KEY` 또는 `SUPABASE_SERVICE_ROLE_KEY`가 Vercel에 설정되지 않으면,
callback 라우트의 Serverless Function이 로드 실패할 수 있다.

**확인 방법:**
- Vercel Dashboard → Settings → Environment Variables 에서 **전체 6개** 환경변수 확인

#### 원인 C: Vercel 빌드 캐시 문제

이전 빌드 캐시가 남아 있어 새 라우트가 포함되지 않을 수 있다.

**확인 방법:**
- Vercel Deployments → 최신 배포 → ... 메뉴 → "Redeploy" → **"Use existing Build Cache" 체크 해제**

---

## 해결 체크리스트

### Step 1: Vercel 환경변수 전체 확인

Vercel Dashboard → Project → **Settings** → **Environment Variables** 에서 아래 변수가 **모두** 설정되어 있는지 확인:

| 환경변수 | 값 | 용도 |
|----------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://apqydhwahkccxlltacas.supabase.co` | Supabase API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (긴 JWT) | Supabase 인증 |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` (긴 JWT) | 서버 측 DB 접근 |
| `ENCRYPTION_KEY` | 64자리 hex 문자열 | 토큰 암호화 |
| `GITHUB_OAUTH_CLIENT_ID` | `Ov23lia...` | GitHub OAuth |
| `GITHUB_OAUTH_CLIENT_SECRET` | `13ffcaf...` | GitHub OAuth |

**중요:** Environment 설정에서 **Production**, **Preview**, **Development** 모두에 적용되는지 확인.

### Step 2: Vercel 배포 커밋 확인

Vercel Dashboard → **Deployments** 탭:
- 최신 Production 배포의 **Git Commit** 확인
- 로컬 최신 커밋(`58c8ea5`)과 동일한지 확인

만약 다르다면:
```bash
git push origin main
```
를 실행하여 최신 코드를 푸시.

### Step 3: 빌드 캐시 없이 강제 재배포

1. Vercel Dashboard → **Deployments**
2. 최신 배포의 **...** 메뉴 클릭
3. **"Redeploy"** 클릭
4. **"Use existing Build Cache" 체크 해제** (매우 중요!)
5. **"Redeploy"** 확인

### Step 4: 빌드 로그 확인

재배포 후 빌드 로그에서:
1. **Build 성공 여부** 확인
2. **Route 목록**에 아래 두 라우트가 포함되는지 확인:
   ```
   ƒ /api/oauth/[provider]/authorize
   ƒ /api/oauth/[provider]/callback
   ```
3. 에러 메시지가 있다면 기록

### Step 5: Function 로그 확인

배포 후에도 404가 계속되면:
1. Vercel Dashboard → **Logs** 탭
2. Filter: `/api/oauth` 검색
3. callback 요청의 상태 코드와 에러 메시지 확인

---

## GitHub OAuth App 설정 확인

https://github.com/settings/developers 에서:

| 항목 | 값 |
|------|-----|
| Homepage URL | `https://linkmap.vercel.app` |
| Authorization callback URL | `https://linkmap.vercel.app/api/oauth/github/callback` |

---

## 코드 흐름 참조

### authorize 흐름 (성공)
```
사용자 → /api/oauth/github/authorize
  1. Supabase 인증 확인
  2. process.env.GITHUB_OAUTH_CLIENT_ID 확인
  3. oauth_states 테이블에 state 토큰 저장
  4. GitHub OAuth 페이지로 리디렉트
```

### callback 흐름 (404 실패)
```
GitHub → /api/oauth/github/callback?code=xxx&state=yyy
  1. Supabase 인증 확인
  2. oauth_states에서 state 토큰 검증
  3. GitHub API로 access_token 교환       ← GITHUB_OAUTH_CLIENT_SECRET 필요
  4. encrypt(accessToken)                 ← ENCRYPTION_KEY 필요
  5. service_accounts 테이블에 저장         ← SUPABASE_SERVICE_ROLE_KEY 필요
  6. 프로젝트 페이지로 리디렉트
```

### 관련 파일
```
src/app/api/oauth/[provider]/authorize/route.ts   - OAuth 시작
src/app/api/oauth/[provider]/callback/route.ts     - OAuth 콜백
src/lib/crypto/index.ts                            - AES-256-GCM 암호화
src/lib/audit.ts                                   - 감사 로깅
src/lib/supabase/admin.ts                          - Service Role 클라이언트
```

---

## 요약

| 확인 항목 | 상태 | 조치 |
|-----------|------|------|
| GitHub OAuth App 설정 | OK | Callback URL 올바름 |
| DB 테이블 (oauth_states, service_accounts) | OK | 마이그레이션 012-015 적용 완료 |
| `.env.local` (로컬) | OK | 환경변수 설정 완료 |
| Vercel 환경변수 (6개 전체) | **확인 필요** | 특히 `ENCRYPTION_KEY` |
| Vercel 최신 배포 여부 | **확인 필요** | 커밋 SHA 확인 |
| Vercel 빌드 캐시 | **확인 필요** | 캐시 없이 재배포 |
