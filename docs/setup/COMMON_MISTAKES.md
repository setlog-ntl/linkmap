# 자주 하는 실수 모음

Linkmap 설정 중 자주 발생하는 문제와 해결 방법입니다.

---

## 1. Supabase URL Configuration 미설정

**증상**: OAuth 로그인 시 404 에러, 콜백 페이지로 리다이렉트 실패

**원인**: Supabase의 **Authentication > URL Configuration**에서 Site URL과 Redirect URLs를 설정하지 않았습니다.

**해결**:

1. Supabase 대시보드 > **Authentication > URL Configuration**
2. **Site URL** 설정:
   - 로컬: `http://localhost:3000`
   - 프로덕션: `https://www.linkmap.biz`
3. **Redirect URLs** 추가:
   - `http://localhost:3000/**`
   - `https://www.linkmap.biz/**`

자세한 내용: [01-supabase.md](./01-supabase.md#3-url-configuration-중요)

---

## 2. ENCRYPTION_KEY 미설정 또는 형식 오류

**증상**: 환경변수 저장/조회 시 500 에러

**에러 메시지**:
```
Error: ENCRYPTION_KEY environment variable is not set
Error: ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)
```

**원인**: `ENCRYPTION_KEY`가 없거나 64자 hex가 아닙니다.

**해결**:

```bash
# 키 생성
openssl rand -hex 32

# .env.local에 추가 (반드시 64자 hex)
ENCRYPTION_KEY=생성된_키_붙여넣기
```

자세한 내용: [02-encryption.md](./02-encryption.md)

---

## 3. Vercel 환경변수 누락

**증상**: 로컬에서는 정상이지만 Vercel 배포 후 기능 오작동

**원인**: Vercel 대시보드에 환경변수를 추가하지 않았습니다. `.env.local`은 로컬 전용이므로 Vercel에는 별도로 설정해야 합니다.

**해결**:

1. Vercel 대시보드 > **Settings > Environment Variables**
2. [ENV_REFERENCE.md](./ENV_REFERENCE.md)의 Tier 1~2 변수를 모두 추가
3. 환경변수 추가 후 **반드시 재배포** (자동 재배포되지 않음)

---

## 4. service_role 키를 NEXT_PUBLIC_에 노출

**증상**: 보안 경고, RLS 정책 우회 가능

**원인**: `SUPABASE_SERVICE_ROLE_KEY`에 `NEXT_PUBLIC_` 접두사를 붙여 클라이언트에 노출했습니다.

**해결**:

- `SUPABASE_SERVICE_ROLE_KEY`는 **절대** `NEXT_PUBLIC_` 접두사를 붙이지 마세요
- 서버 측 코드(`src/lib/supabase/admin.ts`)에서만 사용합니다
- 이미 노출된 경우: Supabase 대시보드에서 키를 즉시 재생성하세요

---

## 5. Vercel 빌드 캐시로 새 라우트 미반영

**증상**: 새로 추가한 API 라우트(`/api/...`)가 Vercel에서 404를 반환

**원인**: Vercel의 빌드 캐시가 이전 빌드 결과를 재사용하여 새 라우트가 포함되지 않았습니다.

**해결**:

1. Vercel 대시보드 > **Deployments**
2. 최신 배포 > **...** > **Redeploy**
3. **"Use existing Build Cache" 체크 해제**
4. **Redeploy** 클릭

자세한 내용: [03-vercel.md](./03-vercel.md#4-캐시-없이-재배포)

---

## 6. Stripe Webhook Secret 미설정

**증상**: Stripe 결제 후 구독 상태가 업데이트되지 않음

**원인**: `STRIPE_WEBHOOK_SECRET`이 설정되지 않아 Webhook 서명 검증에 실패합니다.

**해결**:

1. Stripe 대시보드 > **Developers > Webhooks**
2. 엔드포인트의 **Signing secret** (`whsec_...`) 복사
3. Vercel 환경변수에 `STRIPE_WEBHOOK_SECRET` 추가
4. 재배포

자세한 내용: [06-stripe.md](./06-stripe.md#3-webhook-설정)

---

## 7. GitHub OAuth Callback URL 불일치

**증상**: GitHub 서비스 연동 시 OAuth 에러 또는 404

**원인**: GitHub OAuth App의 Authorization callback URL이 실제 앱 URL과 다릅니다.

**해결**:

| 환경 | 올바른 Callback URL |
|------|---------------------|
| 로컬 | `http://localhost:3000/api/oauth/github/callback` |
| 프로덕션 | `https://www.linkmap.biz/api/oauth/github/callback` |

1. GitHub > Developer Settings > OAuth Apps > 해당 앱
2. **Authorization callback URL** 확인 및 수정

> 하나의 OAuth App에는 콜백 URL 하나만 설정 가능합니다. 로컬/프로덕션용 앱을 분리하는 것을 권장합니다.

자세한 내용: [05-github-oauth.md](./05-github-oauth.md), [../GITHUB_OAUTH_TROUBLESHOOTING.md](../GITHUB_OAUTH_TROUBLESHOOTING.md)

---

## 빠른 진단 체크리스트

문제 발생 시 아래 순서로 확인하세요:

1. **`.env.local` 확인**: 필요한 환경변수가 모두 설정되어 있는가?
2. **Vercel 환경변수 확인**: 로컬에만 설정하고 Vercel에는 빠뜨리지 않았는가?
3. **Supabase URL Configuration**: Site URL과 Redirect URLs가 올바른가?
4. **빌드 캐시**: 새 코드가 배포에 반영되었는가? (캐시 없이 재배포)
5. **콘솔/로그 확인**: 브라우저 DevTools, Vercel Function Logs에 에러 메시지가 있는가?
