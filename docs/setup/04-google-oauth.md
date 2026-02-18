# Google OAuth 설정

Google 계정으로 Linkmap에 로그인하기 위한 설정입니다. Supabase의 Google Auth Provider를 통해 동작합니다.

## 체크리스트

- [ ] Google Cloud Console에서 OAuth 동의 화면 구성
- [ ] OAuth 2.0 클라이언트 ID 생성
- [ ] 승인된 리디렉션 URI에 Supabase 콜백 URL 추가
- [ ] Supabase 대시보드에서 Google Provider 활성화
- [ ] Supabase URL Configuration에 Site URL + Redirect URLs 설정

## 상세 가이드

Google OAuth 설정의 전체 단계별 가이드는 아래 문서를 참고하세요:

**[../GOOGLE_OAUTH_SETUP.md](../GOOGLE_OAUTH_SETUP.md)**

이 문서에 포함된 내용:
- Google Cloud Console 프로젝트 생성
- OAuth 동의 화면 설정
- OAuth 자격증명 생성 (Client ID / Secret)
- JavaScript 출처 및 리디렉션 URI 설정
- Supabase 대시보드 설정 (Provider 활성화)
- 로컬 테스트 절차
- 인증 플로우 다이어그램
- 트러블슈팅 (redirect_uri_mismatch, access_denied, CORS)
- 프로덕션 배포 체크리스트

## 환경변수

Google OAuth는 Supabase 대시보드에서 설정하므로 별도 환경변수가 필요 없습니다. Supabase가 Google Client ID/Secret을 자체 관리합니다.

## 코드 참조

| 파일 | 역할 |
|------|------|
| `src/app/(auth)/login/page.tsx` | Google OAuth 로그인 버튼 (`signInWithOAuth`) |
| `src/app/auth/callback/route.ts` | Supabase Auth 콜백 (코드 → 세션 교환) |
