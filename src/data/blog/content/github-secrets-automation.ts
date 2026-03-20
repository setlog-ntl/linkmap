export const content = `> **KEY:** GitHub Secrets를 수동으로 관리하면 동기화 누락, 변경 추적 불가, 확인 불가 문제가 생깁니다. [Linkmap](https://www.linkmap.biz)은 환경변수를 GitHub 저장소 시크릿에 **1클릭으로 자동 동기화**합니다.

## GitHub Secrets, 수동 관리의 한계

GitHub Actions로 CI/CD를 구성하면, 환경변수를 GitHub Secrets에 등록해야 합니다.

\`\`\`
수동 관리 흐름:

  Settings → Secrets → New Secret
     ↓
  이름: SUPABASE_URL    값: https://xxx.supabase.co   [저장]
  이름: SUPABASE_KEY    값: eyJhbGci...               [저장]
  이름: OPENAI_API_KEY  값: sk-...                    [저장]
  ... (×10개 이상 반복)
     ↓
  .env 변경할 때마다 다시 수동 업데이트
     ↓
  "어? 배포가 실패했는데... 시크릿 업데이트를 깜빡했다"
\`\`\`

> **WARNING:** 프로젝트에 환경변수가 10개만 되어도, 수동 관리는 실수의 온상이 됩니다. 등록된 시크릿의 값은 **다시 확인할 수도 없습니다** (마스킹).

---

## Linkmap의 GitHub Secrets 자동 배포

![GitHub Secrets 수동 vs 자동 비교](/blog/diagrams/manual-vs-auto-secrets.png)

[Linkmap](https://www.linkmap.biz)은 프로젝트의 환경변수를 GitHub 저장소 시크릿에 **자동으로 동기화**합니다.

\`\`\`
자동 동기화 흐름 (linkmap.biz):

  Linkmap에서 환경변수 저장
       ↓
  AES-256-GCM으로 암호화 저장 (Linkmap DB)
       ↓
  "GitHub 동기화" 클릭
       ↓
  NaCl 암호화 → GitHub API 호출
       ↓
  Repository Secrets 자동 업데이트
       ↓
  다음 GitHub Actions 실행 시 최신 값 사용
\`\`\`

### 설정 방법 (1회, 2분)

| 단계 | 할 일 |
|------|------|
| 1 | [Linkmap](https://www.linkmap.biz)에서 프로젝트 생성 |
| 2 | 프로젝트 설정에서 GitHub 저장소 연결 (OAuth) |
| 3 | 동기화할 환경변수 선택 |
| 4 | **끝!** 이후 자동 동기화 |

> **TIP:** 이후 Linkmap에서 환경변수를 변경할 때마다 GitHub Secrets에 **자동 반영**됩니다. 수동 업데이트가 필요 없습니다.

## 수동 vs 자동 비교

| 항목 | 수동 (GitHub UI) | 자동 ([Linkmap](https://www.linkmap.biz)) |
|------|-----------------|---------------|
| 등록 시간 | 변수당 30초 | **전체 1클릭** |
| 동기화 | 수동 확인 | 자동 |
| 변경 추적 | 없음 | 감사 로그 |
| 누락 방지 | 기억에 의존 | 자동 점검 |
| 다중 저장소 | 각각 설정 | 한곳에서 관리 |
| 값 확인 | 불가능 (마스킹) | Linkmap에서 확인 가능 |

---

## 실전 시나리오

### 시나리오 1: 새 서비스 추가

OpenAI API를 프로젝트에 추가할 때:

1. [서비스 카탈로그](https://www.linkmap.biz/services)에서 OpenAI 선택
2. API 키 입력 (자동 AES-256 암호화)
3. GitHub 동기화 클릭 → \`OPENAI_API_KEY\` 시크릿 자동 등록
4. GitHub Actions에서 바로 사용 가능

### 시나리오 2: 키 로테이션

Supabase 키를 변경할 때:

1. [Linkmap](https://www.linkmap.biz)에서 새 키로 업데이트
2. GitHub 동기화 → 기존 시크릿 **자동 갱신**
3. 다음 배포에서 새 키 적용

### 시나리오 3: 팀원 합류

새 팀원이 프로젝트에 참여할 때:

1. 팀원을 [Linkmap](https://www.linkmap.biz) 프로젝트에 초대
2. 팀원은 서비스맵에서 전체 아키텍처 파악
3. GitHub 권한 설정 후 동기화 → 별도의 시크릿 공유 불필요

> **INFO:** 더 이상 카톡이나 슬랙으로 API 키를 보낼 필요가 없습니다.

## GitHub Actions에서 사용

\`\`\`yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
        env:
          SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: \${{ secrets.SUPABASE_ANON_KEY }}
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
\`\`\`

> **TIP:** Linkmap이 시크릿을 자동 등록하므로, 워크플로에서 \`secrets.XXX\`로 바로 참조할 수 있습니다.

---

> **TRY:** [Linkmap 무료 플랜](https://www.linkmap.biz/signup)으로 시작하세요. 환경변수 관리 기초는 [환경변수 완전 정복 가이드](/guides/env)를 참고하세요.

---

*GitHub 설정은 [GitHub 시작하기 가이드](/guides/github), 배포 파이프라인은 [배포 가이드](/guides/deploy)를 참고하세요.*
`;
