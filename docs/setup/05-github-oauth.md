# GitHub OAuth 설정

Linkmap에서 GitHub 관련 기능은 **두 가지 별도 OAuth**로 구성됩니다.

## 두 가지 GitHub 인증 구분

| 구분 | 앱 로그인 | 서비스 연동 |
|------|-----------|-------------|
| **용도** | GitHub 계정으로 Linkmap 로그인 | GitHub Secrets 동기화, 저장소 연결 |
| **제공자** | Supabase Auth Provider | 직접 구현한 OAuth App |
| **설정 위치** | Supabase 대시보드 | GitHub Developer Settings |
| **콜백 URL** | `<supabase-url>/auth/v1/callback` | `https://www.linkmap.biz/api/oauth/github/callback` |
| **스코프** | `user:email` (기본) | `repo, read:org, read:user, workflow` |
| **환경변수** | 없음 (Supabase 관리) | `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET` |

## 앱 로그인용 GitHub OAuth

Supabase 대시보드에서 설정합니다. Google OAuth와 동일한 방식입니다.

1. **GitHub > Developer Settings > OAuth Apps > New OAuth App**
2. Homepage URL: `https://www.linkmap.biz`
3. Authorization callback URL: `https://<project-ref>.supabase.co/auth/v1/callback`
4. **Supabase 대시보드 > Authentication > Providers > GitHub** 에서 활성화
5. Client ID / Client Secret 입력

## 서비스 연동용 GitHub OAuth (본 가이드)

GitHub Secrets 동기화, 저장소 연결 등 서비스 연동 기능을 위한 별도의 OAuth App입니다.

### 1. OAuth App 생성

1. [GitHub Developer Settings](https://github.com/settings/developers) 접속
2. **OAuth Apps > New OAuth App**
3. 아래 정보 입력:

| 필드 | 값 |
|------|-----|
| Application name | `Linkmap Service` (구분 가능한 이름) |
| Homepage URL | `https://www.linkmap.biz` |
| Authorization callback URL | `https://www.linkmap.biz/api/oauth/github/callback` |

4. **Register application** 클릭

### 2. Client ID / Secret 확인

- **Client ID**: 생성 직후 표시됨
- **Client Secret**: **Generate a new client secret** 클릭하여 생성

> Secret은 생성 직후에만 볼 수 있으므로 즉시 복사해두세요.

### 3. 환경변수 설정

`.env.local`에 추가:

```bash
GITHUB_OAUTH_CLIENT_ID=Ov23li...
GITHUB_OAUTH_CLIENT_SECRET=abc123...
```

Cloudflare Workers에서는 `npx wrangler secret put`으로 동일하게 설정합니다.

### 4. 콜백 URL 설정

**로컬 개발** 시 OAuth App의 Authorization callback URL을 변경하거나, 별도의 로컬용 OAuth App을 만들어야 합니다:

```
# 로컬용
http://localhost:3000/api/oauth/github/callback

# 프로덕션용
https://www.linkmap.biz/api/oauth/github/callback
```

> 하나의 OAuth App에는 콜백 URL을 하나만 설정할 수 있으므로, 개발/프로덕션용 앱을 분리하는 것을 권장합니다.

### 5. 스코프 설명

| 스코프 | 용도 |
|--------|------|
| `repo` | 저장소 Secrets 읽기/쓰기 |
| `read:org` | 조직 저장소 목록 조회 |
| `read:user` | GitHub 프로필 정보 조회 |
| `workflow` | GitHub Actions 워크플로우 관련 |

## 트러블슈팅

GitHub OAuth 관련 문제는 아래 문서를 참고하세요:

**[../GITHUB_OAUTH_TROUBLESHOOTING.md](../GITHUB_OAUTH_TROUBLESHOOTING.md)**

이 문서에 포함된 내용:
- `/api/oauth/github/callback` 404 에러 원인 분석
- Cloudflare Workers 환경변수 누락 확인
- 캐시 없이 재배포 절차
- 빌드 로그에서 라우트 확인

## 코드 참조

| 파일 | 역할 |
|------|------|
| `src/app/api/oauth/[provider]/authorize/route.ts` | OAuth 시작 (state 생성 → GitHub 리다이렉트) |
| `src/app/api/oauth/[provider]/callback/route.ts` | OAuth 콜백 (코드 → 토큰 교환 → 암호화 저장) |
| `src/lib/github/api.ts` | GitHub API 헬퍼 |
| `src/lib/github/encrypt.ts` | NaCl 봉인 상자 암호화 (Secrets API용) |
| `src/lib/github/auto-sync.ts` | 환경변수 자동 동기화 |
| `src/components/github/` | GitHub 연동 UI 컴포넌트 |
