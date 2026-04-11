'use client';

import type { StepData } from '../auth-guide/step-card-with-screenshot';
import { githubIllustrations } from './github-illustrations';

/**
 * first-repo 서브 가이드용 스텝 데이터
 * - create-repo, git-init, first-commit, push, gitignore 섹션에 매핑
 */
export const firstRepoSteps: StepData[] = [
  {
    step: 1,
    title: 'GitHub에서 저장소 생성',
    where: 'github.com/new',
    whereUrl: 'https://github.com/new',
    what: 'Repository name 입력, Private 선택, README 체크 후 Create repository 클릭',
    why: '코드를 저장하고 공유할 원격 저장소가 필요합니다.',
    tip: '처음에는 Private으로 시작하세요. 나중에 언제든 Public으로 변경 가능합니다.',
    screenshots: [
      {
        alt: 'GitHub 새 저장소 생성 폼',
        illustration: githubIllustrations['new-repo'],
        annotations: [
          { type: 'input', x: 40, y: 22, width: 40, height: 8, label: '① 저장소 이름' },
          { type: 'click', x: 9, y: 58, number: 2, label: 'Private 선택' },
          { type: 'click', x: 7, y: 82, number: 3, label: 'README 체크' },
        ],
        caption: '① 저장소 이름 입력 → ② Private 선택 → ③ Add a README file 체크 → Create repository',
      },
    ],
  },
  {
    step: 2,
    title: '로컬 프로젝트 초기화 (git init / clone)',
    where: 'Terminal',
    what: '기존 프로젝트를 Git 저장소로 초기화하거나, GitHub 저장소를 clone합니다.',
    why: '로컬 컴퓨터와 GitHub 원격 저장소를 연결해야 push/pull이 가능합니다.',
    tip: '새 프로젝트는 clone, 기존 프로젝트는 git init + remote add 방식을 사용하세요.',
    screenshots: [
      {
        alt: 'git init → remote add → 연결 과정',
        illustration: githubIllustrations['first-commit'],
        caption: 'git init → git remote add origin → 원격 저장소 연결 완료',
      },
    ],
  },
  {
    step: 3,
    title: '첫 커밋 만들기',
    where: 'Terminal',
    what: 'git add로 파일 스테이징 → git commit으로 스냅샷 저장',
    why: '커밋은 코드 변경 사항의 체크포인트입니다. 작은 단위로 자주 커밋하면 되돌리기 쉽습니다.',
    tip: '커밋 메시지는 "feat:", "fix:", "docs:" 접두어를 사용하면 나중에 히스토리를 읽기 쉽습니다.',
    screenshots: [
      {
        alt: 'git add → git commit 과정',
        illustration: githubIllustrations['first-commit'],
        caption: 'git add . → git commit -m "feat: 초기 프로젝트 설정" → 커밋 완료',
      },
    ],
  },
  {
    step: 4,
    title: 'GitHub에 push하기',
    where: 'Terminal',
    what: 'git push -u origin main으로 로컬 커밋을 GitHub에 업로드합니다.',
    why: 'push해야 GitHub에 코드가 저장되고, 팀원이 접근하거나 배포할 수 있습니다.',
    tip: '첫 push 시 -u 옵션을 붙이면 이후부터는 git push만으로 충분합니다.',
    screenshots: [
      {
        alt: 'git push 명령어 실행',
        illustration: githubIllustrations['first-commit'],
        caption: 'git push -u origin main → GitHub에 코드 업로드 완료',
      },
    ],
  },
  {
    step: 5,
    title: '.gitignore 설정',
    where: '프로젝트 루트',
    what: '.gitignore 파일을 만들어 환경변수(.env), node_modules, 빌드 결과물을 제외합니다.',
    why: '.env에 API 키가 있으면 유출 위험. node_modules는 npm install로 재설치 가능하여 불필요.',
    tip: '저장소 생성 시 GitHub에서 .gitignore 템플릿(Node 등)을 선택하면 자동 생성됩니다.',
    screenshots: [
      {
        alt: '.gitignore 파일 내용 예시',
        illustration: githubIllustrations['gitignore'],
        caption: '.env, node_modules/, .next/, .vscode/ 등을 gitignore에 추가',
      },
    ],
  },
];
