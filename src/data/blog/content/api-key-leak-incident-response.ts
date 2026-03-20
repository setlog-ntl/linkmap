export const content = `> **KEY:** API 키 유출은 "혹시 내 저장소에?"가 아니라 "언제 내 저장소에서?"의 문제입니다. GitHub 리포지터리에는 매년 수백만 건의 시크릿이 노출되며, 유출 후 평균 수 분 안에 자동화된 봇이 키를 스캔합니다. 유출이 확인되면 **삭제보다 교체가 먼저**입니다.

## API 키 유출 사고, 생각보다 흔하다

개발하다 보면 실수는 반드시 생깁니다. \`git add .\` 한 번에 \`.env\` 파일이 통째로 올라가거나, 디버그 로그에 API 키가 찍히거나, 팀원에게 슬랙으로 키를 전송하는 일이 발생합니다.

GitHub의 시크릿 스캐닝 리포트에 따르면 공개 리포지터리에서만 연간 수백만 건의 시크릿이 탐지됩니다. AWS 액세스 키, OpenAI API 키, Stripe 시크릿 키 모두 주요 탐지 대상입니다.

> **WARNING:** 키를 GitHub에 커밋하고 즉시 삭제해도 안전하지 않습니다. 자동화된 봇은 새 커밋을 수 분 내에 스캔하며, fork된 저장소에는 히스토리가 영구 보존됩니다. **커밋된 키는 반드시 폐기하고 새 키를 발급해야 합니다.**

## 유출이 발생하는 주요 경로

어디서 새는지 알아야 막을 수 있습니다.

| 유출 경로 | 빈도 | 예시 |
|----------|------|------|
| \`.env\` 파일 Git 커밋 | 매우 높음 | \`.gitignore\` 설정 누락 |
| 코드 내 하드코딩 | 높음 | \`const key = "sk-..."\` |
| 로그·디버그 출력 | 중간 | \`console.log(process.env)\` |
| 채팅·이메일 전송 | 중간 | 슬랙, 카톡으로 키 공유 |
| 환경변수 미분리 | 낮음 | 개발·프로덕션 키 동일 사용 |
| CI/CD 로그 노출 | 낮음 | Actions 워크플로 로그 |

[환경변수 완전 정복 가이드](/guides/env)에서 각 경로별 방어 방법을 확인할 수 있습니다.

---

## 유출 즉시 조치 체크리스트 — 5단계

![API 키 유출 5단계 긴급 대응 타임라인](/blog/diagrams/incident-response-timeline.png)

유출이 의심되는 순간 이 순서대로 움직이세요.

### 1단계: 즉시 키 폐기 (5분 이내)

**삭제보다 폐기가 먼저입니다.** git 히스토리를 정리하기 전에, 키 자체를 먼저 무효화합니다.

| 서비스 | 폐기 경로 |
|--------|---------|
| **AWS** | IAM → 사용자 → 보안 자격 증명 → 액세스 키 비활성화 |
| **OpenAI** | platform.openai.com → API keys → 해당 키 Revoke |
| **GitHub PAT** | Settings → Developer settings → Personal access tokens → Delete |
| **Stripe** | Dashboard → Developers → API keys → Roll key |
| **Supabase** | Project Settings → API → Service role key 재생성 |

> **TIP:** 폐기 후 새 키 발급까지 서비스가 잠시 중단될 수 있습니다. 프로덕션 환경이라면 새 키를 먼저 발급하고 배포 환경에 적용한 뒤 구 키를 폐기하는 순서로 다운타임을 최소화하세요.

### 2단계: 사용 로그 점검 (10분)

폐기와 동시에, 유출된 키가 악용되었는지 확인합니다.

\`\`\`
AWS CloudTrail → 최근 이벤트에서 낯선 IP·리전·서비스 확인
OpenAI Usage → 비정상적인 호출량·시각 확인
Stripe Dashboard → 비인가 결제 여부 확인
GitHub Security → Settings → Code security → Secret scanning alerts
\`\`\`

비정상 활동이 확인되면 해당 서비스의 보안팀에 즉시 신고하고, 영향 범위에 따라 고객 통지를 검토합니다.

### 3단계: Git 히스토리 정리

키가 이미 폐기되었으므로 히스토리 정리는 신중하게 진행합니다.

\`\`\`bash
# BFG Repo Cleaner 사용 (git filter-branch보다 빠름)
# 먼저 .env 또는 민감 파일을 히스토리에서 제거
bfg --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
\`\`\`

> **INFO:** force push는 협업 저장소에서 팀원 전원의 로컬 클론에 영향을 줍니다. 반드시 팀에 공지한 뒤 진행하세요. 이미 fork된 저장소의 히스토리는 제어할 수 없으므로, 키 폐기가 가장 중요한 조치입니다.

### 4단계: 새 키 배포

새 키는 \`.env\` 파일이 아닌 안전한 방법으로 배포합니다.

| 배포 방법 | 적합한 환경 |
|---------|-----------|
| Vercel 환경변수 UI | Vercel 배포 |
| Cloudflare Workers Secrets | Cloudflare 배포 |
| [GitHub Secrets 자동 동기화](/blog/github-secrets-automation) | GitHub Actions CI/CD |
| [Linkmap](https://www.linkmap.biz) AES-256-GCM 암호화 저장소 | 모든 환경 통합 관리 |

### 5단계: 원인 분석 및 팀 공유

같은 사고가 반복되지 않도록 포스트모템(Post-mortem)을 작성합니다. "왜 유출되었는가", "어떻게 탐지했는가", "어떻게 막을 수 있었는가"를 팀과 공유합니다.

---

## 서비스별 빠른 대응 가이드

### AWS IAM 액세스 키

AWS는 키 유출에 가장 빠르게 반응해야 하는 서비스입니다. 유출된 AWS 키로 수백만 원의 EC2 인스턴스나 S3 버킷이 생성될 수 있습니다.

\`\`\`bash
# AWS CLI로 즉시 비활성화
aws iam update-access-key \\
  --access-key-id AKIAIOSFODNN7EXAMPLE \\
  --status Inactive \\
  --user-name 사용자명
\`\`\`

비활성화 후 CloudTrail에서 해당 키의 최근 30일 활동을 반드시 검토합니다.

### OpenAI API 키

[OpenAI 연동 가이드](/guides/openai)에서 키 발급과 안전한 사용법을 참고하세요. Usage 대시보드에서 비정상 호출(특히 GPT-4 대량 호출)을 확인합니다.

### GitHub Personal Access Token

Settings → Developer settings → Personal access tokens에서 Delete합니다. GitHub은 공개 리포지터리에서 유출된 토큰을 자동 감지하여 이메일로 알려주기도 합니다. [GitHub 시작하기 가이드](/guides/github)에서 토큰 권한 최소화 방법을 확인할 수 있습니다.

## 재발 방지 — 구조적 예방

사고 대응보다 중요한 것은 구조적 예방입니다.

### 암호화 저장소 도입

[Linkmap](https://www.linkmap.biz)은 모든 API 키와 환경변수를 **AES-256-GCM**으로 암호화하여 저장합니다. 평문 \`.env\` 파일 대신 암호화된 저장소를 사용하면 키가 실수로 노출되더라도 암호화된 값만 노출됩니다.

### GitHub Secrets 자동 동기화

[Linkmap의 GitHub Secrets 동기화](https://www.linkmap.biz) 기능을 사용하면, Linkmap에서 키를 업데이트할 때 GitHub 저장소 시크릿에 자동 반영됩니다. 팀원이 \`.env\` 파일을 직접 다룰 필요가 없어집니다.

### 사전 탐지 도구

\`\`\`bash
# git-secrets: 커밋 전 시크릿 탐지
git secrets --install
git secrets --register-aws

# trufflehog: 히스토리 전체 스캔
trufflehog git https://github.com/your-org/your-repo
\`\`\`

> **TIP:** [Linkmap 서비스 카탈로그](https://www.linkmap.biz/services)에서 128개 서비스의 환경변수 정보와 발급 방법을 한눈에 확인할 수 있습니다. 어떤 키가 필요한지 미리 파악하면 하드코딩 유혹을 줄일 수 있습니다.

## 유출 예방 최종 체크리스트

사고 전에 이 항목을 점검하세요.

- [x] \`.gitignore\`에 \`.env*\` 전체 패턴 포함
- [x] \`.env.example\`로 변수 형식만 공유 (값 없이)
- [ ] git 히스토리에 시크릿 커밋 없음 확인
- [ ] CI/CD 로그에서 환경변수 마스킹 확인
- [ ] 개발·프로덕션 키 분리 (동일 키 사용 금지)
- [ ] 사용하지 않는 API 키 정기 폐기 (분기별 로테이션)
- [ ] [Linkmap](https://www.linkmap.biz/signup)으로 환경변수 암호화 저장소 도입

> **TRY:** API 키 유출 걱정 없이 개발하고 싶다면 [Linkmap 무료 플랜](https://www.linkmap.biz/signup)으로 시작하세요. 모든 시크릿을 AES-256-GCM으로 암호화하고, GitHub Secrets에 자동 동기화합니다. 프로젝트 3개, 환경변수 50개까지 무료입니다.

---

*\`.env\` 파일의 근본적인 위험성은 [.env 파일은 왜 위험한가](/blog/why-dotenv-is-dangerous)에서, 배포 환경 관리는 [도메인·배포·서버 가이드](/guides/deploy)에서 자세히 다룹니다.*
`;
