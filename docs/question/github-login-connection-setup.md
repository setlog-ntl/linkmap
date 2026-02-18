# Q. GitHub 로그인이 연결되지 않을 때 — 설정 방법

## 질문

로그인/회원가입 화면에서 "GitHub" 버튼을 눌렀는데 연결이 되지 않거나, 로그인 후 다시 로그인 페이지로 돌아오거나 오류가 난다. GitHub 로그인을 사용하려면 어떤 설정이 필요한가?

---

## 자주 나오는 오류: `Unsupported provider: provider is not enabled`

**에러 메시지 예시:**
```json
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

**원인:** Supabase 프로젝트에서 **GitHub 프로바이더가 꺼져 있거나**, 아직 설정되지 않은 상태입니다.

**해결 방법:**

1. [Supabase 대시보드](https://supabase.com/dashboard) → 사용 중인 **프로젝트** 선택
2. 왼쪽 메뉴 **Authentication** → **Providers** 이동
3. **GitHub** 행을 클릭해 펼친 뒤
   - **Enable Sign in with GitHub** 스위치를 **ON**으로 설정
   - **Client ID**, **Client Secret**에 GitHub OAuth 앱에서 발급받은 값을 입력
4. **Save** 클릭

GitHub OAuth 앱이 아직 없다면 아래 "2. Supabase 대시보드 설정" 이전에 "1. GitHub 쪽 설정"을 먼저 진행한 뒤, 다시 위 단계에서 Client ID/Secret을 넣고 저장하면 됩니다.

---

## 답변

Linkmap의 GitHub 로그인은 **Supabase Auth**의 소셜 로그인(GitHub Provider)을 사용합니다. 아래 **1. GitHub OAuth 앱**, **2. Supabase 대시보드**, **3. Redirect URL** 세 가지를 모두 맞춰야 정상 동작합니다.

---

### 1. GitHub 쪽 설정 (OAuth App)

1. **GitHub OAuth 앱 페이지**로 이동  
   - [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)  
   - 또는: [https://github.com/settings/developers](https://github.com/settings/developers)

2. **New OAuth App** (또는 기존 앱 수정)  
   - **Application name**: 예) `Linkmap` 또는 `Linkmap (개발)`  
   - **Homepage URL**:  
     - 로컬: `http://localhost:3000`  
     - 운영: `https://www.linkmap.biz` (실제 서비스 도메인으로 변경)  
   - **Authorization callback URL**:  
     - **반드시 Supabase 프로젝트의 콜백 URL**을 넣어야 합니다.  
     - 형식: `https://<프로젝트-ref>.supabase.co/auth/v1/callback`  
     - 예: `https://abcdefghijk.supabase.co/auth/v1/callback`  
     - Supabase 대시보드 → **Authentication** → **Providers** → **GitHub** 섹션에 표시된 **Callback URL**을 그대로 복사해 넣으면 됩니다.

3. **Register application** 후 **Client ID**와 **Client Secret**을 복사해 둡니다. (Client Secret은 한 번만 표시되므로 안전한 곳에 저장)

---

### 2. Supabase 대시보드 설정

1. **Supabase 프로젝트** 선택 후  
   - **Authentication** → **Providers** 이동

2. **GitHub** 프로바이더  
   - GitHub 행을 펼친 뒤  
   - **Enable Sign in with GitHub** 를 켜고  
   - **Client ID**: GitHub OAuth 앱에서 복사한 값  
   - **Client Secret**: GitHub OAuth 앱에서 복사한 값  
   - **Save** 클릭

3. **Callback URL 확인**  
   - 같은 GitHub 섹션에 나오는 **Callback URL**이 위 1번에서 GitHub OAuth 앱의 "Authorization callback URL"에 입력한 값과 **완전히 동일**한지 확인합니다.

---

### 3. Redirect URL (앱으로 돌아오는 주소) 설정

GitHub 인증이 끝나면 Supabase가 사용자를 **우리 앱**으로 보냅니다. 이 때 사용하는 주소를 Supabase에 허용해 두어야 합니다.

1. Supabase 대시보드에서  
   - **Authentication** → **URL Configuration** 이동

2. **Redirect URLs** 목록에 다음을 추가  
   - 로컬 개발: `http://localhost:3000/auth/callback`  
   - 운영: `https://www.linkmap.biz/auth/callback`  
   - (실제 서비스 도메인으로 바꿔서 등록)

3. 와일드카드를 지원하는 경우 예시  
   - `http://localhost:3000/*`  
   - `https://www.linkmap.biz/*`  
   (프로젝트에서 사용하는 도메인이 더 있으면 모두 추가)

로그인 시 `redirectTo`로 `/auth/callback?next=...` 를 쓰고 있으므로, 위 URL이 허용되어 있지 않으면 로그인 후 리다이렉트가 실패해 연결이 안 된 것처럼 보일 수 있습니다.

---

### 4. 환경 변수 (참고)

**로그인용** GitHub은 Supabase 대시보드에 Client ID/Secret만 넣으면 되고, **별도 환경 변수는 필요 없습니다.**

- `NEXT_PUBLIC_SUPABASE_URL`  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`  

위 두 값이 올바르게 설정되어 있어야 클라이언트에서 Supabase Auth(GitHub 로그인 포함)가 동작합니다.  
(프로젝트의 `.env.local.example` 참고)

---

### 5. 체크리스트 요약

| 확인 항목 | 내용 |
|-----------|------|
| GitHub OAuth App | 생성 후 **Authorization callback URL** = Supabase 콜백 URL (`https://<ref>.supabase.co/auth/v1/callback`) |
| Supabase Providers | **GitHub** 사용 설정, Client ID / Client Secret 입력 후 저장 |
| Supabase Redirect URLs | 앱 주소 추가: `http://localhost:3000/auth/callback`, `https://도메인/auth/callback` |
| Supabase URL/Anon Key | `.env.local` 등에 설정되어 있는지 확인 |

위를 모두 적용한 뒤에도 문제가 있으면, 브라우저 개발자 도구의 **Network** 탭에서 GitHub 로그인 클릭 후 리다이렉트되는 URL과 응답을 확인하고, Supabase **Authentication → Logs**에서 에러가 찍히는지 확인하면 원인 파악에 도움이 됩니다.
