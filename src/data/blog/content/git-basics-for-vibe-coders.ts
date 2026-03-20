export const content = `> **KEY:** Git은 "게임 세이브 포인트"입니다. AI가 코드를 망쳤을 때, 어제 잘 되던 버전으로 1초 만에 되돌아갈 수 있는 유일한 방법입니다.

## AI가 코드를 망쳤다면, 지금 당장 Git이 필요하다

바이브코딩은 즐겁습니다. AI에게 "로그인 기능 만들어줘"라고 하면 코드가 나옵니다. 그런데 AI가 새 기능을 추가하다가 멀쩡하던 코드를 건드리면? 화면이 하얗게 변하거나 앱이 다운됩니다.

**Git은 RPG 게임의 세이브 포인트와 같습니다.** 코드가 잘 동작할 때 저장해두고 언제든 돌아올 수 있습니다.

## [GitHub](https://github.com) 계정 만들기 (5분)

1. github.com에서 Sign Up
2. 이메일, 비밀번호, 사용자 이름 입력
3. 이메일 인증 완료

> **INFO:** 첫 Git 설치 후 이름과 이메일을 등록해야 합니다: \`git config --global user.name "홍길동"\` / \`git config --global user.email "hong@example.com"\`

[GitHub 시작 가이드](/guides/github)에서 SSH 키 등록까지 전체 과정을 확인할 수 있습니다.

## 딱 5가지 명령어만 기억하자

\`\`\`bash
# 1. 새 프로젝트에 Git 시작
git init

# 2. 저장할 파일 고르기
git add .

# 3. 세이브 포인트 만들기
git commit -m "로그인 기능 추가"

# 4. 인터넷(GitHub)에 업로드
git push origin main

# 5. 최신 코드 받기
git pull origin main
\`\`\`

> **TIP:** 커밋 메시지는 "버그 수정"보다 "로그인 후 리다이렉트 안 되는 문제 수정"처럼 구체적으로 쓰세요. AI에게 "커밋 메시지 써줘"라고 요청해도 됩니다.

## CLI가 어렵다면 [GitHub Desktop](https://desktop.github.com)

터미널이 낯설다면 GitHub Desktop을 추천합니다. 클릭으로 add, commit, push를 처리할 수 있는 무료 GUI 앱입니다.

---

## .gitignore — 절대 올리면 안 되는 파일들

\`\`\`
# 환경변수 (절대 커밋 금지!)
.env
.env.local

# 라이브러리
node_modules/

# 빌드 결과물
.next/
dist/
\`\`\`

> **WARNING:** GitHub Desktop을 쓰더라도 \`.gitignore\` 설정은 반드시 확인하세요. GUI가 실수로 \`.env\` 파일을 커밋하면 API 키가 전 세계에 공개됩니다.

[환경변수 완전 정복 가이드](/guides/env)에서 \`.env\` 파일을 안전하게 관리하는 법을 배울 수 있습니다.

## 실전 루틴

매일 코딩 마칠 때 이 3줄을 실행하세요:

\`\`\`bash
git add .
git commit -m "오늘 작업 내용 요약"
git push origin main
\`\`\`

AI에게 코드 수정을 요청하기 전에도 커밋을 남겨두면 더 좋습니다:

\`\`\`bash
git commit -m "AI 작업 전 스냅샷 - 회원가입 폼 완성"
\`\`\`

GitHub 저장소와 환경변수 연결 고급 주제는 [GitHub Secrets 자동화](/blog/github-secrets-automation)에서 다룹니다. [Linkmap](https://www.linkmap.biz)의 [서비스 맵](https://www.linkmap.biz/services)을 사용하면 프로젝트에 연결된 GitHub 저장소를 한눈에 관리할 수 있습니다.

> **TRY:** [Linkmap 무료 가입](https://www.linkmap.biz/signup)으로 GitHub와 연결된 서비스들을 시각화해보세요. 바이브코딩으로 빠르게 만든 프로젝트일수록 서비스 연결 관리가 중요합니다.

---

*바이브코딩 시작 방법은 [바이브코딩 시작 가이드](/blog/vibe-coding-getting-started-guide)를, 배포 방법은 [배포 완전 정복 가이드](/guides/deploy)를 참고하세요.*`;
