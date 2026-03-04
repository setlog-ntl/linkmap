# 카카오 로그인 설정 가이드

> Supabase + Next.js 환경에서 카카오 로그인을 설정하는 상세 가이드입니다.

---

## 1. 사전 준비

| 항목 | 설명 |
|------|------|
| 카카오 계정 | [accounts.kakao.com](https://accounts.kakao.com) |
| Supabase 프로젝트 | Site URL, Redirect URLs 설정 가능 상태 |
| Next.js 앱 | 로컬 개발 환경 (`http://localhost:3000`) |

### 필요한 값 목록

| 값 | 출처 | 용도 |
|----|------|------|
| REST API 키 | 카카오 개발자 콘솔 | OAuth 클라이언트 ID |
| Client Secret | 카카오 > 보안 | Supabase Provider Secret |
| Supabase 콜백 URL | Supabase Dashboard | 카카오 Redirect URI 등록 |

---

## 2. 카카오 개발자 콘솔 설정

### Step 1: 앱 생성

1. [developers.kakao.com](https://developers.kakao.com) 접속 → 로그인
2. **내 애플리케이션** → **애플리케이션 추가하기**
3. 앱 이름, 사업자명 입력 → **저장**
4. 생성된 앱의 **앱 키** 페이지에서 **REST API 키** 복사

> **키 종류 구분:**
> - **JavaScript 키**: 프론트엔드 SDK 전용 (브라우저 노출 가능)
> - **REST API 키**: OAuth 인가 코드 요청에 사용 (Client ID 역할)
> - **Admin 키**: 서버 전용, 절대 클라이언트 노출 금지

### Step 2: 카카오 로그인 활성화

1. 좌측 메뉴 **카카오 로그인** 클릭
2. **활성화 설정** → **ON**으로 변경
3. **OpenID Connect** → **활성화** (Supabase OIDC 연동 시 필수)

### Step 3: Redirect URI 등록

1. **카카오 로그인** → **Redirect URI** → **등록**
2. 아래 URL 추가:
   ```
   https://<project-ref>.supabase.co/auth/v1/callback
   ```
3. 로컬 테스트 시:
   ```
   http://localhost:54321/auth/v1/callback
   ```

### Step 4: 동의 항목 설정

1. 좌측 메뉴 **동의항목** 클릭
2. 다음 항목 설정:
   - **닉네임**: 필수 동의
   - **카카오계정(이메일)**: 필수 동의 (비즈 앱 전환 필요할 수 있음)
   - **프로필 사진**: 선택 동의

> **비즈 앱 전환:** 이메일을 필수 동의로 받으려면 비즈 앱 전환이 필요합니다.
> 좌측 메뉴 **앱 설정** → **비즈니스** → **개인 개발자 비즈 앱 전환**

### Step 5: Client Secret 생성

1. 좌측 메뉴 **카카오 로그인** → **보안**
2. **Client Secret** → **코드 생성** 클릭
3. 생성된 코드 복사
4. **활성화 상태** → **사용함** 선택

---

## 3. Supabase Custom OIDC Provider 등록 (권장)

Supabase는 카카오를 기본 Provider로 지원하지 않으므로, **Custom OIDC Provider**로 등록합니다.

### Step 1: Supabase Dashboard 설정

1. Supabase Dashboard → **Authentication** → **Providers**
2. 맨 아래 **Add new provider** 또는 기존에 있다면 **Kakao** 토글 ON

**OIDC 설정값:**

| 항목 | 값 |
|------|-----|
| Provider name | `kakao` |
| Client ID | 카카오 **REST API 키** |
| Client Secret | 카카오 **Client Secret** |
| Issuer URL | `https://kauth.kakao.com` |
| Skip nonce check | ON (카카오가 nonce를 지원하지 않을 수 있음) |

### Step 2: URL Configuration

1. **Authentication** → **URL Configuration**
2. **Site URL**: `https://your-domain.com` (또는 개발 시 `http://localhost:3000`)
3. **Redirect URLs**에 추가:
   ```
   http://localhost:3000/auth/callback
   https://your-domain.com/auth/callback
   ```

---

## 4. 직접 OAuth 구현 (대안)

Supabase Custom Provider 대신 직접 구현할 수도 있습니다.

### .env 설정

```env
KAKAO_CLIENT_ID=your_rest_api_key
KAKAO_CLIENT_SECRET=your_client_secret
KAKAO_REDIRECT_URI=http://localhost:3000/api/auth/callback/kakao
```

### 인가 코드 요청

```typescript
// 카카오 로그인 버튼 클릭 시
const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';

function redirectToKakao() {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
    response_type: 'code',
    scope: 'openid profile_nickname account_email',
  });
  window.location.href = `${KAKAO_AUTH_URL}?${params}`;
}
```

### 토큰 교환 (서버 사이드)

```typescript
// app/api/auth/callback/kakao/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_ID!,
      client_secret: process.env.KAKAO_CLIENT_SECRET!,
      redirect_uri: process.env.KAKAO_REDIRECT_URI!,
      code,
    }),
  });

  const tokens = await tokenRes.json();
  // tokens.access_token으로 사용자 정보 조회 후 세션 생성
  // ...
}
```

---

## 5. 로컬 테스트

1. 환경변수 설정 확인
2. `npm run dev` 실행
3. 로그인 페이지에서 카카오 로그인 클릭
4. 카카오 동의 화면 확인
5. 콜백 처리 후 대시보드 리디렉션 확인

### 테스트 체크리스트

- [ ] 카카오 로그인 버튼 클릭 시 카카오 인증 화면으로 이동
- [ ] 동의 후 앱으로 리디렉션
- [ ] 사용자 프로필(닉네임, 이메일) 정상 저장
- [ ] 로그아웃 후 재로그인 정상 동작

---

## 6. 인증 흐름 다이어그램

```
사용자 → [카카오 로그인 클릭]
           ↓
      Supabase Auth (또는 앱 서버)
           ↓  ← client_id + redirect_uri + scope
      카카오 인증 서버 (kauth.kakao.com)
           ↓  ← 사용자 로그인 + 동의
      Redirect → 콜백 URL (code 전달)
           ↓
      서버에서 code → access_token 교환
           ↓
      사용자 정보 조회 (kapi.kakao.com)
           ↓
      세션 생성 → 대시보드 이동
```

---

## 7. 트러블슈팅

### KOE101: Invalid client_id

**원인:** REST API 키가 잘못되었거나 앱이 비활성화됨
**해결:** 카카오 개발자 콘솔 → 앱 키 페이지에서 REST API 키 재확인

### KOE006: Redirect URI mismatch

**원인:** 등록된 Redirect URI와 요청의 redirect_uri가 불일치
**해결:**
- 프로토콜 확인 (`http` vs `https`)
- 후행 슬래시 제거
- 카카오 콘솔에 정확한 URI 재등록

### 이메일 정보가 안 넘어옴

**원인:** 동의 항목에서 이메일이 "선택"이거나 비즈 앱이 아님
**해결:** 비즈 앱 전환 후 이메일을 "필수 동의"로 변경

### OpenID Connect 토큰 오류

**원인:** 카카오 로그인 설정에서 OIDC가 비활성화됨
**해결:** 카카오 개발자 콘솔 → 카카오 로그인 → OpenID Connect → 활성화

---

## 8. 프로덕션 체크리스트

- [ ] REST API 키를 환경변수로 관리 (하드코딩 금지)
- [ ] Client Secret 활성화 및 환경변수 저장
- [ ] 프로덕션 Redirect URI 등록
- [ ] 이메일 필수 동의 설정 (비즈 앱)
- [ ] HTTPS 사용 확인
- [ ] 에러 핸들링 구현
- [ ] 로그아웃 시 카카오 세션도 정리 (선택)

---

## 참고 링크

- [카카오 로그인 공식 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [Supabase Custom OIDC Provider](https://supabase.com/docs/guides/auth/social-login)
- [카카오 REST API 레퍼런스](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
