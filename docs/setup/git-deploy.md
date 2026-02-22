# 깃 배포 적용 (GitHub Actions → Cloudflare Workers)

`main` 브랜치에 푸시할 때마다 **GitHub Actions**가 빌드 후 **Cloudflare Workers**로 자동 배포합니다.

---

## 1. 사전 준비

- Cloudflare 계정, Workers & Pages 사용 가능
- workers.dev 서브도메인 설정 완료 (예: `linkmap.xxx.workers.dev`)
- 로컬에서 한 번이라도 `npx wrangler login` 완료한 상태 권장

---

## 2. GitHub Secrets 설정

저장소 **Settings** → **Secrets and variables** → **Actions** → **New repository secret**에서 아래 4개 추가:

| Secret 이름 | 설명 | 예시 |
|-------------|------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 토큰 (Workers 편집 권한) | [Create API Token](https://dash.cloudflare.com/profile/api-tokens) → Edit Cloudflare Workers |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 계정 ID | 대시보드 오른쪽 사이드바 또는 URL의 `dash.cloudflare.com/<계정ID>` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon(public) 키 | Supabase 프로젝트 설정 → API에서 복사 |

---

## 3. 배포 트리거

- **자동:** `main` 브랜치에 `git push` 하면 워크플로 실행
- **수동:** GitHub 저장소 **Actions** → **Deploy to Cloudflare Workers** → **Run workflow**

---

## 4. 배포 후 시크릿 (Cloudflare에서 설정)

빌드에는 위 4개만 필요하고, **런타임 시크릿**은 Cloudflare에서 따로 넣어야 합니다.

```bash
npx wrangler login
npx wrangler secret put ENCRYPTION_KEY
# 프롬프트에 .env.local의 ENCRYPTION_KEY 값 입력
```

필요 시: Supabase Service Role Key, Stripe 시크릿 등도 `wrangler secret put <이름>` 으로 추가.

---

## 5. 워크플로 파일

- 경로: [.github/workflows/deploy-cloudflare.yml](../../.github/workflows/deploy-cloudflare.yml)
- 빌드: `npm run build:cf` (OpenNext Cloudflare 어댑터)
- 배포: `npx wrangler deploy`

---

## 6. 문제 해결

| 현상 | 확인 사항 |
|------|-----------|
| 빌드 실패: `NEXT_PUBLIC_SUPABASE_*` 없음 | 위 4개 Secrets 모두 등록했는지 확인 |
| 배포 실패: 403 / 인증 오류 | `CLOUDFLARE_API_TOKEN` 권한에 Workers Edit 포함 여부 |
| 앱 500 / 로그인 오류 | Cloudflare에서 `ENCRYPTION_KEY` 시크릿 설정 여부 |
| workers.dev 404 | Cloudflare 대시보드에서 workers.dev 서브도메인 설정 여부 |

상세: [Cloudflare 마이그레이션 가이드](../cloudflare-migration.md)
