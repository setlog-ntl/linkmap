export const content = `> **KEY:** 5가지 실천법 요약 — (1) .gitignore 완벽 설정, (2) 커밋 히스토리 점검, (3) 환경별 분리, (4) NEXT_PUBLIC_ 접두사 주의, (5) [Linkmap](https://www.linkmap.biz) 같은 전용 관리 도구 사용. 지금 바로 적용하세요.

## .env 파일, 제대로 관리하고 있나요?

\`.env\` 파일은 편리하지만, [잘못 관리하면 API 키 유출로 이어집니다](/blog/why-dotenv-is-dangerous). 이 글에서는 **지금 바로 적용할 수 있는** 5가지 실천법을 공유합니다.

## 1. .gitignore 완벽하게 설정

프로젝트 루트의 \`.gitignore\`에 아래를 반드시 포함하세요:

\`\`\`
# 환경변수 파일 전체 차단
.env
.env.*
.env.local
.env.development
.env.staging
.env.production
!.env.example
\`\`\`

> **TIP:** \`.env.example\`은 커밋해도 됩니다 — 실제 값 대신 **형식만** 기록합니다:

\`\`\`
# .env.example (커밋 OK — 값 없이 형식만)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=sk-...
\`\`\`

## 2. 이미 커밋된 시크릿 확인

과거에 실수로 \`.env\`를 커밋했을 수 있습니다:

\`\`\`bash
# git 히스토리에서 .env 파일 검색
git log --all --full-history -- .env
git log --all --full-history -- ".env*"
\`\`\`

> **WARNING:** 결과가 나온다면 해당 키는 **이미 노출된 것**입니다. 즉시 새 키로 교체하세요. git 히스토리 정리보다 **키 교체가 우선**입니다.

## 3. 환경별 분리

개발, 스테이징, 프로덕션 환경에 같은 키를 쓰면 안 됩니다:

| 환경 | 키 관리 위치 | 추천 |
|------|-----------|------|
| 로컬 개발 | \`.env.local\` (로컬만) | — |
| 스테이징 | 배포 플랫폼 설정 | Vercel Preview |
| 프로덕션 | 배포 플랫폼 설정 | Vercel, Cloudflare |

> **INFO:** 프로덕션 키는 \`.env\` 파일이 아니라 배포 플랫폼의 환경변수 설정에서 관리하세요. [Linkmap의 GitHub Secrets 자동 동기화](/blog/github-secrets-automation)를 사용하면 환경변수가 CI/CD에 자동 반영됩니다.

---

## 4. NEXT_PUBLIC_ 접두사 주의

![NEXT_PUBLIC_ 보안 레벨](/blog/diagrams/next-public-security-levels.png)

Next.js에서 \`NEXT_PUBLIC_\`으로 시작하는 환경변수는 **브라우저에 노출**됩니다:

\`\`\`
공개 가능 (브라우저에 노출됨):
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

절대 공개 금지 (서버에서만 사용):
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
  OPENAI_API_KEY=sk-...
  STRIPE_SECRET_KEY=sk_live_...
\`\`\`

> **WARNING:** **절대로** \`SUPABASE_SERVICE_ROLE_KEY\`, \`OPENAI_API_KEY\`, \`STRIPE_SECRET_KEY\`에 \`NEXT_PUBLIC_\` 접두사를 붙이면 안 됩니다. 브라우저 개발자 도구에서 **누구나** 볼 수 있게 됩니다. 환경변수의 공개/비공개 구분이 헷갈린다면 [환경변수 완전 정복 가이드](/guides/env)를 참고하세요.

## 5. 환경변수 관리 도구 사용

\`.env\` 파일의 근본적 한계를 해결하려면 [Linkmap](https://www.linkmap.biz) 같은 전용 도구가 필요합니다.

| 기능 | .env 파일 | [Linkmap](https://www.linkmap.biz) |
|------|----------|---------|
| 암호화 | 평문 | **AES-256-GCM** |
| 자동 동기화 | 수동 복사 | GitHub Secrets 자동 배포 |
| 감사 로그 | 없음 | 모든 접근 기록 |
| 누락 점검 | 없음 | 자동 감지 |
| 팀 공유 | 카톡/슬랙 | 초대 링크 + 역할 제어 |
| 시각화 | 없음 | 서비스맵 |

---

## 지금 바로 확인하세요

- [x] \`.gitignore\`에 \`.env*\` 패턴 포함
- [ ] git 히스토리에 \`.env\` 커밋 기록 없음
- [ ] 프로덕션 키는 배포 플랫폼(Vercel, Cloudflare)에서 관리
- [ ] \`NEXT_PUBLIC_\`에 시크릿 키 미포함
- [ ] [Linkmap](https://www.linkmap.biz/signup)으로 환경변수 관리 도구 도입

> **TRY:** [Linkmap 무료 플랜](https://www.linkmap.biz/signup)으로 시작하세요. 프로젝트 3개, 환경변수 50개까지 무료입니다.

---

*환경변수 기초는 [환경변수 완전 정복 가이드](/guides/env), .env 위험성은 [.env 파일은 왜 위험한가](/blog/why-dotenv-is-dangerous)를 참고하세요.*
`;
